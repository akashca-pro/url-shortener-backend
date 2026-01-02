import mongoose, { Schema } from 'mongoose';
import { IUrl } from '../interfaces/url.interface';

const UrlSchema = new Schema<IUrl>(
    {
        originalUrl: { type: String, required: true },
        shortCode: { type: String, required: true, unique: true },
        userId: { type: String, required: true, ref: 'User' },
        clickCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Index for faster lookups by userId
UrlSchema.index({ userId: 1 });

export const UrlModel = mongoose.model<IUrl>('Url', UrlSchema);
