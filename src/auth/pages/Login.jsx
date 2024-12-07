import React, { useState } from 'react'
import '../styles/styleLogin.css'
import logo from '../../assets/img/logo.png'
import appFirebase from '../../credenciales'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth(appFirebase);

export const Login = () => {

  /**
   * Se usa el useState para crear el estado del formulario y sus valores iniciales
   */
const [formData, setFormData] = useState(
  {
    email: '',
    password: ''
  }
);


/**
 * Estado para saber si estoy iniciando sesión o me estoy registrando
 */
const [session, setSession] = useState(true);

/**
 * Función para cambiar el estado de registro o iniciar sesión
 */
const handleChangeStateSession = (e) => {
  setSession(!session);
  setFormData({    
      email: '',
      password: ''    
  })
}

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
  const {email, password} = formData;
  e.preventDefault();
  try {
    // Si session es false, quiere decir que será registro de usuario
    if (!session) {
      await createUserWithEmailAndPassword(auth, email, password)
    } else {      
      await signInWithEmailAndPassword(auth, email, password)
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
    <>
    <div className="d-flex  vh-100 ">
    <div className="col-md-7 d-md-block d-none fondo">
    </div>
      <div className="container d-flex flex-column justify-content-center align-items-center col-md-5 col-12">
        <div className="">
          <img src={logo} alt="" width={300}/>
        </div>
        <h1>
          {session ? 'Inicia sesión' : 'Registrarme'}
          
        </h1>
  <form className='form-group d-flex flex-column w-md-50 w-75'  onSubmit={handleSubmit}>
  <div class="form-floating mb-3">
  <input type="email" class="form-control" id="email"  name="email"
          value={formData.email}
          onChange={handleChange}         
          required placeholder='adminCocktails@gmail.com'/>
  <label for="email">Correo</label>
</div>
<div class="form-floating mb-3">
  <input type="password" class="form-control" id="password" name="password"
          value={formData.password}
          onChange={handleChange}
          required placeholder='admin123456' />
  <label for="password">Contraseña</label>
</div>

    <div className="d-flex justify-content-center">
    <button className='btn btn-primary' type='submit'>
    {session ? 'Iniciar sesión' : 'Registrarme'}

    </button>             
    </div>
  </form>
      </div>
      <div className="position-absolute change p-3">
        <p className='mb-0'>
          {session ? '¿No tienes un usuario? ' : '¿Ya tienes una cuenta?'}
          
        <button className='btn bg-transparent mb-1 text-primary fw-semibold' onClick={handleChangeStateSession}>
        {session ? ' Registrarte ' : 'Iniciar sesión'}
       
          </button>
        </p>
    </div>
    </div>
    </>
  )
}
