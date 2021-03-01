import {Args, Mutation, Resolver, Query, ResolveField, Int, Parent} from '@nestjs/graphql';
import {Restaurant} from './entities/restaurant.entity';
import {RestaurantsService} from "./restaurants.service";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../users/entities/user.entity";
import {CoreOutput} from "../common/dtos/output.dto";
import {Role} from "../auth/role.decorator";
import {EditRestaurantInput, EditRestaurantOutput} from "./dtos/edit-restaurant.dto";
import {DeleteRestaurantInput, DeleteRestaurantOutput} from "./dtos/delete-restaurant.dto";
import {Category} from "./entities/category.entity";
import {AllCategoriesOutput} from "./dtos/all-categories.dto";
import {CategoryInput, CategoryOutput} from "./dtos/category.dto";
import {RestaurantsInput, RestaurantsOutput} from "./dtos/restaurants.dto";
import {RestaurantInput, RestaurantOutput} from "./dtos/restaurant.dto";
import {SearchRestaurantInput, SearchRestaurantOutput} from "./dtos/search-restaurant.dto";


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


    @Query(() => RestaurantsOutput)
    restaurants(@Args('input') restaurantsInput : RestaurantsInput): Promise<RestaurantsOutput> {
        return this.restaurantService.allRestaurants(restaurantsInput)
    }


    @Query(() => RestaurantOutput)
    restaurant(
        @Args('input') restaurantInput : RestaurantInput
    ) : Promise<RestaurantOutput> {
        return this.restaurantService.findRestaurantById(restaurantInput);
    }


    @Query(() => SearchRestaurantOutput)
    searchRestaurant(
        @Args('input') searchRestaurantInput : SearchRestaurantInput
    ): Promise<SearchRestaurantOutput> {
        return this.restaurantService.searchRestaurantByName(searchRestaurantInput)
    }
}


@Resolver(() => Category)
export class CategoryResolver {
    constructor(private readonly restaurantsService : RestaurantsService) {}

    @ResolveField(() => Int)
    restaurantCount(@Parent() category : Category) : Promise<number> {
        return this.restaurantsService.countRestaurant(category);
    }


    @Query(() => AllCategoriesOutput)
    allCategories() : Promise<AllCategoriesOutput>{
        return this.restaurantsService.allCategories();
    }

    @Query(() => CategoryOutput)
    category(@Args('input') categoryInput : CategoryInput) : Promise<CategoryOutput> {
        return this.restaurantsService.findCategoryBySlug(categoryInput)
    }
}