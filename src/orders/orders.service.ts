import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Restaurant} from "../restaurants/entities/restaurant.entity";
import {Repository} from "typeorm";
import {CategoryRepository} from "../restaurants/repositories/category.repository";
import {Dish} from "../restaurants/entities/dish.entity";
import {Order} from "./entities/order.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
    ) {}


}