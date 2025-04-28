import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0', // Especificación OpenAPI versión 3.0.0
    info: {
      title: 'Task Management API', // Título de la API
      version: '1.0.0', // Versión de  API
      description: 'API para gestionar tareas y usuarios, incluyendo autenticación, validación y persistencia con Mongoose.', // Descripción general de la API
    },
    servers: [ // Define los servidores donde la API está disponible
      {
        // URL base de la API
        url: 'http://localhost:5001/api',
        description: 'Servidor de desarrollo local'
      },

    ],
    tags: [ // Define tags para agrupar endpoints en la UI de Swagger
        { name: 'Auth', description: 'Operaciones relacionadas con la autenticación y gestión de usuarios.' },
        { name: 'Tasks', description: 'Operaciones relacionadas con la gestión de tareas.' },
    ],

    components: { // Definiciones reusables (schemas, seguridad)
      schemas: {

        // Schema para la respuesta completa de una tarea
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID único de la tarea (generado por la base de datos)', example: '60d0fe4f5311236164000001' }, // MongoDB ObjectId como string
            userId: { type: 'string', description: 'ID del usuario propietario de la tarea', example: '60d0fe4f5311236164000002' }, // User _id como string
            title: { type: 'string', description: 'Título de la tarea', example: 'Completar documentación Swagger' },
            description: { type: 'string', description: 'Descripción detallada de la tarea', nullable: true, example: 'Añadir comentarios @swagger a los controladores.' },
            completed: { type: 'boolean', description: 'Indica si la tarea está completada', default: false, example: false },
            dueDate: { type: 'string', format: 'date-time', description: 'Fecha límite para completar la tarea (ISO 8601)', nullable: true, example: '2023-12-31T23:59:59.000Z' },
            status: { type: 'string', description: 'Estado de la tarea', enum: ['pendiente', 'en progreso', 'bloqueada', 'completada'], default: 'pendiente', nullable: true, example: 'pendiente' }, // Estado inicial de la tarea
            createdAt: { type: 'string', format: 'date-time', description: 'Fecha y hora de creación de la tarea (ISO 8601)', example: '2023-10-27T10:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Fecha y hora de la última actualización de la tarea (ISO 8601)', example: '2023-10-27T10:30:00.000Z' },
          },
          required: ['_id', 'userId', 'title', 'completed', 'createdAt', 'updatedAt'], // Campos requeridos en la respuesta
        },
        // Schema para crear una tarea
        TaskInput: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Título de la tarea', example: 'Planificar sprint' },
            description: { type: 'string', description: 'Tareas para el próximo sprint', nullable: true, example: 'Definir historias de usuario y estimar tiempos.' },
            dueDate: { type: 'string', format: 'date-time', description: 'Fecha límite para completar la tarea (ISO 8601)', nullable: true, example: '2023-11-05T18:00:00.000Z' },
            status: { type: 'string', description: 'Estado inicial de la tarea', enum: ['pendiente', 'en progreso', 'bloqueada'], default: 'pendiente', nullable: true, example: 'en progreso' }, // No incluir 'completada' si no es estado inicial válido
          },
          required: ['title'], // validateTask lo hace requerido
        },
         // Schema para actualizar una tarea
        TaskUpdateInput: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Título de la tarea', nullable: true, example: 'Refinar Plan del Sprint' },
            description: { type: 'string', description: 'Detallar subtareas', nullable: true, example: 'Dividir historias grandes.' },
            completed: { type: 'boolean', description: 'Indica si la tarea está completada', nullable: true, example: true },
            dueDate: { type: 'string', format: 'date-time', description: 'Fecha límite para completar la tarea (ISO 8601)', nullable: true, example: '2023-11-10T23:59:59.000Z' },
            status: { type: 'string', description: 'Estado de la tarea', enum: ['pendiente', 'completada', 'en progreso', 'bloqueada'], nullable: true, example: 'completada' },
          },
          // required: [], // Los campos son opcionales en la petición PUT/PATCH, pero al menos uno debe enviarse.
        },
        // Schema para la respuesta básica de un usuario
        UserResponse: { // Corresponde a IUserResponse en el backend
            type: 'object',
            properties: {
                _id: { type: 'string', description: 'ID del usuario', example: '60d0fe4f5311236164000002' },
                name: { type: 'string', description: 'Nombre del usuario', example: 'Juan Pérez' },
                email: { type: 'string', format: 'email', description: 'Correo electrónico del usuario (único)', example: 'juan.perez@example.com' },
                createdAt: { type: 'string', format: 'date-time', description: 'Fecha y hora de creación (ISO 8601)', example: '2023-10-26T08:00:00.000Z' },
                updatedAt: { type: 'string', format: 'date-time', description: 'Fecha y hora de la última actualización (ISO 8601)', example: '2023-10-26T08:00:00.000Z' },
            },
            required: ['_id', 'name', 'email', 'createdAt', 'updatedAt']
        },
        // Schema para crear un usuario - Corresponde a IUser en el backend
        UserInput: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Nombre del usuario', example: 'Nuevo Usuario' },
                email: { type: 'string', format: 'email', description: 'Correo electrónico del usuario (único)', example: 'nuevo.usuario@example.com' },
                password: { type: 'string', description: 'Contraseña del usuario (mínimo 6 caracteres)', minLength: 6, writeOnly: true, example: 'password123' }, // writeOnly = no se muestra en las respuestas
            },
            required: ['name', 'email', 'password'], // validateUser los hace requeridos
        },
         // Schema para el login de usuario
        LoginInput: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email', description: 'Correo electrónico del usuario', example: 'juan.perez@example.com' },
                password: { type: 'string', description: 'Contraseña del usuario', writeOnly: true, example: 'mypassword' },
            },
            required: ['email', 'password'], // validateLogin los hace requeridos
        },
        // Schema para la respuesta exitosa de login/registro (con token y datos básicos del usuario)
        AuthResponse: {
             type: 'object',
             properties: {
                 token: { type: 'string', description: 'Token de autenticación JWT', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                 user: { $ref: '#/components/schemas/UserResponse' } // Referencia al schema de respuesta de usuario
             },
             required: ['token', 'user']
        },
        // Schema genérico para respuestas de error
        Error: {
            type: 'object',
            properties: {
                success: { type: 'boolean', description: 'Indica si la operación falló', example: false },
                message: { type: 'string', description: 'Mensaje de error descriptivo', example: 'ID de tarea inválido' },
            },
            required: ['success', 'message']
        }

      },

      securitySchemes: {
        bearerAuth: { // Nombre del esquema: 'bearerAuth'
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Autenticación basada en token JWT. El token debe enviarse en el encabezado `Authorization` como `Bearer [token]`.',
        }
      }

    },
  }, 

  apis: ['./src/controllers/*.ts'], // Ruta a los archivos de los controladores donde están las anotaciones Swagger
};

export default swaggerOptions;