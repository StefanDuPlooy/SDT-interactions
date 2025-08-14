import { Router } from 'express';
import { SDTController } from '../controllers/SDTController';

const router = Router();
const sdtController = new SDTController();

// Get current risk assessment for student
router.get('/student/:studentId/risk-assessment', (req, res) => 
  sdtController.getStudentRiskAssessment(req, res)
);

// Bulk risk assessment for class
router.get('/class/:courseId/risk-batch', (req, res) => 
  sdtController.getClassRiskBatch(req, res)
);

// Historical data for model training
router.get('/training-data', (req, res) => 
  sdtController.getTrainingData(req, res)
);

// Bulk engagement data export
router.get('/engagement-batch', (req, res) => 
  sdtController.getEngagementBatch(req, res)
);

// Get individual student dashboard data
router.get('/student/:studentId/dashboard', (req, res) => 
  sdtController.getStudentDashboard(req, res)
);

// Get student interactions over time
router.get('/student/:studentId/interactions', (req, res) => 
  sdtController.getStudentInteractions(req, res)
);

export default router;