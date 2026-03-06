import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ReturnDto } from 'src/dto/return.dto';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ReturnDto<User[]>> {
    return (
      this.userRepository
        .createQueryBuilder()
        // .addSelect('User.password')
        .getMany()
        .then(
          (res) =>
            <ReturnDto<User[]>>{
              message: 'Get All',
              error: false,
              data: res,
            },
        )
        .catch(
          (_) =>
            <ReturnDto<any>>{
              message: 'error when retrieving all users',
              error: true,
              data: null,
            },
        )
    );
  }

  async create(data: UserCreateDto): Promise<ReturnDto<User>> {
    const user = new User();
    user.email = data.email;
    user.name = data.name;
    user.password = bcrypt.hashSync(data.password, 10);
    user.cpf = data.cpf;
    user.telefone = data.telefone;

    return this.userRepository
      .save(user)
      .then((result) => {
        return <ReturnDto<User>>{
          message: 'User Create Success',
          error: false,
          data: result,
        };
      })
      .catch((error) => {
        throw new NotFoundException(<ReturnDto<User>>{
          message: 'There was an error registering the user',
          error: true,
          data: null,
        });
      });
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder()
      .addSelect('User.password')
      .where({ email: email })
      .getOne();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findOneOrFail(id);
  }
}
