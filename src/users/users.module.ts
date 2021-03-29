import {UserResolver} from "./users.resolver";
import {User} from './entities/user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {Verification} from "./entities/verification.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Verification])],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UsersModule {
}
