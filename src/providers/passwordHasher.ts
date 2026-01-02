import * as bcrypt from 'bcrypt';
import { injectable } from 'inversify';
import { IPasswordHasher } from '@/providers/interfaces/passwordHasher.interface';

/**
 * Implementation of the password hashing provider using bcrypt.
 */
@injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
    readonly #saltRounds: number;

    constructor(saltRounds: number = 10) {
        this.#saltRounds = saltRounds;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.#saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async comparePasswords(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}

