export class RegisterDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly displayName: string
  ) {}
}

export class LoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}

export class UserProfileDto {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly displayName: string
  ) {}
}