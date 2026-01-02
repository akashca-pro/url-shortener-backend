import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '@/config';
import { ITokenPayload } from '@/types/token.type';
import { ITokenProvider } from '@/providers/interfaces/tokenProvider.interface';

/**
 * Provider for managing JWT authentication tokens.
 */
export class JwtTokenProvider implements ITokenProvider {
    private _accessSecret: Secret = config.JWT_ACCESS_TOKEN_SECRET;
    private _accessExpiry = config.JWT_ACCESS_TOKEN_EXPIRY;

    generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, this._accessSecret, {
            expiresIn: this._accessExpiry,
        } as SignOptions);
    }

    verifyAccessToken(token: string): ITokenPayload | null {
        try {
            const decoded = jwt.verify(token, this._accessSecret) as ITokenPayload;
            return decoded;
        } catch {
            return null;
        }
    }
}

// Export singleton instance
export const tokenProvider = new JwtTokenProvider();
