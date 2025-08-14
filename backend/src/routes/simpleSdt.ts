import { Router } from 'express';
import { SimpleSDTController } from '../controllers/SimpleSDTController';

const router = Router();
const sdtController = new SimpleSDTController();

// Get individual student dashboard data
router.get('/student/:studentId/dashboard', (req, res) => 
  sdtController.getStudentDashboard(req, res)
);

// Get student interactions over time
router.get('/student/:studentId/interactions', (req, res) => 
  sdtController.getStudentInteractions(req, res)
);

export default router;