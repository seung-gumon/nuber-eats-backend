import {Module} from '@nestjs/common';
import {PaymentResolver} from "./payment.resolver";
import {PaymentService} from "./payment.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Payment} from "./entities/payment.entity";
import {Restaurant} from "../restaurants/entities/restaurant.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Payment , Restaurant])],
    providers: [PaymentResolver, PaymentService]
})
export class PaymentsModule {
}
