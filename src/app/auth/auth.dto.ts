import { IsEmail, isEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8)
  password: string;
}



export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}


export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string; // JWT reset token

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}


export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  resetSessionId : string;
}

export class VerifyResetTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @IsNotEmpty()
  @Length(6, 6) // token 6 digit
  token: string;
}