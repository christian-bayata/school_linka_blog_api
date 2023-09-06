export class ResetPasswordDto {
  password: string;
  confirmPassword: string;
  code: string;
  email: string;
}
export class VerificationDto {
  ver_id: string;
  email: string;
}
