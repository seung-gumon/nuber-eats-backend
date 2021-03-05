import {Restaurant} from "./entities/restaurant.entity";
import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository , Raw} from "typeorm";
import {CreateRestaurantInput, CreateRestaurantOutput} from "./dtos/create-restaurant.dto";
import {User} from "../users/entities/user.entity";
import {Category} from "./entities/category.entity";
import {EditRestaurantInput, EditRestaurantOutput} from "./dtos/edit-restaurant.dto";
import {CategoryRepository} from "./repositories/category.repository";
import {DeleteRestaurantInput, DeleteRestaurantOutput} from "./dtos/delete-restaurant.dto";
import {CoreOutput} from "../common/dtos/output.dto";
import {AllCategoriesOutput} from "./dtos/all-categories.dto";
import {CategoryInput, CategoryOutput} from "./dtos/category.dto";
import {RestaurantsInput, RestaurantsOutput} from "./dtos/restaurants.dto";
import {RestaurantInput, RestaurantOutput} from "./dtos/restaurant.dto";
import {SearchRestaurantInput, SearchRestaurantOutput} from "./dtos/search-restaurant.dto";
import {CreateDishInput, CreateDishOutput} from "./dtos/create-dish.dto";



@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurant: Repository<Restaurant>,
        private readonly categories: CategoryRepository,

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


    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find({relations: ['restaurants']});
            return {
                ok: true,
                categories
            }
        } catch {
            return {
                ok: false,
                error: '카테고리를 불러 올 수 없습니다.'
            }
        }
    }

    countRestaurant(category: Category) {
        return this.restaurant.count({category});
    }

    async findCategoryBySlug({slug, page}: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne({slug});
            if (!category) {
                return {
                    ok: false,
                    error: '카테고리를 찾지 못하였습니다.'
                }
            }
            const restaurants = await this.restaurant.find({
                where: {
                    category,
                },
                take: 25,
                skip: (page - 1) * 25,
            });
            category.restaurants = restaurants;
            const totalResult = await this.countRestaurant(category);
            return {
                ok: true,
                category,
                totalPages: Math.ceil(totalResult / 25)
            }
        } catch {
            return {
                ok: false,
                error: '카테고리를 찾지 못하였습니다.'
            }
        }
    }


    async allRestaurants({page}: RestaurantsInput): Promise<RestaurantsOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurant.findAndCount({skip: (page - 1), take: 25});
            return {
                ok: true,
                results : restaurants,
                totalPages: Math.ceil(totalResults / 25),
                totalResults
            }
        } catch {
            return {
                ok: false,
                error: "가게를 찾지 못하였습니다."
            }
        }
    }

    async findRestaurantById({restaurantId} : RestaurantInput) : Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurant.findOne(restaurantId , {relations : ['menu']});
            if (!restaurant) {
                return {
                    ok : false,
                    error : '가게를 찾지 못하였습니다.'
                }
            }
        }catch {
            return {
                ok :false,
                error : '가게를 찾지 못하였습니다'
           }
        }
    }


    async searchRestaurantByName({query,page} : SearchRestaurantInput) : Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResult] = await this.restaurant.findAndCount({
                where : {
                    name : Raw(name => `${name} ILIKE '%${query}%'`)
                },
                skip : (page - 1) * 25,
                take : 25
            });
            return {
                ok : true,
                restaurants,
                totalResults : totalResult,
                totalPages : Math.ceil(totalResult / 25)
            }
        }catch{
            return {
                ok:false,
                error : '가게를 찾지 못하였습니다'
            }
        }
    }


    async createDish(owner:User , createDishInput : CreateDishInput) : Promise<CreateDishOutput> {
        return {
            ok : false
        }
    }



}