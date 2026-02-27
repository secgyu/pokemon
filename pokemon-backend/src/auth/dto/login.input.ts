import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: '유효한 이메일을 입력하세요' })
  email: string;

  @Field()
  @IsString()
  password: string;
}
