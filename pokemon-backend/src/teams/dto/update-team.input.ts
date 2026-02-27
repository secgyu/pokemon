import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsArray, MinLength, MaxLength, ArrayMaxSize, IsInt, Min, Max, IsOptional } from 'class-validator';

@InputType()
export class UpdateTeamInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '팀 이름을 입력하세요' })
  @MaxLength(30, { message: '팀 이름은 30자 이하여야 합니다' })
  name?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6, { message: '팀은 최대 6마리입니다' })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(1025, { each: true })
  pokemonIds?: number[];
}
