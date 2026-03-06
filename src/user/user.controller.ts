import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReturnDto } from 'src/dto/return.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(): Promise<ReturnDto<User[]>> {
    return this.userService.findAll();
  }

  @Post()
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() data: UserCreateDto,
  ): Promise<ReturnDto<User>> {
    return this.userService.create(data);
  }

  @Get(':id')
  async getById(@Param() id: string): Promise<ReturnDto<User>> {
    try {
      const user = await this.userService.findById(id);

      return <ReturnDto<User>>{
        message: '',
        error: true,
        data: user,
      };
    } catch (err) {
      return <ReturnDto<User>>{
        message: 'User not found',
        error: false,
        data: null,
      };
    }
  }
}
