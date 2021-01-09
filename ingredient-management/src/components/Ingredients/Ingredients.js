import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    console.log('<Ingredients> re-render');

    fetch('https://react-hooks-udpate-d7642-default-rtdb.firebaseio.com/ingredients.json')
      .then((res) => (res.json()))
      .then((resData) => {
        const loadedIngredients = [];
        for (const key in resData) {
          loadedIngredients.push({
            id: key,
            title: resData[key].title,
            amount: resData[key].amount,
          });
        }

        setIngredients(loadedIngredients);
      });
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-udpate-d7642-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        // Convert respons to json
        return res.json();
      })
      .then((resData) => {
        console.log('<Ingredients> fetch data');
        // Set the response data name as ingredient id
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: resData.name, ...ingredient }
        ]);
      });
  }

  console.log('create new filteredIngredientsHandler function object');

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, [])

  // const filteredIngredientsHandler = (filteredIngredients) => {
  //   setIngredients(filteredIngredients);
  // };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={() => { }}
        />
      </section>
    </div>
  );
}

export default Ingredients;
