import React, { useState, useEffect } from 'react'
import { useNavigate  } from 'react-router';
import Select from 'react-select';





export const Filtros = ({arrayCategorias, arrayVasos, arraryIngredientes, arrayAlcohol}) => {

    const navigate = useNavigate();


  /**
   * Variable de filtros seleccionados
   */
  const [formFilter, setSelectFilters] = useState({
    categoria: null,
    vaso: null,
    ingrediente: null,
    alcohol: null,
  });

  const { categoria, vaso, ingrediente, alcohol } = formFilter;

  /**
   * Función para manejar los cambios en los selectores
   */
  const handleChange = (selectedOption, actionMeta) => {
    const field = actionMeta.name;
    setSelectFilters((prev) => ({
      ...prev,
      [field]: selectedOption,
    }));
  };

  /**
   * Enviar campos a la URL
   */
  const setDataUrl = () => {
    const params = new URLSearchParams();
    Object.entries(formFilter).forEach(([key, value]) => {
      if (value) {
        params.set(key, Object.values(value)); 
      }
    });

    navigate({ search: params.toString() }, { replace: true }); 
  };



  /**
   * Escuchar cambios en formFilter y actualizar la URL
   */
  useEffect(() => {
    setDataUrl();
  }, [formFilter]);


  /**
   * Función para resetear un campo
   */
  const resetField = (field) => {
    setSelectFilters((res) => ({
      ...res,
      [field]: null,
    }));
  };

    return (
        <div className="p-4 filtros-container">
      <div className="form-group">
        <label className="fw-semibold mb-1">Filtrar por categoría:</label>
        <Select
          name="categoria" 
          value={categoria}
          options={arrayCategorias}
          getOptionLabel={(option) => option.strCategory}
          getOptionValue={(option) => option.strCategory}
          onChange={handleChange}
          placeholder="Seleccione una categoría"
        />
        <button
          className="btn btn-sm btn-secondary mt-2"
          onClick={() => resetField('categoria')}
        >
          Resetear filtro de tipo de Categoría
        </button>
      </div>

      <div className="form-group mt-4">
        <label className="fw-semibold mb-1">Filtrar por tipo de vaso:</label>
        <Select
          name="vaso" 
          value={vaso}
          options={arrayVasos}
          getOptionLabel={(option) => option.strGlass}
          getOptionValue={(option) => option.strGlass}
          onChange={handleChange}
          placeholder="Seleccione un tipo de vaso"
        />
        <button
          className="btn btn-sm btn-secondary mt-2"
          onClick={() => resetField('vaso')}
        >
          Resetear filtro de tipo de Vaso
        </button>
      </div>

      <div className="form-group mt-4">
        <label className="fw-semibold mb-1">Filtrar por ingredientes:</label>
        <Select
          name="ingrediente" 
          value={ingrediente}
          options={arraryIngredientes}
          getOptionLabel={(option) => option.strIngredient1}
          getOptionValue={(option) => option.strIngredient1}
          onChange={handleChange}
          placeholder="Seleccione un ingrediente"
        />
        <button
          className="btn btn-sm btn-secondary mt-2"
          onClick={() => resetField('ingrediente')}
        >
          Resetear filtro de tipo de Ingrediente
        </button>
      </div>

      <div className="form-group mt-4">
        <label className="fw-semibold mb-1">Filtrar por alcohol:</label>
        <Select
          name="alcohol" 
          value={alcohol}
          options={arrayAlcohol}
          getOptionLabel={(option) => option.strAlcoholic}
          getOptionValue={(option) => option.strAlcoholic}
          onChange={handleChange}
          placeholder="Seleccione una opción"
        />
        <button
          className="btn btn-sm btn-secondary mt-2"
          onClick={() => resetField('alcohol')}
        >
          Resetear filtro de tipo de Alcohol
        </button>
      </div>
    </div>

  )
}
