import {User} from './users/entities/user.entity';
import {
    Module,
    } from '@nestjs/common';
import * as Joi from 'joi';
import {GraphQLModule} from '@nestjs/graphql';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {JwtModule} from './jwt/jwt.module';
import {Verification} from './users/entities/verification.entity';
import {MailModule} from './mail/mail.module';
import {Restaurant} from "./restaurants/entities/restaurant.entity";
import {Category} from "./restaurants/entities/category.entity";
import {RestaurantsModule} from "./restaurants/restaurants.module";
import {AuthModule} from "./auth/auth.module";
import {Dish} from "./restaurants/entities/dish.entity";
import {OrdersModule} from './orders/orders.module';
import {Order} from "./orders/entities/order.entity";
import {OrderItem} from "./orders/entities/order-item.entity";
import {CommonModule} from "./common/common.module";
import { PaymentsModule } from './payments/payments.module';
import {Payment} from "./payments/entities/payment.entity";
import {ScheduleModule} from "@nestjs/schedule";
import { UploadsModule } from './uploads/uploads.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
            ignoreEnvFile: process.env.NODE_ENV === 'production',
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('dev', 'production').required(),
                DB_HOST: Joi.string(),
                DB_PORT: Joi.string(),
                DB_USERNAME: Joi.string(),
                DB_PASSWORD: Joi.string(),
                DB_NAME: Joi.string(),
                PRIVATE_KEY: Joi.string().required() ,
                MAILGUN_API_KEY: Joi.string().required(),
                MAILGUN_FROM_EMAIL: Joi.string().required(),
                MAILGUN_DOMAIN_NAME: Joi.string().required(),
                AWS_SECRET_ACCESSKEY : Joi.string().required()
            }),
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            ...(process.env.DATABASE_URL ? {url: process.env.DATABASE_URL}
            : {
                    host: process.env.DB_HOST,
                    port: +process.env.DB_PORT,
                    username: process.env.USERNAME,
                    password: process.env.PASSWORD,
                    database: process.env.DB_NAME,
                }),
            synchronize:process.env.NODE_ENV !== 'prod',
            logging: false,
            entities: [User, Verification, Restaurant, Category, Dish, Order, OrderItem , Payment],
        }),
        GraphQLModule.forRoot({
            playground: process.env.NODE_ENV !== "production",
            installSubscriptionHandlers: true,
            autoSchemaFile: true,
            context: ({req, connection}) => {
                const TOKEN_KEY = 'x-jwt';
                return {
                    token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
                }
            },
        }),
        ScheduleModule.forRoot(),
        JwtModule.forRoot({
            privateKey: process.env.PRIVATE_KEY,
        }),
        AuthModule,
        UsersModule,
        RestaurantsModule,
        MailModule.forRoot({
            apiKey: process.env.MAILGUN_API_KEY,
            fromEmail: process.env.MAILGUN_FROM_EMAIL,
            domain: process.env.MAILGUN_DOMAIN_NAME,
        }),
        OrdersModule,
        CommonModule,
        PaymentsModule,
        UploadsModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
