import express from 'express';
import { getBookPacks} from '../controllers/bookPackController.js';

const router = express.Router();
router.get('/packs',getBookPacks);

export default router;