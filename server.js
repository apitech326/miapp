const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/corregir', async (req, res) => {
  const texto = req.body.texto;

  try {
    const respuesta = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',
        messages: [{ role: 'user', content: `Corrige ortografía, gramática y redacción del siguiente texto. Devuelve solo el texto corregido, sin comentarios:\n\n${texto}` }]
      })
    });

    const data = await respuesta.json();
    res.json({ resultado: data.choices?.[0]?.message?.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al conectar con OpenRouter' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
