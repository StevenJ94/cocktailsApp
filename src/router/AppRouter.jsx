import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Home } from "../cocktails/pages/Home";
import { Login } from "../auth/pages/Login";

// Importar Firebase y herramientas necesarias
//@ts-ignore
import appFirebase from '../credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

const auth = getAuth(appFirebase);

export const AppRouter = () => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUser(usuarioFirebase);
      } else {
        setUser(null);
      }
      // Aquí verifico si está la autenticación 
      setCheckingAuth(false);
    });

    // Limpieza del efecto
    return () => unsubscribe();
  }, []);

  // Esto es para mostrar mientras carga la petición del firebase
  if (checkingAuth) {
    return <div className='vh-100 d-flex justify-content-center align-items-center'>
      <div className="text-center">
        <h3>
        Cargando...
        </h3>
      <div class="spinner-border text-primary mt-2" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
      </div>
      </div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para Home */}
        <Route
          path="/"
          element={user ? <Home correoUsuario={user.email} nombreUsuario={user.displayName} /> : <Navigate to="/login" replace />}
        />

        {/* Ruta para Login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Redirección de rutas no definidas */}
        <Route
          path="*"
          element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};