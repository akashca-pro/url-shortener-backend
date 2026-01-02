import { IUser } from '@/db/interfaces/user.interface';
import { SignupRequestDTO } from '@/dtos/auth/signup.dto';

export interface IUserRepo {
    createUser(data: SignupRequestDTO): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserById(id: string): Promise<IUser | null>;
}
