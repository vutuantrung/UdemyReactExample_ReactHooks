import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
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
        // Set the response data name as ingredient id
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: resData.name, ...ingredient }
        ]);
      });
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={() => { }} />
      </section>
    </div>
  );
}

export default Ingredients;
