import { FastifyReply } from 'fastify';
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
    @Res() res: FastifyReply,
  ) {
    await this.mailService.lemon(body);
    return res.send(JSON.stringify({ success: true }));
  }
}
