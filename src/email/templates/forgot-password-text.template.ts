export function forgotPasswordText(code: string) {
  return `This is your password reset code: \n\n${code}\n\nIf you have not requested this email, then ignore it`;
}
