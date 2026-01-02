import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { IAuthService } from '@/services/interfaces/auth.service.interface';
import { ResponseDTO } from '@/dtos/Response.dto';
import { SignupRequestDTO, SignupResponseDTO } from '@/dtos/auth/signup.dto';
import { LoginRequestDTO, LoginResponseDTO } from '@/dtos/auth/login.dto';
import { IUserRepo } from '@/repos/interfaces/user.repo.interface';
import { IPasswordHasher } from '@/providers/interfaces/passwordHasher.interface';
import { ITokenProvider } from '@/providers/interfaces/tokenProvider.interface';
import { AUTH_ERRORS } from '@/const/errors.const';
import { ITokenPayload } from '@/types/token.type';
import logger from '@/utils/logger';

@injectable()
export class AuthService implements IAuthService {
    readonly #userRepo: IUserRepo;
    readonly #passwordHasher: IPasswordHasher;
    readonly #tokenProvider: ITokenProvider;

    constructor(
        @inject(TYPES.IUserRepo) userRepo: IUserRepo,
        @inject(TYPES.IPasswordHasher) passwordHasher: IPasswordHasher,
        @inject(TYPES.ITokenProvider) tokenProvider: ITokenProvider
    ) {
        this.#userRepo = userRepo;
        this.#passwordHasher = passwordHasher;
        this.#tokenProvider = tokenProvider;
    }

    async signup(req: SignupRequestDTO): Promise<ResponseDTO<SignupResponseDTO | null>> {
        const method = 'AuthService.signup';
        logger.info(`[AUTH-SERVICE] ${method} started`);

        // Check if user already exists
        const existingUser = await this.#userRepo.getUserByEmail(req.email);
        if (existingUser) {
            logger.error(`[AUTH-SERVICE] ${method} user already exists`);
            return {
                data: null,
                errorMessage: AUTH_ERRORS.USER_ALREADY_EXISTS,
                success: false,
            };
        }

        // Hash password
        const hashedPassword = await this.#passwordHasher.hashPassword(req.password);
        logger.info(`[AUTH-SERVICE] ${method} password hashed`);

        // Create user
        const newUser = await this.#userRepo.createUser({
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

        const accessToken = this.#tokenProvider.generateAccessToken(tokenPayload);
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
        const user = await this.#userRepo.getUserByEmail(req.email);
        if (!user) {
            logger.error(`[AUTH-SERVICE] ${method} user not found`);
            return {
                data: null,
                errorMessage: AUTH_ERRORS.INVALID_CREDENTIALS,
                success: false,
            };
        }

        // Verify password
        const isPasswordValid = await this.#passwordHasher.comparePasswords(
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

        const accessToken = this.#tokenProvider.generateAccessToken(tokenPayload);
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
