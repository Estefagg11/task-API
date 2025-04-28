
import { Request, Response } from 'express'; //express es una libreria de node.js que nos permite crear respuestas y solicitudes http
import { AuthService } from '../services/auth.service'; //importamos el servicio de autenticacion
import { IUser } from '../types/user'; //importamos la interfaz de usuario

export class AuthController { // para que sea accesible desde otros archivos, exportamos la clase. Esta clase se encargara de manejar las peticiones http relacionadas con la autenticacion login y registro
  private authService: AuthService;//declara una propiedad privada de tipo AuthService, solo sera accesible desde la clase AuthController

  constructor() { //crear una instancia de AuthService para que AuthController pueda acceder a sus funcionalidades(login y registro)
    this.authService = new AuthService();// Crea una nueva "herramienta" (AuthService) que se encargará de todo lo relacionado con la autenticación (como registrar y autenticar usuarios).
    // Guardamos esa herramienta en la propiedad 'authService' para poder usarla en cualquier parte de esta clase.
  }
  
  /**
   * @swagger
   * /users/register: # Endpoint POST /api/users/register
   *   post:
   *     summary: Registra un nuevo usuario.
   *     tags: [Auth] # Agrupa bajo el tag Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput' # Referencia al schema de entrada para registrar usuario
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente y token generado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse' # Referencia al schema de respuesta de autenticación
   *       400:
   *         description: "Datos de registro inválidos (ej: email ya registrado, campos faltantes)"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error' # Referencia al schema de error
   *       500:
   *         description: Error del servidor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */ 
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

  /**
   * @swagger
   * /users/login: # Endpoint POST /api/users/login
   *   post:
   *     summary: "Inicia sesión y obtiene un token JWT." # Encerrado en comillas (buena práctica)
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginInput' # Referencia al schema de entrada para login
   *     responses:
   *       200:
   *         description: "Inicio de sesión exitoso. Devuelve token JWT y datos del usuario." # Encerrado en comillas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse' # Referencia al schema de respuesta de autenticación
   *       400:
   *         # --- CORRECCIÓN AQUÍ: Se añadió la comilla de cierre ---
   *         description: "Datos de login inválidos (ej: email o contraseña faltantes)" # ¡Faltaba la comilla final!
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: "Credenciales inválidas" # Ya estaba entre comillas, pero confirmo
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: "Error del servidor." # Encerrado en comillas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

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

  /**
   * @swagger
   * /users/logout: # Endpoint POST /api/users/logout
   *   post:
   *     summary: Cierra la sesión del usuario.
   *     description: Este endpoint notifica al servidor que el cliente ha cerrado sesión. No requiere autenticación ni invalida el token JWT en el backend; el cliente es responsable de eliminar su token almacenado. # Descripción basada en tu código
   *     tags: [Auth]
   *     # No requiere seguridad bearerAuth
   *     # No requiere requestBody
   *     responses:
   *       200: # Código 200: OK (confirmado por tu código)
   *         description: Sesión cerrada exitosamente (instrucción para el cliente).
   *         content:
   *           application/json:
   *             schema:
   *               type: object # Define la estructura de la respuesta del controlador de logout
   *               properties:
   *                 success: { type: 'boolean', example: true }
   *                 message: { type: 'string', example: 'Logged out successfully. Please remove the token on the client side.' }
   *               required: ['success', 'message']
   *       500: # Código 500: Internal Server Error (si hay algún error inesperado)
   *         description: Error del servidor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  
  logout = (req: Request, res: Response): void => {
    // No es necesario realizar ninguna acción en el servidor si no usas cookies
    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Please remove the token on the client side.'
    });
  };

}

