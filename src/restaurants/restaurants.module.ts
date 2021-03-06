import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Restaurant} from './entities/restaurant.entity';
import {CategoryRepository} from './repositories/category.repository';
import {
    CategoryResolver,
    DishResolver,
    RestaurantResolver,
} from './restaurants.resolver';
import {RestaurantsService} from './restaurants.service';
import {Dish} from "./entities/dish.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])],
    providers: [
        RestaurantResolver,
        CategoryResolver,
        DishResolver,
        RestaurantsService,
    ],
})
export class RestaurantsModule {
}