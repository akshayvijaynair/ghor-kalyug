import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Index Route!');
});

export default router;