import { Module } from '@nestjs/common';
import {OrderResolver} from "./order.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {OrderService} from "./orders.service";
import {Restaurant} from "../restaurants/entities/restaurant.entity";
import {OrderItem} from "./entities/order-item.entity";
import {Dish} from "../restaurants/entities/dish.entity";

@Module({
    imports : [TypeOrmModule.forFeature([Order,Restaurant,OrderItem,Dish])],
    providers : [
        OrderService,
        OrderResolver,
        OrderItem,
        Dish,
    ]
})
export class OrdersModule {}
