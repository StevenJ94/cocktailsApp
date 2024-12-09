import React from 'react'

export const CardProduct = ({title, image, description, tipo}) => {
  return (
    <div className="card card-product-list d-flex flex-column justify-content-center align-items-center">
       <img src={tipo == 'c' ? image : `https://www.thecocktaildb.com/images/ingredients/${title}.png`} width="50" className="card-img-top my-3" alt="..."></img>
  <div className="card-body">
  <h5 className="card-title text-center w-100">{title}</h5>
    {/* <p className="card-text">{description ? description : 'No hay descripción'}</p> */}
  </div>
</div>    
  )
}
