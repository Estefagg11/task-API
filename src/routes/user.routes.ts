
import { Router } from 'express';//importa router de express
import { AuthController } from '../controllers/auth.controller';//importa el controlador de usuario
import { validateUser, validateLogin } from '../middleware/validation.middleware';//importa la validacion de usuario

const router = Router();//crea una instancia de router
const authController = new AuthController();//crea una instancia del controlador de usuario


router.post('/register', validateUser, authController.register);//crea una ruta post para registrar un usuario
router.post('/login', validateLogin, authController.login);//crea una ruta post para loguear un usuario
router.post('/logout', authController.logout); // Aquí añadimos la ruta para logout

export default router;//exporta el router


//validateUser: Middleware que valida los datos del usuario antes de que lleguen al controlador.
//authController.register: Controlador que maneja la lógica para registrar al usuario en la base de datos.

//validateLogin: Middleware que valida los datos de inicio de sesión antes de que lleguen al controlador.
//authController.login: Controlador que maneja la lógica para autenticar al usuario y generar un token (como un JWT).