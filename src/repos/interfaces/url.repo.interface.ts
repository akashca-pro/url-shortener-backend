import { IUrl } from '@/db/interfaces/url.interface';
import { CreateUrlRequestDTO } from '@/dtos/url/createUrl.dto';

export interface IUrlRepo {
    createUrl(data: CreateUrlRequestDTO & { shortCode: string; userId: string }): Promise<IUrl | null>;
    getUrlByShortCode(shortCode: string): Promise<IUrl | null>;
    getUrlsByUserId(userId: string): Promise<IUrl[]>;
    getUrlById(id: string): Promise<IUrl | null>;
    deleteUrl(id: string): Promise<boolean>;
    incrementClickCount(id: string): Promise<void>;
    isShortCodeExists(shortCode: string): Promise<boolean>;
}
