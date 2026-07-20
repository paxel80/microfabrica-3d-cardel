interface Env {
  TURNSTILE_SECRET_KEY: string;
  CONTACT_TO_EMAIL?: string;
  DB: D1Database;
}

const SITE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: "Datos inválidos." }, 400);
  }

  const token = formData.get("cf-turnstile-response");
  if (!token || typeof token !== "string") {
    return json({ error: "Falta el token de Turnstile." }, 400);
  }

  // Verificar el token con Cloudflare
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const verifyRes = await fetch(SITE_VERIFY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  });

  const verify: any = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok || !verify.success) {
    return json(
      { error: "Verificación de seguridad fallida.", codes: verify["error-codes"] ?? [] },
      400
    );
  }

  // Validar campos obligatorios
  const nombre = str(formData.get("nombre"));
  const email = str(formData.get("email"));
  const mensaje = str(formData.get("mensaje"));
  if (!nombre || !email || !mensaje) {
    return json({ error: "Nombre, correo y mensaje son obligatorios." }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: "Correo no válido." }, 400);
  }

  const telefono = str(formData.get("telefono"));
  const perfil = str(formData.get("perfil"));
  const fondo = str(formData.get("fondo"));

  // Persistir en D1
  try {
    await env.DB.prepare(
      `INSERT INTO leads (nombre, email, telefono, perfil, fondo, mensaje, turnstile_ok, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(nombre, email, telefono, perfil, fondo, mensaje, 1, ip)
      .run();
  } catch (e) {
    console.error("D1 insert error:", e);
    return json({ error: "No se pudo guardar la solicitud. Intenta de nuevo." }, 500);
  }

  const lead = { nombre, email, telefono, segmento, mensaje, ip, ts: new Date().toISOString() };
  console.log("NUEVO LEAD:", JSON.stringify(lead));

  return json({ success: true, message: "Solicitud recibida." }, 200);
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
