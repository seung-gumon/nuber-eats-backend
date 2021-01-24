import { EditProfileInput } from './dtos/edit-profile.dto';
import { JwtService } from './../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './dtos/login.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Verification } from './entities/verification.entity';
import {MailService} from "../mail/mail.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification) private readonly verification: Repository<Verification>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService : MailService
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

      const user = await this.users.save(this.users.create({ email, password, role }));
      const verification = await this.verification.save(this.verification.create({user}))
      this.mailService.sendVerificationEmail(user.email, verification.code)
    } catch (e) {
      return '계정을 생성 할 수 없습니다';
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({email}, {select: ['id', 'password']});
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
      const token = this.jwtService.sign(user.id);
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

  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne(userId);
    if (email) {
      user.email = email;
      user.verified = false;
      const verification = await this.verification.save(this.verification.create({user}))
      this.mailService.sendVerificationEmail(user.email, verification.code)
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }


  async verifyEmail(code: string): Promise<boolean> {
    try {
      const verification = await this.verification.findOne(
          {code},
          {relations: ['user']}
      );
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verification.delete(verification.id)
        return true;
      }
      return false
    }catch (error){
      return false
    }

  }

}
