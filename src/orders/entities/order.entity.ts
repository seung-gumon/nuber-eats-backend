import {Field, Float, InputType, ObjectType, registerEnumType} from '@nestjs/graphql';
import {Column, Entity, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {User} from "../../users/entities/user.entity";
import {Restaurant} from "../../restaurants/entities/restaurant.entity";
import {OrderItem} from "./order-item.entity";
import {IsEnum, IsNumber} from "class-validator";


enum OrderStatus {
    Pending = 'Pending',
    Cooking = 'Cooking',
    PickedUp = 'PickedUp',
    Delivered = 'Delivered',
}


registerEnumType(OrderStatus, {name: 'OrderStatus'})


@InputType("OrderInputType", {isAbstract: true})
@ObjectType()
@Entity()
export class Order extends CoreEntity {

    @Field(() => User, {nullable: true})
    @ManyToOne(type => User, User => User.orders, {onDelete: "SET NULL", nullable: true})
    customer ?: User

    @Field(() => User, {nullable: true})
    @ManyToOne(type => User, User => User.rides, {onDelete: "SET NULL", nullable: true})
    driver ?: User

    @Field(() => Restaurant, {nullable: true})
    @ManyToOne(() => Restaurant, Restaurant => Restaurant.orders, {onDelete: 'SET NULL', nullable: true})
    restaurant?: Restaurant

    @Field(() => [OrderItem])
    @ManyToMany(() => OrderItem)
    @JoinTable()
    items: OrderItem[]


    @Column({nullable: true})
    @Field(() => Float, {nullable: true})
    @IsNumber()
    total?: number


    @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.Pending})
    @Field(() => OrderStatus)
    @IsEnum(OrderStatus)
    status: OrderStatus

}