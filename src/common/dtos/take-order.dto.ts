import {InputType, ObjectType, PickType} from "@nestjs/graphql";
import {Order} from "../../orders/entities/order.entity";
import {CoreOutput} from "./output.dto";


@InputType()
export class TakeOrderInput extends PickType(Order, ['id']) {
}

@ObjectType()
export class TakeOrderOutput extends CoreOutput {
}