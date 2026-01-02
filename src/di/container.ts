import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Interfaces
import { IPasswordHasher } from '@/providers/interfaces/passwordHasher.interface';
import { ITokenProvider } from '@/providers/interfaces/tokenProvider.interface';
import { IUserRepo } from '@/repos/interfaces/user.repo.interface';
import { IUrlRepo } from '@/repos/interfaces/url.repo.interface';
import { IAuthService } from '@/services/interfaces/auth.service.interface';
import { IUrlService } from '@/services/interfaces/url.service.interface';

// Implementations
import { BcryptPasswordHasher } from '@/providers/passwordHasher';
import { JwtTokenProvider } from '@/providers/tokenProvider';
import { UserRepo } from '@/repos/user.repo';
import { UrlRepo } from '@/repos/url.repo';
import { AuthService } from '@/services/auth.service';
import { UrlService } from '@/services/url.service';
import { AuthController } from '@/presentation/controllers/authController';
import { UrlController } from '@/presentation/controllers/urlController';

const container = new Container();

// Bind Providers
container.bind<IPasswordHasher>(TYPES.IPasswordHasher).to(BcryptPasswordHasher).inSingletonScope();
container.bind<ITokenProvider>(TYPES.ITokenProvider).to(JwtTokenProvider).inSingletonScope();

// Bind Repositories
container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo).inSingletonScope();
container.bind<IUrlRepo>(TYPES.IUrlRepo).to(UrlRepo).inSingletonScope();

// Bind Services
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<IUrlService>(TYPES.IUrlService).to(UrlService).inSingletonScope();

// Bind Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<UrlController>(TYPES.UrlController).to(UrlController).inSingletonScope();

export { container };
