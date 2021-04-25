import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Payment} from "./entities/payment.entity";
import {Repository , LessThan} from "typeorm";
import {User} from "../users/entities/user.entity";
import {CreatePaymentInput, CreatePaymentOutput} from "./dtos/create-payment.dto";
import {Restaurant} from "../restaurants/entities/restaurant.entity";
import {GetPaymentsOutput} from "./dtos/get-payments.dto";
import {Cron, Interval} from "@nestjs/schedule";

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly payments: Repository<Payment>,
        @InjectRepository(Restaurant)
        private readonly restaurant: Repository<Restaurant>
    ) {
    }


    async createPayment(owner: User, {transactionId, restaurantId}: CreatePaymentInput): Promise<CreatePaymentOutput> {
        try {
            const restaurant = await this.restaurant.findOne(restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: "레스토랑을 찾을 수 없습니다"
                }
            }
            if (restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: "권한이 없습니다."
                }
            }
            restaurant.isPromoted = true;
            const date = new Date()
            date.setDate(date.getDate() + 7)
            restaurant.promotedUntil = date;
            await this.restaurant.save(restaurant);
            await this.restaurant.save(this.payments.create({transactionId, user: owner, restaurant}))
            return {
                ok: true
            }
        } catch {
            return {
                ok: false,
                error: "잠시 후 다시 시도 해주세요!"
            }
        }
    }

    async getPayments(user: User): Promise<GetPaymentsOutput> {
        try {
            const payments = await this.payments.find({user: user});
            return {
                ok: true,
                payments
            }
        } catch {
            return {
                ok: false,
                error: "결제 내역을 찾지 못하였습니다."
            }
        }
    }


    @Interval(2000)
    async checkPromotedRestaurants() {
        const restaurants = await this.restaurant.find({isPromoted : true , promotedUntil : LessThan(new Date())});
        restaurants.forEach(async restaurant => {
            restaurant.isPromoted = false
            restaurant.promotedUntil = null
            await this.restaurant.save(restaurant);
        })
    }
}