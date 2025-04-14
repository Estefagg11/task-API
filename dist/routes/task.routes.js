"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); //importa router de express, define rutas y ayuda a maneja las solicitudes
const task_controller_1 = require("../controllers/task.controller"); //importa TaskController
const auth_middleware_1 = require("../middleware/auth.middleware"); //importa authMiddleware
const validation_middleware_1 = require("../middleware/validation.middleware"); //importa validateTask
const router = (0, express_1.Router)(); //crea una instancia de Router
const taskController = new task_controller_1.TaskController(); //crea una instancia de TaskController
router.use(auth_middleware_1.authMiddleware); //usa authMiddleware para todas las rutas, solo usuarios autenticados puedan acceder a las rutas
router.post('/', validation_middleware_1.validateTask, taskController.createTask); //crea una nueva tarea
router.get('/', taskController.getAllTasks); //obtiene todas las tareas
router.get('/:id', taskController.getTaskById); //obtiene una tarea por id
router.put('/:id', validation_middleware_1.validateTask, taskController.updateTask); //actualiza una tarea
router.patch('/:id/complete', taskController.completeTask); //completa una tarea
router.delete('/:id', taskController.deleteTask); //elimina una tarea
exports.default = router; //exporta router
