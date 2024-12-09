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
  const [ingredientesCocteles, setingredientesCocteles] = useState(null);

const getDetalles = async () => {
  // console.log('a');
  setLoading(false);
  const detalles = await axiosInstance.get(`lookup.php?${tipo}=${id}`);
  console.log(detalles);
  setdetalles(tipo === 'i' ? detalles.data.drinks[0] : detalles.data.ingredients[0])
  if (tipo === 'i') {
    let arrayTemp = [];
    for (let i = 1; i < 15; i++) {
      if (!detalles.data.drinks[0][`strIngredient${i}`]) {
        break;
      }
      arrayTemp.push(detalles.data.drinks[0][`strIngredient${i}`])
    }
    console.log(arrayTemp);
    setingredientesCocteles(arrayTemp)
  }
}

useEffect(() => {
  getDetalles()
}, []);

useEffect(() => {
  if (detalles) {
    setLoading(false);
  }
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
  if (detalles && !loading) {    
    return (
      <div className=" d-flex flex-wrap justify-content-md-start justify-content-center gap-5 contenedor-detalle w-100 p-5">
        <div className="d-flex flex-column  text-start">
          <h2 className=''>
            {tipo === 'i' ? detalles.strDrink : detalles.strIngredient}
          </h2>
        <img className='p-0' src={tipo === 'i' ? detalles.strDrinkThumb : `https://www.thecocktaildb.com/images/ingredients/${detalles.strIngredient}.png`} alt="" />
        </div>
        <div className="d-flex flex-column text-start">
          {
            tipo === 'i' &&
            <div className="d-flex flex-column justify-content-center mt-md-5 mt-2">
              <div className="form-group mt-md-0 mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Categoría:
                </p>
                <p className='mb-0 text-muted'>
                  {detalles.strCategory}
                </p>
              </div>
              <div className="form-group mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Alcohol:
                </p>
                <p className='mb-0 text-muted'>
                  {detalles.strAlcoholic}
                </p>
              </div>
              <div className="form-group mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Tipo de vaso:
                </p>
                <p className='mb-0 text-muted'>
                  {detalles.strGlass}
                </p>
              </div>
              <div className="form-group mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  instrucciones:
                </p>
                <p className='mb-0 text-muted'>
                  {detalles.strInstructionsES}
                </p>
              </div>
            </div>
          }
        </div>
        {
          tipo === 'i' &&
        <div className="d-flex col-12 flex-column ">
          <h2>
            Ingredientes
          </h2>
          <div className="d-flex g-5 mt-2 text-center">
          {ingredientesCocteles.map((res, index) => {
  return (
    <div key={index}>
      <div class="card-ingredientes card mx-2" >
  <img src={`https://www.thecocktaildb.com/images/ingredients/${res}.png`} class="card-img-top my-2" alt="..." />
  <div class="card-body bg-secondary text-white">
    <p class="card-text">{res}</p>
  </div>
</div>

    </div>
  );
})}
          </div>
        </div>
        }
      </div>
    )
  }
}
