# Saben

Saben is a question and answer platform. The website is built using the MERN stack (MongoDB, Express, React, NodeJS).

## Features

- **User Management**: Register, log in, and manage user profiles.
- **Question Management**: Create, view, and delete questions.
- **Reply Management**: Create, view, and delete replies to questions.
- **Pagination**: Paginate questions and replies to manage large datasets efficiently.

## Project Structure

- **`models/`**: Contains Mongoose schemas for `User`, `Question`, and `Reply`.
- **`controllers/`**: Logic for handling API requests.
- **`routes/`**: API routes for users, questions, and replies.
- **`middlewares/`**: Middleware for authentication and validation.
- **`utils/`**: Utility functions and classes like `ApiResponse` and `ApiError`.

## API Endpoints

### User Routes

- **POST /api/users/register**
  - Register a new user.
  - **Body**: `{ "name": "Test User", "username": "test_user_123", "email": "testuser@example.com", "password": "testuser123" }`

- **POST /api/users/login**
  - Log in a user.
  - **Body**: `{ "username": "test_user_123", "password": "testuser123" }`

- **POST /api/users/logout**
  - Log out a user (protected route).

- **POST /api/users/refresh-token**
  - Refresh access token.

- **GET /api/users/current-user**
  - Get the current logged-in user (protected route).

### Question Routes

- **GET /api/questions**
  - Retrieve a list of questions with pagination (protected route).
  - **Query Params**: `page`, `limit`

- **POST /api/questions**
  - Create a new question (protected route).
  - **Body**: `{ "title": "Question Title", "body": "Question body" }`

- **GET /api/questions/:id**
  - Get details of a specific question (protected route).

- **DELETE /api/questions/:id**
  - Delete a question (protected route).

### Reply Routes

- **POST /api/replies**
  - Create a new reply (protected route).
  - **Body**: `{ "body": "Reply body", "question": "<questionId>" }`

- **GET /api/replies/:questionId**
  - Retrieve replies for a specific question with pagination (protected route).
  - **Query Params**: `page`, `limit`

- **DELETE /api/replies/:id**
  - Delete a reply (protected route).
