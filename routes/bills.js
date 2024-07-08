import express from 'express';
import { storeBill,getBill,billAtName,getMonthly, details } from '../controller/bill.js';

const router = express.Router();

router.post('/', storeBill);
router.get('/', getBill);
router.get('/atname', billAtName);
router.get('/monthly', getMonthly);
router.get('/details', details);

export default router;