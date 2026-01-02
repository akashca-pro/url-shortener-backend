import { Document } from 'mongoose';

export interface IUrl extends Document {

    originalUrl: string;
    shortCode: string;
    userId: string;
    clickCount: number;
    createdAt: Date;
    updatedAt: Date;
}
