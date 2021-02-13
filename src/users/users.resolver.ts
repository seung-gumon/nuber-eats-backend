import { EditProfileOutput, EditProfileInput } from './dtos/edit-profile.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
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
import {VerifyEmailInput, VerifyEmailOutput} from "./dtos/verify-email.dto";
import {Role} from "../auth/role.decorator";

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
  @Role(["Any"])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Role(["Any"])
  @Query(() => UserProfileOutput)
  async useProfile(
    @Args() { userId }: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.UsersService.findById(userId);
      if (!user) {
        throw Error();
      }
      return {
        ok: Boolean(user),
        user,
      };
    } catch (e) {
      return {
        error: '유저를 찾지 못하였습니다.',
        ok: false,
      };
    }
  }


  @Mutation(() => EditProfileOutput)
  @Role(["Any"])
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.UsersService.editProfile(authUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation(returns => VerifyEmailOutput)
  async verifyEmail(@Args('input') {code}: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      await this.UsersService.verifyEmail(code);
      return {
        ok: true
      }
    } catch (error) {
      return {
        ok: false,
        error
      }
    }
  }


}
