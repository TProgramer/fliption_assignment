// 환경변수 검증을 위한 커스텀 함수
// https://docs.nestjs.com/techniques/configuration#custom-validate-function
import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

export enum Environment {
  LOCAL = 'local',
  PROD = 'prod',
}

export enum EnvKey {
  NODE_ENV = 'NODE_ENV',

  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USER = 'DB_USER',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',
  DB_SYNC = 'DB_SYNC',
  DB_LOG = 'DB_LOG',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  DB_HOST: string;
  @IsNumber()
  DB_PORT: number;
  @IsString()
  DB_USER: string;
  @IsString()
  DB_PASSWORD: string;
  @IsString()
  DB_DATABASE: string;
  @IsBoolean()
  DB_SYNC: boolean;
  @IsBoolean()
  DB_LOG: boolean;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
