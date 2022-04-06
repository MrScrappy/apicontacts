import {
  Controller,
  Get,
  Post,
  Put,
  Res,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import fetch from 'node-fetch';

//importar los DTO
import { CreateUserDTO, ContactListDTO } from './dto/users.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Crear Usuario
  @Post('/create')
  async validatePost(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    try {
      const resultValidate = await ValidateNumber(createUserDTO.phone);

      if (resultValidate.valid === true) {
        const NewUser = await this.usersService.createUser(createUserDTO);
        res.status(HttpStatus.OK).json({
          message: 'User created successfully',
          user: NewUser,
        });
      } else {
        throw new Error(
          JSON.stringify({
            message: 'El numero de telefono no es valido',
            error: 'no se pudo crear el usuario',
          }),
        );
      }
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json(JSON.parse(error.message));
    }
  }

  // Hacer un Update del contactlist

  @Put('/updateContactList/:id')
  async updateContactList(
    @Res() res,
    @Body() contactListDTO: ContactListDTO,
    @Param('id') id: string,
  ) {
    console.log(contactListDTO);
    const contactList = await this.usersService.updateContactUser(
      id,
      contactListDTO.contactList,
    );
    res.status(HttpStatus.OK).json({
      message: 'ContactList updated successfully',
      response: contactList,
    });
  }

  @Get('/contactlist/:id')
  async contactlist(@Res() res, @Param('id') id: string) {
    try {
      const response = await this.usersService.contactList(id);
      console.log(response.userId);

      if (response.userId === null || response.userId === undefined) {
        throw new Error(
          JSON.stringify({
            message: 'El id no existe o es erroneo',
            error: 'El usuario no existe',
          }),
        );
      }

      if (response.userId) {
        res.status(HttpStatus.OK).json({
          message: 'Usuario Existe',
          respone: {
            userId: response.userId,
            contactList: response.contactList,
          },
        });
      }
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json(JSON.parse(error.message));
    }
  }

  @Get('all')
  async getAllUsers(@Res() res) {
    const users = await this.usersService.getAllUsers();
    res.status(HttpStatus.OK).json({
      message: 'Lista de usuarios',
      users: users,
    });
  }

  @Post('/compare')
  async compareUsers(@Res() res, @Body() body) {
    const { userId1, userId2 } = body;
    const response = await this.usersService.diferentCompareUsers(
      userId1,
      userId2,
    );
    res.status(HttpStatus.OK).json({
      message: 'Comparacion de usuarios',
      response: response,
    });
  }
}

async function ValidateNumber(phoneNumber: string) {
  //peticion fetch de tipo post
  try {
    const result = await fetch('https://neutrinoapi.net/phone-validate', {
      method: 'POST',
      body: JSON.stringify({
        number: phoneNumber,
      }),
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'SrD3lta',
        'api-key': 'VUaejkBjVaEHXUPkW6x2O1vHyokHqUBuXmTOmGsEFdcueKd7',
      },
    });
    const resultJson = await result.json();
    if (resultJson.valid === true) {
      return {
        valid: true,
        number: phoneNumber,
        message: 'El numero es valido',
      };
    } else {
      return {
        valid: false,
        number: phoneNumber,
        message: 'El numero es invalido',
      };
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
