
import { Request, Response } from 'express';// Importar Request y Response de express, para definir las solicitudes y respuestas HTTP en el controlador
import { TaskService } from '../services/task.service';// clase que contiene la lógica de negocio para las tareas(crear,leer,actualizar,eliminar.)
import { ITask } from '../types/task';// Interfaz que define la estructura de una tarea (titulo,descripcion,estado,fecha,etc)
import mongoose from 'mongoose';// Importar mongoose para validar los ID de las tareas

export class TaskController { // Clase que contiene los métodos para manejar las solicitudes HTTP relacionadas con las tareas
  private taskService: TaskService;// Propiedad que almacena una instancia de la clase TaskService

  constructor() {
    this.taskService = new TaskService();// Inicializar la propiedad taskService con una nueva instancia de TaskService
  }

  /**
   * @swagger
   * /tasks: # La ruta es relativa al base path definido en app.ts (/api/tasks)
   *   post:
   *     summary: Crea una nueva tarea para el usuario autenticado.
   *     tags: [Tasks] # Agrupa este endpoint bajo Tasks
   *     security: # Este endpoint requiere autenticación
   *       - bearerAuth: [] # Referencia al esquema de seguridad 'bearerAuth' definido en swaggerConfig.ts
   *     requestBody: # Descripción del cuerpo de la solicitud
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TaskInput' # Referencia al schema de entrada para crear tareas
   *     responses: # Posibles respuestas
   *       201:
   *         description: Tarea creada exitosamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task' # Referencia al schema de la tarea completa
   *       400:
   *         description: Datos de entrada inválidos.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error' # Referencia al schema de error
   *       401:
   *         description: No autenticado (Token JWT inválido o faltante).
   *       500:
   *         description: Error del servidor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  createTask = async (req: Request, res: Response): Promise<void> => {// Método para crear una nueva tarea
    try {
      const taskData: ITask = {// Crear un objeto con los datos de la tarea
        ...req.body,// Copiar los datos de la solicitud HTTP
        userId: req.user.id// Agregar el ID del usuario que creó la tarea, Esto asegura que la tarea creada esté vinculada al usuario que la creó.
      };
      
      const task = await this.taskService.createTask(taskData);// Crear la tarea en la base de datos
      
      
      res.status(201).json(task);//Responder con la tarea creada/ CREADO
    } catch (error: any) {// Manejar errores
      res.status(400).json({// Responder con un código de estado 400 
        success: false, // Indicar que la solicitud no fue exitosa
        message: error.message// Enviar un mensaje de error
      });
    }
  };

  /**
   * @swagger
   * /tasks: # Endpoint GET /api/tasks
   *   get:
   *     summary: Obtiene todas las tareas del usuario autenticado.
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de tareas obtenida exitosamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: array # La respuesta es un array
   *               items:
   *                 $ref: '#/components/schemas/Task' # Cada item del array es una Tarea
   *       401:
   *         description: No autenticado (Token JWT inválido o faltante).
   *       500:
   *         description: Error del servidor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getTasks(req.user.id); //obtiene todas las tareas del usuario
      
      
      res.status(200).json(tasks); //responder con las tareas obtenidas
    } catch (error: any) {
      res.status(500).json({//error inesperado en el servidor 
        success: false,
        message: error.message //responder con un código de estado 500 y un mensaje de error
      });
    }
  };

  /**
   * @swagger
   * /tasks/{id}: # Endpoint GET /api/tasks/:id
   *   get:
   *     summary: Obtiene una tarea por su ID para el usuario autenticado.
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters: # Parámetros de la ruta
   *       - in: path # El parámetro está en la ruta
   *         name: id # El nombre del parámetro es 'id'
   *         schema:
   *           type: string # El tipo de dato es string
   *         required: true
   *         description: El ID de la tarea a obtener (MongoDB ObjectId como string).
   *     responses:
   *       200:
   *         description: Tarea obtenida exitosamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       400:
   *         description: ID de tarea inválido.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: No autenticado (Token JWT inválido o faltante).
   *       403:
   *         description: No autorizado para acceder a esta tarea (no pertenece al usuario autenticado).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Tarea no encontrada.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Error del servidor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; //obtener el ID de la tarea de los parámetros de la solicitud
      
      
      if (!mongoose.Types.ObjectId.isValid(id)) { //validar si el ID de la tarea es válido
        res.status(400).json({ //responder con un código de estado 400 si el ID no es válido
          success: false,
          message: 'ID de tarea inválido'//responder con un mensaje de error
        });
        return;//Finaliza la ejecución del método en este punto. Esto asegura que no se ejecute el resto del código si el id no es válido
      }
      
      const task = await this.taskService.getTaskById(id); //obtener la tarea por ID
      
      if (!task) {//verificar si la tarea existe
        res.status(404).json({//responder con un código de estado 404 si la tarea no existe
          success: false,
          message: 'Tarea no encontrada'//responder con un mensaje de error
        });
        return;
      }
      
      
      if (task.userId !== req.user.id) {//verificar si el usuario es el propietario de la tarea
        res.status(403).json({//responder con un código de estado 403 si el usuario no es el propietario
          success: false,
          message: 'No autorizado para acceder a esta tarea'//responder con un mensaje de error
        });
        return;
      }
      
      
      res.status(200).json(task);//responder con la tarea obtenida
    } catch (error: any) {
      res.status(500).json({//responder con un código de estado 500 si ocurre un error
        success: false,
        message: error.message//responder con un mensaje de error
      });
    }
  };

  /**
   * @swagger
   * /tasks/{id}: # Endpoint PUT /api/tasks/:id
   *   put:
   *     summary: Actualiza una tarea existente por su ID para el usuario autenticado.
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: El ID de la tarea a actualizar (MongoDB ObjectId como string).
   *     requestBody:
   *       required: true # Opcional, pero PUT suele esperar un cuerpo completo
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TaskUpdateInput' # Referencia al schema de entrada para actualizar
   *     responses:
   *       200:
   *         description: Tarea actualizada exitosamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       400:
   *         description: ID de tarea inválido o datos de entrada inválidos.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: No autenticado (Token JWT inválido o faltante).
   *       403:
   *         description: No autorizado para modificar esta tarea (no pertenece al usuario autenticado).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Tarea no encontrada.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Error del servidor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;//obtener el ID de la tarea de los parámetros de la solicitud
      
      
      if (!mongoose.Types.ObjectId.isValid(id)) {//validar si el ID de la tarea es válido
        res.status(400).json({//responder con un código de estado 400 si el ID no es válido
          success: false,
          message: 'ID de tarea inválido'//responder con un mensaje de error
        });
        return;
      }
      
      
      const existingTask = await this.taskService.getTaskById(id); //obtener la tarea por ID
      
      if (!existingTask) {//verificar si la tarea existe
        res.status(404).json({//responder con un código de estado 404 si la tarea no existe
          success: false,
          message: 'Tarea no encontrada'//responder con un mensaje de error
        });
        return;
      }
      
      if (existingTask.userId !== req.user.id) {//verificar si el usuario es el propietario de la tarea
        res.status(403).json({//responder con un código de estado 403 si el usuario no es el propietario
          success: false,//significa que hubo un error o problema al procesar la solicitud.respuesta JSON que se envía para indicar que algo no salió como se esperaba o que hubo un error en la operación.
          message: 'No autorizado para modificar esta tarea'//responder con un mensaje de error
        });
        return;
      }
      
      const task = await this.taskService.updateTask(id, req.body); //actualizar la tarea con los datos de la solicitud 
      
      
      res.status(200).json(task);//responder con la tarea actualizada
    } catch (error: any) {
      res.status(500).json({//responder con un código de estado 500 si ocurre un error
        success: false,
        message: error.message//responder con un mensaje de error
      });
    }
  };

  /**
   * @swagger
   * /tasks/{id}/complete: # Endpoint PATCH /api/tasks/:id/complete
   *   patch: # Usamos PATCH para una actualización parcial (solo completar)
   *     summary: Marca una tarea como completada por su ID para el usuario autenticado.
   *     description: Actualiza el estado `completed` de la tarea a `true`. # Describe lo que hace el servicio
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: El ID de la tarea a marcar como completada (MongoDB ObjectId como string).
   *     # No hay requestBody porque tu servicio solo establece completed: true
   *     responses:
   *       200: # Tu servicio devuelve la tarea actualizada con status 200
   *         description: Tarea marcada como completada exitosamente. Devuelve la tarea actualizada.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       400:
   *         description: ID de tarea inválido.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: No autenticado (Token JWT inválido o faltante).
   *       403:
   *         description: No autorizado para modificar esta tarea (no pertenece al usuario autenticado).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Tarea no encontrada.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Error del servidor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  completeTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;//obtener el ID de la tarea de los parámetros de la solicitud
      
      
      if (!mongoose.Types.ObjectId.isValid(id)) {//validar si el ID de la tarea es válido
        res.status(400).json({//responder con un código de estado 400 si el ID no es válido
          success: false,
          message: 'ID de tarea inválido'//responder con un mensaje de error  
        });
        return;
      }
      
      
      const existingTask = await this.taskService.getTaskById(id);//obtener la tarea por ID
      
      if (!existingTask) {//verificar si la tarea existe
        res.status(404).json({//responder con un código de estado 404 si la tarea no existe
          success: false,
          message: 'Tarea no encontrada'//responder con un mensaje de error
        });
        return;
      }
      
    if (existingTask.userId !== req.user.id) {//verificar si el usuario es el propietario de la tarea
        res.status(403).json({//responder con un código de estado 403 si el usuario no es el propietario
          success: false,
          message: 'No autorizado para modificar esta tarea'//responder con un mensaje de error
        });
        return;
      }
      
      const task = await this.taskService.completeTask(id);//completar la tarea
      
      
      res.status(200).json(task);//responder con la tarea actualizada
    } catch (error: any) {
      res.status(500).json({//responder con un código de estado 500 si ocurre un error
        success: false,
        message: error.message//responder con un mensaje de error
      });
    }
  };

   /**
   * @swagger
   * /tasks/{id}: # Endpoint DELETE /api/tasks/:id
   *   delete:
   *     summary: Elimina una tarea por su ID para el usuario autenticado.
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: El ID de la tarea a eliminar (MongoDB ObjectId como string).
   *     responses:
   *       204: # Código 204: No Content (eliminación exitosa)
   *         description: Tarea eliminada exitosamente (No Content).
   *       400:
   *         description: ID de tarea inválido.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: No autenticado (Token JWT inválido o faltante).
   *       403:
   *         description: No autorizado para eliminar esta tarea (no pertenece al usuario autenticado).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Tarea no encontrada.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Error del servidor.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;//obtener el ID de la tarea de los parámetros de la solicitud
      
      
      if (!mongoose.Types.ObjectId.isValid(id)) {//validar si el ID de la tarea es válido
        res.status(400).json({//responder con un código de estado 400 si el ID no es válido
          success: false,
          message: 'ID de tarea inválido'//responder con un mensaje de error
        });
        return;//finalizar la ejecución del método
      }
      
      
      const existingTask = await this.taskService.getTaskById(id);//obtener la tarea por ID
      
      if (!existingTask) {//verificar si la tarea existe
        res.status(404).json({//responder con un código de estado 404 si la tarea no existe
          success: false,
          message: 'Tarea no encontrada'
        });
        return;
      }
      
      if (existingTask.userId !== req.user.id) {//verificar si el usuario es el propietario de la tarea
        res.status(403).json({//responder con un código de estado 403 si el usuario no es el propietario
          success: false,
          message: 'No autorizado para eliminar esta tarea'
        });
        return;
      }
      
      await this.taskService.deleteTask(id);//eliminar la tarea
      
      
      res.status(204).end();//responder con un código de estado 204 
    } catch (error: any) {
      res.status(500).json({//responder con un código de estado 500 si ocurre un error
        success: false,
        message: error.message
      });
    }
  };
}