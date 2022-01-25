import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthTokenType } from './admin.model';

@Injectable()
export class AdminService {
  constructor(@InjectModel('admin') private readonly authTokenModel: Model<AuthTokenType>) {}

  async promise(authToken: string): Promise<AuthTokenType> {
    // delete all
    const all = await this.authTokenModel.find();
    if (all) await Promise.all(all.map(async (token) => await this.authTokenModel.deleteOne({ _id: token._id })));
    // save new one (return id)
    return await (
      await new this.authTokenModel({ authToken, savedTime: new Date() }).save()
    )._id;
  }

  async deliver(authToken: string): Promise<boolean> {
    const token = await this.authTokenModel.findOne({ authToken });
    const isExpired = token && new Date().getTime() - token.savedTime.getTime() < 60 * 60 * 24 * 14 * 1000; // expired: 2 weeks
    return token && isExpired ? true : false;
  }
}
