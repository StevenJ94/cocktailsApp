import React, { useState } from 'react'
import '../styles/styleLogin.css'

export const Login = () => {

  /**
   * Se usa el useState para crear el estado del formulario y sus valores iniciales
   */
const [formData, setFormData] = useState(
  {
    username: '',
    password: ''
  }
);

/**
 * Luego se crea la función al usar un input
 */
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

/**
 * Esta es la función que permite llamar a la ruta
 */
const handleSubmit = async (e) => {
  e.preventDefault(); // Evita la recarga de la página
  try {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        expiresInMins: 30, 
      }),
      credentials: 'include', // Incluye cookies
    });

    const data = await response.json();
    console.log(data);

    // Maneja la respuesta
    if (response.ok) {
      alert('Login successful!');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
    <>
      <div className=" vh-100 d-flex justify-content-center align-items-center">
      <div class="card carta col-md-6 col-10 col-lg-3">
  <div class="card-body">


  <form className='form-group d-flex flex-column gap-4'  onSubmit={handleSubmit}>
    <div className="d-flex flex-column">
        <label htmlFor="" className='fw-semibold'>Usuario</label>
        <input type="text" className='form-control'  name="username"
          value={formData.username}
          onChange={handleChange}
          required placeholder='emilys'/>
    </div>
    <div className="d-flex flex-column">
        <label htmlFor="" className='fw-semibold'>Contraseña</label>
        <input type="password" className='form-control' name="password"
          value={formData.password}
          onChange={handleChange}
          required placeholder='emilyspass'/>
    </div>
    <div className="d-flex justify-content-center">
    <button className='btn btn-primary' type='submit'>
      Iniciar sesión
    </button>             
    </div>
  </form>
  </div>
</div>
      </div>
    </>
  )
}
