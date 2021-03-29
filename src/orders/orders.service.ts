import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Order, OrderStatus} from "./entities/order.entity";
import {CreateOrderInput, CreateOrderOutput} from "./dtos/create-order.dto";
import {User, UserRole} from "../users/entities/user.entity";
import {Restaurant} from "../restaurants/entities/restaurant.entity";
import {OrderItem} from "./entities/order-item.entity";
import {Dish} from "../restaurants/entities/dish.entity";
import {GetOrdersInputType, GetOrdersOutput} from "./dtos/get-orders.dto";
import {GetOrderInput, GetOrderOutput} from "./dtos/get-order.dto";
import {EditOrderInput, EditOrderOutput} from "./dtos/edit-order.dto";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItems: Repository<OrderItem>,
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>
    ) {
    }

    async createOrder(
        customer: User,
        {restaurantId, items}: CreateOrderInput,
    ): Promise<CreateOrderOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: '가게를 찾지 못하였습니다.',
                };
            }
            let orderFinalPrice = 0;
            const orderItems: OrderItem[] = [];
            for (const item of items) {
                const dish = await this.dishes.findOne(item.dishId);
                if (!dish) {
                    return {
                        ok: false,
                        error: '메뉴를 찾지 못하였습니다.',
                    };
                }


                let dishFinalPrice = dish.price;
                for (const itemOption of item.options) {
                    const dishOption = dish.options.find(
                        dishOption => dishOption.name === itemOption.name,
                    );
                    if (dishOption) {
                        if (dishOption.extra) {
                            dishFinalPrice = dishFinalPrice + dishOption.extra;
                        } else {
                            const dishOptionChoice = dishOption.choices.find(
                                optionChoice => optionChoice.name === itemOption.choice,
                            );
                            if (dishOptionChoice) {
                                if (dishOptionChoice.extra) {
                                    dishFinalPrice = dishFinalPrice + dishOption.extra;
                                }
                            }
                        }
                    }
                }
                orderFinalPrice = orderFinalPrice + dishFinalPrice;
                const orderItem = await this.orderItems.save(
                    this.orderItems.create({
                        dish,
                        options: item.options,
                    }),
                );
                orderItems.push(orderItem);
            }

            await this.orders.save(
                this.orders.create({
                    customer,
                    restaurant,
                    total: orderFinalPrice,
                    items: orderItems
                }),
            );
            return {
                ok: true,
            }
        } catch (e) {
            return {
                ok: false,
                error: "주문을 하지 못하였습니다."
            }
        }
    }


    async getOrders(user: User, {status}: GetOrdersInputType): Promise<GetOrdersOutput> {
        try {
            let orders: Order[]
            if (user.role === UserRole.Client) {
                orders = await this.orders.find({
                    where: {
                        customer: user,
                        ...(status && {status})
                    }
                })
            } else if (user.role === UserRole.Delivery) {
                orders = await this.orders.find({
                    where: {
                        driver: user,
                        ...(status && {status})
                    }
                })
            } else if (user.role === UserRole.Owner) {
                const restaurants = await this.restaurants.find({
                    where: {
                        owner: user,
                    },
                    relations: ['orders']
                });
                orders = restaurants.flatMap(restaurant => restaurant.orders);
                if (status) {
                    orders = orders.filter(order => order.status === status);
                }
            }
            return {
                ok: true,
                orders
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    canSeeOrder(user: User, order: Order): boolean {
        let canSee = true;
        if (user.role === UserRole.Client && order.customerId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.Delivery && order.driverId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.Owner && order.restaurant.ownerId !== user.id) {
            canSee = false;
        }
        return canSee
    }


    async getOrder(user: User, {id: orderId}: GetOrderInput): Promise<GetOrderOutput> {
        try {
            const order = await this.orders.findOne(orderId, {relations: ['restaurant']});
            if (!order) {
                return {
                    ok: false,
                    error: "주문을 찾을 수 없습니다!"
                }
            }
            if (!this.canSeeOrder(user, order)) {
                return {
                    ok: false,
                    error: "권한이 없습니다"
                }
            }
            return {
                ok: true,
                order
            }
        } catch (e) {
            return {
                ok: false,
                error: '주문을 불러올 수 없습니다.'
            }
        }
    }


    async editOrder(user: User, {id: orderId, status}: EditOrderInput): Promise<EditOrderOutput> {
        try {
            const order = await this.orders.findOne(orderId, {relations: ['restaurant']});
            if (!order) {
                return {
                    ok: false,
                    error: "주문을 찾지 못하였습니다."
                }
            }

            if (!this.canSeeOrder(user, order)) {
                return {
                    ok: false,
                    error: "권한이 없습니다"
                }
            }

            let canEdit = true;
            if (user.role === UserRole.Client) {
                canEdit = false;
            }

            if (user.role === UserRole.Owner) {
                if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
                    canEdit = false;
                }
            }

            if (user.role === UserRole.Delivery) {
                if (status !== OrderStatus.PickedUp && status !== OrderStatus.Delivered) {
                    canEdit = false;
                }
            }

            if (!canEdit) {
                return {
                    ok: false,
                    error: "권한이 없습니다."
                }
            }

            await this.orders.save([{
                id: orderId,
                status,
            }]);
            return {
                ok: true
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }
}