import express from 'express';
import { addStock,getStock } from '../controller/stock.js';

const router = express.Router();

router.get('/', getStock);
router.put('/', addStock);


export default router;