import { EmailField, PasswordField } from '@/decorators/field.decorators';

export class SigninReqDto {
  @EmailField()
  email!: string;

  @PasswordField()
  password!: string;
}
