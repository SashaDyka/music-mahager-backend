import { User } from '../../generated/prisma';

export class UserProfileDto {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly displayName: string
  ) {}

  static fromPrisma(user: User): UserProfileDto {
    return new UserProfileDto(user.id, user.email, user.displayName);
  }
}

export class UpdateUserDto {
  constructor(
    public readonly displayName?: string,
    public readonly email?: string
  ) {}
}