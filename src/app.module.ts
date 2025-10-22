// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('SUPABASE_HOST'),
        port: parseInt(config.get<string>('SUPABASE_PORT') || '5432', 10),
        username: config.get<string>('SUPABASE_USERNAME'),
        password: config.get<string>('SUPABASE_PASSWORD'),
        database: config.get<string>('SUPABASE_DATABASE'),
        ssl: { rejectUnauthorized: false },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // cuidado: só em dev
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    ProductsModule,
    AuthModule,
  ],
})
export class AppModule {}
