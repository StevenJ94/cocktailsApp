import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router'
import React from 'react'
import ReactPaginate from 'react-paginate';

import axiosInstance from '../../axiosInstance'

import { Filtros } from '../components/Filtros';
import { CardProduct } from '../components/cardProduct';


export const Lista = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Valor por defecto

  const updateItemsPerPage = () => {
    if (window.matchMedia('(max-width: 576px)').matches) {
      // Para pantallas móviles (por debajo de 576px)
      setItemsPerPage(1);
    } else if (window.matchMedia('(min-width: 577px) and (max-width: 768px)').matches) {
      // Para tablets (576px a 768px)
      setItemsPerPage(4);
      
    } else if (window.matchMedia('(min-width: 769px) and (max-width: 1200px)').matches) {
      // Para laptops (769px a 1200px)
      setItemsPerPage(4);
    } 
  };

  useEffect(() => {
    updateItemsPerPage(); // Actualiza al cargar la página
    window.addEventListener('resize', updateItemsPerPage); // Actualiza al redimensionar
    return () => {
      window.removeEventListener('resize', updateItemsPerPage); // Limpieza del evento
    };
  }, [itemOffset, itemsPerPage]);

  /**
   * Variable para guardar el listado de datos filtrados
   */
  const [listDatosFiltrados, setlistDatosFiltrados] = useState();

  /**
   * Variables de los parametros de la url
   */
  const categoria = searchParams.get('categoria');
  const vaso = searchParams.get('vaso');
  const ingrediente = searchParams.get('ingrediente');
  const alcohol = searchParams.get('alcohol');

/**
 * Obtener datos filtrados
 */
  const getDatosFiltrados = async () => {
  if (categoria || vaso || ingrediente || alcohol) {
    const params = `${
    (categoria ? `?c=${categoria}` : '') +
    (vaso ? `${categoria ? '&' : '?'}g=${vaso}` : '') +
    (ingrediente ? `${categoria || vaso ? '&' : '?'}i=${ingrediente}`: '') +
    (alcohol ? `${categoria || vaso || ingrediente ? '&' : '?'}a=${alcohol}`: '') 
    }`;    
    const listaFiltados =  await axiosInstance.get(
      `filter.php${params}`
    );
    setlistDatosFiltrados(listaFiltados.data.drinks)
  } else {
    setlistDatosFiltrados(null)
  }
}

useEffect(() => {
  getDatosFiltrados();
}, [categoria, vaso, ingrediente, alcohol]);

  /**
   * función de la paginación
   */
  useEffect(() => {
    if (listDatosFiltrados && listDatosFiltrados.length > 0) {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(listDatosFiltrados.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(listDatosFiltrados.length / itemsPerPage));
    }  else {
      setCurrentItems([]); 
      setPageCount(0);  // Resetea el número de páginas
    }
  }, [itemOffset, itemsPerPage, listDatosFiltrados]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % listDatosFiltrados.length;
    setItemOffset(newOffset);
  };

  /**
   * Variables de los lisados iniciales (Randoms)
   */
  const [listPopularsCocktails, setlistPopularsCocktails] = useState(null);
  const [listRandomsCocktails, setlistRandomsCocktails] = useState(null);
  const [listPopularsIngredients, setlistPopularsIngredients] = useState(null);
  const [listRandomsIngredients, setlistRandomsIngredients] = useState(null);

  /**
   * Variables de los array para que se usen en los filtros
   */
  const [arrayCategoriasPadre, setarrayCategorias] = useState(null);
  const [arrayVasosPadre, setarrayVasos] = useState(null);
  const [arrayIngredientesPadre, setarrayIngredientes] = useState(null);
  const [arrayAlcoholPadre, setarrayAlcohol] = useState(null);  
  
  /**
   * Variable de loading
   */
  const [loading, setLoading] = useState(true);
  
  /**
   * En caso de error
   */
  const [error, setError] = useState(null);

/**
 * Función para obtener todos los cocteles randoms
 */
  const getDataCocktails = async () => {
    setLoading(true)
    try {
      const cocktailRequests = Array.from({ length: 8 }, () => axiosInstance.get('random.php'));
      const ingredientRequests = Array.from({ length: 8 }, () =>
      axiosInstance.get(`lookup.php?iid=${Math.floor(Math.random() * 50)}`)
      );
      const cocktailResponses = await Promise.all(cocktailRequests)
      const ingredientResponses = await Promise.all(ingredientRequests)
      await enviarDatosLista(cocktailResponses, ingredientResponses)
    } catch (err) {
      setError(err.message);
    } finally {

    }
  };

  /**
   * Función que hace la validación y organiza el array de los elementos aleatorios y populares
   */
  const enviarDatosLista = async (_cocktailResponses, _ingredientResponses) => {
    console.log(_cocktailResponses);
    console.log(_ingredientResponses);
    // Utilizo este try porque hay veces que el ingrediente que viene es null, por ende afecta el comportamiento de la carga de datos, esta validación solucciona esto pero quita ese elemento del array
    try {
      const arrayCocktailsPopular = await Promise.all(
        _cocktailResponses.slice(0, 4).map((res) => res?.data?.drinks?.[0] || null)
      );
      const arrayCocktailsRandom = await Promise.all(
        _cocktailResponses.slice(4).map((res) => res?.data?.drinks?.[0] || null)
      );
      const arrayIngredientPopular = await Promise.all(
        _ingredientResponses.slice(0, 4).map((res) => res?.data?.ingredients?.[0] || null)
      );
      const arrayIngredientRandom = await Promise.all(
        _ingredientResponses.slice(4).map((res) => res?.data?.ingredients?.[0] || null)
      );
        
      // Filtrar valores nulos o inválidos
      setlistPopularsCocktails(arrayCocktailsPopular.filter(Boolean));
      setlistRandomsCocktails(arrayCocktailsRandom.filter(Boolean));
      setlistPopularsIngredients(arrayIngredientPopular.filter(Boolean));
      setlistRandomsIngredients(arrayIngredientRandom.filter(Boolean));
    } catch (error) {
      console.error('Error procesando los datos:', error);
      setError('Hubo un problema al procesar los datos.');
    }
  }

 /**
  * Función para obtener los valores de los filtros de las rutas */ 
  const getArrayFiltros = async () => {
    const categorias = await axiosInstance.get('list.php?c=list');
    const vasos = await axiosInstance.get('list.php?g=list');
    const ingredientes = await axiosInstance.get('list.php?i=list');
    const alcohol = await axiosInstance.get('list.php?a=list');
    if (categorias && vasos && ingredientes && alcohol) {
      setarrayCategorias(categorias.data.drinks)
      setarrayVasos(vasos.data.drinks)
      setarrayIngredientes(ingredientes.data.drinks)
      setarrayAlcohol(alcohol.data.drinks)
    }
}

/**
 * al inicializar la vista, se cargan estos datos
 */
useEffect(() => {
  getArrayFiltros();
  getDataCocktails();
}, []);

/*
 Escuchar cambios en listPopularsCocktails 
*/
useEffect(() => {
  if (
    listPopularsCocktails &&
    listRandomsCocktails &&
    listPopularsIngredients &&
    listRandomsIngredients
  ) {
    setLoading(false);
  }
}, [
  listPopularsCocktails,
  listRandomsCocktails,
  listPopularsIngredients,
  listRandomsIngredients,
]);

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
      <div className='d-flex p-0 m-0 contenedor-padre'>
       <div className='sidebar-web col-xl-2 col-lg-3 d-lg-block d-none shadow-lg'>
        <Filtros arrayCategorias={arrayCategoriasPadre} arrayVasos={arrayVasosPadre} arraryIngredientes={arrayIngredientesPadre} arrayAlcohol={arrayAlcoholPadre}/>
       </div>
      <div className="my-5 w-100 px-md-5 px-0 contenedor-lista">
        <div className="d-lg-none d-block">
        <button class="btn btn-primary mb-4 mx-lg-0 mx-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
 Filtros
</button>
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Filtros</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
  <Filtros arrayCategorias={arrayCategoriasPadre} arrayVasos={arrayVasosPadre} arraryIngredientes={arrayIngredientesPadre} arrayAlcohol={arrayAlcoholPadre}/>
  </div>
</div>
        </div>
        { listDatosFiltrados &&   
      <div className="cocteles-filtrados mx-md-0 mx-4">
      <h1 className="mb-2">Resultado de filtros</h1>
      <hr />
      <div className="row">
        {  currentItems.map((cocktail, index) => (
            <div className="col-md-3 mb-4 d-flex justify-content-center" key={index}>
              <CardProduct
                title={cocktail.strDrink}
                image={cocktail.strDrinkThumb}
                description={cocktail.strInstructions}
                tipo={'i'}
                id={cocktail.idDrink}
              />
            </div>
          ))}
          { listDatosFiltrados.length > 0 &&
     
            <ReactPaginate
    
            breakLabel={null}
            nextLabel={null}
      onPageChange={handlePageClick}
      pageRangeDisplayed={4}
      pageCount={pageCount}
      previousLabel={null}
      renderOnZeroPageCount={null}
      className='estilos-paginacion'
    />
  
          }
          {
            listDatosFiltrados.length == 0 &&
            <h3 className="mb-5 text-muted w-100 text-center">No hay resultados</h3>
          }
      </div>
      </div>
        }
      <div className="cocteles-populares mx-md-0 mx-4">
      <h1 className="mb-2">Cócteles Populares</h1>
      <hr />
      <div className="row">
        {listPopularsCocktails &&
          listPopularsCocktails.map((cocktail, index) => (
            <div className="col-md-3 mb-4 d-flex justify-content-center" key={index}>
              <CardProduct
                title={cocktail.strDrink}
                image={cocktail.strDrinkThumb}
                description={cocktail.strInstructions}
                tipo={'i'}
                id={cocktail.idDrink}
              />
            </div>
          ))}
      </div>
      </div>
      <div className="cocteles-randoms mx-md-0 mx-4">
      <h1 className="mb-2">Cócteles aleatorios</h1>
      <hr />
      <div className="row ">
        {listRandomsCocktails &&
          listRandomsCocktails.map((cocktail, index) => (
            <div className="col-md-3 mb-4 d-flex justify-content-center" key={index}>
              <CardProduct
                title={cocktail.strDrink}
                image={cocktail.strDrinkThumb}
                description={cocktail.strInstructions}
                tipo={'i'}
                id={cocktail.idDrink}
              />
            </div>
          ))}
      </div>
      </div>
      <div className="ingredientes-populares mx-md-0 mx-4">
      <h1 className="mb-2">Ingredientes Populares</h1>
      <hr />
      <div className="row ">
        {listPopularsIngredients &&
          listPopularsIngredients.map((ingredient, index) => (
            <div className="col-md-3 mb-4 d-flex justify-content-center" key={index}>
              <CardProduct
                title={ingredient.strIngredient}
                image={ingredient.strIngredient}
                description={ingredient.strDescription}
                tipo={'iid'}
                id={ingredient.idIngredient}
              />
            </div>
          ))}
      </div>
      </div>
      <div className="ingredientes-randoms mx-md-0 mx-4">
      <h1 className="mb-2">Igredientes aleatorios</h1>
      <hr />
      <div className="row ">
        {listRandomsIngredients &&
          listRandomsIngredients.map((ingredient, index) => (
            <div className="col-md-3 mb-4 d-flex justify-content-center" key={index}>
              <CardProduct
                title={ingredient.strIngredient}
                image={ingredient.strIngredient}
                description={ingredient.strDescription}
                tipo={'iid'}
                id={ingredient.idIngredient}
              />
            </div>
          ))}
      </div>
      </div>
    </div>
      </div>
    )
}
