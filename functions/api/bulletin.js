// Cloudflare Pages Function — stores/serves the current weekly bulletin.
// GET  /api/bulletin        -> public: returns the current bulletin JSON ({} if none)
// POST /api/bulletin        -> admin: { password, bulletin } -> saves to KV (password-gated)

const KEY = 'current';

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestGet({ env }) {
  const data = await env.BULLETIN.get(KEY);
  return new Response(data || '{}', {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'Invalid request.' }, 400);
  }

  const pw = (body && body.password) || request.headers.get('x-admin-password') || '';
  if (!env.ADMIN_PASSWORD || pw !== env.ADMIN_PASSWORD) {
    return json({ error: 'Incorrect password.' }, 401);
  }

  const bulletin = body.bulletin;
  if (!bulletin || typeof bulletin !== 'object') {
    return json({ error: 'No bulletin data.' }, 400);
  }

  bulletin.updatedAt = new Date().toISOString();
  await env.BULLETIN.put(KEY, JSON.stringify(bulletin));
  return json({ ok: true, updatedAt: bulletin.updatedAt });
}
