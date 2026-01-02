import { ITokenPayload } from '@/types/token.type';

export interface ITokenProvider {
    generateAccessToken(payload: ITokenPayload): string;
    verifyAccessToken(token: string): ITokenPayload | null;
}
