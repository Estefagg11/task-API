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
exports.TaskRepository = void 0;
const task_model_1 = __importDefault(require("../models/task.model")); // Importa el modelo Task y TaskDocument
class TaskRepository {
    create(taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = new task_model_1.default(taskData); //crea un objeto de tipo Task con los datos de taskData
            return yield task.save(); //guarda el objeto en la base de datos
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_model_1.default.findById(id); //busca un objeto en la base de datos por su id
        });
    }
    findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_model_1.default.find({ userId }); //busca todos los objetos en la base de datos que tengan el userId igual al userId recibido
        });
    }
    update(id, taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_model_1.default.findByIdAndUpdate(id, taskData, { new: true }); //busca un objeto en la base de datos por su id y lo actualiza con los datos de taskData
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_model_1.default.findByIdAndDelete(id); //busca un objeto en la base de datos por su id y lo elimina
        });
    }
    toTaskResponse(task) {
        return {
            _id: task._id.toString(), //convierte el id a string
            title: task.title, //devuelve el titulo
            description: task.description, //devuelve la descripcion
            completed: task.completed, //devuelve si esta completado
            userId: task.userId.toString(), //convierte el userId a string
            createdAt: task.createdAt, //devuelve la fecha de creacion
            updatedAt: task.updatedAt //devuelve la fecha de actualizacion
        };
    }
    toTaskResponseList(tasks) {
        return tasks.map(task => this.toTaskResponse(task)); //devuelve un array con los datos de cada objeto de tasks
    }
}
exports.TaskRepository = TaskRepository;
