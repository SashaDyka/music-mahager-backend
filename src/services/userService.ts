import { PrismaClient, User } from '../../generated/prisma';
import { UserProfileDto } from '../dto/userDTO.js';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async getUserById(id: string): Promise<UserProfileDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    return user ? UserProfileDto.fromPrisma(user) : null;
  }
  
  async updateUser(id: string, data: { displayName?: string; email?: string }): Promise<UserProfileDto | null> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        displayName: data.displayName,
        email: data.email,
        updatedAt: new Date(),
      },
    });

    return UserProfileDto.fromPrisma(updatedUser);
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}