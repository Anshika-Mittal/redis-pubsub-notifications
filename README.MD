# Redis Pub/Sub Notification System

A simple real-time notification system built using **Node.js, Express.js, and Redis Pub/Sub**. It demonstrates how one service can publish notifications to a Redis channel and another service can subscribe to that channel and receive messages.

## 🚀 Features

- **Publish Notifications:** Send notifications through a REST API.
- **Real-Time Messaging:** Redis Pub/Sub delivers messages to active subscribers.
- **Default Values:** Uses a default notification title if none is provided.
- **Timestamping:** Adds an ISO-formatted creation timestamp to every notification.
- **Separate Publisher and Subscriber:** Demonstrates communication between independent services.

## 🛠️ Tech Stack

- Node.js
- Express.js
- Redis
- ioredis

## Project Structure

```text
redis-pubsub-notifications/
├── api.js          # Express API and Redis publisher
├── subscriber.js   # Redis subscriber
├── package.json
├── bun.lock        # If using Bun
├── .gitignore
└── README.md
```

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)
- Bun or npm

Redis must be running and accessible at `localhost:6379`, unless you configure a different Redis URL.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Anshika-Mittal/redis-pubsub-notifications.git
cd redis-pubsub-notifications
```


### 2. Install dependencies

Using Bun:

```bash
bun add express ioredis
```

Or using npm:

```bash
npm install express ioredis
```

Ensure your `package.json` includes `"type": "module"` because the project uses ES module imports.

### 3. Start Redis

Start your local Redis server. If Redis is installed locally, you can commonly run:

```bash
redis-server
```

Verify the connection using:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

### 4. Configure the Redis URL (Optional)

The application defaults to:

```text
redis://localhost:6379
```

To use another Redis instance, set the `redisURL` environment variable.

For PowerShell:

```powershell
$env:redisURL="redis://localhost:6379"
```

For macOS/Linux:

```bash
export redisURL="redis://localhost:6379"
```

## ▶️ Running the Project

Run the publisher API and subscriber in **two separate terminals**.

### Terminal 1: Start the subscriber

```bash
node subscriber.js
```

Expected output:

```text
Subscribed
```

### Terminal 2: Start the API

```bash
node api.js
```

Expected output:

```text
Server listening on http://localhost:3000
```

## 🔌 API Documentation

### Publish a Notification

**Endpoint:** `POST /notification`

**Base URL:** `http://localhost:3000`

**Request Body:**

```json
{
  "title": "Your order has been shipped"
}
```

Send the request using Postman or cURL:

```bash
curl -X POST http://localhost:3000/notification \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Your order has been shipped\"}"
```

**Example Response:**

```json
{
  "message": "Published"
}
```

If `title` is omitted, the API uses `"Default title"`.

## 🔄 How It Works

1. A client sends a `POST /notification` request to the Express API.
2. The API creates a notification payload containing the title and creation timestamp.
3. The Redis publisher publishes the JSON-serialized payload to the `notifications` channel.
4. Redis forwards the message to clients currently subscribed to that channel.
5. The subscriber parses the JSON message and prints the notification to the console.

### Architecture

```text
Client
  |
  | POST /notification
  v
Express API (Publisher)
  |
  | PUBLISH notifications
  v
Redis Pub/Sub
  |
  | Message delivery
  v
Subscriber
  |
  v
Console Output
```

## 🧪 Example Output

After sending a notification while the subscriber is running, the subscriber terminal displays output similar to:

```text
Subscribed
Received on notifications : {
  title: 'Your order has been shipped',
  createdAt: '2026-10-25T08:30:00.000Z'
}
```

The timestamp is illustrative; the actual value is generated when the request is processed.

## 🧠 Redis Concepts Demonstrated

### 1. Publisher

The publisher sends a message to a named Redis channel:

```javascript
await publisher.publish("notifications", JSON.stringify(payload));
```

### 2. Subscriber

The subscriber registers interest in a channel:

```javascript
subscriber.subscribe("notifications");
```

It listens for incoming messages using:

```javascript
subscriber.on("message", (channel, message) => {
    console.log("Received on", channel, ":", JSON.parse(message));
});
```

### 3. Redis Pub/Sub

Redis Pub/Sub enables lightweight, real-time communication between independent services without requiring the publisher to know who the subscribers are.

**Important:** Redis Pub/Sub provides at-most-once delivery. If a subscriber is disconnected when a message is published, it will miss that message. Messages are not stored for later delivery.

## ⚠️ Important Notes

- At least one subscriber must be connected to receive a published message.
- The API's response confirms that the publish operation completed; it does not guarantee that a notification was processed by a subscriber.
- The number returned by Redis `PUBLISH` represents the number of clients that received the message. You can include this count in the API response if needed.
- This project demonstrates message delivery through Redis; it does not send emails, SMS messages, or push notifications.

## 🔮 Future Improvements

- Support multiple notification channels, such as `emails`, `orders`, and `alerts`.
- Add request validation and error handling.
- Return the number of subscribers that received each message.
- Use Redis Streams or a durable queue when messages must be retained and processed after a subscriber reconnects.
- Integrate an email, SMS, or push-notification provider.

## 📚 Learning Outcome

This project demonstrates how to implement **real-time, event-driven communication** using Redis Pub/Sub, including publishing JSON messages, subscribing to channels, and separating an API service from a message consumer.

---

**Author:** Anshika Mittal
