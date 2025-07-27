# API MQTT-Telegram Bridge

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white)

Este projeto é uma ponte (bridge) que conecta um broker MQTT a um bot do Telegram. Ele escuta mensagens em um tópico MQTT específico e, ao receber um sinal predefinido, envia uma notificação para um chat do Telegram.

É ideal para projetos de IoT e automação, como um sensor de porta que, ao ser ativado, envia um alerta para o seu celular.

## ✨ Funcionalidades

- **Ambiente Completo com Docker**: Inicia a aplicação e um broker MQTT (Mosquitto) com um único comando.
- **Notificações Telegram**: Envia mensagens para um chat específico do Telegram através de um bot.
- **Configuração Flexível**: Todas as chaves e endpoints são configurados via variáveis de ambiente.
- **Endpoint de Status**: Inclui um endpoint `/status` para verificar se o serviço está online.
- **Logging Estruturado**: Utiliza `pino` para logs legíveis e eficientes, com formatação especial para ambiente de desenvolvimento.

## 🔧 Pré-requisitos

Antes de começar, você vai precisar de:

- **Docker** e **Docker Compose**
- Um **Token de Bot do Telegram**. Crie um com o @BotFather.
- O **Chat ID** do chat do Telegram para onde as mensagens serão enviadas. Você pode obtê-lo com o @userinfobot.

## ⚙️ Instalação e Configuração

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/EmmanuelBMoraes/api-mqtt-telegram.git
    cd api-mqtt-telegram
    ```

2.  **Configure as variáveis de ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.

    ```bash
    cp .env.example .env
    ```

    Agora, edite o arquivo `.env` e preencha com suas credenciais do Telegram e ajuste o tópico MQTT.

## 🚀 Executando o Ambiente com Docker Compose

Com o Docker e o Docker Compose instalados, você pode iniciar a aplicação e o broker MQTT com um único comando.

```bash
# O argumento -d executa os contêineres em segundo plano (detached mode)
docker-compose up -d
```

O serviço será construído e iniciado em segundo plano. Para visualizar os logs, use:

```bash
docker-compose logs -f
```

Para parar o serviço, execute:

```bash
docker-compose down
```

## 🚦 Como Funciona

1.  A aplicação se conecta ao broker MQTT e se inscreve no tópico definido em `MQTT_TOPIC`.
2.  Ela fica aguardando por mensagens. O código atual está configurado para reagir a uma mensagem com payload `1`.
3.  Ao receber a mensagem `1` no tópico, a aplicação formata a notificação "Alguém está na porta!" e a envia para a API do Telegram.
4.  A mensagem aparece no chat do Telegram configurado.

### Testando o fluxo

Você pode usar um cliente MQTT (como MQTTX ou o comando `mosquitto_pub`) para publicar uma mensagem no tópico e testar o fluxo:

```bash
# Exemplo com mosquitto_pub
mosquitto_pub -h test.mosquitto.org -t "casa/porta/sensor" -m "1"
```

## 🌐 Endpoint da API

A aplicação expõe um endpoint HTTP para verificação de status:

#### `GET /status`

Retorna o status da aplicação e o tópico MQTT que está sendo monitorado.

**Resposta de Sucesso (200 OK):**

```json
{
  "status": "Rodando",
  "mqtt_topic": "casa/porta/sensor"
}
```
