import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne, RelationId} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {IsNumber, IsString, Length} from "class-validator";
import {Restaurant} from "./restaurant.entity";


@InputType('DishChoiceInputType', {isAbstract: true})
@ObjectType()
class DishChoice {
    @Field(() => String)
    name: string;
    @Field(() => Int, {nullable: true})
    extra ?: number;
}


@InputType('DishOptionInputType', {isAbstract: true})
@ObjectType()
class DishOption {
    @Field(() => String)
    name: string;
    @Field(() => [DishChoice], {nullable: true})
    choice?: DishChoice[]
    @Field(() => Int, {nullable: true})
    extra?: number
}


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


    @Field(type => String, {nullable: true})
    @Column({nullable: true})
    @IsString()
    photo ?: string;


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

    @Field(() => [DishOption], {nullable: true})
    @Column({type: "json", nullable: true})
    options?: DishChoice[]

}