import { Controller, UseGuards, Post, Get, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';

@UseGuards(AdminGuard)
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService, private readonly jwtService: JwtService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(): Promise<{ token: string }> {
    const token = this.jwtService.sign({ isAdmin: true });
    await this.adminService.promise(token);
    return { token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/logout')
  logout(): boolean {
    this.jwtService.sign({ isAdmin: true }); // create new token for logout
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/status')
  status(): boolean {
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/refresh')
  async refresh(): Promise<{ token: string }> {
    const token = this.jwtService.sign({ isAdmin: true });
    await this.adminService.promise(token);
    return { token };
  }

  @Get('deliver')
  async deliver(@Req() req: FastifyRequest): Promise<{ token?: string; success?: boolean }> {
    if (await this.adminService.deliver(req.headers.authorization.replace(/^bearer /, ''))) {
      return { token: this.jwtService.sign({ isAdmin: true }) };
    } else {
      return { success: false };
    }
  }
}
