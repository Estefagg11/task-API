"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err.stack); // Imprime el error en la consola. 
    if (err instanceof SyntaxError && 'body' in err) { //Comprueba si el error es un error de sintaxis y si el error tiene una propiedad 'body'.
        res.status(400).json({
            success: false,
            message: 'JSON mal formado. Verifica el formato de tu solicitud.' //Si el error es un error de sintaxis, se envía un mensaje de error al cliente.
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor' //Si se produce un error en el servidor, se envía un mensaje de error al cliente.
    });
};
exports.errorMiddleware = errorMiddleware;
//detecta errores en la aplicación, los registra en la consola y envía un mensaje al cliente para que sepa qué ocurrió, ya sea un problema con su solicitud o un error interno del servidor.
