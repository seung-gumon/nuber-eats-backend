import {Restaurant} from "./entities/restaurant.entity";
import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {User} from "../users/entities/user.entity";
import {Category} from "./entities/category.entity";
import {EditRestaurantInput, EditRestaurantOutput} from "./dtos/edit-restaurant.dto";
import {CategoryRepository} from "./repositories/category.repository";
import {DeleteRestaurantInput, DeleteRestaurantOutput} from "./dtos/delete-restaurant.dto";
import {CoreOutput} from "../common/dtos/output.dto";


@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurant: Repository<Restaurant>,
        private readonly categories: CategoryRepository
    ) {
    }


    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurant.create(createRestaurantInput);
            newRestaurant.owner = owner;
            const category = await this.categories.getOrCreate(createRestaurantInput.categoryName);
            newRestaurant.category = category;
            await this.restaurant.save(newRestaurant);
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


    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        try {
            const res = await this.checkRestaurant(owner.id, editRestaurantInput.restaurantId);
            if (!res.ok) {
                return res
            }
            let category: Category = null;
            if (editRestaurantInput.categoryName) {
                category = await this.categories.getOrCreate(editRestaurantInput.categoryName);
            }
            await this.restaurant.save([{
                id: editRestaurantInput.restaurantId,
                ...editRestaurantInput,
                ...(category && ({category}))
            }])

            return {
                ok: true
            }
        } catch (error) {
            return {
                ok: false,
                error: "레스토랑 업데이트 실패 하였습니다."
            }
        }
    }


    async deleteRestaurant(
        {id: ownerId}: User,
        {restaurantId}: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        try {
            const res = await this.checkRestaurant(ownerId, restaurantId)
            if (!res.ok) {
                return res
            }
            await this.restaurant.delete(restaurantId)
        } catch (error) {
            return {
                ok: false,
                error: "레스토랑을 삭제하지 못하였습니다."
            }
        }
    }

    async checkRestaurant(ownerId: number, restaurantId: number): Promise<CoreOutput> {
        const restaurant = await this.restaurant.findOne(restaurantId, {loadRelationIds: true});
        if (!restaurant) {
            return {
                ok: false,
                error: "레스토랑을 찾지 못하였습니다."
            }
        }
        if (ownerId !== restaurant.ownerId) {
            return {
                ok: false,
                error: "삭제 권한이 없습니다."
            }
        }
        return {
            ok: true,
        }
    }

}