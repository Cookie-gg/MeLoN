import { Response } from 'express';
import { MailGuard } from './mail.guard';
import { MailService } from './mail.service';
import { Body, Controller, Header, HttpCode, Post, Res, UseGuards } from '@nestjs/common';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @UseGuards(MailGuard)
  @Post()
  @HttpCode(200)
  @Header('Content-type', 'application/json')
  async getHello(
    @Body()
    body: { name: string; email: string; subject: string; message: string },
    @Res() res: Response,
  ) {
    await this.mailService.lemon(body);
    return res.end(JSON.stringify({ success: true }));
  }
}
