// squema para definir los datos que se van a guardar en la base de datos
import { Schema } from 'mongoose';

export const CreateUserSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  contactList: { type: Array, default: [] },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
