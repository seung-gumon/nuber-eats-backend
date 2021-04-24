import {Args, Mutation, Query, Resolver, Subscription} from "@nestjs/graphql";
import {Order} from "./entities/order.entity";
import {OrderService} from "./orders.service";
import {CreateOrderInput, CreateOrderOutput} from "./dtos/create-order.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../users/entities/user.entity";
import {Role} from "../auth/role.decorator";
import {GetOrdersInputType, GetOrdersOutput} from "./dtos/get-orders.dto";
import {GetOrderInput, GetOrderOutput} from "./dtos/get-order.dto";
import {EditOrderInput, EditOrderOutput} from "./dtos/edit-order.dto";
import {Inject} from "@nestjs/common";
import {NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB} from "../common/common.constants";
import {PubSub} from "graphql-subscriptions";
import {OrderUpdatesInput} from "../common/dtos/order-updates.dto";
import {TakeOrderInput, TakeOrderOutput} from "../common/dtos/take-order.dto";


@Resolver(() => Order)
export class OrderResolver {
    constructor(
        private readonly ordersService: OrderService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
    ) {
    }


    @Mutation(() => CreateOrderOutput)
    @Role(['Client'])
    async createOrder(
        @AuthUser() customer: User,
        @Args("input")createOrderInput: CreateOrderInput): Promise<CreateOrderOutput> {
        return await this.ordersService.createOrder(customer, createOrderInput);
    }


    @Query(() => GetOrdersOutput)
    @Role(["Any"])
    async getOrders(
        @AuthUser() user: User,
        @Args("input") getOrdersInput: GetOrdersInputType
    ): Promise<GetOrdersOutput> {
        return this.ordersService.getOrders(user, getOrdersInput);
    }


    @Query(() => GetOrderOutput)
    @Role(["Any"])
    async getOrder(
        @AuthUser() user: User,
        @Args("input") getOrderInput: GetOrderInput
    ): Promise<GetOrderOutput> {
        return this.ordersService.getOrder(user, getOrderInput);
    }


    @Mutation(() => EditOrderOutput)
    @Role(['Any'])
    async editOrder(
        @AuthUser() user: User,
        @Args('input') editOrderInput: EditOrderInput
    ): Promise<EditOrderOutput> {
        return this.ordersService.editOrder(user, editOrderInput)
    }


    @Subscription(() => Order, {
        filter: ({pendingOrders: {ownerId}}, _, {user}) => {
            return ownerId === user.id;
        },
        resolve: ({pendingOrders: {order}}) => order,
    })
    @Role(['Owner'])
    pendingOrders() {
        return this.pubSub.asyncIterator(NEW_PENDING_ORDER)
    }


    @Subscription(() => Order)
    @Role(['Delivery'])
    cookedOrders() {
        return this.pubSub.asyncIterator(NEW_COOKED_ORDER)
    }

    @Subscription(() => Order, {
        filter: ({orderUpdates: order}: { orderUpdates: Order }, {input}: { input: OrderUpdatesInput }, {user}: { user: User }) => {
            if (order.driverId !== user.id && order.customerId !== user.id && order.restaurant.ownerId !== user.id) {
                return false;
            }
            return order.id === input.id
        }
    })
    @Role(['Any'])
    orderUpdates(@Args('input') OrderUpdatesInput: OrderUpdatesInput) {
        return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
    }


    @Mutation(() => TakeOrderOutput)
    @Role(['Delivery'])
    takeOrder(
        @Args('input') takeOrderInput : TakeOrderInput,
        @AuthUser() driver: User,
    ) : Promise<TakeOrderOutput> {
        return this.ordersService.takeOrder(driver , takeOrderInput)
    }


}