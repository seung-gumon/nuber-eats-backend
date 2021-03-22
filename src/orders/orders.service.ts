import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Order} from "./entities/order.entity";
import {CreateOrderInput, CreateOrderOutput} from "./dtos/create-order.dto";
import {User, UserRole} from "../users/entities/user.entity";
import {Restaurant} from "../restaurants/entities/restaurant.entity";
import {OrderItem} from "./entities/order-item.entity";
import {Dish} from "../restaurants/entities/dish.entity";
import {GetOrdersInputType, GetOrdersOutput} from "./dtos/get-orders.dto";

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
            console.log(e);
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
                    }
                })
            } else if (user.role === UserRole.Delivery) {
                orders = await this.orders.find({
                    where: {
                        driver: user,
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

}