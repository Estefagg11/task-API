
import { Request, Response, NextFunction } from 'express';//importamos las interfaces Request, Response y NextFunction de express
import jwt from 'jsonwebtoken';//importamos la libreria jsonwebtoken
import config from '../config/config';//importamos el archivo config.ts
import { UserRepository } from '../repositories/user.repository';//importamos la clase UserRepository del archivo user.repository.ts

//En TypeScript, las interfaces son estrictas. La interfaz Request de Express no incluye una propiedad user por defecto. 
//Si se intenta asignar o acceder a req.user sin extender la interfaz, TypeScript generará un error porque no reconoce esa propiedad.
declare global {//Declaración global para añadir propiedades personalizadas a la interfaz Request de Express
  namespace Express {
    interface Request {
      user?: any;// Aquí estamos añadiendo una propiedad 'user' a la solicitud de Express, que puede contener información sobre el usuario.
    }
  }
}
//La interfaz JwtPayload define la estructura esperada del payload de un token JWT. 
//En este caso, asegura que el payload contenga un id de tipo string. 
// Esto se utiliza en el middleware para decodificar el token y obtener el ID del usuario, que luego se usa para validar su autenticación y autorización.

interface JwtPayload {//
  id: string;//El payload del JWT contiene el ID del usuario.payload es la parte del token que contiene la información del usuario.
}

//verifica si el cliente ha enviado un token válido en la solicitud. 
//Si no hay un token o no es válido, se le niega el acceso.
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;//Extrae el encabezado de autorización de la solicitud.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {//Comprueba si el encabezado de autorización no está presente o no comienza con 'Bearer'.  
      res.status(401).json({ message: 'No autorizado, token no proporcionado' });//Si no se proporciona un token o el token no comienza con 'Bearer ', se envía un mensaje de error al cliente.
      return;
    }

    
    const token = authHeader.split(' ')[1];//Extrae el token del encabezado de autorización. El token se encuentra después de 'Bearer ' en el encabezado de autorización.
    
    
    const secret: any = config.JWT_SECRET;//Obtiene la clave secreta del archivo de configuración.
    const decoded = jwt.verify(token, secret) as JwtPayload;//Decodifica el token utilizando la clave secreta y obtiene el payload del token. Verifica que el token no ha sido alterado, busca el usaurio en la base de datos y valida su autenticacion.

    
    const userRepository = new UserRepository();//Crea una instancia de UserRepository.
    const user = await userRepository.findById(decoded.id);//Busca al usuario en la base de datos utilizando el ID del usuario del payload del token.
    if (!user) {//Si el usuario no se encuentra en la base de datos, se envía un mensaje de error al cliente.
      res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      return;
    }

    
    const userResponse = userRepository.toUserResponse(user);//Convierte el usuario en un objeto de respuesta de usuario.

    //userResponse transforma el objeto del usuario obtenido de la base de datos en un formato más simple y seguro para ser utilizado en la aplicación.
    //Al agregar esta información al objeto req, las siguientes funciones de middleware o controladores pueden acceder fácilmente a los datos del usuario autenticado sin necesidad de volver a consultar la base de datos.
    req.user = {//Añade el objeto de respuesta de usuario a la solicitud de Express.
      id: userResponse._id,//Añade el ID del usuario a la solicitud de Express.
      email: userResponse.email,//Añade el correo electrónico del usuario a la solicitud de Express.
      name: userResponse.name//Añade el nombre del usuario a la solicitud de Express.
    };

    next();//Llama a la siguiente función de middleware.
  } catch (error) {
    res.status(401).json({ message: 'No autorizado, token inválido' });//Si se produce un error al verificar el token, se envía un mensaje de error al cliente.
    return;
  }
};