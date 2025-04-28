Task Management API

Descripción:

Este proyecto es una aplicación web completa para la gestión de tareas personales. 
Consiste en un backend API construido con Node.js (Express y TypeScript) y un frontend interactivo desarrollado con React. 
La aplicación permite a los usuarios registrarse, iniciar sesión y gestionar sus tareas, incluyendo crear, ver, editar, eliminar y marcar tareas como completadas. 

Características Principales:

*   Registro de usuarios.
*   Inicio y cierre de sesión (gestionado principalmente en el cliente con token JWT).
*   Gestión de tareas CRUD (Crear, Leer, Actualizar, Eliminar) asociadas a cada usuario.
*   Marcado de tareas como completadas.
*   Asignación de descripciones, fechas límite y estados a las tareas.
*   Validación de datos en las entradas del backend.
*   Interfaz de usuario dinámica construida con React.

Tecnologías Utilizadas:

Backend:

*   Node.js
*   Express.js (Framework web)
*   TypeScript
*   Mongoose (ODM para MongoDB)
*   MongoDB (Base de Datos - *Se utiliza Mongoose para la conexión*)
*   JSON Web Tokens (JWT) (Autenticación)
*   bcrypt (Hash de contraseñas)
*   express-validator (Validación de peticiones)
*   CORS, Morgan (Middlewares)
*   dotenv (Carga de variables de entorno)


Frontend:

*   React
*   TypeScript
*   Vite (Bundler y servidor de desarrollo)
*   react-router-dom (Enrutamiento)
*   react-hook-form (Gestión de formularios)
*   Axios (Cliente HTTP)
*   Tailwind CSS (Estilizado)
*   Context API de React (Gestión de estado)

Prerrequisitos:

Antes de instalar y ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

*   Node.js (versión 18 o superior recomendada)
*   npm o Yarn (gestores de paquetes de Node.js)
*   Git
*   Una instancia de MongoDB corriendo y accesible.

Instalación:


1.  Clonar el Repositorio:
    
   git clone https://github.com/Estefagg11/task-API.git


2.  Instalar Dependencias:
    
    npm install bcryptjs cors dotenv express express-validator jsonwebtoken mongoose morgan swagger-jsdoc swagger-ui-express

    npm install --save-dev @types/bcryptjs @types/cors @types/express @types/jsonwebtoken @types/morgan @types/swagger-jsdoc @types/swagger-ui-express nodemon ts-node

3. Cofigurar base de datos:

    En el archivo de database.ts realiza el siguiente cambio:

    const mongoURI: string = 'pon-aqui-tu-uri-de-mongodb';

    URI de conexión a MongoDB Atlas (reemplaza "pon-aqui-tu-uri-de-mongodb" por tu propia conexión)

Ejecución:

Para ejecutar el proyecto completo, necesitas iniciar tanto el servidor backend como la aplicación frontend en terminales separadas.

1.  Iniciar el Backend:
    Abre una terminal, navega al directorio `backend (API 1.1)` y ejecuta npm run dev
   
    El servidor Express se iniciará (por defecto en el puerto 5001) y te lo indicará en la consola.

2.  Iniciar el Frontend:
    Abre otra terminal, navega al directorio `frontend (client)` y ejecuta npm run dev

    La aplicación React se iniciará (típicamente en `http://localhost:5173`) y se abrirá en tu navegador predeterminado.

Asegúrate de que ambos procesos sigan corriendo para que la aplicación funcione.

Uso de la Aplicación:

1.  Abre la aplicación frontend en tu navegador (`http://localhost:5173`).
2.  Si eres un usuario nuevo, navega a la página de "Register" para crear una cuenta.
3.  Si ya tienes una cuenta, ve a la página de "Login" para iniciar sesión.
4.  Una vez autenticado, serás redirigido a la página de "Mis Tareas", donde podrás ver tus tareas existentes.
5.  Usa el botón "Añadir Tarea" para crear nuevas tareas.
6.  En la lista de tareas, puedes ver los detalles, usar los botones para editar o eliminar una tarea, o marcarla como completada.
7.  Usa el botón "Logout" en la barra de navegación para cerrar tu sesión.

DOCUMENTACION: http://localhost:5001/api-docs/
