# Preference Center Backend Challenge

This project implements a simple Preference Center API for managing user consents, built with Node.js, Express, TypeScript, PostgreSQL (via Docker), Prisma, Zod for validation, and Jest for testing.

## Technical Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL (using Docker)
- Prisma (ORM)
- Zod (Validation)
- Jest & Testcontainers (Testing)
- ESLint (Linting)
- Prettier (Code Formatting)

## Prerequisites

- Node.js (v20 or higher recommended)
- Docker and Docker Compose
- npm

## Development Environment Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd didomi
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    Copy the `.env.example` file to `.env`. This `.env` file is used for your **development environment**.

    ```bash
    cp .env.example .env
    ```

    The `DATABASE_URL` in your `.env` file should point to your development database, which by default is `postgresql://postgres:postgres@localhost:5433/didomi?schema=public`.

    For **testing**, the `npm test` script automatically sets a separate `DATABASE_URL` pointing to `localhost:5434/didomi_test`, ensuring an isolated test environment.

4.  **Set up the database:**

    This project uses PostgreSQL with Docker Compose. The default development database will run on `localhost:5433` and be named `didomi`.

    - Start the database container:

      ```bash
      docker-compose up -d
      ```

    - Apply Prisma migrations to create the database schema:

      ```bash
      npx prisma migrate dev --name init
      ```

    - Generate the Prisma Client:

      ```bash
      npm run prisma:generate
      ```

    The database should now be running, the schema applied, and the Prisma Client generated.

## Running the Application

1.  **Build the TypeScript code:**

    ```bash
    npm run build
    ```

2.  **Start the application in development mode (with hot-reloading):**

    ```bash
    npm run dev
    ```

    This command uses `nodemon` to automatically restart the server when file changes are detected. The API will be running at `http://localhost:3000` (or the port specified in your environment variables).

3.  **Start the application in production mode:**

    ```bash
    npm start
    ```

    The API should now be running at `http://localhost:3000` (or the port specified in your environment variables).

## Running Tests

To run the comprehensive test suite, use:

```bash
npm run test
```

This command triggers Jest, which is configured to use **Testcontainers** for managing a dedicated test database.

Here's how the testing environment is set up:

- **Global Setup (`tests/jest.setup.ts`)**: Before any test suites run, Testcontainers starts a fresh PostgreSQL container and runs `npx prisma migrate deploy` against it. This provides a clean database state for each test suite.
- **Per-Test Cleanup (`beforeEach` in test files)**: Within each test suite, the `beforeEach` hook in the test files (`tests/event.test.ts` and `tests/user.test.ts`) performs cleanup (deleting data) between individual tests. This ensures isolation between tests within the same suite.
- **Global Teardown (`tests/jest.teardown.ts`)**: After all test suites have finished, the Testcontainers container is stopped and removed.

This setup provides robust isolation at both the test suite and individual test levels.

## Code Quality

- ESLint is configured for linting.
- Prettier is configured for code formatting. It's recommended to set up your editor to format on save.

## API Documentation

A Postman collection file (`postman_collection.json`) is included in the project root. You can import this file into Postman to easily interact with the API endpoints.

The API supports the following endpoints:

### Users

- `GET /users`

  - Retrieves all users with their current consent status.
  - Response: `Array<User>` (User object includes `id`, `email`, and `consents` array)

- `GET /users/:id`

  - Retrieves a single user by their ID.
  - Response: `User` object (User object includes `id`, `email`, and `consents` array)
  - Returns 404 if user is not found.

- `POST /users`

  - Creates a new user.
  - Request Body: `{ "email": "string" }` (email must be a valid and unique email address)
  - Response: `User` object
  - Returns 422 if email is invalid or already exists.

- `DELETE /users/:id`
  - Deletes a user by ID.
  - Response: 204 No Content
  - Returns 404 if user is not found.

### Events

- `POST /events`
  - Creates a new consent change event for a user.
  - Request Body: `{ "user": { "id": "string" }, "consents": Array<{ id: "email_notifications" | "sms_notifications", enabled: boolean }> }`
  - Response: `Event` object
  - Returns 404 if user is not found.
  - Returns 422 if consents format or IDs are invalid.
  - Returns 500 if an internal server error occurs during the transaction.
