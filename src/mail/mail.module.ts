import {DynamicModule, Module} from '@nestjs/common';
import {JwtModuleOptions} from "../jwt/jwt.interfaces";
import {CONFIG_OPTIONS} from "../common/common.constants";
import {JwtService} from "../jwt/jwt.service";
import {MailModuleOptions} from "./mail.interfaces";


@Module({})
export class MailModule {
    static forRoot(options: MailModuleOptions): DynamicModule {
        return {
            module: MailModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options,
                },

            ],
            exports: [],
        };
    }
}
