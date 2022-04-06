import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './interfaces/users.interfaces';
import { CreateUserDTO } from './dto/users.dto';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(@InjectModel('User') readonly CreateUserModel: Model<User>) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const user = new this.CreateUserModel(createUserDTO);
    return await user.save();
  }

  //     async getSameContactsTwoUsers(UserId1: String, UserId2: String): Promise<any>{

  //     };
  async updateContactUser(
    UserId: string,
    contactList: Array<string>,
  ): Promise<any> {
    //consultar el usuario por id
    const user = await this.CreateUserModel.findById(UserId);
    // una funcion quecompara dos arreglos y en caso de ser diferentes agregar los datos uno en el otro
    if (user.contactList.length == 0) {
      await this.CreateUserModel.findByIdAndUpdate(UserId, {
        contactList: contactList,
      });
      return { userId: user?._id ?? null, contactList: contactList };
    }
    const contactListUser = user.contactList;

    contactListUser.sort();
    contactList.sort();

    const contactNewList = [];
    // usando el metodo map comparar dos arreglos y en caso de ser diferentes agregar los datos uno en el otro
    const delta1 = contactList.map((item) => {
      if (contactListUser.indexOf(item) == -1) {
        contactNewList.push(item);
      }
    });
    const delta2 = contactListUser.map((item) => {
      if (contactList.indexOf(item) == -1) {
        contactNewList.push(item);
      }
    });

    // actualizar el contactlist del usuario
    await this.CreateUserModel.findByIdAndUpdate(UserId, {
      contactList: contactNewList,
    });

    return {
      userId: user?._id ?? null,
      contactList: contactListUser,
      // newContacts: contactNewList,
    };
    //obtener el contactlist del usuario
    // const contactList = user.contactList;
    // const contactList = await this.CreateUserModel.findById(UserId);
  }

  async contactList(UserId: string): Promise<any> {
    //consultar el usuario por id y obtener el contactlist
    const user = await this.CreateUserModel.findById(UserId);
    //obtener el contactlist del usuario
    const contactList = user.contactList;
    // const contactList = await this.CreateUserModel.findById(UserId);
    return { userId: user?._id ?? null, contactList: contactList };
  }

  async diferentCompareUsers(UserId1: string, UserId2: string): Promise<any> {
    //consultar el usuario por id y obtener el contactlist
    const user1 = await this.CreateUserModel.findById(UserId1);
    const user2 = await this.CreateUserModel.findById(UserId2);
    //obtener el contactlist del usuario
    const contactListUser1 = user1.contactList;
    const contactListUser2 = user2.contactList;

    // extraer los contact list de los dos usuarios
    const contactListUser1Phones = contactListUser1.map((item) => {
      return item.phone;
    });
    const contactListUser2Phones = contactListUser2.map((item) => {
      return item.phone;
    });

    const result = [];
    function compareArrays(arr1, arr2) {
      for (let i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) !== -1) {
          result.push(arr1[i]);
        }
      }
      return result;
    }
    compareArrays(contactListUser2Phones, contactListUser1Phones);
    return {
      userId1: user1?._id ?? null,
      userId2: user2?._id ?? null,
      contactList: result,
    };
  }

  async getAllUsers(): Promise<User[]> {
    // traer todos los usuarios de la base de datos
    return await this.CreateUserModel.find();
  }

  async existUser(UserId: string): Promise<any> {
    const user = await this.CreateUserModel.findById(UserId);
    return user;
  }
}
