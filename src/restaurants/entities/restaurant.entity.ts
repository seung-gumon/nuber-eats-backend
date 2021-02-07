import {Field, InputType, ObjectType} from '@nestjs/graphql';
import {Column, Entity, ManyToOne} from "typeorm";
import {IsOptional, IsString, Length} from "class-validator";
import {CoreEntity} from "../../common/entities/core.entity";
import {Category} from "./category.entity";
import {User} from "../../users/entities/user.entity";


@InputType("RestaurantInputType" , {isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {

    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;


    @Field(type => String)
    @Column()
    @IsOptional()
    coverImg: string

    @Field(type => String, {defaultValue: "강남"})
    @Column()
    @IsString()
    address: string


    @Field(type => Category, {nullable: true})
    @ManyToOne(type => Category, category => category.restaurants, {nullable: true, onDelete: "SET NULL"})
    category: Category


    @Field(type => User)
    @ManyToOne(type => User, category => category.restaurants)
    owner: User


}
