import mongoose, { Schema, Document } from 'mongoose';
import { InteractionEvent as IInteractionEvent } from '../../shared/types';

export interface InteractionDocument extends Omit<IInteractionEvent, 'id'>, Document {
  interactionId: string;
}

const interactionSchema = new Schema<InteractionDocument>({
  interactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
    ref: 'Session'
  },
  studentId1: {
    type: String,
    required: true,
    index: true,
    ref: 'Student'
  },
  studentId2: {
    type: String,
    required: true,
    index: true,
    ref: 'Student'
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  avgDistance: {
    type: Number,
    required: true,
    min: 0
  },
  avgOrientationDiff: {
    type: Number,
    required: true,
    min: 0,
    max: 180
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  interactionType: {
    type: String,
    enum: ['discussion', 'collaboration', 'social', 'help-seeking'],
    required: true,
    index: true
  },
  context: {
    type: String,
    enum: ['lecture', 'group-work', 'break', 'lab'],
    required: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'interactions'
});

// Compound indexes for efficient queries
interactionSchema.index({ sessionId: 1, startTime: 1 });
interactionSchema.index({ studentId1: 1, sessionId: 1 });
interactionSchema.index({ studentId2: 1, sessionId: 1 });
interactionSchema.index({ interactionType: 1, context: 1 });

// Custom validator to ensure studentId1 and studentId2 are different
interactionSchema.pre('save', function(next) {
  if (this.studentId1 === this.studentId2) {
    next(new Error('Student cannot interact with themselves'));
  } else {
    next();
  }
});

export const InteractionModel = mongoose.model<InteractionDocument>('Interaction', interactionSchema);