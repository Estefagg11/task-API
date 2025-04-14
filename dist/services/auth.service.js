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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); //importamos la libreria jsonwebtoken
const user_repository_1 = require("../repositories/user.repository"); //importamos el repositorio de usuario
const config_1 = __importDefault(require("../config/config")); //importamos la configuracion
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository(); //inicializamos la variable userRepository
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Datos recibidos en el backend:", userData);
            const existingUser = yield this.userRepository.findByEmail(userData.email); //buscamos un usuario por email
            if (existingUser) { //si el usuario ya existe
                throw new Error('El usuario ya existe'); //lanzamos un error y mensaje
            }
            const user = yield this.userRepository.create(userData); //creamos un usuario
            const token = this.generateToken(user._id.toString()); //generamos un token
            const userResponse = this.userRepository.toUserResponse(user); //creamos un objeto de tipo IUserResponse,método responsable de transformar un objeto de usuario (user) en un formato específico (IUserResponse), una versión segura del usuario, omitiendo información sensible como contraseñas.
            return { user: userResponse, token }; //devolvemos el usuario y el token
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email); //buscamos un usuario por email
            if (!user) { //si el usuario no existe
                throw new Error('Credenciales inválidas'); //lanzamos un error y mensaje
            }
            const isMatch = yield user.comparePassword(password); //comparamos la contraseña
            if (!isMatch) { //si no coincide
                throw new Error('Credenciales inválidas'); //lanzamos un error y mensaje
            }
            const token = this.generateToken(user._id.toString()); //generamos un token
            const userResponse = this.userRepository.toUserResponse(user); //creamos un objeto de tipo IUserResponse
            return { user: userResponse, token }; //devolvemos el usuario y el token
        });
    }
    generateToken(userId) {
        const payload = { id: userId }; //creamos un objeto payload con el id del usuario
        const secret = config_1.default.JWT_SECRET; //creamos una variable secret con la clave secreta
        const options = { expiresIn: config_1.default.JWT_EXPIRATION }; //creamos un objeto con la fecha de expiracion
        return jsonwebtoken_1.default.sign(payload, secret, options); //devuelve el token
    }
}
exports.AuthService = AuthService;
//El archivo auth.service.ts actúa como un intermediario entre la lógica de negocio y la base de datos para manejar la autenticación de usuarios. 
//Registrar nuevos usuarios de manera segura.
//Validar credenciales de inicio de sesión.
//Generar tokens JWT para la autenticación basada en tokens.
//Proveer una versión segura de los datos del usuario (IUserResponse) para evitar exponer información sensible.
