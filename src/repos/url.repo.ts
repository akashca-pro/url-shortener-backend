import { injectable } from 'inversify';
import { IUrl } from '@/db/interfaces/url.interface';
import { UrlModel } from '@/db/models/url.model';
import { CreateUrlRequestDTO } from '@/dtos/url/createUrl.dto';
import { IUrlRepo } from '@/repos/interfaces/url.repo.interface';
import logger from '@/utils/logger';

@injectable()
export class UrlRepo implements IUrlRepo {
    async createUrl(
        data: CreateUrlRequestDTO & { shortCode: string; userId: string }
    ): Promise<IUrl | null> {
        try {
            const url = await UrlModel.create({
                originalUrl: data.originalUrl,
                shortCode: data.shortCode,
                userId: data.userId,
                clickCount: 0,
            });
            return url;
        } catch (error) {
            logger.error('Error creating URL:', error);
            return null;
        }
    }

    async getUrlByShortCode(shortCode: string): Promise<IUrl | null> {
        try {
            const url = await UrlModel.findOne({ shortCode });
            return url;
        } catch (error) {
            logger.error('Error getting URL by short code:', error);
            return null;
        }
    }

    async getUrlsByUserId(userId: string): Promise<IUrl[]> {
        try {
            const urls = await UrlModel.find({ userId }).sort({ createdAt: -1 });
            return urls;
        } catch (error) {
            logger.error('Error getting URLs by user ID:', error);
            return [];
        }
    }

    async getUrlById(id: string): Promise<IUrl | null> {
        try {
            const url = await UrlModel.findById(id);
            return url;
        } catch (error) {
            logger.error('Error getting URL by ID:', error);
            return null;
        }
    }

    async deleteUrl(id: string): Promise<boolean> {
        try {
            const result = await UrlModel.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            logger.error('Error deleting URL:', error);
            return false;
        }
    }

    async incrementClickCount(id: string): Promise<void> {
        try {
            await UrlModel.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });
        } catch (error) {
            logger.error('Error incrementing click count:', error);
        }
    }

    async isShortCodeExists(shortCode: string): Promise<boolean> {
        try {
            const url = await UrlModel.findOne({ shortCode });
            return url !== null;
        } catch (error) {
            logger.error('Error checking short code:', error);
            return false;
        }
    }
}

