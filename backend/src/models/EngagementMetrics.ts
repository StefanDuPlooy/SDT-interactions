import mongoose, { Schema, Document } from 'mongoose';
import { StudentEngagementMetrics as IStudentEngagementMetrics } from '../types';

export interface EngagementMetricsDocument extends IStudentEngagementMetrics, Document {}

const engagementMetricsSchema = new Schema<EngagementMetricsDocument>({
  studentId: {
    type: String,
    required: true,
    index: true,
    ref: 'Student'
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
    ref: 'Session'
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  
  // Social engagement indicators
  interactionFrequency: {
    type: Number,
    required: true,
    min: 0
  },
  averageInteractionDuration: {
    type: Number,
    required: true,
    min: 0
  },
  socialNetworkPosition: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  
  // Behavioral patterns
  initiatesInteractions: {
    type: Boolean,
    required: true,
    default: false
  },
  respondsToInteractions: {
    type: Boolean,
    required: true,
    default: false
  },
  isolationRisk: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  
  // Predictive features for SDT
  collaborationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  helpSeekingBehavior: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  peerInfluenceLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Academic correlation signals
  engagementTrend: {
    type: String,
    enum: ['increasing', 'decreasing', 'stable'],
    required: true,
    default: 'stable'
  },
  participationGap: {
    type: Number,
    required: true
  },
  
  // Risk indicators
  academicRiskFlags: [{
    type: String,
    trim: true
  }],
  socialRiskFlags: [{
    type: String,
    trim: true
  }],
  overallRiskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  collection: 'engagement_metrics'
});

// Compound indexes for efficient querying
engagementMetricsSchema.index({ studentId: 1, timestamp: -1 });
engagementMetricsSchema.index({ sessionId: 1, overallRiskScore: -1 });
engagementMetricsSchema.index({ overallRiskScore: -1, timestamp: -1 });
engagementMetricsSchema.index({ engagementTrend: 1, timestamp: -1 });

// Ensure unique combination of student and session
engagementMetricsSchema.index({ studentId: 1, sessionId: 1 }, { unique: true });

export const EngagementMetricsModel = mongoose.model<EngagementMetricsDocument>('EngagementMetrics', engagementMetricsSchema);