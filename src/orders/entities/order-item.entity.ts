import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Dish, DishOption} from "../../restaurants/entities/dish.entity";


@InputType("OrderItemInputType" , {isAbstract : true})
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity{

    @Field(type => Dish)
    @ManyToOne(type => Dish, {nullable: true, onDelete: "CASCADE"})
    dish : Dish


    @Field(() => [DishOption], {nullable: true})
    @Column({type: "json", nullable: true})
    options?: DishOption[]
}
