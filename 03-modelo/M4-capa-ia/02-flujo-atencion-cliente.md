# 02 — Flujo Automatizado de Atención al Cliente

> Objetivo: el 70% de los mensajes se resuelven sin que toques el teléfono. Tú solo entras en excepciones y cierres grandes.

---

## El embudo automatizado (WhatsApp)

```
Cliente escribe
   │
   ▼
🤖 Bot saluda + muestra menú: 1) Catálogo 2) Cotizar pieza 3) Estado de mi pedido 4) Hablar con humano
   │
   ├── Opción 1 → envía catálogo con precios (PDF/fotos) + botón de pedido
   │
   ├── Opción 2 → 🤖 pide: foto de la pieza + medidas + para qué la usa
   │        ├── Si es estándar (perilla, clip, soporte) → cotiza de lista en <2 min
   │        └── Si es rara → te escala a ti CON fotos y medidas ya capturadas
   │
   ├── Opción 3 → consulta la hoja de pedidos y responde estado + fecha estimada
   │
   └── Opción 4 → te avisa; entras solo cuando vale la pena
   │
   ▼
Cotización aceptada → 🤖 envía CLABE, pide 50% anticipo, confirma recepción
   │
   ▼
Pedido confirmado → entra a TU cola de producción (hoja compartida)
   │
   ▼
Listo → 🤖 avisa al cliente, agenda entrega, cobra el 50% restante
   │
   ▼
Entregado → 🤖 pide foto/reseña y ofrece 10% en su próximo trabajo
```

## Tus 15 respuestas rápidas (semana 1, gratis)

1. Precios de los 10 productos más vendidos (kits, perillas, letreros...)
2. Mándame foto de la pieza + una regla/cinta al lado y te cotizo en 1 hora
3. Tiempos de entrega: estándar 24-72h
4. Forma de pago: 50% anticipo, 50% contra entrega
5. Zona de entrega / envío
6. Garantía: si no ajusta, se reimprime gratis
7. Materiales disponibles y para qué sirve cada uno (1 línea c/u)
8. Lo que NO haces (piezas de seguridad automotriz, componentes eléctricos)
9. Horario de atención humana
10. Catálogo de figuras/trabajos previos (fotos)
11. Precio de diseño/modelado por hora
12. Política de cambios
13. Datos para factura (RESICO)
14. Referidos: tráeme un cliente y llévate 10%
15. Gracias + reseña

## Métricas del embudo (las que reportas al socio)

| Métrica | Meta |
|---|---|
| Tiempo de primera respuesta | <2 min (bot) |
| Mensajes que se resuelven sin ti | >70% |
| Cotización estándar | <2 min automática |
| Cotización personalizada | <1 hora (tu promesa estrella) |
| Conversión cotización → venta | >40% |

## Líneas rojas del bot

- NUNCA prometer fecha sin que el pedido esté en tu cola
- NUNCA cotizar pieza desconocida sin tu revisión (el bot dice te confirmo precio en 1 hora)
- Cliente enojado o reclamo → escalamiento inmediato a ti, sin bot de por medio
