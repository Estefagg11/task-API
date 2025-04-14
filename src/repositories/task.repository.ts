
import Task, { TaskDocument } from '../models/task.model';// Importa el modelo Task y TaskDocument
import { ITask } from '../types/task';// Importa la interfaz ITask

export class TaskRepository {//crea una clase TaskRepository
  async create(taskData: ITask): Promise<TaskDocument> {//crea un metodo que recibe un objeto de tipo ITask y devuelve un objeto de tipo TaskDocument
    const task = new Task(taskData);//crea un objeto de tipo Task con los datos de taskData
    return await task.save();//guarda el objeto en la base de datos
  }

  async findById(id: string): Promise<TaskDocument | null> {//crea un metodo findById que recibe un string y devuelve un objeto de tipo TaskDocument o null
    return await Task.findById(id);//busca un objeto en la base de datos por su id
  }

  async findAll(userId: string): Promise<TaskDocument[]> {//crea un metodo findAll que recibe un string y devuelve un array de objetos de tipo TaskDocument
    return await Task.find({ userId });//busca todos los objetos en la base de datos que tengan el userId igual al userId recibido
  }

  async update(id: string, taskData: Partial<ITask>): Promise<TaskDocument | null> {//crea un metodo update que recibe un string y un objeto de tipo Partial<ITask> y devuelve un objeto de tipo TaskDocument o null
    return await Task.findByIdAndUpdate(id, taskData, { new: true });//busca un objeto en la base de datos por su id y lo actualiza con los datos de taskData
  }

  async delete(id: string): Promise<TaskDocument | null> {//crea un metodo delete que recibe un string y devuelve un objeto de tipo TaskDocument o null
    return await Task.findByIdAndDelete(id);//busca un objeto en la base de datos por su id y lo elimina
  }

  toTaskResponse(task: TaskDocument): ITask {//crea un metodo toTaskResponse que recibe un objeto de tipo TaskDocument y devuelve un objeto de tipo ITask
    return {//devuelve un objeto con los datos de task
      _id: (task._id as any).toString(),//convierte el id a string
      title: task.title,//devuelve el titulo
      description: task.description,//devuelve la descripcion
      completed: task.completed,//devuelve si esta completado
      userId: (task.userId as any).toString(),//convierte el userId a string
      createdAt: task.createdAt,//devuelve la fecha de creacion
      updatedAt: task.updatedAt//devuelve la fecha de actualizacion
    };
  }

  toTaskResponseList(tasks: TaskDocument[]): ITask[] {//crea un metodo toTaskResponseList que recibe un array de objetos de tipo TaskDocument y devuelve un array de objetos de tipo ITask
    return tasks.map(task => this.toTaskResponse(task));//devuelve un array con los datos de cada objeto de tasks
  }
}