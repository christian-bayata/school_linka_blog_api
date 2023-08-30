export class SignUpDto {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly verified?: string;
  readonly avatar?: string;
  readonly loginCount?: number;
  readonly lastLoggedIn?: Date;
}
