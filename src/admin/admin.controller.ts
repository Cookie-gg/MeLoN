import { Controller, UseGuards, Post, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';

@UseGuards(AdminGuard)
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login() {
    return this.adminService.sign();
  }

  @Get('/logout')
  logout() {
    this.adminService.sign();
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/status')
  status() {
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/refresh')
  refresh() {
    return this.adminService.sign();
  }
}
