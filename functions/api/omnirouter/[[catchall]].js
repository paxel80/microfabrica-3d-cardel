// Cloudflare Pages Load Balancer Function for API omnirouter route
const BACKENDS = [
  'https://trail-ceramic-wants-aquatic.trycloudflare.com', // ocisp (São Paulo)
  'https://chargers-generally-chronic-candidate.trycloudflare.com' // ocifr (Frankfurt)
];

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  const targetPath = '/' + (params.catchall ? params.catchall.join('/') : '');
  const searchParams = url.search;

  let primaryIndex = Math.floor(Math.random() * BACKENDS.length);
  let secondaryIndex = (primaryIndex + 1) % BACKENDS.length;

  let targetUrl = `${BACKENDS[primaryIndex]}${targetPath}${searchParams}`;

  try {
    let response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
      redirect: 'follow'
    });

    if (response.status >= 500) {
      targetUrl = `${BACKENDS[secondaryIndex]}${targetPath}${searchParams}`;
      response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
        redirect: 'follow'
      });
    }

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('X-Omniroute-LB-Backend', BACKENDS[primaryIndex]);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });

  } catch (err) {
    targetUrl = `${BACKENDS[secondaryIndex]}${targetPath}${searchParams}`;
    return await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
      redirect: 'follow'
    });
  }
}
