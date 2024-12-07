import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Home } from "../cocktails/pages/Home";
import { Login } from "../auth/pages/Login";


// Voy a importar todo lo relacionado a firebase
//@ts-ignore
import appFirebase from '../credenciales'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
 const auth = getAuth(appFirebase);


export const AppRouter = () => {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
        setUser(usuarioFirebase)
    } else {
      setUser(null)
    }
  })

    return (
        <BrowserRouter>
        <Routes>
          {/* Ruta para Home */}
          <Route path="/" element={ user ? <Home correoUsuario={user.email} /> : <Navigate to="/login" replace /> }/>
          
          {/* Ruta para Login */}
          <Route path="/login" element={ user ? <Navigate to="/" replace /> : <Login/> }/>
  
          {/* Redirección de rutas no definidas */}
          <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    )
}