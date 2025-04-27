import { Link } from 'react-router-dom'; //crear enlaces de navegación, navegar entre rutas
import { useAuth } from '../context/AuthContext'; //importar el contexto de autenticación
//importar el hook useAuth para acceder a la información de autenticación del usuario

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-zinc-800 p-4 text-white flex justify-between items-center">
      {/* Logo o Título a la izquierda */}
      <Link to="/" className="font-bold text-xl text-white hover:text-gray-300 transition-colors">
        Gestor de Tareas
      </Link>

      {/* Menú a la derecha */}
      <ul className="flex space-x-4 items-center">
        {!isAuthenticated && (
          <>
            <li>
              <Link to="/login" className="hover:text-gray-300 transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-gray-300 transition-colors">
                Register
              </Link>
            </li>
          </>
        )}

        
        {isAuthenticated && (
          <>
             {user && (
               <li className="text-gray-400 text-sm"> 
                 Hola, {user.name || user.email}
               </li>
             )}
            
            <li>
              <Link to="/tasks" className="hover:text-gray-300 transition-colors">
                Mis Tareas
              </Link>
            </li>
             <li>
               <Link to="/add-task" className="hover:text-gray-300 transition-colors">
                 Añadir Tarea
               </Link>
             </li>
            <li>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition-colors"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;