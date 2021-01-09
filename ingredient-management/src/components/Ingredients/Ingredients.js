import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import ErrorModal from '../UI/ErrorModal';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get here');
  }
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not be reached!');
  }
}

const Ingredients = () => {

  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttpState] = useReducer(httpReducer, { loading: false, error: null });

  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

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

        dispatchIngredients({ type: 'SET', ingredients: loadedIngredients });
      });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    // dispatch http state to set value of isLoading
    dispatchHttpState({ type: 'SEND' });

    // post data to firebase
    fetch('https://react-hooks-udpate-d7642-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        dispatchHttpState({ type: 'RESPONSE' });
        // Convert respons to json
        return res.json();
      })
      .then((resData) => {
        console.log('<Ingredients> fetch data');
        // Set the response data name as ingredient id
        dispatchIngredients({ type: 'ADD', ingredient: { id: resData.name, ...ingredient } });
      });
  }, []);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setIngredients(filteredIngredients);
    dispatchIngredients({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const removeIngredientHandler = useCallback((ingredientId) => {
    dispatchHttpState({ type: 'SEND' });
    fetch(`https://react-hooks-udpate-d7642-default-rtdb.firebaseio.com/igredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then((res) => {
        dispatchHttpState({ type: 'RESPONSE' });
        dispatchIngredients({ type: 'DELETE', id: ingredientId });
      })
      .catch((err) => {
        dispatchHttpState({ type: 'ERROR', errorMessage: err.message });
      });
  }, []);

  const clearError = () => {
    dispatchHttpState({ type: 'CLEAR' });
  }

  const ingredientList = useMemo(() => (
    <IngredientList
      ingredients={ingredients}
      onRemoveItem={removeIngredientHandler}
    />
  ), [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
