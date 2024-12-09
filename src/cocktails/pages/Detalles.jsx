import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import ReactPaginate from 'react-paginate';
import axiosInstance from '../../axiosInstance';


export const Detalles = () => {
   /**
   * Variable de loading
   */
   const [loading, setLoading] = useState(true);

   const [currentItems, setCurrentItems] = useState([]);
   const [pageCount, setPageCount] = useState(0);
   const [itemOffset, setItemOffset] = useState(0);
   const [itemsPerPage, setItemsPerPage] = useState(6); // Valor por defecto

   const updateItemsPerPage = () => {
     if (window.matchMedia('(max-width: 576px)').matches) {
       // Para pantallas móviles (por debajo de 576px)
       setItemsPerPage(1);
     } else if (window.matchMedia('(min-width: 577px) and (max-width: 768px)').matches) {
       // Para tablets (576px a 768px)
       setItemsPerPage(4);
       
     } else if (window.matchMedia('(min-width: 769px) and (max-width: 1200px)').matches) {
       // Para laptops (769px a 1200px)
       setItemsPerPage(6);
     } 
   };
 
   useEffect(() => {
     updateItemsPerPage(); // Actualiza al cargar la página
     window.addEventListener('resize', updateItemsPerPage); // Actualiza al redimensionar
     return () => {
       window.removeEventListener('resize', updateItemsPerPage); // Limpieza del evento
     };
   }, [itemOffset, itemsPerPage]);

   


  
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
  } else {
    const arrayCockteles = await axiosInstance.get(`filter.php?i=${detalles.data.ingredients[0].strIngredient}`);
    setingredientesCocteles(arrayCockteles.data.drinks)
  }
}

useEffect(() => {
  getDetalles()
}, []);

useEffect(() => {
  if (detalles) {
    console.log(ingredientesCocteles);
    setLoading(false);
  }
}, [detalles]);

 /**
   * función de la paginación
   */
 useEffect(() => {
  if (ingredientesCocteles && ingredientesCocteles.length > 0 && tipo === 'iid') {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(ingredientesCocteles.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(ingredientesCocteles.length / itemsPerPage));
  }  else {
    setCurrentItems([]); 
    setPageCount(0);  // Resetea el número de páginas
  }
}, [itemOffset, itemsPerPage, ingredientesCocteles]);

const handlePageClick = (event) => {
  const newOffset = (event.selected * itemsPerPage) % ingredientesCocteles.length;
  setItemOffset(newOffset);
};



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
        <div className="d-flex flex-column  text-start col-lg-3 col-12 justify-content-lg-start justify-content-center align-items-center">
        <img className='p-0 img-thumbnail' src={tipo === 'i' ? detalles.strDrinkThumb : `https://www.thecocktaildb.com/images/ingredients/${detalles.strIngredient}.png`} alt="" />
        </div>
        <div className="d-flex flex-column text-start col-lg-8 col-12 ">
          {
            tipo === 'i' &&
            <div className="d-flex flex-column justify-content-start mt-md-0 mt-2">
              <div className="">
                  <h1 className=''>
            {detalles.strDrink}
          </h1>
          <hr />
              </div>
              <div className="form-group mt-md-0 mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Categoría:
                </p>
                <p className='mb-0 detalles-datos-text'>
                  {detalles.strCategory}
                </p>
              </div>
              <div className="form-group mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Alcohol:
                </p>
                <p className='mb-0 detalles-datos-text'>
                  {detalles.strAlcoholic === 'Alcoholic' ? 'Contiene alcohol': 'No contiene alcohol'}
                </p>
              </div>
              <div className="form-group mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Tipo de vaso:
                </p>
                <p className='mb-0 detalles-datos-text'>
                  {detalles.strGlass}
                </p>
              </div>
              <div className="form-group mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  instrucciones:
                </p>
                <p className='mb-0 detalles-datos-text'>
                  {detalles.strInstructionsES ? detalles.strInstructionsES : 'No hay instrucciones'}
                </p>
              </div>
            </div>
          }
           {
            tipo === 'iid' &&
            <div className="d-flex flex-column justify-content-start mt-md-0 mt-2">
              <div className="">
                  <h1 className=''>
            {detalles.strIngredient}
          </h1>
          <hr />
              </div>
              <div className="form-group mt-md-0 mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Tipo:
                </p>
                <p className='mb-0 detalles-datos-text'>
                  {detalles.strType}
                </p>
              </div>
              <div className="form-group mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Alcohol:
                </p>
                <p className='mb-0 detalles-datos-text'>
                  {detalles.strAlcohol === "Yes" ? 'Contiene alcohol': 'No contiene alcohol'}
                </p>
              </div>
              <div className="form-group mt-3">
                <p className='mb-0 fw-semibold semi-titulo'>
                  Descripción:
                </p>
                <p className='mb-0 detalles-datos-text'>
                  {detalles.strDescription ? detalles.strDescription : 'No hay descripción'}
                </p>
              </div>
            </div>
          }
        </div>
        {
          tipo === 'i' &&
        <div className="d-flex col-12 flex-column ">
          <h1>
            Ingredientes
          </h1>
          <hr />
          <div className="d-flex g-5 text-center flex-wrap justify-content-md-start justify-content-center">
          {ingredientesCocteles.map((res, index) => {
  return (
    <div key={index}>
      <div class="card-ingredientes card mx-md-2 mx-0 mt-4" >
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
          {
          (tipo === 'iid' && ingredientesCocteles) &&
        <div className="d-flex col-12 flex-column ">
          <h1>
            Cócteles que contienen este ingrediente
          </h1>
          <hr />
          <div className="d-flex text-center flex-wrap justify-content-sm-between justify-content-center ">
          {currentItems.map((res, index) => {
  return (
    <div key={index}>
      <div class="card-ingredientes card mx-md-2 mx-0 mt-4" >
  <img src={res.strDrinkThumb} class="card-img-top" alt="..." />
  <div class="card-body bg-secondary text-white">
    <p class="card-text">{res.strDrink}</p>
  </div>
</div>
    </div>
  );
})}
 <ReactPaginate
     breakLabel={null}
      nextLabel={null}
      onPageChange={handlePageClick}
      pageRangeDisplayed={4}
      pageCount={pageCount}
      previousLabel={null}
      renderOnZeroPageCount={null}
      className='estilos-paginacion col-12 mt-5'
    />
          </div>
        </div>
        }
      </div>
    )
  }
}
