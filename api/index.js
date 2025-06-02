const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

app.use(cors());

const windowNumbers = {
  p: [],
  f: [],
  e: [],
  r: []
};

const URLS = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand"
};

const typeMap = {
  prime: 'p',
  fibonacci: 'f',
  even: 'e',
  random: 'r'
};

app.get("/numbers/:type", async (req, res) => {
  const typeParam = req.params.type;
  const type = typeMap[typeParam];

  if (!type || !URLS[type]) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  const prevState = [...windowNumbers[type]];
  let newNumbers = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    try {
      const response = await axios.get(URLS[type], { signal: controller.signal });
      clearTimeout(timeoutId);
      newNumbers = response.data.numbers;
    } catch (error) {
      console.warn(` External API failed: ${error.message}, using mock data.`);
      newNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    }

    const combined = [...new Set([...windowNumbers[type], ...newNumbers])];

    if (combined.length > WINDOW_SIZE) {
      windowNumbers[type] = combined.slice(combined.length - WINDOW_SIZE);
    } else {
      windowNumbers[type] = combined;
    }

    const avg = windowNumbers[type].reduce((sum, num) => sum + num, 0) / windowNumbers[type].length;

    res.json({
      windowPrevState: prevState,
      windowCurrState: windowNumbers[type],
      numbers: newNumbers,
      avg: parseFloat(avg.toFixed(2)),
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});