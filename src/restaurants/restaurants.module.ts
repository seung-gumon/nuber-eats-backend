import {Module} from '@nestjs/common';
import {RestaurantResolver} from './restaurants.resolver';
import {RestaurantsService} from "./restaurants.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {Category} from "./entities/category.entity";

@Module({
    providers: [RestaurantResolver, RestaurantsService],
    imports: [TypeOrmModule.forFeature([Restaurant , Category])],
    exports: []
})
export class RestaurantsModule {
}
