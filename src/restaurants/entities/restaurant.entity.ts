import {Field, InputType, ObjectType} from '@nestjs/graphql';
import {Column, Entity, ManyToOne} from "typeorm";
import {IsOptional, IsString, Length} from "class-validator";
import {CoreEntity} from "../../common/entities/core.entity";
import {Category} from "./category.entity";


@InputType({isAbstract: true})
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


    @Field(type => Category)
    @ManyToOne(type => Category, category => category.restaurants)
    category: Category

}
