import {Field, Float, InputType, ObjectType, registerEnumType} from '@nestjs/graphql';
import {Column, Entity, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {User} from "../../users/entities/user.entity";
import {Restaurant} from "../../restaurants/entities/restaurant.entity";
import {Dish} from "../../restaurants/entities/dish.entity";


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

    @Field(() => Restaurant)
    @ManyToOne(() => Restaurant, Restaurant => Restaurant.orders, {onDelete: 'SET NULL', nullable: true})
    restaurant: Restaurant

    @Field(() => [Dish])
    @ManyToMany(type => Dish)
    @JoinTable()
    dishes: Dish[]


    @Column()
    @Field(() => Float)
    total: number


    @Column({type: 'enum', enum: OrderStatus})
    @Field(() => OrderStatus)
    status: OrderStatus

}