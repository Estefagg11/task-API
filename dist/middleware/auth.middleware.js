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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); //importamos la libreria jsonwebtoken
const config_1 = __importDefault(require("../config/config")); //importamos el archivo config.ts
const user_repository_1 = require("../repositories/user.repository"); //importamos la clase UserRepository del archivo user.repository.ts
//verifica si el cliente ha enviado un token válido en la solicitud. 
//Si no hay un token o no es válido, se le niega el acceso.
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization; //Extrae el encabezado de autorización de la solicitud.
        if (!authHeader || !authHeader.startsWith('Bearer ')) { //Comprueba si el encabezado de autorización no está presente o no comienza con 'Bearer'.  
            res.status(401).json({ message: 'No autorizado, token no proporcionado' }); //Si no se proporciona un token o el token no comienza con 'Bearer ', se envía un mensaje de error al cliente.
            return;
        }
        const token = authHeader.split(' ')[1]; //Extrae el token del encabezado de autorización. El token se encuentra después de 'Bearer ' en el encabezado de autorización.
        const secret = config_1.default.JWT_SECRET; //Obtiene la clave secreta del archivo de configuración.
        const decoded = jsonwebtoken_1.default.verify(token, secret); //Decodifica el token utilizando la clave secreta y obtiene el payload del token. Verifica que el token no ha sido alterado, busca el usaurio en la base de datos y valida su autenticacion.
        const userRepository = new user_repository_1.UserRepository(); //Crea una instancia de UserRepository.
        const user = yield userRepository.findById(decoded.id); //Busca al usuario en la base de datos utilizando el ID del usuario del payload del token.
        if (!user) { //Si el usuario no se encuentra en la base de datos, se envía un mensaje de error al cliente.
            res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            return;
        }
        const userResponse = userRepository.toUserResponse(user); //Convierte el usuario en un objeto de respuesta de usuario.
        //userResponse transforma el objeto del usuario obtenido de la base de datos en un formato más simple y seguro para ser utilizado en la aplicación.
        //Al agregar esta información al objeto req, las siguientes funciones de middleware o controladores pueden acceder fácilmente a los datos del usuario autenticado sin necesidad de volver a consultar la base de datos.
        req.user = {
            id: userResponse._id, //Añade el ID del usuario a la solicitud de Express.
            email: userResponse.email, //Añade el correo electrónico del usuario a la solicitud de Express.
            name: userResponse.name //Añade el nombre del usuario a la solicitud de Express.
        };
        next(); //Llama a la siguiente función de middleware.
    }
    catch (error) {
        res.status(401).json({ message: 'No autorizado, token inválido' }); //Si se produce un error al verificar el token, se envía un mensaje de error al cliente.
        return;
    }
});
exports.authMiddleware = authMiddleware;
