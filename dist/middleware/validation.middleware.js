"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateUser = exports.validateTask = void 0;
const validateTask = (req, res, next) => {
    const { title } = req.body; // Extraemos el título de la tarea del cuerpo de la petición
    if (!title || title.trim() === '') { // Si el título no existe o está vacío
        res.status(400).json({ message: 'El título de la tarea es requerido' });
        return;
    }
    next(); // Si el título existe y no está vacío, llamamos a la función next
};
exports.validateTask = validateTask;
const validateUser = (req, res, next) => {
    const { name, email, password } = req.body; // Extraemos el nombre, email y contraseña del cuerpo de la petición
    if (!name || name.trim() === '') { // Si el nombre no existe o está vacío
        res.status(400).json({ message: 'El nombre es requerido' }); // Enviamos un mensaje de error
        return;
    }
    if (!email || email.trim() === '') { // Si el email no existe o está vacío
        res.status(400).json({ message: 'El email es requerido' }); // Enviamos un mensaje de error
        return; // Terminamos la ejecución de la función
    }
    if (!password || password.length < 6) { // Si la contraseña no existe o tiene menos de 6 caracteres
        res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' }); // Enviamos un mensaje de error
        return;
    }
    next(); // Si el nombre, email y contraseña existen y no están vacíos, llamamos a la función next
};
exports.validateUser = validateUser;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body; // Extraemos el email y contraseña del cuerpo de la petición
    if (!email || email.trim() === '') { // Si el email no existe o está vacío
        res.status(400).json({ message: 'El email es requerido' }); // Enviamos un mensaje de error
        return;
    }
    if (!password || password.trim() === '') { // Si la contraseña no existe o está vacía
        res.status(400).json({ message: 'La contraseña es requerida' });
        return;
    }
    next(); // Si el email y contraseña existen y no están vacíos, llamamos a la función next
};
exports.validateLogin = validateLogin;
