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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repositories/task.repository"); //importamos el repositorio de tareas
class TaskService {
    constructor() {
        this.taskRepository = new task_repository_1.TaskRepository(); //inicializamos la variable taskRepository
    }
    createTask(taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.create(taskData); //creamos una tarea con el metodo create del repositorio de tareas
            return this.taskRepository.toTaskResponse(task); //devolvemos la tarea creada
        });
    }
    getTasks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.taskRepository.findAll(userId); //busca todas las tareas del usuario con el metodo findAll del repositorio de tareas
            return this.taskRepository.toTaskResponseList(tasks); //devolvemos las tareas encontradas
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(id); //busca la tarea con el metodo findById del repositorio de tareas
            return task ? this.taskRepository.toTaskResponse(task) : null; //devolvemos la tarea encontrada o null
        });
    }
    updateTask(id, taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.update(id, taskData); //actualizamos la tarea con el metodo update del repositorio de tareas
            return task ? this.taskRepository.toTaskResponse(task) : null; //devolvemos la tarea actualizada o null
        });
    }
    completeTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.update(id, { completed: true }); //actualizamos la tarea con el metodo update del repositorio de tareas
            return task ? this.taskRepository.toTaskResponse(task) : null; //devolvemos la tarea actualizada o null
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.delete(id); //eliminamos la tarea con el metodo delete del repositorio de tareas
            return task ? this.taskRepository.toTaskResponse(task) : null; //devolvemos la tarea eliminada o null
        });
    }
}
exports.TaskService = TaskService;
//El archivo task.service.ts proporciona una interfaz para gestionar tareas en la aplicación.
//Crear tareas: Permite registrar nuevas tareas.
//Leer tareas: Obtiene todas las tareas de un usuario o una tarea específica.
//Actualizar tareas: Modifica los datos de una tarea existente.
//Completar tareas: Marca una tarea como completada.
//Eliminar tareas: Elimina una tarea de la base de datos.
