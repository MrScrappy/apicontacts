// tenemos el dto que nos determina la informacion enviada entre cliente y servidor
export class CreateUserDTO {
  readonly name: string;
  readonly lastName: string;
  phone: string;
}

export class ContactListDTO {
  contactList: Array<string>;
}
