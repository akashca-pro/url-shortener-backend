/**
 * Injection tokens for Inversify DI container.
 * Using symbols ensures type-safe injection.
 */
export const TYPES = {
    // Providers
    IPasswordHasher: Symbol.for('IPasswordHasher'),
    ITokenProvider: Symbol.for('ITokenProvider'),

    // Repositories
    IUserRepo: Symbol.for('IUserRepo'),
    IUrlRepo: Symbol.for('IUrlRepo'),

    // Services
    IAuthService: Symbol.for('IAuthService'),
    IUrlService: Symbol.for('IUrlService'),

    // Controllers
    AuthController: Symbol.for('AuthController'),
    UrlController: Symbol.for('UrlController'),
};
