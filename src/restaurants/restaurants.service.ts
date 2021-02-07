import {Restaurant} from "./entities/restaurant.entity";
import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {User} from "../users/entities/user.entity";


@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(Restaurant) private readonly restaurant: Repository<Restaurant>
    ) {
    }

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurant.create(createRestaurantInput);
            await this.restaurant.save(newRestaurant)
            return {
                ok: true
            }
        } catch {
            return {
                ok: false,
                error: "새로운 레스토랑을 생성하지 못하였습니댜."
            }
        }
    }
}