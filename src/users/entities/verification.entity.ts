import { User } from './user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { InputType, ObjectType, Field } from '@nestjs/graphql';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: String;

  @OneToOne((Type) => User)
  @JoinColumn()
  user: User;
}
