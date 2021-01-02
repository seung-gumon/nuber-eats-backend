import { LoginOutput, LoginInput } from './dtos/login.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

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
  me() {}
}
