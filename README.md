# Real-Time Chat Application

A full-featured real-time chat application built with Express.js, Socket.io, and PostgreSQL, supporting direct messaging, group chats, and file sharing.

## Features

- **User Authentication**
  - JWT-based authentication
  - User registration and login
  - Password hashing with bcrypt

- **Direct Messaging**
  - One-to-one conversations
  - Real-time message delivery
  - Read receipts and typing indicators

- **Group Chats**
  - Create and manage group conversations
  - Add participants
  - Group admin capabilities (Future)

- **File Sharing**
  - Upload and share files in chats with real-time delivery
  - File metadata storage

- **Real-Time Events**
  - Live message delivery
  - Typing indicators
  - Online/offline status updates

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Real-Time**: Socket.io
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Local filesystem (configurable for S3)

## Setup & Installation

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhinavv9/Chat-app-server.git
   cd Chat-app-server
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Run migrations to set up the database**
   ```bash
   npx sequelize-cli db:migrate
   ```
4. **Start the server**
   ```bash
   npm run dev   # Development mode with nodemon
   npm start     # Production mode
   ```

### Environment Variables
Create a .env file in the root directory with the following variables:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Authentication
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=3000
NODE_ENV=development

# File Storage (uncomment for AWS S3)
# AWS_ACCESS_KEY_ID=your_aws_access_key_id
# AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
# AWS_REGION=your_aws_region
# S3_BUCKET_NAME=your_s3_bucket_name
```


## Future Improvements

### Performance Enhancements
#### Redis Integration
- Add Redis for socket session storage
- Implement pub/sub for scaling with multiple server instances
- Cache frequent database queries

#### Database Optimizations
- Add database indexes for frequent queries
- Implement pagination for message retrieval
- Archive old messages to improve query performance

### Feature Enhancements
#### Message Features
- Message editing and deletion
- Message reactions (emoji responses)
- Message threading for organized discussions

#### Media Enhancements
- Image compression and thumbnails
- Video/audio message support
- Real-time media streaming

#### User Experience
- Read receipts with timestamps
- Message delivery confirmations
- Advanced notification preferences

### Security Improvements
#### End-to-End Encryption
- Implement E2EE for direct messages
- Key management system

#### Rate Limiting
- Prevent spam and abuse with rate limits
- IP-based and user-based limits