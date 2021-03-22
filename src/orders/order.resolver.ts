import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Order} from "./entities/order.entity";
import {OrderService} from "./orders.service";
import {CreateOrderInput, CreateOrderOutput} from "./dtos/create-order.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../users/entities/user.entity";
import {Role} from "../auth/role.decorator";
import {GetOrdersInputType, GetOrdersOutput} from "./dtos/get-orders.dto";


@Resolver(() => Order)
export class OrderResolver {
    constructor(private readonly ordersService: OrderService) {
    }


    @Mutation(() => CreateOrderOutput)
    @Role(['Client'])
    async createOrder(
        @AuthUser() customer: User,
        @Args("input")createOrderInput: CreateOrderInput): Promise<CreateOrderOutput> {
        return await this.ordersService.createOrder(customer , createOrderInput);
    }


    @Query(() => GetOrdersOutput)
    @Role(["Any"])
    async getOrders(
        @AuthUser() user: User,
        @Args("input") getOrdersInput : GetOrdersInputType
    ) : Promise<GetOrdersOutput> {
        return this.ordersService.getOrders(user,getOrdersInput);
    }

}