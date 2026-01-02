import { injectable } from 'inversify';
import { IUser } from '@/db/interfaces/user.interface';
import { UserModel } from '@/db/models/user.model';
import { SignupRequestDTO } from '@/dtos/auth/signup.dto';
import { IUserRepo } from '@/repos/interfaces/user.repo.interface';
import logger from '@/utils/logger';

@injectable()
export class UserRepo implements IUserRepo {
    async createUser(data: SignupRequestDTO): Promise<IUser | null> {
        try {
            const user = await UserModel.create({
                name: data.name,
                email: data.email.toLowerCase(),
                password: data.password,
            });
            return user;
        } catch (error) {
            logger.error('Error creating user:', error);
            return null;
        }
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            return user;
        } catch (error) {
            logger.error('Error getting user by email:', error);
            return null;
        }
    }

    async getUserById(id: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch (error) {
            logger.error('Error getting user by id:', error);
            return null;
        }
    }
}

