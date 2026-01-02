export interface CreateUrlRequestDTO {
    originalUrl: string;
    customCode?: string;
}

export interface CreateUrlResponseDTO {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    clickCount: number;
    createdAt: Date;
}
