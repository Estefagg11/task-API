"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); //importa router de express
const auth_controller_1 = require("../controllers/auth.controller"); //importa el controlador de usuario
const validation_middleware_1 = require("../middleware/validation.middleware"); //importa la validacion de usuario
const router = (0, express_1.Router)(); //crea una instancia de router
const authController = new auth_controller_1.AuthController(); //crea una instancia del controlador de usuario
router.post('/register', validation_middleware_1.validateUser, authController.register); //crea una ruta post para registrar un usuario
router.post('/login', validation_middleware_1.validateLogin, authController.login); //crea una ruta post para loguear un usuario
router.post('/logout', authController.logout); // Aquí añadimos la ruta para logout
exports.default = router; //exporta el router
//validateUser: Middleware que valida los datos del usuario antes de que lleguen al controlador.
//authController.register: Controlador que maneja la lógica para registrar al usuario en la base de datos.
//validateLogin: Middleware que valida los datos de inicio de sesión antes de que lleguen al controlador.
//authController.login: Controlador que maneja la lógica para autenticar al usuario y generar un token (como un JWT).
