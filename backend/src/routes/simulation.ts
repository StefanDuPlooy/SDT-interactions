import { Router } from 'express';
import { SimulationController } from '../controllers/SimulationController';

const router = Router();
const simulationController = new SimulationController();

// Generate new session simulation
router.post('/session', (req, res) => simulationController.generateSession(req, res));

// Get session by ID
router.get('/sessions/:sessionId', (req, res) => simulationController.getSession(req, res));

// Get engagement metrics for a student in a session
router.get('/students/:studentId/engagement/:sessionId', (req, res) => 
  simulationController.getEngagementMetrics(req, res)
);

export default router;