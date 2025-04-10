import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Story = mongoose.model('Story', storySchema);
