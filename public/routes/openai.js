const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST /gerar-tarefa
router.post("/gerar-tarefa", async (req, res) => {
  const { tema } = req.body;

  if (!tema) return res.status(400).json({ erro: "Tema é obrigatório." });

  try {
    const resposta = await openai.createChatCompletion({
      model: "gpt-4", // ou gpt-3.5-turbo se quiser mais rápido/barato
      messages: [
        { role: "system", content: "Você é um assistente que sugere tarefas úteis e criativas." },
        { role: "user", content: `Me dê 5 tarefas úteis relacionadas a: ${tema}` },
      ],
      temperature: 0.7,
    });

    const texto = resposta.data.choices[0].message.content;
    const tarefas = texto.split(/\d\.\s/).filter(t => t.trim() !== ""); // divide em lista
    res.json({ tarefas });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ erro: "Erro ao gerar tarefas com IA." });
  }
});

module.exports = router;
