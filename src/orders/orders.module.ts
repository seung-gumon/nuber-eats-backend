import { Module } from '@nestjs/common';
import {OrderResolver} from "./order.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {OrderService} from "./orders.service";
import {Restaurant} from "../restaurants/entities/restaurant.entity";

@Module({
    imports : [TypeOrmModule.forFeature([Order,Restaurant])],
    providers : [
        OrderService,
        OrderResolver
    ]
})
export class OrdersModule {}
