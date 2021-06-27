import {Field, ObjectType} from "@nestjs/graphql";
import {CoreOutput} from "../../common/dtos/output.dto";
import {Restaurant} from "../entities/restaurant.entity";

@ObjectType()
export class MyRestaurantOutput extends CoreOutput {
    @Field(() => [Restaurant], {nullable:true})
    restaurants ?: Restaurant[]
}