import { v4 as uuidv4 } from 'uuid';
import {
  Student,
  InteractionEvent,
  ClassSession,
  NetworkMetrics,
  SessionParams,
  SimulationConfig,
  StudentEngagementMetrics
} from '@/shared/types';

export class SimulationEngine {
  private config: SimulationConfig = {
    baseInteractionProbability: 0.1,
    personalityFactors: {
      extrovert: 1.5,
      introvert: 0.7,
      ambivert: 1.0
    },
    contextFactors: {
      lecture: 0.3,
      tutorial: 0.8,
      lab: 0.9,
      "group-work": 1.2
    },
    riskFactors: {
      high: 1.3,
      medium: 1.0,
      low: 0.9
    }
  };

  async generateSession(params: SessionParams): Promise<ClassSession> {
    const sessionId = uuidv4();
    const startTime = new Date();
    
    // Get student data (in real implementation, fetch from database)
    const students = await this.getStudents(params.studentIds);
    
    // Generate interaction timeline
    const interactions = this.generateInteractionTimeline(
      params.duration,
      students,
      params.sessionType
    );

    // Calculate network metrics
    const networkMetrics = this.calculateNetworkMetrics(interactions);

    const session: ClassSession = {
      id: sessionId,
      courseId: params.courseId,
      date: startTime,
      duration: params.duration,
      sessionType: params.sessionType,
      students,
      interactions,
      networkMetrics
    };

    return session;
  }

  private async getStudents(studentIds: string[]): Promise<Student[]> {
    // Mock implementation - in real app, fetch from database
    return studentIds.map(id => ({
      id,
      name: `Student ${id.slice(-3)}`,
      academicLevel: Math.random() > 0.7 ? "postgraduate" : "undergraduate",
      major: this.getRandomMajor(),
      currentGPA: 2.0 + Math.random() * 2.0,
      riskLevel: this.getRandomRiskLevel(),
      personalityType: this.getRandomPersonality(),
      participationScore: Math.floor(Math.random() * 100)
    }));
  }

  private generateInteractionTimeline(
    sessionDuration: number,
    students: Student[],
    context: string
  ): InteractionEvent[] {
    const interactions: InteractionEvent[] = [];
    const activityPeaks = this.getActivityPeaks(context);
    
    for (const peak of activityPeaks) {
      const peakMinute = Math.floor(sessionDuration * peak);
      const peakInteractions = this.generatePeakInteractions(
        students,
        peakMinute,
        context
      );
      interactions.push(...peakInteractions);
    }

    return interactions;
  }

  private getActivityPeaks(context: string): number[] {
    const peaks = {
      'lecture': [0.1, 0.5, 0.9],
      'group-work': [0.2, 0.4, 0.6, 0.8],
      'lab': [0.3, 0.7],
      'tutorial': [0.2, 0.6]
    };
    return peaks[context as keyof typeof peaks] || [0.5];
  }

  private generatePeakInteractions(
    students: Student[],
    peakMinute: number,
    context: string
  ): InteractionEvent[] {
    const interactions: InteractionEvent[] = [];
    const sessionId = uuidv4();

    for (let i = 0; i < students.length; i++) {
      for (let j = i + 1; j < students.length; j++) {
        const probability = this.calculateInteractionProbability(
          students[i],
          students[j],
          context
        );

        if (Math.random() < probability) {
          const interaction = this.createInteractionEvent(
            sessionId,
            students[i],
            students[j],
            peakMinute,
            context
          );
          interactions.push(interaction);
        }
      }
    }

    return interactions;
  }

  private calculateInteractionProbability(
    student1: Student,
    student2: Student,
    context: string
  ): number {
    let baseProbability = this.config.baseInteractionProbability;

    // Apply personality factors
    baseProbability *= this.config.personalityFactors[student1.personalityType];
    baseProbability *= this.config.personalityFactors[student2.personalityType];

    // Special case for introvert-introvert pairs
    if (student1.personalityType === 'introvert' && student2.personalityType === 'introvert') {
      baseProbability *= 0.5;
    }

    // Apply context factors
    baseProbability *= this.config.contextFactors[context as keyof typeof this.config.contextFactors];

    // Academic similarity factor
    const gpaDiff = Math.abs(student1.currentGPA - student2.currentGPA);
    if (gpaDiff < 0.5) {
      baseProbability *= 1.2; // Similar academic performance increases interaction
    }

    // Risk factor considerations
    if (student1.riskLevel === 'high' || student2.riskLevel === 'high') {
      if (context === 'group-work') {
        baseProbability *= 1.3; // Help-seeking behavior
      } else {
        baseProbability *= 0.8; // Potential isolation
      }
    }

    return Math.min(baseProbability, 0.7); // Cap at 70%
  }

  private createInteractionEvent(
    sessionId: string,
    student1: Student,
    student2: Student,
    peakMinute: number,
    context: string
  ): InteractionEvent {
    const startOffset = Math.floor(Math.random() * 20) - 10; // ±10 minutes around peak
    const startMinute = Math.max(0, peakMinute + startOffset);
    const duration = this.generateInteractionDuration(context);
    
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + startMinute);
    
    const endTime = new Date(startTime);
    endTime.setSeconds(endTime.getSeconds() + duration);

    return {
      id: uuidv4(),
      sessionId,
      studentId1: student1.id,
      studentId2: student2.id,
      startTime,
      endTime,
      duration,
      avgDistance: 0.8 + Math.random() * 0.7, // 0.8-1.5 meters
      avgOrientationDiff: Math.random() * 45, // 0-45 degrees
      confidence: 0.7 + Math.random() * 0.3, // 0.7-1.0
      interactionType: this.getRandomInteractionType(context),
      context: context as any
    };
  }

  private generateInteractionDuration(context: string): number {
    const baseDurations = {
      'lecture': 15, // 15 seconds average
      'tutorial': 60, // 1 minute average
      'lab': 120, // 2 minutes average
      'group-work': 180 // 3 minutes average
    };
    
    const base = baseDurations[context as keyof typeof baseDurations] || 60;
    const variation = base * 0.5; // ±50% variation
    
    return Math.max(5, base + (Math.random() - 0.5) * 2 * variation);
  }

  calculateNetworkMetrics(interactions: InteractionEvent[]): NetworkMetrics {
    // Build adjacency list
    const graph: Record<string, Set<string>> = {};
    const students = new Set<string>();

    interactions.forEach(interaction => {
      const { studentId1, studentId2 } = interaction;
      students.add(studentId1);
      students.add(studentId2);

      if (!graph[studentId1]) graph[studentId1] = new Set();
      if (!graph[studentId2]) graph[studentId2] = new Set();

      graph[studentId1].add(studentId2);
      graph[studentId2].add(studentId1);
    });

    // Calculate centrality scores
    const centralityScores: NetworkMetrics['centralityScores'] = {};
    const totalStudents = students.size;

    students.forEach(student => {
      const degree = graph[student]?.size || 0;
      centralityScores[student] = {
        degree: totalStudents > 1 ? degree / (totalStudents - 1) : 0,
        betweenness: this.calculateBetweennessCentrality(student, graph),
        closeness: this.calculateClosenessCentrality(student, graph),
        eigenvector: 0 // Simplified - can implement full algorithm if needed
      };
    });

    // Calculate network density
    const maxEdges = (totalStudents * (totalStudents - 1)) / 2;
    const actualEdges = interactions.length;
    const networkDensity = maxEdges > 0 ? actualEdges / maxEdges : 0;

    return {
      timestamp: new Date(),
      totalStudents,
      totalInteractions: interactions.length,
      networkDensity,
      avgClusteringCoeff: this.calculateAverageClusteringCoefficient(graph),
      numComponents: this.countConnectedComponents(graph),
      centralityScores
    };
  }

  private calculateBetweennessCentrality(student: string, graph: Record<string, Set<string>>): number {
    // Simplified betweenness centrality calculation
    // In a full implementation, use Floyd-Warshall or similar algorithm
    return Math.random() * 0.5; // Mock implementation
  }

  private calculateClosenessCentrality(student: string, graph: Record<string, Set<string>>): number {
    // Simplified closeness centrality calculation
    // In a full implementation, calculate shortest paths to all other nodes
    return Math.random() * 0.8; // Mock implementation
  }

  private calculateAverageClusteringCoefficient(graph: Record<string, Set<string>>): number {
    let totalClustering = 0;
    let nodeCount = 0;

    Object.keys(graph).forEach(node => {
      const neighbors = Array.from(graph[node]);
      if (neighbors.length < 2) return;

      let triangles = 0;
      const possibleTriangles = (neighbors.length * (neighbors.length - 1)) / 2;

      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          if (graph[neighbors[i]]?.has(neighbors[j])) {
            triangles++;
          }
        }
      }

      totalClustering += triangles / possibleTriangles;
      nodeCount++;
    });

    return nodeCount > 0 ? totalClustering / nodeCount : 0;
  }

  private countConnectedComponents(graph: Record<string, Set<string>>): number {
    const visited = new Set<string>();
    let components = 0;

    Object.keys(graph).forEach(node => {
      if (!visited.has(node)) {
        this.dfsVisit(node, graph, visited);
        components++;
      }
    });

    return components;
  }

  private dfsVisit(node: string, graph: Record<string, Set<string>>, visited: Set<string>) {
    visited.add(node);
    graph[node]?.forEach(neighbor => {
      if (!visited.has(neighbor)) {
        this.dfsVisit(neighbor, graph, visited);
      }
    });
  }

  async generateEngagementMetrics(
    student: Student,
    session: ClassSession
  ): Promise<StudentEngagementMetrics> {
    const studentInteractions = session.interactions.filter(
      interaction => interaction.studentId1 === student.id || interaction.studentId2 === student.id
    );

    const interactionFrequency = (studentInteractions.length / session.duration) * 60; // per hour
    const averageInteractionDuration = studentInteractions.length > 0 
      ? studentInteractions.reduce((sum, i) => sum + i.duration, 0) / studentInteractions.length 
      : 0;

    const centrality = session.networkMetrics.centralityScores[student.id];
    const socialNetworkPosition = centrality ? centrality.degree : 0;

    // Calculate behavioral patterns
    const initiatedInteractions = studentInteractions.filter(
      i => i.studentId1 === student.id
    ).length;
    const initiatesInteractions = initiatedInteractions > 0;
    const respondsToInteractions = studentInteractions.length > initiatedInteractions;

    // Calculate risk factors
    const isolationRisk = socialNetworkPosition < 0.1 ? 0.8 : 0.2;
    const academicRiskFlags = this.calculateAcademicRiskFlags(student, studentInteractions);
    const socialRiskFlags = this.calculateSocialRiskFlags(student, studentInteractions, isolationRisk);

    return {
      studentId: student.id,
      sessionId: session.id,
      timestamp: new Date(),
      interactionFrequency,
      averageInteractionDuration,
      socialNetworkPosition,
      initiatesInteractions,
      respondsToInteractions,
      isolationRisk,
      collaborationScore: this.calculateCollaborationScore(studentInteractions),
      helpSeekingBehavior: this.calculateHelpSeekingBehavior(studentInteractions),
      peerInfluenceLevel: socialNetworkPosition * 100,
      engagementTrend: this.determineEngagementTrend(student),
      participationGap: student.participationScore - 65, // Assuming class average of 65
      academicRiskFlags,
      socialRiskFlags,
      overallRiskScore: this.calculateOverallRiskScore(student, isolationRisk, academicRiskFlags, socialRiskFlags)
    };
  }

  private calculateAcademicRiskFlags(student: Student, interactions: InteractionEvent[]): string[] {
    const flags: string[] = [];
    
    if (student.currentGPA < 2.5) flags.push('low_gpa');
    if (student.participationScore < 40) flags.push('low_participation');
    if (interactions.length < 2) flags.push('social_isolation');
    
    return flags;
  }

  private calculateSocialRiskFlags(student: Student, interactions: InteractionEvent[], isolationRisk: number): string[] {
    const flags: string[] = [];
    
    if (isolationRisk > 0.5) flags.push('social_isolation');
    if (interactions.length === 0) flags.push('no_interactions');
    if (student.personalityType === 'introvert' && interactions.length < 3) flags.push('introvert_underengagement');
    
    return flags;
  }

  private calculateCollaborationScore(interactions: InteractionEvent[]): number {
    const collaborationInteractions = interactions.filter(i => i.interactionType === 'collaboration');
    return Math.min(100, collaborationInteractions.length * 15);
  }

  private calculateHelpSeekingBehavior(interactions: InteractionEvent[]): number {
    const helpSeekingInteractions = interactions.filter(i => i.interactionType === 'help-seeking');
    return Math.min(100, helpSeekingInteractions.length * 20);
  }

  private determineEngagementTrend(student: Student): "increasing" | "decreasing" | "stable" {
    // Mock implementation - in real system, compare with historical data
    const trends: ("increasing" | "decreasing" | "stable")[] = ['increasing', 'decreasing', 'stable'];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  private calculateOverallRiskScore(
    student: Student,
    isolationRisk: number,
    academicRiskFlags: string[],
    socialRiskFlags: string[]
  ): number {
    let riskScore = 0;
    
    // GPA contribution (0-40 points)
    if (student.currentGPA < 2.0) riskScore += 40;
    else if (student.currentGPA < 2.5) riskScore += 25;
    else if (student.currentGPA < 3.0) riskScore += 10;
    
    // Participation contribution (0-30 points)
    if (student.participationScore < 30) riskScore += 30;
    else if (student.participationScore < 50) riskScore += 20;
    else if (student.participationScore < 70) riskScore += 10;
    
    // Social isolation contribution (0-30 points)
    riskScore += isolationRisk * 30;
    
    return Math.min(100, riskScore);
  }

  private getRandomMajor(): string {
    const majors = [
      'Computer Science', 'Engineering', 'Mathematics', 'Physics',
      'Biology', 'Chemistry', 'Psychology', 'Business', 'Economics'
    ];
    return majors[Math.floor(Math.random() * majors.length)];
  }

  private getRandomRiskLevel(): "low" | "medium" | "high" {
    const rand = Math.random();
    if (rand < 0.6) return 'low';
    if (rand < 0.85) return 'medium';
    return 'high';
  }

  private getRandomPersonality(): "extrovert" | "introvert" | "ambivert" {
    const rand = Math.random();
    if (rand < 0.3) return 'extrovert';
    if (rand < 0.6) return 'introvert';
    return 'ambivert';
  }

  private getRandomInteractionType(context: string): "discussion" | "collaboration" | "social" | "help-seeking" {
    const contextTypes = {
      'lecture': ['discussion', 'social'],
      'tutorial': ['discussion', 'help-seeking', 'collaboration'],
      'lab': ['collaboration', 'help-seeking'],
      'group-work': ['collaboration', 'discussion', 'help-seeking']
    };
    
    const types = contextTypes[context as keyof typeof contextTypes] || ['discussion'];
    return types[Math.floor(Math.random() * types.length)] as any;
  }
}