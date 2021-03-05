import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne, RelationId} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {IsNumber, IsString, Length} from "class-validator";
import {Restaurant} from "./restaurant.entity";

@InputType('DishInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    name: string;


    @Field(type => Int)
    @Column()
    @IsNumber()
    price: number


    @Field(type => String)
    @Column()
    @IsString()
    photo: string;


    @Field(() => String)
    @Column()
    @Length(5, 140)
    description: string;


    @Field(type => Restaurant)
    @ManyToOne(
        () => Restaurant,
        Restaurant => Restaurant.menu,
        {onDelete: "CASCADE"}
    )
    restaurant: Restaurant;


    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;

}