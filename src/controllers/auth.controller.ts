
import { Request, Response } from 'express'; //express es una libreria de node.js que nos permite crear respuestas y solicitudes http
import { AuthService } from '../services/auth.service'; //importamos el servicio de autenticacion
import { IUser } from '../types/user'; //importamos la interfaz de usuario

export class AuthController { // para que sea accesible desde otros archivos, exportamos la clase. Esta clase se encargara de manejar las peticiones http relacionadas con la autenticacion login y registro
  private authService: AuthService;//declara una propiedad privada de tipo AuthService, solo sera accesible desde la clase AuthController

  constructor() { //crear una instancia de AuthService para que AuthController pueda acceder a sus funcionalidades(login y registro)
    this.authService = new AuthService();// Crea una nueva "herramienta" (AuthService) que se encargará de todo lo relacionado con la autenticación (como registrar y autenticar usuarios).
    // Guardamos esa herramienta en la propiedad 'authService' para poder usarla en cualquier parte de esta clase.
  } 

  register = async (req: Request, res: Response): Promise<void> => { //creamos un metodo llamado register que recibe una solicitud(req) y una respuesta(res) y devuelve una promesa de tipo void (no devuelve nada, no tiene un valor de retorno util)
    try { //manejo de errores
      const userData: IUser = req.body;// extraemos los datos del usuario del cuerpo de la solicitud(req.body)[email, password, name]. Estos datos se almacenan en la variable userData
      const result = await this.authService.register(userData);//llamamos al metodo register del servicio de autenticacion y le pasamos los datos del usuario
      //await asegura que el código espere hasta que la promesa devuelta por register se resuelva. Se espera que result contenga los datos del usuario y el token de autenticación.
    
      const response = {//creamos una respuesta que contiene los datos del usuario y el token de autenticacion. se envia como respuesta al cliente.
        ...result.user,//extraemos los datos que se obtienen después de registrar o autenticar al usuario.
        token: result.token//extraemos el token de autenticacion
      };
      console.log(response);
      res.status(201).json(response);// se envia una respuesta al cliente con un codigo de estado 201 (creado) y la respuesta en formato json
    } catch (error: any) { //si ocurre un error, se captura y se envia una respuesta al cliente con un codigo de estado 400 (error de solicitud) y un mensaje de error
      console.log(error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => { //creamos un metodo llamado login que recibe una solicitud(req) y una respuesta(res) y devuelve una promesa de tipo void (no devuelve nada, no tiene un valor de retorno util)
    try {//manejo de errores
      const { email, password } = req.body;//extraemos el email y la contraseña del cuerpo de la solicitud(req.body)  y los almacenamos en las variables email y password
      const result = await this.authService.login(email, password);//Llama al método login de authService, pasando el correo y la contraseña. Se espera que este método devuelva los datos del usuario y un token si las credenciales son correctas.
      
      
      const response = {//creamos una respuesta que contiene los datos del usuario y el token de autenticacion. se envia como respuesta al cliente.
        ...result.user,//extraemos los datos del usuario
        token: result.token//extraemos el token de autenticacion
      };
      
      res.status(200).json(response);// se envia una respuesta al cliente con un codigo de estado 200 (éxito) y la respuesta en formato json
    } catch (error: any) {//si ocurre un error, se captura y se envia una respuesta al cliente con un codigo de estado 401 (no autorizado) y un mensaje de error
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };

  
  logout = (req: Request, res: Response): void => {
    // No es necesario realizar ninguna acción en el servidor si no usas cookies
    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Please remove the token on the client side.'
    });
  };

}

