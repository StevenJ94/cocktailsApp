import React from 'react'
import {  useNavigate } from "react-router";

export const CardProduct = ({title, image, description, tipo, id}) => {
  const navigate = useNavigate();


  /**
   * Navegar a la vista de detalle
   */
  const handleChange = () => {
      navigate(`/detalles/${tipo}/${title}/${id}`); 
  };

  return (    
    <div className="card card-product-list text-center" onClick={() => {handleChange()}}>
       <img src={tipo == 'i' ? image : `https://www.thecocktaildb.com/images/ingredients/${title}.png`} width="50" className="card-img-top mb-3" alt="..."></img>
  <div className="card-body">
  <h5 className="card-title text-center w-100">{title}</h5>

  </div>
</div>    
  )
}
