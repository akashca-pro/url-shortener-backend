import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { IUrlService } from '@/services/interfaces/url.service.interface';
import { ResponseDTO } from '@/dtos/Response.dto';
import { CreateUrlRequestDTO, CreateUrlResponseDTO } from '@/dtos/url/createUrl.dto';
import { GetUrlsResponseDTO, UrlItemDTO } from '@/dtos/url/getUrls.dto';
import { IUrlRepo } from '@/repos/interfaces/url.repo.interface';
import { URL_ERRORS } from '@/const/errors.const';
import { generateShortCode } from '@/utils/shortCodeGenerator';
import { config } from '@/config';
import logger from '@/utils/logger';

@injectable()
export class UrlService implements IUrlService {
    readonly #urlRepo: IUrlRepo;

    constructor(
        @inject(TYPES.IUrlRepo) urlRepo: IUrlRepo
    ) {
        this.#urlRepo = urlRepo;
    }

    async createShortUrl(
        userId: string,
        req: CreateUrlRequestDTO
    ): Promise<ResponseDTO<CreateUrlResponseDTO | null>> {
        const method = 'UrlService.createShortUrl';
        logger.info(`[URL-SERVICE] ${method} started`);

        let shortCode: string;

        // Use custom code if provided, otherwise generate one
        if (req.customCode) {
            // Check if custom code already exists
            const exists = await this.#urlRepo.isShortCodeExists(req.customCode);
            if (exists) {
                logger.error(`[URL-SERVICE] ${method} custom code already exists`);
                return {
                    data: null,
                    errorMessage: URL_ERRORS.URL_ALREADY_EXISTS,
                    success: false,
                };
            }
            shortCode = req.customCode;
        } else {
            // Generate unique short code
            let attempts = 0;
            const maxAttempts = 5;
            
            do {
                shortCode = generateShortCode();
                const exists = await this.#urlRepo.isShortCodeExists(shortCode);
                if (!exists) break;
                attempts++;
            } while (attempts < maxAttempts);

            if (attempts >= maxAttempts) {
                logger.error(`[URL-SERVICE] ${method} failed to generate unique code`);
                return {
                    data: null,
                    errorMessage: URL_ERRORS.URL_CREATION_FAILED,
                    success: false,
                };
            }
        }

        // Create URL
        const url = await this.#urlRepo.createUrl({
            originalUrl: req.originalUrl,
            shortCode,
            userId,
        });

        if (!url) {
            logger.error(`[URL-SERVICE] ${method} failed to create URL`);
            return {
                data: null,
                errorMessage: URL_ERRORS.URL_CREATION_FAILED,
                success: false,
            };
        }

        logger.info(`[URL-SERVICE] ${method} URL created successfully`);

        return {
            data: {
                id: url._id.toString(),
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl: `${config.BASE_URL}/${url.shortCode}`,
                clickCount: url.clickCount,
                createdAt: url.createdAt,
            },
            success: true,
        };
    }

    async getUserUrls(userId: string): Promise<ResponseDTO<GetUrlsResponseDTO | null>> {
        const method = 'UrlService.getUserUrls';
        logger.info(`[URL-SERVICE] ${method} started`);

        const urls = await this.#urlRepo.getUrlsByUserId(userId);

        const urlItems: UrlItemDTO[] = urls.map((url) => ({
            id: url._id.toString(),
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${config.BASE_URL}/${url.shortCode}`,
            clickCount: url.clickCount,
            createdAt: url.createdAt,
        }));

        logger.info(`[URL-SERVICE] ${method} found ${urls.length} URLs`);

        return {
            data: {
                urls: urlItems,
                total: urls.length,
            },
            success: true,
        };
    }

    async getOriginalUrl(shortCode: string): Promise<ResponseDTO<string | null>> {
        const method = 'UrlService.getOriginalUrl';
        logger.info(`[URL-SERVICE] ${method} started`);

        const url = await this.#urlRepo.getUrlByShortCode(shortCode);

        if (!url) {
            logger.error(`[URL-SERVICE] ${method} URL not found`);
            return {
                data: null,
                errorMessage: URL_ERRORS.URL_NOT_FOUND,
                success: false,
            };
        }

        // Increment click count asynchronously 
        this.#urlRepo.incrementClickCount(url._id.toString()).catch((err) => {
            logger.error('Failed to increment click count:', err);
        });

        logger.info(`[URL-SERVICE] ${method} URL found, redirecting`);

        return {
            data: url.originalUrl,
            success: true,
        };
    }

    async deleteUrl(userId: string, urlId: string): Promise<ResponseDTO<boolean>> {
        const method = 'UrlService.deleteUrl';
        logger.info(`[URL-SERVICE] ${method} started`);

        // Get URL and verify ownership
        const url = await this.#urlRepo.getUrlById(urlId);

        if (!url) {
            logger.error(`[URL-SERVICE] ${method} URL not found`);
            return {
                data: false,
                errorMessage: URL_ERRORS.URL_NOT_FOUND,
                success: false,
            };
        }

        if (url.userId.toString() !== userId) {
            logger.error(`[URL-SERVICE] ${method} unauthorized access`);
            return {
                data: false,
                errorMessage: URL_ERRORS.UNAUTHORIZED_URL_ACCESS,
                success: false,
            };
        }

        const deleted = await this.#urlRepo.deleteUrl(urlId);

        if (!deleted) {
            logger.error(`[URL-SERVICE] ${method} failed to delete URL`);
            return {
                data: false,
                errorMessage: URL_ERRORS.URL_NOT_FOUND,
                success: false,
            };
        }

        logger.info(`[URL-SERVICE] ${method} URL deleted successfully`);

        return {
            data: true,
            success: true,
        };
    }
}
