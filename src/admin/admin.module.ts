import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'admin', // should be same as name on @InjectModle
        schema: new Schema({
          authToken: String,
          savedTime: Date,
        }),
      },
    ]),
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AdminService, LocalStrategy, JwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
