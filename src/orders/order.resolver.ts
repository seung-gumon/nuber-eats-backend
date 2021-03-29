import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Order} from "./entities/order.entity";
import {OrderService} from "./orders.service";
import {CreateOrderInput, CreateOrderOutput} from "./dtos/create-order.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../users/entities/user.entity";
import {Role} from "../auth/role.decorator";
import {GetOrdersInputType, GetOrdersOutput} from "./dtos/get-orders.dto";
import {GetOrderInput, GetOrderOutput} from "./dtos/get-order.dto";
import {EditOrderInput, EditOrderOutput} from "./dtos/edit-order.dto";


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



    @Query(() => GetOrderOutput)
    @Role(["Any"])
    async getOrder(
        @AuthUser() user: User,
        @Args("input") getOrderInput : GetOrderInput
    ) : Promise<GetOrderOutput> {
        return this.ordersService.getOrder(user,getOrderInput);
    }


    @Mutation(() => EditOrderOutput)
    @Role(['Any'])
    async editOrder(
        @AuthUser() user : User,
        @Args('input') editOrderInput : EditOrderInput
    ) : Promise<EditOrderOutput> {
        return this.ordersService.editOrder(user , editOrderInput)
    }

}