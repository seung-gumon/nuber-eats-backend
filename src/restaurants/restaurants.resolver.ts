import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {Restaurant} from './entities/restaurant.entity';
import {RestaurantsService} from "./restaurants.service";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../users/entities/user.entity";
import {CoreOutput} from "../common/dtos/output.dto";
import {Role} from "../auth/role.decorator";
import {EditRestaurantInput, EditRestaurantOutput} from "./dtos/edit-restaurant.dto";
import {DeleteRestaurantInput, DeleteRestaurantOutput} from "./dtos/delete-restaurant.dto";


@Resolver(() => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantsService) {
    }

    @Mutation(returns => CoreOutput)
    @Role(["Owner"])
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args("input") createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput)
    }


    @Mutation(() => EditRestaurantOutput)
    @Role(["Owner"])
    editRestaurant(
        @AuthUser() owner: User,
        @Args("input") editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(owner, editRestaurantInput)
    }


    @Mutation(() => EditRestaurantOutput)
    @Role(["Owner"])
    deleteRestaurant(
        @AuthUser() owner : User,
        @Args('input') deleteRestaurantInput : DeleteRestaurantInput
    ) : Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput)
    }

}
