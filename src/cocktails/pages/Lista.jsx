import { useEffect, useState } from 'react';
import React from 'react'

import axiosInstance from '../../axiosInstance'

import { Filtros } from '../components/Filtros';
import { CardProduct } from '../components/cardProduct';


export const Lista = () => {
  const [listPopularsCocktails, setlistPopularsCocktails] = useState(null);
  const [listRandomsCocktails, setlistRandomsCocktails] = useState(null);
  const [listPopularsIngredients, setlistPopularsIngredients] = useState(null);
  const [listRandomsIngredients, setlistRandomsIngredients] = useState(null);
  const [loading, setLoading] = useState(true);
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
    for (let i = 0; i < 4; i++) {
      const responsePopularCocktails = await axiosInstance.get('api/json/v1/1/random.php');
      const responseRandomCocktails = await axiosInstance.get('api/json/v1/1/random.php');
      const responsePopularInredients = await axiosInstance.get(`api/json/v1/1/lookup.php?iid=${Math.floor(Math.random() * 50)}`);
      const responseRandomIngredients = await axiosInstance.get(`api/json/v1/1/lookup.php?iid=${Math.floor(Math.random() * 50)}`);
      arrayCocktailsPopular.push(responsePopularCocktails.data.drinks[0])
      arrayCocktailsRandom.push(responseRandomCocktails.data.drinks[0])
      arrayIngredientPopular.push(responsePopularInredients.data.ingredients[0])
      arrayIngredientRandom.push(responseRandomIngredients.data.ingredients[0])
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

useEffect(() => {
  getDataCocktails();
}, []);

// Escuchar cambios en listPopularsCocktails
  useEffect(() => {
    if (listPopularsCocktails) {
      console.log('Cocktails populares:', listPopularsCocktails);
      console.log('Cocktails Randoms:', listRandomsCocktails);
      console.log('Ingredientes populares:', listPopularsIngredients);
      console.log('Ingradientes Randoms:', listRandomsIngredients);
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
    <div className='d-flex p-0 m-0'>
     <div className='sidebar-web col-xl-2 col-lg-3 d-lg-block d-none shadow-lg'>
      <Filtros />
     </div>
    <div className="container m-4 col-sm">
    <div className="cocteles-populares">
    <h1 className="mb-4">Cocteles Populares</h1>
    <div className="row ">
      {listPopularsCocktails &&
        listPopularsCocktails.map((cocktail, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={cocktail.strDrink}
              image={cocktail.strDrinkThumb}
              description={cocktail.strInstructions}
            />
          </div>
        ))}
    </div>
    </div>
    <div className="cocteles-randoms">
    <h1 className="mb-4">Cocteles aleatorios</h1>
    <div className="row ">
      {listRandomsCocktails &&
        listRandomsCocktails.map((cocktail, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={cocktail.strDrink}
              image={cocktail.strDrinkThumb}
              description={cocktail.strInstructions}
            />
          </div>
        ))}
    </div>
    </div>
    <div className="ingredientes-populares">
    <h1 className="mb-4">Ingredientes Populares</h1>
    <div className="row ">
      {listPopularsIngredients &&
        listPopularsIngredients.map((ingredient, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={ingredient.strIngredient}
              image={ingredient.strIngredient}
              description={ingredient.strDescription}
            />
          </div>
        ))}
    </div>
    </div>
    <div className="ingredientes-randoms">
    <h1 className="mb-4">Igredientes aleatorios</h1>
    <div className="row ">
      {listRandomsIngredients &&
        listRandomsIngredients.map((ingredient, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <CardProduct
              title={ingredient.strIngredient}
              image={ingredient.strIngredient}
              description={ingredient.strDescription}
            />
          </div>
        ))}
    </div>
    </div>
  </div>
    </div>
  )
}
