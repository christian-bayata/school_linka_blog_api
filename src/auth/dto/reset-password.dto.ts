export class ResetPasswordDto {
  password: string;
  confirmPassword: string;
  code: string;
}
export class VerificationDto {
  ver_id: string;
  email: string;
}
