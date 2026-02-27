import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail({}, { message: '유효한 이메일을 입력하세요' })
  email: string;

  @Field()
  @IsString()
  @MinLength(2, { message: '닉네임은 2자 이상이어야 합니다' })
  @MaxLength(20, { message: '닉네임은 20자 이하여야 합니다' })
  nickname: string;

  @Field()
  @IsString()
  @MinLength(6, { message: '비밀번호는 6자 이상이어야 합니다' })
  password: string;
}
