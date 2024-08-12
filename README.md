# Saben

Saben is a web-based Q&A (Questions and Answers) platform designed to facilitate user engagement and knowledge sharing. It allows users to post questions, provide answers, and interact with each other through replies. Users can register, log in, and manage their profiles, while also being able browse through various topics.

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

- **POST /api/v1/users/register**
  - Register a new user.
  - **Body**: `{ "name": "Test User", "username": "test_user_123", "email": "testuser@example.com", "password": "testuser123" }`

- **POST /api/v1/users/login**
  - Log in a user.
  - **Body**: `{ "username": "test_user_123", "password": "testuser123" }`

- **POST /api/v1/users/logout**
  - Log out a user (protected route).

- **POST /api/v1/users/refresh-token**
  - Refresh access token.

- **GET /api/v1/users/current-user**
  - Get the current logged-in user (protected route).

### Question Routes

- **GET /api/v1/questions**
  - Retrieve a list of questions with pagination (protected route).
  - **Query Params**: `page`, `limit`

- **POST /api/v1/questions**
  - Create a new question (protected route).
  - **Body**: `{ "title": "Question Title", "body": "Question body" }`

- **GET /api/v1/questions/:id**
  - Get details of a specific question (protected route).

- **DELETE /api/v1/questions/:id**
  - Delete a question (protected route).

### Reply Routes

- **POST /api/v1/replies**
  - Create a new reply (protected route).
  - **Body**: `{ "body": "Reply body", "question": "<questionId>" }`

- **GET /api/v1/replies/:questionId**
  - Retrieve replies for a specific question with pagination (protected route).
  - **Query Params**: `page`, `limit`

- **DELETE /api/v1/replies/:id**
  - Delete a reply (protected route).
