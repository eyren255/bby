// Admin auth helper. Validates ADMIN_KEY from env.
export function requireAdmin(req, res, next){
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : (req.body && req.body.adminKey);
  if (!process.env.ADMIN_KEY) return res.status(500).json({ ok: false, error: 'Server not configured' });
  if (token === process.env.ADMIN_KEY) return next();
  return res.status(401).json({ ok: false, error: 'Unauthorized' });
}