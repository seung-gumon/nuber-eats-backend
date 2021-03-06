import { Module } from '@nestjs/common';
import {OrderResolver} from "./order.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {OrderService} from "./orders.service";

@Module({
    imports : [TypeOrmModule.forFeature([Order])],
    providers : [
        OrderService,
        OrderResolver
    ]
})
export class OrdersModule {}
