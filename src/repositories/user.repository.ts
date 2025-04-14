
import User, { UserDocument } from '../models/user.model';//importa el modelo de usuario
import { IUser, IUserResponse } from '../types/user';//importa las interfaces de usuario

export class UserRepository {//crea la clase UserRepository
  async create(userData: IUser): Promise<UserDocument> {//crea la funcion create que recibe un objeto de tipo IUser y devuelve un objeto de tipo UserDocument
    const user = new User(userData);//crea un nuevo objeto de tipo User con los datos de userData
    return await user.save();//guarda el objeto en la base de datos
  }

  async findByEmail(email: string): Promise<UserDocument | null> {//crea la funcion findByEmail que recibe un string y devuelve un objeto de tipo UserDocument o null
    return await User.findOne({ email });//busca un usuario por email
  }

  async findById(id: string): Promise<UserDocument | null> {//crea la funcion findById que recibe un string y devuelve un objeto de tipo UserDocument o null
    return await User.findById(id);//busca un usuario por id
  }

  
  toUserResponse(user: UserDocument): IUserResponse {//crea la funcion toUserResponse que recibe un objeto de tipo UserDocument y devuelve un objeto de tipo IUserResponse
    return {//devuelve un objeto con los datos del usuario
      _id: (user._id as any).toString(),//convierte el id a string
      name: user.name,//nombre del usuario
      email: user.email,//email del usuario
      createdAt: user.createdAt,//fecha de creacion del usuario
      updatedAt: user.updatedAt//fecha de actualizacion del usuario
    };
  }
}