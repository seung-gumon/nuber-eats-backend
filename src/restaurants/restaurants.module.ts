import {Module} from '@nestjs/common';
import {CategoryResolver, RestaurantResolver} from './restaurants.resolver';
import {RestaurantsService} from "./restaurants.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {CategoryRepository} from "./repositories/category.repository";

@Module({
    providers: [RestaurantResolver, RestaurantsService , CategoryResolver],
    imports: [TypeOrmModule.forFeature([Restaurant , CategoryRepository])],
    exports: []
})
export class RestaurantsModule {
}
