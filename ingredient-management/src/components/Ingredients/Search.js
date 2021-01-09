import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');

  useEffect(() => {
    console.log('<Search> re-render demo');
  })

  useEffect(() => {
    console.log('<Search> re-render load ingredients');
    const query = filter.length === 0
      ? ''
      : `?orderBy="title"&equalTo="${filter}"`;
    fetch('https://react-hooks-udpate-d7642-default-rtdb.firebaseio.com/ingredients.json' + query)
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

        onLoadIngredients(loadedIngredients);
      });
  }, [filter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
