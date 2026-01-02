import { ResponseDTO } from '@/dtos/Response.dto';
import { CreateUrlRequestDTO, CreateUrlResponseDTO } from '@/dtos/url/createUrl.dto';
import { GetUrlsResponseDTO } from '@/dtos/url/getUrls.dto';

export interface IUrlService {
    createShortUrl(
        userId: string,
        req: CreateUrlRequestDTO
    ): Promise<ResponseDTO<CreateUrlResponseDTO | null>>;
    
    getUserUrls(userId: string): Promise<ResponseDTO<GetUrlsResponseDTO | null>>;
    
    getOriginalUrl(shortCode: string): Promise<ResponseDTO<string | null>>;
    
    deleteUrl(userId: string, urlId: string): Promise<ResponseDTO<boolean>>;
}
