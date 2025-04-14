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
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service"); // clase que contiene la lógica de negocio para las tareas(crear,leer,actualizar,eliminar.)
const mongoose_1 = __importDefault(require("mongoose")); // Importar mongoose para validar los ID de las tareas
class TaskController {
    constructor() {
        this.createTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const taskData = Object.assign(Object.assign({}, req.body), { userId: req.user.id // Agregar el ID del usuario que creó la tarea, Esto asegura que la tarea creada esté vinculada al usuario que la creó.
                 });
                const task = yield this.taskService.createTask(taskData); // Crear la tarea en la base de datos
                res.status(201).json(task); //Responder con la tarea creada/ CREADO
            }
            catch (error) { // Manejar errores
                res.status(400).json({
                    success: false, // Indicar que la solicitud no fue exitosa
                    message: error.message // Enviar un mensaje de error
                });
            }
        });
        this.getAllTasks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield this.taskService.getTasks(req.user.id); //obtiene todas las tareas del usuario
                res.status(200).json(tasks); //responder con las tareas obtenidas
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message //responder con un código de estado 500 y un mensaje de error
                });
            }
        });
        this.getTaskById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; //obtener el ID de la tarea de los parámetros de la solicitud
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) { //validar si el ID de la tarea es válido
                    res.status(400).json({
                        success: false,
                        message: 'ID de tarea inválido' //responder con un mensaje de error
                    });
                    return; //Finaliza la ejecución del método en este punto. Esto asegura que no se ejecute el resto del código si el id no es válido
                }
                const task = yield this.taskService.getTaskById(id); //obtener la tarea por ID
                if (!task) { //verificar si la tarea existe
                    res.status(404).json({
                        success: false,
                        message: 'Tarea no encontrada' //responder con un mensaje de error
                    });
                    return;
                }
                if (task.userId !== req.user.id) { //verificar si el usuario es el propietario de la tarea
                    res.status(403).json({
                        success: false,
                        message: 'No autorizado para acceder a esta tarea' //responder con un mensaje de error
                    });
                    return;
                }
                res.status(200).json(task); //responder con la tarea obtenida
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message //responder con un mensaje de error
                });
            }
        });
        this.updateTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; //obtener el ID de la tarea de los parámetros de la solicitud
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) { //validar si el ID de la tarea es válido
                    res.status(400).json({
                        success: false,
                        message: 'ID de tarea inválido' //responder con un mensaje de error
                    });
                    return;
                }
                const existingTask = yield this.taskService.getTaskById(id); //obtener la tarea por ID
                if (!existingTask) { //verificar si la tarea existe
                    res.status(404).json({
                        success: false,
                        message: 'Tarea no encontrada' //responder con un mensaje de error
                    });
                    return;
                }
                if (existingTask.userId !== req.user.id) { //verificar si el usuario es el propietario de la tarea
                    res.status(403).json({
                        success: false, //significa que hubo un error o problema al procesar la solicitud.respuesta JSON que se envía para indicar que algo no salió como se esperaba o que hubo un error en la operación.
                        message: 'No autorizado para modificar esta tarea' //responder con un mensaje de error
                    });
                    return;
                }
                const task = yield this.taskService.updateTask(id, req.body); //actualizar la tarea con los datos de la solicitud 
                res.status(200).json(task); //responder con la tarea actualizada
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message //responder con un mensaje de error
                });
            }
        });
        this.completeTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; //obtener el ID de la tarea de los parámetros de la solicitud
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) { //validar si el ID de la tarea es válido
                    res.status(400).json({
                        success: false,
                        message: 'ID de tarea inválido' //responder con un mensaje de error  
                    });
                    return;
                }
                const existingTask = yield this.taskService.getTaskById(id); //obtener la tarea por ID
                if (!existingTask) { //verificar si la tarea existe
                    res.status(404).json({
                        success: false,
                        message: 'Tarea no encontrada' //responder con un mensaje de error
                    });
                    return;
                }
                if (existingTask.userId !== req.user.id) { //verificar si el usuario es el propietario de la tarea
                    res.status(403).json({
                        success: false,
                        message: 'No autorizado para modificar esta tarea' //responder con un mensaje de error
                    });
                    return;
                }
                const task = yield this.taskService.completeTask(id); //completar la tarea
                res.status(200).json(task); //responder con la tarea actualizada
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message //responder con un mensaje de error
                });
            }
        });
        this.deleteTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; //obtener el ID de la tarea de los parámetros de la solicitud
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) { //validar si el ID de la tarea es válido
                    res.status(400).json({
                        success: false,
                        message: 'ID de tarea inválido' //responder con un mensaje de error
                    });
                    return; //finalizar la ejecución del método
                }
                const existingTask = yield this.taskService.getTaskById(id); //obtener la tarea por ID
                if (!existingTask) { //verificar si la tarea existe
                    res.status(404).json({
                        success: false,
                        message: 'Tarea no encontrada'
                    });
                    return;
                }
                if (existingTask.userId !== req.user.id) { //verificar si el usuario es el propietario de la tarea
                    res.status(403).json({
                        success: false,
                        message: 'No autorizado para eliminar esta tarea'
                    });
                    return;
                }
                yield this.taskService.deleteTask(id); //eliminar la tarea
                res.status(204).end(); //responder con un código de estado 204 
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
        this.taskService = new task_service_1.TaskService(); // Inicializar la propiedad taskService con una nueva instancia de TaskService
    }
}
exports.TaskController = TaskController;
