import { IAuthService } from '@/services/interfaces/auth.service.interface';
import { ResponseDTO } from '@/dtos/Response.dto';
import { SignupRequestDTO, SignupResponseDTO } from '@/dtos/auth/signup.dto';
import { LoginRequestDTO, LoginResponseDTO } from '@/dtos/auth/login.dto';
import { userRepo } from '@/repos/user.repo';
import { passwordHasher } from '@/providers/passwordHasher';
import { tokenProvider } from '@/providers/tokenProvider';
import { AUTH_ERRORS } from '@/const/errors.const';
import { ITokenPayload } from '@/types/token.type';
import logger from '@/utils/logger';

class AuthService implements IAuthService {
    async signup(req: SignupRequestDTO): Promise<ResponseDTO<SignupResponseDTO | null>> {
        const method = 'AuthService.signup';
        logger.info(`[AUTH-SERVICE] ${method} started`);

        // Check if user already exists
        const existingUser = await userRepo.getUserByEmail(req.email);
        if (existingUser) {
            logger.error(`[AUTH-SERVICE] ${method} user already exists`);
            return {
                data: null,
                errorMessage: AUTH_ERRORS.USER_ALREADY_EXISTS,
                success: false,
            };
        }

        // Hash password
        const hashedPassword = await passwordHasher.hashPassword(req.password);
        logger.info(`[AUTH-SERVICE] ${method} password hashed`);

        // Create user
        const newUser = await userRepo.createUser({
            ...req,
            password: hashedPassword,
        });

        if (!newUser) {
            logger.error(`[AUTH-SERVICE] ${method} failed to create user`);
            return {
                data: null,
                errorMessage: 'Failed to create user',
                success: false,
            };
        }

        logger.info(`[AUTH-SERVICE] ${method} user created`);

        // Generate token
        const tokenPayload: ITokenPayload = {
            userId: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
        };

        const accessToken = tokenProvider.generateAccessToken(tokenPayload);
        if (!accessToken) {
            logger.error(`[AUTH-SERVICE] ${method} failed to generate token`);
            return {
                data: null,
                errorMessage: AUTH_ERRORS.ACCESS_TOKEN_ISSUE_ERROR,
                success: false,
            };
        }

        logger.info(`[AUTH-SERVICE] ${method} access token generated`);

        return {
            data: {
                accessToken,
                user: {
                    id: newUser._id.toString(),
                    name: newUser.name,
                    email: newUser.email,
                },
            },
            success: true,
        };
    }

    async login(req: LoginRequestDTO): Promise<ResponseDTO<LoginResponseDTO | null>> {
        const method = 'AuthService.login';
        logger.info(`[AUTH-SERVICE] ${method} started`);

        // Find user
        const user = await userRepo.getUserByEmail(req.email);
        if (!user) {
            logger.error(`[AUTH-SERVICE] ${method} user not found`);
            return {
                data: null,
                errorMessage: AUTH_ERRORS.INVALID_CREDENTIALS,
                success: false,
            };
        }

        // Verify password
        const isPasswordValid = await passwordHasher.comparePasswords(
            req.password,
            user.password
        );
        if (!isPasswordValid) {
            logger.error(`[AUTH-SERVICE] ${method} invalid credentials`);
            return {
                data: null,
                errorMessage: AUTH_ERRORS.INVALID_CREDENTIALS,
                success: false,
            };
        }

        logger.info(`[AUTH-SERVICE] ${method} login successful`);

        // Generate token
        const tokenPayload: ITokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
        };

        const accessToken = tokenProvider.generateAccessToken(tokenPayload);
        if (!accessToken) {
            logger.error(`[AUTH-SERVICE] ${method} failed to generate token`);
            return {
                data: null,
                errorMessage: AUTH_ERRORS.ACCESS_TOKEN_ISSUE_ERROR,
                success: false,
            };
        }

        logger.info(`[AUTH-SERVICE] ${method} access token generated`);

        return {
            data: {
                accessToken,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                },
            },
            success: true,
        };
    }
}

export const authService = new AuthService();
