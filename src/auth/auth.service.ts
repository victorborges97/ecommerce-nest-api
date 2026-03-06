import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ReturnDto } from 'src/dto/return.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log(`email: ${email}, password: ${password}`);
    const user = await this.userService.findOne(email);
    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { cpf, email, id, telefone, name } = user;
      return { cpf, email, id, telefone, name };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return <ReturnDto<any>>{
      message: 'Login success',
      error: false,
      data: { access_token: this.jwtService.sign(payload) },
    };
  }
}
