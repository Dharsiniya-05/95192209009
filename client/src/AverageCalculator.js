import React, { useState } from 'react';
import axios from 'axios';

const AverageCalculator = () => {
  const [average, setAverage] = useState(null);
  const [window, setWindow] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAverage = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9876/numbers/${type}`);
      setAverage(res.data.avg);
      setWindow(res.data.windowCurrState);
    } catch (error) {
      alert('Error fetching data');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Average Calculator</h2>
      <div>
        <button onClick={() => fetchAverage('prime')}>Prime Numbers</button>
        <button onClick={() => fetchAverage('fibonacci')}>Fibonacci Numbers</button>
        <button onClick={() => fetchAverage('even')}>Even Numbers</button>
        <button onClick={() => fetchAverage('random')}>Random Numbers</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Average: {average !== null ? average.toFixed(2) : '-'}</p>
          <p>Sliding Window: {window.length ? window.join(', ') : '-'}</p>
        </>
      )}
    </div>
  );
};

export default AverageCalculator;