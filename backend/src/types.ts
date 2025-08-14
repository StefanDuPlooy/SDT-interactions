export interface Student {
  id: string;
  name: string;
  academicLevel: "undergraduate" | "postgraduate";
  major: string;
  currentGPA: number;
  riskLevel: "low" | "medium" | "high";
  personalityType: "extrovert" | "introvert" | "ambivert";
  participationScore: number; // 0-100
}

export interface InteractionEvent {
  id: string;
  sessionId: string;
  studentId1: string;
  studentId2: string;
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
  avgDistance: number; // meters
  avgOrientationDiff: number; // degrees
  confidence: number; // 0-1
  interactionType: "discussion" | "collaboration" | "social" | "help-seeking";
  context: "lecture" | "group-work" | "break" | "lab";
}

export interface NetworkMetrics {
  timestamp: Date;
  totalStudents: number;
  totalInteractions: number;
  networkDensity: number;
  avgClusteringCoeff: number;
  numComponents: number;
  centralityScores: {
    [studentId: string]: {
      degree: number;
      betweenness: number;
      closeness: number;
      eigenvector: number;
    };
  };
}

export interface ClassSession {
  id: string;
  courseId: string;
  date: Date;
  duration: number; // minutes
  sessionType: "lecture" | "tutorial" | "lab" | "group-work";
  students: Student[];
  interactions: InteractionEvent[];
  networkMetrics: NetworkMetrics;
}

export interface StudentEngagementMetrics {
  studentId: string;
  sessionId: string;
  timestamp: Date;
  interactionFrequency: number; // interactions per hour
  socialNetworkPosition: number; // centrality score 0-1
  collaborationScore: number; // 0-100
  overallRiskScore: number; // 0-100
  riskFactors: string[];
  averageInteractionDuration?: number; // seconds
}

export interface SessionParams {
  courseId: string;
  sessionType: "lecture" | "tutorial" | "lab" | "group-work";
  duration: number; // minutes
  studentIds: string[];
  parameters?: {
    interactionProbability?: number;
    extrovertBonus?: number;
    academicCorrelation?: number;
  };
}

export interface SimulationConfig {
  baseInteractionProbability: number;
  personalityFactors: {
    extrovert: number;
    introvert: number;
    ambivert: number;
  };
  academicCorrelationStrength: number;
  sessionTypeModifiers: {
    lecture: number;
    tutorial: number;
    lab: number;
    "group-work": number;
  };
  contextFactors?: {
    lecture: number;
    tutorial: number;
    lab: number;
    "group-work": number;
  };
}

// API Response wrapper
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// SDT Integration Types
export interface RiskAssessment {
  studentId: string;
  currentRiskLevel: number; // 0-100
  riskFactors: string[];
  engagementTrend: "increasing" | "decreasing" | "stable";
  recommendations: string[];
  lastUpdated: Date;
}

export interface SessionData {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  participants: number;
  totalInteractions: number;
  riskFlags: number;
}