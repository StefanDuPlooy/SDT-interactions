import { Request, Response } from 'express';

export class SimpleSDTController {
  // Get comprehensive dashboard data for a single student
  async getStudentDashboard(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      
      // Mock student profile
      const student = {
        id: studentId,
        name: this.getActualName(studentId), // Show actual name for current student
        academicLevel: Math.random() > 0.5 ? 'undergraduate' : 'postgraduate',
        major: ['Computer Science', 'Mathematics', 'Physics', 'Engineering'][Math.floor(Math.random() * 4)],
        currentGPA: 2.0 + Math.random() * 2.0,
        riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        personalityType: ['extrovert', 'introvert', 'ambivert'][Math.floor(Math.random() * 3)],
        participationScore: Math.floor(Math.random() * 100)
      };

      // Generate historical engagement data (last 12 weeks)
      const engagementHistory = Array.from({ length: 12 }, (_, i) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - (i * 7));
        
        return {
          week: `Week ${12 - i}`,
          date: weekAgo,
          interactionFrequency: Math.random() * 10,
          socialNetworkPosition: Math.random(),
          collaborationScore: Math.floor(Math.random() * 100),
          overallRiskScore: Math.floor(Math.random() * 100),
          sessionCount: Math.floor(Math.random() * 5) + 1
        };
      });

      // Recent interactions summary
      const recentInteractions = {
        totalInteractions: Math.floor(Math.random() * 50) + 20,
        averageDuration: Math.floor(Math.random() * 180) + 30, // seconds
        topInteractionPartners: [
          { studentId: 'STU_001', name: this.getAnonymousName('STU_001'), count: Math.floor(Math.random() * 10) + 5 },
          { studentId: 'STU_002', name: this.getAnonymousName('STU_002'), count: Math.floor(Math.random() * 8) + 3 },
          { studentId: 'STU_003', name: this.getAnonymousName('STU_003'), count: Math.floor(Math.random() * 6) + 2 }
        ],
        interactionTypes: {
          discussion: Math.floor(Math.random() * 15) + 5,
          collaboration: Math.floor(Math.random() * 12) + 3,
          social: Math.floor(Math.random() * 8) + 2,
          'help-seeking': Math.floor(Math.random() * 5) + 1
        }
      };

      // Current session statistics
      const currentStats = {
        weeklyEngagement: Math.floor(Math.random() * 100),
        networkCentrality: Math.random(),
        participationTrend: this.getRandomTrend(),
        riskLevel: student.riskLevel,
        lastActiveSession: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        sessionsThisWeek: Math.floor(Math.random() * 5) + 1
      };

      const dashboardData = {
        student,
        engagementHistory,
        recentInteractions,
        currentStats,
        lastUpdated: new Date()
      };

      const response = {
        success: true,
        data: dashboardData,
        message: 'Student dashboard data retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error retrieving student dashboard:', error);
      const response = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  }

  // Get detailed interaction history for a student
  async getStudentInteractions(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { limit = 50, offset = 0, startDate, endDate } = req.query;

      // Generate mock interactions
      const interactions = Array.from({ length: Number(limit) }, (_, i) => {
        const startTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
        const duration = Math.floor(Math.random() * 300) + 30; // 30-330 seconds
        const endTime = new Date(startTime.getTime() + duration * 1000);
        
        return {
          id: `INT_${studentId}_${i.toString().padStart(3, '0')}`,
          sessionId: `SES_${Math.floor(Date.now() / 1000000)}_${Math.floor(Math.random() * 1000)}`,
          studentId1: studentId,
          studentId2: `STU_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
          startTime,
          endTime,
          duration,
          avgDistance: 0.8 + Math.random() * 0.7, // 0.8-1.5 meters
          avgOrientationDiff: Math.random() * 45, // 0-45 degrees
          confidence: 0.7 + Math.random() * 0.3, // 0.7-1.0
          interactionType: ['discussion', 'collaboration', 'social', 'help-seeking'][Math.floor(Math.random() * 4)],
          context: ['lecture', 'group-work', 'break', 'lab'][Math.floor(Math.random() * 4)]
        };
      }).sort((a, b) => b.startTime.getTime() - a.startTime.getTime()); // Most recent first

      // Interaction statistics
      const stats = {
        totalInteractions: interactions.length,
        dateRange: {
          start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: endDate || new Date()
        },
        averageDuration: interactions.reduce((sum, int) => sum + int.duration, 0) / interactions.length,
        interactionsByType: interactions.reduce((acc, int) => {
          acc[int.interactionType] = (acc[int.interactionType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        interactionsByContext: interactions.reduce((acc, int) => {
          acc[int.context] = (acc[int.context] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        uniquePartners: new Set(interactions.map(int => int.studentId2)).size
      };

      const interactionData = {
        interactions,
        stats,
        pagination: {
          total: 200, // Mock total
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + Number(limit) < 200
        }
      };

      const response = {
        success: true,
        data: interactionData,
        message: 'Student interactions retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error retrieving student interactions:', error);
      const response = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  }

  private getActualName(studentId: string): string {
    // Generate actual student names for when students view their own dashboard
    const actualStudentNames = {
      'STU_001': 'Alex Johnson',
      'STU_002': 'Morgan Smith',
      'STU_003': 'Casey Davis',
      'STU_004': 'Taylor Wilson',
      'STU_005': 'Jordan Brown',
      'STU_006': 'Riley Jones',
      'STU_007': 'Avery Garcia',
      'STU_008': 'Cameron Martinez'
    };
    
    if (actualStudentNames[studentId as keyof typeof actualStudentNames]) {
      return actualStudentNames[studentId as keyof typeof actualStudentNames];
    }
    
    // For other student IDs, generate a name based on the number
    const match = studentId.match(/STU_(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      const names = [
        'Alex Johnson', 'Morgan Smith', 'Casey Davis', 'Taylor Wilson', 'Jordan Brown',
        'Riley Jones', 'Avery Garcia', 'Cameron Martinez', 'Quinn Rodriguez', 'Parker Lewis'
      ];
      return names[(num - 1) % names.length];
    }
    
    return `Student ${studentId}`;
  }

  private getAnonymousName(studentId: string): string {
    // Generate consistent anonymous names based on student ID (for other students)
    const anonymousNames = {
      'STU_001': 'Student A',
      'STU_002': 'Student B', 
      'STU_003': 'Student C',
      'STU_004': 'Student D',
      'STU_005': 'Student E',
      'STU_006': 'Student F',
      'STU_007': 'Student G',
      'STU_008': 'Student H'
    };
    
    // For any other student IDs, generate a letter based on the ID
    if (anonymousNames[studentId as keyof typeof anonymousNames]) {
      return anonymousNames[studentId as keyof typeof anonymousNames];
    }
    
    // Extract number from student ID and convert to letter
    const match = studentId.match(/STU_(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      const letter = String.fromCharCode(65 + ((num - 1) % 26)); // A, B, C, etc.
      return `Student ${letter}`;
    }
    
    return `Student ${studentId}`;
  }

  private getRandomTrend(): "increasing" | "decreasing" | "stable" {
    const trends: ("increasing" | "decreasing" | "stable")[] = ['increasing', 'decreasing', 'stable'];
    return trends[Math.floor(Math.random() * trends.length)];
  }
}