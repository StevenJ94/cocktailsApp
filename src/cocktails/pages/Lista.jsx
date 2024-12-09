import { useEffect, useState } from 'react';
import React from 'react'

import axiosInstance from '../../axiosInstance'

import { Filtros } from '../components/Filtros';
import { CardProduct } from '../components/cardProduct';
import { useSearchParams } from 'react-router'


export const Lista = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
  }
}


  useEffect(() => {
    getDatosFiltrados();
  }, [categoria, vaso, ingrediente, alcohol]);

  useEffect(() => {
  }, [listDatosFiltrados]);

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
      let arrayCocktailsPopular = []
      let arrayCocktailsRandom = []
      let arrayIngredientPopular = []
      let arrayIngredientRandom = []
      for (let i = 0; i < 8; i++) {
        const responseCocktails = await axiosInstance.get('random.php');
        const responseInredients = await axiosInstance.get(`lookup.php?iid=${Math.floor(Math.random() * 50)}`);
        // Hago una validación para cuando sean 4 productos, los divido, para llamar menos veces la ruta ya que se está usando la random
        if (i < 4) {
          arrayCocktailsPopular.push(responseCocktails.data.drinks[0])
          arrayIngredientPopular.push(responseInredients.data.ingredients[0])
        } else {
          arrayCocktailsRandom.push(responseCocktails.data.drinks[0])
          arrayIngredientRandom.push(responseInredients.data.ingredients[0])
          
        }
      }
      // console.log(arrayCocktails);
      setlistPopularsCocktails(arrayCocktailsPopular);
      setlistRandomsCocktails(arrayCocktailsRandom);
      setlistPopularsIngredients(arrayIngredientPopular);
      setlistRandomsIngredients(arrayIngredientRandom);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

useEffect(() => {
  getArrayFiltros();
  getDataCocktails();
}, []);

// Escuchar cambios en listPopularsCocktails
  useEffect(() => {
    if (listPopularsCocktails) {
      setLoading(false)
    }
  }, [listPopularsCocktails]); // Este useEffect solo se ejecuta cuando listPopularsCocktails cambia

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
      { listDatosFiltrados &&   
    <div className="cocteles-filtrados mx-md-0 mx-4">
    <h1 className="mb-2">Resultado de filtros</h1>
    <hr />
    <div className="row">
      { listDatosFiltrados.length > 0 && listDatosFiltrados.map((cocktail, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={cocktail.strDrink}
              image={cocktail.strDrinkThumb}
              description={cocktail.strInstructions}
              tipo={'c'}
            />
          </div>
        ))}
        {
          listDatosFiltrados.length == 0 &&
          <h3 className="mb-2 text-muted">No hubo resultados</h3>
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
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={cocktail.strDrink}
              image={cocktail.strDrinkThumb}
              description={cocktail.strInstructions}
              tipo={'c'}
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
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={cocktail.strDrink}
              image={cocktail.strDrinkThumb}
              description={cocktail.strInstructions}
              tipo={'c'}
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
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={ingredient.strIngredient}
              image={ingredient.strIngredient}
              description={ingredient.strDescription}
              tipo={'i'}
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
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={ingredient.strIngredient}
              image={ingredient.strIngredient}
              description={ingredient.strDescription}
              tipo={'i'}
            />
          </div>
        ))}
    </div>
    </div>
  </div>
    </div>
  )
}
