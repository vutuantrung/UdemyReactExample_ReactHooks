import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === inputRef.current) {
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
      }
    }, 500);

    // It's a function that will run right before thisa same useEffect functional run next time
    // So not often this function is done, but before the next time it will run
    return () => {
      // Clear up the previous timer before the new effect is applied
      clearTimeout(timer);
    }
  }, [filter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
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
