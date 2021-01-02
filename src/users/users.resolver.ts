import { AuthGuard } from './../auth/auth.guard';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') CreateAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const error = await this.UsersService.createAccount(CreateAccountInput);
      if (error) {
        return {
          error,
          ok: false,
        };
      }
      return {
        ok: true,
      };
    } catch (error) {
      return {
        error,
        ok: false,
      };
    }
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.UsersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Query((returns) => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }
}
