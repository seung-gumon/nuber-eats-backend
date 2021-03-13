import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Dish, DishChoice} from "../../restaurants/entities/dish.entity";

@InputType('OrderItemOptionInputType', {isAbstract: true})
@ObjectType()
export class OrderItemOption {
    @Field(() => String)
    name: string;
    @Field(() => DishChoice, {nullable: true})
    choice?: DishChoice
    @Field(() => Int, {nullable: true})
    extra?: number
}

@InputType("OrderItemInputType" , {isAbstract : true})
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity{

    @Field(type => Dish)
    @ManyToOne(type => Dish, {nullable: true, onDelete: "CASCADE"})
    dish : Dish


    @Field(() => [OrderItemOption], {nullable: true})
    @Column({type: "json", nullable: true})
    options?: OrderItemOption[]
}
