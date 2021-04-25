import {Args, Mutation, Resolver , Query} from "@nestjs/graphql";
import {Payment} from "./entities/payment.entity";
import {PaymentService} from "./payment.service";
import {CreatePaymentInput, CreatePaymentOutput} from "./dtos/create-payment.dto";
import {Role} from "../auth/role.decorator";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../users/entities/user.entity";
import {GetPaymentsOutput} from "./dtos/get-payments.dto";


@Resolver(() => Payment)
export class PaymentResolver {
    constructor(
        private readonly paymentService: PaymentService
    ) {
    }

    @Mutation(() => CreatePaymentOutput)
    @Role(['Owner'])
    createPayment(
        @AuthUser() owner: User,
        @Args('input') createPaymentInput: CreatePaymentInput): Promise<CreatePaymentOutput> {
        return this.paymentService.createPayment(owner, createPaymentInput)
    }


    @Query(() => GetPaymentsOutput)
    @Role(['Owner'])
    getPayments(
        @AuthUser() user: User
    ): Promise<GetPaymentsOutput> {
        return this.paymentService.getPayments(user);
    }
}