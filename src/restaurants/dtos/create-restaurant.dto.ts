import {InputType, ObjectType, OmitType} from "@nestjs/graphql";
import {Restaurant} from "../entities/restaurant.entity";
import {CoreOutput} from "../../common/dtos/output.dto";


@InputType()
export class CreateRestaurantInput extends OmitType(Restaurant, ["id", "category","owner"]) {
}


@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {
}