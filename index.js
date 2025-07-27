require("dotenv").config();
const express = require("express");
const mqtt = require("mqtt");
const axios = require("axios");

// --- Configurações ---
const PORT = process.env.PORT || 3000;
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_TOPIC = process.env.MQTT_TOPIC;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (
  !MQTT_BROKER_URL ||
  !MQTT_TOPIC ||
  !TELEGRAM_BOT_TOKEN ||
  !TELEGRAM_CHAT_ID
) {
  console.error(
    "Erro: Verifique se todas as variáveis de ambiente estão definidas no arquivo .env"
  );
  process.exit(1);
}

// --- Servidor Express para status ---
const app = express();
app.get("/status", (req, res) => {
  res.json({ status: "Rodando", mqtt_topic: MQTT_TOPIC });
});

app.listen(PORT, () => {
  console.log(`Servidor de status rodando na porta ${PORT}`);
});

// --- Cliente MQTT ---
console.log(`Conectando ao broker MQTT em ${MQTT_BROKER_URL}`);
const client = mqtt.connect(MQTT_BROKER_URL);

client.on("connect", () => {
  console.log("Conectado ao broker MQTT!");
  client.subscribe(MQTT_TOPIC, (err) => {
    if (!err) {
      console.log(`Inscrito com sucesso no tópico: "${MQTT_TOPIC}"`);
    } else {
      console.error("Erro ao se inscrever no tópico:", err);
    }
  });
});

client.on("message", (topic, message) => {
  const payload = message.toString();
  console.log(`Mensagem recebida do tópico "${topic}": ${payload}`);
  if (payload.length > 1) {
    console.log("Mensagem inválida");
    return;
  }
  if (payload === "1") {
    sendMessageToTelegram("Alguém está na porta!");
  }
});

client.on("error", (error) => {
  console.error("Erro no cliente MQTT:", error);
  client.end();
});

async function sendMessageToTelegram(text) {
  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  console.log("Enviando mensagem para o Telegram...");
  try {
    const response = await axios.post(telegramApiUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: "Markdown",
    });
    console.log("Mensagem enviada com sucesso ao Telegram:", response.data.ok);
  } catch (error) {
    console.error(
      "Erro ao enviar mensagem para o Telegram:",
      error.response ? error.response.data : error.message
    );
  }
}
