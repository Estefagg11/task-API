
export interface ITask { //exportamos la interfaz para poder usarla en otros archivos 
    _id?: string;//el signo de interrogación indica que es opcional
    title: string; //título de la tarea
    description?: string; //el signo de interrogación indica que es opcional
    completed: boolean; //indica si la tarea está completada o no
    userId: string; //id del usuario que creó la tarea
    createdAt?: Date; //fecha de creación de la tarea
    updatedAt?: Date; //fecha de actualización de la tarea
  }
  