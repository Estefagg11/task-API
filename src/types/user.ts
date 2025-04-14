
export interface IUser { //Exportamos la interfaz IUser
    _id?: string;// El identificador único del usuario, opcional.sera asignado por mongoDB
    name: string;//El nombre es obligatorio
    email: string;//El email es obligatorio
    password: string;//La contraseña es obligatoria
    createdAt?: Date;//La fecha de creación es opcional
    updatedAt?: Date;//La fecha de actualización es opcional
  }
  
  
  export interface IUserResponse {//Exportamos la interfaz IUserResponse
    _id?: string; // El identificador único del usuario, opcional.
    name: string;//El nombre es obligatorio
    email: string;//El email es obligatorio
    createdAt?: Date;//La fecha de creación es opcional
    updatedAt?: Date;//La fecha de actualización es opcional
  }