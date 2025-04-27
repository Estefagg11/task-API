import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; // Importamos BrowserRouter, Routes, Route y Outlet
import { AuthProvider } from './context/AuthContext'; // Proveedor de autenticación
import { TaskProvider } from './context/TaskContext'; // Proveedor de tareas

// Importamos las páginas
import TaskPage from './pages/TaskPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TaskFormPage from './pages/TaskFormPage';
import HomePage from './pages/HomePage';

// Importamos componentes
import ProtectedRoute from './components/ProtectedRoute'; // Componente para proteger rutas
import Navbar from './components/Navbar'; // Barra de navegación

function App() {
  return (
    <AuthProvider> {/* Proveedor de autenticación envuelve toda la aplicación */}
      <BrowserRouter> {/* Configuración de rutas con React Router */}
        <Navbar /> {/* Barra de navegación visible en todas las páginas */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path='/' element={<HomePage />} /> {/* Página de inicio */}
          <Route path='/login' element={<LoginPage />} /> {/* Página de inicio de sesión */}
          <Route path='/register' element={<RegisterPage />} /> {/* Página de registro */}

          {/*  Rutas Protegidas  */}
          <Route element={<ProtectedRoute />}> {/* Protegemos las rutas con autenticación */}
            <Route element={
              <TaskProvider> {/* Proveedor de tareas envuelve las rutas relacionadas con tareas */}
                <Outlet /> {/* Placeholder para renderizar rutas hijas */}
              </TaskProvider>
            }>
              {/* Rutas relacionadas con tareas */}
              <Route path='/tasks' element={<TaskPage />} /> {/* Página de lista de tareas */}
              <Route path='/add-task' element={<TaskFormPage />} /> {/* Página para crear una nueva tarea */}
              <Route path='/tasks/:id' element={<TaskFormPage />} /> {/* Página para editar una tarea */}
            </Route>
          </Route>

          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; // Exportamos el componente para usarlo en otras partes de la aplicación