
import { TaskRepository } from '../repositories/task.repository';//importamos el repositorio de tareas
import { ITask } from '../types/task';//importamos la interfaz de tarea

export class TaskService {//creamos la clase TaskService
  private taskRepository: TaskRepository;//creamos una variable privada de tipo TaskRepository

  constructor() {//creamos el constructor de la clase
    this.taskRepository = new TaskRepository();//inicializamos la variable taskRepository
  }

  async createTask(taskData: ITask): Promise<ITask> {//creamos el metodo createTask que recibe un objeto de tipo ITask y devuelve una promesa de tipo ITask
    const task = await this.taskRepository.create(taskData);//creamos una tarea con el metodo create del repositorio de tareas
    return this.taskRepository.toTaskResponse(task);//devolvemos la tarea creada
  }

  async getTasks(userId: string): Promise<ITask[]> {//creamos el metodo getTasks que recibe un id de usuario y devuelve una promesa de un array de tareas
    const tasks = await this.taskRepository.findAll(userId);//busca todas las tareas del usuario con el metodo findAll del repositorio de tareas
    return this.taskRepository.toTaskResponseList(tasks);//devolvemos las tareas encontradas
  }

  async getTaskById(id: string): Promise<ITask | null> {//creamos el metodo getTaskById que recibe un id de tarea y devuelve una promesa de una tarea o null
    const task = await this.taskRepository.findById(id);//busca la tarea con el metodo findById del repositorio de tareas
    return task ? this.taskRepository.toTaskResponse(task) : null;//devolvemos la tarea encontrada o null
  }

  async updateTask(id: string, taskData: Partial<ITask>): Promise<ITask | null> {//creamos el metodo updateTask que recibe un id de tarea y un objeto de tipo Partial<ITask> y devuelve una promesa de una tarea o null
    const task = await this.taskRepository.update(id, taskData);//actualizamos la tarea con el metodo update del repositorio de tareas
    return task ? this.taskRepository.toTaskResponse(task) : null;//devolvemos la tarea actualizada o null
  }

  async completeTask(id: string): Promise<ITask | null> {//creamos el metodo completeTask que recibe un id de tarea y devuelve una promesa de una tarea o null
    const task = await this.taskRepository.update(id, { completed: true });//actualizamos la tarea con el metodo update del repositorio de tareas
    return task ? this.taskRepository.toTaskResponse(task) : null;//devolvemos la tarea actualizada o null
  }

  async deleteTask(id: string): Promise<ITask | null> {//creamos el metodo deleteTask que recibe un id de tarea y devuelve una promesa de una tarea o null
    const task = await this.taskRepository.delete(id);//eliminamos la tarea con el metodo delete del repositorio de tareas
    return task ? this.taskRepository.toTaskResponse(task) : null;//devolvemos la tarea eliminada o null
  }
}

//El archivo task.service.ts proporciona una interfaz para gestionar tareas en la aplicación.
//Crear tareas: Permite registrar nuevas tareas.
//Leer tareas: Obtiene todas las tareas de un usuario o una tarea específica.
//Actualizar tareas: Modifica los datos de una tarea existente.
//Completar tareas: Marca una tarea como completada.
//Eliminar tareas: Elimina una tarea de la base de datos.