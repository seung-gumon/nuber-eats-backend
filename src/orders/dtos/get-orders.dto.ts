import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Order, OrderStatus} from "../entities/order.entity";
import {CoreOutput} from "../../common/dtos/output.dto";

@InputType()
export class GetOrdersInputType {
    @Field(() => OrderStatus, {nullable: true})
    status: OrderStatus
}


@ObjectType()
export class GetOrdersOutput extends CoreOutput {
    @Field(() => [Order] , {nullable : true})
    orders?: Order[];
}