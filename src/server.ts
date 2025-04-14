
import app from './app'; //importamos la constante app del archivo app.ts
import config from './config/config'; //importamos la constante config del archivo config.ts

const PORT: number = parseInt(config.PORT as string, 10); //obtenemos el puerto del archivo config.ts y lo almacenamos en la constante PORT

app.listen(PORT, () => {  //iniciamos el servidor en el puerto PORT
  console.log(`Servidor corriendo en puerto ${PORT}`);  //mostramos un mensaje en consola
});

//Punto de entrada principal de la aplicación. 
//Su función es inicializar el servidor Express y ponerlo en funcionamiento escuchando en un puerto específico.
//archivo que arranca la aplicación y la pone en funcionamiento.
