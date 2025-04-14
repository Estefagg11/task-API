"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service"); //importamos el servicio de autenticacion
class AuthController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try { //manejo de errores
                const userData = req.body; // extraemos los datos del usuario del cuerpo de la solicitud(req.body)[email, password, name]. Estos datos se almacenan en la variable userData
                const result = yield this.authService.register(userData); //llamamos al metodo register del servicio de autenticacion y le pasamos los datos del usuario
                //await asegura que el código espere hasta que la promesa devuelta por register se resuelva. Se espera que result contenga los datos del usuario y el token de autenticación.
                const response = Object.assign(Object.assign({}, result.user), { token: result.token //extraemos el token de autenticacion
                 });
                res.status(201).json(response); // se envia una respuesta al cliente con un codigo de estado 201 (creado) y la respuesta en formato json
            }
            catch (error) { //si ocurre un error, se captura y se envia una respuesta al cliente con un codigo de estado 400 (error de solicitud) y un mensaje de error
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try { //manejo de errores
                const { email, password } = req.body; //extraemos el email y la contraseña del cuerpo de la solicitud(req.body)  y los almacenamos en las variables email y password
                const result = yield this.authService.login(email, password); //Llama al método login de authService, pasando el correo y la contraseña. Se espera que este método devuelva los datos del usuario y un token si las credenciales son correctas.
                const response = Object.assign(Object.assign({}, result.user), { token: result.token //extraemos el token de autenticacion
                 });
                res.status(200).json(response); // se envia una respuesta al cliente con un codigo de estado 200 (éxito) y la respuesta en formato json
            }
            catch (error) { //si ocurre un error, se captura y se envia una respuesta al cliente con un codigo de estado 401 (no autorizado) y un mensaje de error
                res.status(401).json({
                    success: false,
                    message: error.message
                });
            }
        });
        this.logout = (req, res) => {
            // No es necesario realizar ninguna acción en el servidor si no usas cookies
            res.status(200).json({
                success: true,
                message: 'Logged out successfully. Please remove the token on the client side.'
            });
        };
        this.authService = new auth_service_1.AuthService(); // Crea una nueva "herramienta" (AuthService) que se encargará de todo lo relacionado con la autenticación (como registrar y autenticar usuarios).
        // Guardamos esa herramienta en la propiedad 'authService' para poder usarla en cualquier parte de esta clase.
    }
}
exports.AuthController = AuthController;
