
import jwt from 'jsonwebtoken';//importamos la libreria jsonwebtoken
import { UserRepository } from '../repositories/user.repository';//importamos el repositorio de usuario
import { IUser, IUserResponse } from '../types/user';//importamos los tipos de usuario
import config from '../config/config';//importamos la configuracion


export class AuthService {//creamos la clase AuthService
  private userRepository: UserRepository;//creamos una variable privada de tipo UserRepository

  constructor() {//creamos el constructor
    this.userRepository = new UserRepository();//inicializamos la variable userRepository
  }

  async register(userData: IUser): Promise<{ user: IUserResponse; token: string }> {//creamos la funcion register que recibe un objeto de tipo IUser y devuelve un objeto con un usuario y un token
    console.log("Datos recibidos en el backend:", userData);
    const existingUser = await this.userRepository.findByEmail(userData.email);//buscamos un usuario por email
    if (existingUser) {//si el usuario ya existe
      throw new Error('El usuario ya existe');//lanzamos un error y mensaje
    }

    
    const user = await this.userRepository.create(userData);//creamos un usuario
    
    
    const token = this.generateToken((user._id as any).toString());//generamos un token
    
    
    const userResponse = this.userRepository.toUserResponse(user);//creamos un objeto de tipo IUserResponse,método responsable de transformar un objeto de usuario (user) en un formato específico (IUserResponse), una versión segura del usuario, omitiendo información sensible como contraseñas.

    return { user: userResponse, token };//devolvemos el usuario y el token
  }

  async login(email: string, password: string): Promise<{ user: IUserResponse; token: string }> {//creamos la funcion login que recibe un email y un password y devuelve un objeto con un usuario y un token
    
    const user = await this.userRepository.findByEmail(email);//buscamos un usuario por email
    if (!user) {//si el usuario no existe
      throw new Error('Credenciales inválidas');//lanzamos un error y mensaje
    }

    
    const isMatch = await user.comparePassword(password);//comparamos la contraseña
    if (!isMatch) {//si no coincide
      throw new Error('Credenciales inválidas');//lanzamos un error y mensaje
    }

    
    const token = this.generateToken((user._id as any).toString());//generamos un token

    
    const userResponse = this.userRepository.toUserResponse(user);//creamos un objeto de tipo IUserResponse

    return { user: userResponse, token };//devolvemos el usuario y el token
  }

  private generateToken(userId: string): string {//creamos la funcion generateToken que recibe un userId y devuelve un token
    
    const payload: any = { id: userId };//creamos un objeto payload con el id del usuario
    const secret: any = config.JWT_SECRET;//creamos una variable secret con la clave secreta
    const options: any = { expiresIn: config.JWT_EXPIRATION };//creamos un objeto con la fecha de expiracion
    
    return jwt.sign(payload, secret, options);//devuelve el token
  }
}


//El archivo auth.service.ts actúa como un intermediario entre la lógica de negocio y la base de datos para manejar la autenticación de usuarios. 
//Registrar nuevos usuarios de manera segura.
//Validar credenciales de inicio de sesión.
//Generar tokens JWT para la autenticación basada en tokens.
//Proveer una versión segura de los datos del usuario (IUserResponse) para evitar exponer información sensible.