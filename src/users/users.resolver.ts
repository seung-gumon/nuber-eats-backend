import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Query(() => Boolean)
  hi() {
    return true;
  }

  @Mutation(() => createAccountOutput)
  createAccount(@Args('input') createAccountInput: createAccountInput) {}
}
