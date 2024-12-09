import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router";

import logo from '../../assets/img/logo.png'

import '../styles/cocktailsStyle.css'

import axiosInstance from '../../axiosInstance';
import appFirebase from '../../credenciales'
import { getAuth, signOut } from 'firebase/auth'
import AsyncSelect from 'react-select/async';


const auth = getAuth(appFirebase);


export const Home = ({correoUsuario}) => {
  const navigate = useNavigate();
  /**
   * Loading 
   */
  const [loading, setLoading] = useState(false); 

  /**
   * Función para cargar opciones desde la API
   */
  const loadOptions = async (inputValue) => {
    if (!inputValue) return []; // Si no hay texto, no buscar
    setLoading(true); // Activar loading
    try {
      const response = await axiosInstance.get(`search.php?s=${inputValue}`);
      const results = response.data.drinks; // Ajusta esto según tu API
      console.log(results);
      return results.map((item) => ({
        value: item.idDrink, // Valor del item
        label: item.strDrink, // Texto que se muestra
      }));
    } catch (error) {
      console.error('Error al cargar opciones:', error);
      return [];
    } finally {
      setLoading(false); // Desactivar loading
    }
  };

  /**
   * Navegar a la vista de detalle
   */
  const handleChange = (selectedOption) => {
    if (selectedOption) {
      const nombre = selectedOption.label; 
      const id = selectedOption.value; 
      navigate(`/detalles/${'i'}/${nombre}/${id}`); 
    }
  };

  
  return (
    <>
    <div className="contenedor">
    <nav className="navbar navbar-expand-lg ">
  <div className="container-fluid mx-md-5">
    <button className='btn bg-transparent p-0 m-0' onClick={() => {navigate('')}}>
  <img src={logo} alt="" width={70}/>
    </button>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <button className='btn bg-transparent' onClick={() => {navigate('')}}>
          Inicio
          </button>
       </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Perfil
          </a>
          <ul className="dropdown-menu p-3">
            <li><p className="mb-0 fw-semibold">
              <span className='text-primary'>
              Correo:
              </span> {correoUsuario}</p></li>
            <li className='d-flex justify-content-center mt-2'><button className="btn btn-primary" onClick={() => {signOut(auth)}}>Cerrar sesión</button></li>
          </ul>
        </li>

      </ul>
      <div className="d-flex">

      </div>
      <form className="d-flex flex-column" role="search">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions} // Función para cargar opciones
        defaultOptions // Muestra opciones predeterminadas al cargar
        onChange={handleChange} // Maneja selección
        placeholder="Buscar cócteles"
        isLoading={loading} // Indicador de carga
        noOptionsMessage={() => "Sin resultados"
      }
      />

      </form>
    </div>
  </div>
    </nav>
    <div className="">
    <Outlet />
    </div>

    </div>
    </>
  )
}
