// tenemos la interfaz para Ts Scribir el codigo
import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly lastName: string;
  phone: string;
  contactList: any[];
  readonly createAt: Date;
}
