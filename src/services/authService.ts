import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto } from '../dto/authDTO.js';
import { UserProfileDto } from '../dto/authDTO.js';

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(dto: RegisterDto): Promise<UserProfileDto> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        displayName: dto.displayName,
        passwordHash: hashedPassword,
      },
    });

    return new UserProfileDto(user.id, user.email, user.displayName);
  }

  async login(dto: LoginDto): Promise<{ user: UserProfileDto; token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    return {
      user: new UserProfileDto(user.id, user.email, user.displayName),
      token,
    };
  }

  async getProfile(userId: string): Promise<UserProfileDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return new UserProfileDto(user.id, user.email, user.displayName);
  }
}