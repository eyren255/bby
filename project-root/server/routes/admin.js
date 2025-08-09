// Admin routes
import { Router } from 'express';
import { requireAdmin } from '../lib/auth.js';

export default function createAdminRouter(db){
  const router = Router();

  router.post('/admin/clear', requireAdmin, (req, res) => {
    db.exec('DELETE FROM scores');
    res.json({ ok: true, cleared: true });
  });

  return router;
}