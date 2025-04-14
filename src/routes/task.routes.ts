
import { Router } from 'express';//importa router de express, define rutas y ayuda a maneja las solicitudes
import { TaskController } from '../controllers/task.controller';//importa TaskController
import { authMiddleware } from '../middleware/auth.middleware';//importa authMiddleware
import { validateTask } from '../middleware/validation.middleware';//importa validateTask

const router = Router();//crea una instancia de Router
const taskController = new TaskController();//crea una instancia de TaskController


router.use(authMiddleware);//usa authMiddleware para todas las rutas, solo usuarios autenticados puedan acceder a las rutas

router.post('/', validateTask, taskController.createTask);//crea una nueva tarea
router.get('/', taskController.getAllTasks);//obtiene todas las tareas
router.get('/:id', taskController.getTaskById);//obtiene una tarea por id
router.put('/:id', validateTask, taskController.updateTask);//actualiza una tarea
router.patch('/:id/complete', taskController.completeTask);//completa una tarea
router.delete('/:id', taskController.deleteTask);//elimina una tarea

export default router;//exporta router