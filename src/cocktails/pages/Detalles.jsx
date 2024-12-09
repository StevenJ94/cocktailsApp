import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'


import axiosInstance from '../../axiosInstance';


export const Detalles = () => {
   /**
   * Variable de loading
   */
   const [loading, setLoading] = useState(true);
  
  const { tipo, nombre, id } = useParams(); // Extraer los parámetros de la URL
  const [detalles, setdetalles] = useState(null);

const getDetalles = async () => {
  console.log('a');
  setLoading(false);
  const detalles = await axiosInstance.get(`lookup.php?${tipo}=${id}`);
  setdetalles(detalles.data.drinks)
}

useEffect(() => {
  getDetalles()
}, []);

useEffect(() => {
  setLoading(false);
  console.log(detalles);
}, [detalles]);


// Esto es para mostrar mientras carga la petición del firebase
if (loading) {
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
     <div className="container mt-4">
      <h1>Detalles</h1>
      <p>
        <strong>Tipo:</strong> {tipo}
      </p>
      <p>
        <strong>Nombre:</strong> {nombre}
      </p>
      <p>
        <strong>Id:</strong> {id}
      </p>
    </div>
  )
}
