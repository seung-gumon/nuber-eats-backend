import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {Restaurant} from './entities/restaurant.entity';
import {RestaurantsService} from "./restaurants.service";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../users/entities/user.entity";

@Resolver(() => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantsService) {
    }

    @Mutation(returns => Boolean)
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args("input") createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput)
    }

}
