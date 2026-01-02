import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { injectable } from 'inversify';
import { config } from '@/config';
import { ITokenPayload } from '@/types/token.type';
import { ITokenProvider } from '@/providers/interfaces/tokenProvider.interface';

/**
 * Provider for managing JWT authentication tokens.
 */
@injectable()
export class JwtTokenProvider implements ITokenProvider {
    #accessSecret: Secret = config.JWT_ACCESS_TOKEN_SECRET;
    #accessExpiry = config.JWT_ACCESS_TOKEN_EXPIRY;

    generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, this.#accessSecret, {
            expiresIn: this.#accessExpiry,
        } as SignOptions);
    }

    verifyAccessToken(token: string): ITokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.#accessSecret) as ITokenPayload;
            return decoded;
        } catch {
            return null;
        }
    }
}

