import {Field, InputType, Int, ObjectType, PickType} from "@nestjs/graphql";
import {Payment} from "../entities/payment.entity";
import {CoreEntity} from "../../common/entities/core.entity";
import {CoreOutput} from "../../common/dtos/output.dto";


@InputType()
export class CreatePaymentInput extends PickType(Payment, ['transactionId']) {
    @Field(() => Int)
    restaurantId: number
}


@ObjectType()
export class CreatePaymentOutput extends CoreOutput{}