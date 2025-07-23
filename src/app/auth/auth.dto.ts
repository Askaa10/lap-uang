import { IsEmail, isEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDTO {
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8)
  password: string;
}


export class ChangePassword {
  
}