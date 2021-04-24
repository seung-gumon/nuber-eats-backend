import {InputType, ObjectType, Field, Int} from "@nestjs/graphql";
import {Column, Entity, ManyToOne, RelationId} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {User} from "../../users/entities/user.entity";
import {Restaurant} from "../../restaurants/entities/restaurant.entity";


@InputType('PaymentInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Payment extends CoreEntity {

    @Field(() => Int)
    @Column()
    transactionId: number;


    @Field(() => User)
    @ManyToOne(
        type => User,
        user => user.payments,
    )
    user: User;


    @Field(() => Restaurant)
    @ManyToOne(type => Restaurant)
    restaurant: Restaurant;


    @RelationId((payment: Payment) => payment.user)
    userId: number

    @RelationId((payment: Payment) => payment.restaurant)
    restaurantId: number


}