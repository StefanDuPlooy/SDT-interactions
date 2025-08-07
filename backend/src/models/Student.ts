import mongoose, { Schema, Document } from 'mongoose';
import { Student as IStudent } from '@/shared/types';

export interface StudentDocument extends Omit<IStudent, 'id'>, Document {
  studentId: string;
}

const studentSchema = new Schema<StudentDocument>({
  studentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  academicLevel: {
    type: String,
    enum: ['undergraduate', 'postgraduate'],
    required: true
  },
  major: {
    type: String,
    required: true,
    trim: true
  },
  currentGPA: {
    type: Number,
    required: true,
    min: 0.0,
    max: 4.0
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
    default: 'low'
  },
  personalityType: {
    type: String,
    enum: ['extrovert', 'introvert', 'ambivert'],
    required: true,
    default: 'ambivert'
  },
  participationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50
  }
}, {
  timestamps: true,
  collection: 'students'
});

// Indexes for better query performance
studentSchema.index({ riskLevel: 1 });
studentSchema.index({ academicLevel: 1, major: 1 });
studentSchema.index({ currentGPA: 1 });

export const StudentModel = mongoose.model<StudentDocument>('Student', studentSchema);