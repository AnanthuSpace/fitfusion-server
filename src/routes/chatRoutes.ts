import { Router } from 'express';
import chatController from '../controllers/chatController';

const router = Router();

router.post('/start', chatController.startChat);
router.get('/get-messages', chatController.getMessages);

export default router;
