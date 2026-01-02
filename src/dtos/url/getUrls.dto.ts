export interface UrlItemDTO {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    clickCount: number;
    createdAt: Date;
}

export interface GetUrlsResponseDTO {
    urls: UrlItemDTO[];
    total: number;
}
