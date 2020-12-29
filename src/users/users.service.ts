import { JwtService } from './../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './dtos/login.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<string | undefined> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return '해당 이메일을 가진 사용자가 이미 존재합니다';
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      return '계정을 생성 할 수 없습니다';
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: '이메일을 찾을 수 없습니다.',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: passwordCorrect,
          error: '비밀번호가 틀렸습니다.',
        };
      }
      const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
      return {
        ok: passwordCorrect,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
