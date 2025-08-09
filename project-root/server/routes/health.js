// Health check route
import { Router } from 'express';
const router = Router();
router.get('/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', time: new Date().toISOString() });
});
export default router;