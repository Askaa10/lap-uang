export class MailForgotPasswordDTO {
    name: string;
    email: string;
    otpToken: number | string;
    userId : string;
}
