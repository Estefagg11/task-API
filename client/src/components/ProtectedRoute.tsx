import { Navigate, Outlet } from 'react-router-dom'; // Para redirigir a otras rutas
import { useAuth } from '../context/AuthContext'; // Asegura que la ruta al contexto sea correcta

function ProtectedRoute() { // Obtenemos el estado de carga y autenticación
  const { loading, isAuthenticated } = useAuth(); 

  //verifica el token inicial
  if (loading) {
    // Muestra un mensaje de carga mientras se verifica el token
    // Para evitar redirigir a login antes de saber si el token es válido
    return (
      <p className="text-white text-center text-lg mt-10">
        Cargando ruta protegida...
      </p>
    );
  }

  //Si el usuario NO está autenticado
  if (!loading && !isAuthenticated) {
    //Redirige al usuario a la página de login
    //"replace" evita que la ruta protegida quede en el historial del navegador, así el usuario no vuelve a ella con el botón "atrás" después de iniciar sesión.
    return <Navigate to="/login" replace />;
  }

  //Si el usuario está autenticado
  // Permite el acceso a la ruta
  // <Outlet /> renderizará el componente definido como hijo de esta ruta en App.tsx
  return <Outlet />;
}

export default ProtectedRoute; // Exporta el componente para usarlo en otras partes de la aplicación

//las rutas hijas son una forma de anidar rutas dentro de una ruta principal, lo que permite una estructura más lógica y modular en aplicaciones con múltiples vistas o secciones.