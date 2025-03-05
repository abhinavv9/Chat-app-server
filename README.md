# Node.js Express Socket.io PostgreSQL Chat Application

This project is a backend service built using Node.js, Express, Socket.io for real-time communication, and PostgreSQL as the database. It follows a modular architecture, making it scalable and maintainable.

## Features

1. **User Authentication**
   - JWT-based authentication.
   - Users can register and log in.
   - Secure API access with JWT middleware.

2. **Real-Time Chat**
   - One-to-one and group messaging.
   - Real-time messaging using Socket.io.
   - Chat history stored in PostgreSQL.
   - Users can create groups and invite others.

3. **File Attachments**
   - Users can send/receive PDF, JPEG, and PNG files.
   - AWS S3 is used for file storage.
   - File metadata (URL, type, sender) is saved in the database.

## API Endpoints

- **User Management**
  - `POST /auth/register` - Register a user
  - `POST /auth/login` - Authenticate user
  - `GET /users` - Get users (JWT protected)

- **Chat Functionality**
  - `POST /chats/send-message` - Send a message
  - `GET /chats/:chatId` - Fetch chat history

- **Group Management**
  - `POST /groups` - Create a new group
  - `POST /groups/:groupId/add-user` - Add a user to a group
  - `GET /groups/:groupId/messages` - Fetch group messages

- **File Uploads**
  - `POST /uploads` - Upload & send a file

## WebSockets (Socket.io)

Handles events for:
- `connect` / `disconnect`
- `send_message` / `receive_message`
- `create_group` / `join_group` / `group_message`
- `send_file` / `receive_file`

## Project Structure

```
nodejs-express-socketio-postgres
├── src
│   ├── config
│   ├── models
│   ├── services
│   ├── controllers
│   ├── routes
│   ├── sockets
│   ├── middlewares
│   ├── utils
│   └── app.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── sequelize.config.js
├── migrations/
├── seeders/
└── README.md
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd nodejs-express-socketio-postgres
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on the `.env.example` file and configure your environment variables.

5. Run the application:
   ```
   npm start
   ```

## License

This project is licensed under the MIT License.