import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Home } from "../cocktails/pages/Home";
import { Login } from "../auth/pages/Login";


export const AppRouter = () => {
    return (
        <BrowserRouter>
        <Routes>
          {/* Ruta para Home */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta para Login */}
          <Route path="/login" element={<Login />} />
  
          {/* Redirección de rutas no definidas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    )
}