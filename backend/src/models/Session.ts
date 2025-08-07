import mongoose, { Schema, Document } from 'mongoose';
import { ClassSession as IClassSession, NetworkMetrics } from '@/shared/types';

export interface SessionDocument extends Omit<IClassSession, 'students' | 'interactions' | 'id'>, Document {
  sessionId: string;
  students: string[]; // Array of student IDs
  simulationParams?: object;
}

const networkMetricsSchema = new Schema<NetworkMetrics>({
  timestamp: { type: Date, required: true },
  totalStudents: { type: Number, required: true },
  totalInteractions: { type: Number, required: true },
  networkDensity: { type: Number, required: true, min: 0, max: 1 },
  avgClusteringCoeff: { type: Number, required: true, min: 0, max: 1 },
  numComponents: { type: Number, required: true, min: 1 },
  centralityScores: {
    type: Map,
    of: {
      degree: { type: Number, required: true },
      betweenness: { type: Number, required: true },
      closeness: { type: Number, required: true },
      eigenvector: { type: Number, required: true }
    }
  }
}, { _id: false });

const sessionSchema = new Schema<SessionDocument>({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  courseId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  sessionType: {
    type: String,
    enum: ['lecture', 'tutorial', 'lab', 'group-work'],
    required: true,
    index: true
  },
  students: [{
    type: String,
    required: true
  }],
  networkMetrics: {
    type: networkMetricsSchema,
    required: true
  },
  simulationParams: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'sessions'
});

// Compound indexes for better query performance
sessionSchema.index({ courseId: 1, date: -1 });
sessionSchema.index({ sessionType: 1, date: -1 });

export const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);