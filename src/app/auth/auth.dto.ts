import { IsEmail, isEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class LoginDTO {


  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8)
  password: string;
}


export class ResetPasswordDTO {
  @IsString()
  @MinLength(8)
  new_password: string;
}

export class ChangePassword {
  
}