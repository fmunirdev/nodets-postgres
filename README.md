# nodets-postgres

Sample code demonstrating writing APIs using Node.js as a backend runtime, TypeScript for type checking, Sequelize as ORM, and Passport.js for authentication.

## Up and running

Setting up and developing locally is pretty straightforward.

### Requirements

You must have the following software/tools installed on your system:

- Docker version >= 24.0.4
- Docker Compose version >= v2.2.3
- A recent version of VS Code
- VS Code extension for API browsing: [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

### Build and run

Clone the code repository or open it in GitHub Codespaces and navigate to the project dir:

```bash
docker compose up --build
<OR>
docker-compose up --build
```

It will build and spin up two Docker containers: the backend API and a PostgreSQL database instance. All the credentials are sourced via environment variables in `docker-compose.yml`. On app start-up, the "Users" table and a dummy "superuser" will be created automatically.

### Browsing the API endpoints

Even though the API endpoints could be tested in any HTTP-supported client app/utility, the REST Client allows you to send HTTP requests and view the response in Visual Studio Code directly.

- Open the prepared API docs located at: `docs/api/index.http`
- Click the `Send Request` link above the request OR use the shortcut `Ctrl+Alt+R`(`Cmd+Alt+R` for macOS). [Read more about usage on REST Client extension's homepage](https://marketplace.visualstudio.com/items?itemName=humao.rest-client#usage).
- `/login` endpoint is already configured to use the dummy user credentials. On successful response, it returns a JWT Access Token and set the variable `@authToken` (used to browse secured endpoints).
- Endpoints performing CRUD operations require a JWT Bearer token for authentication. And already configured to make use of the request variable `@authToken`.
- To browse a single resource, copy the `id` from the `POST /users/` response and replace the path parameter `<user.id>` with it.

> **Note:** This codebase is just for demonstration purposes. Any authenticated user is able to change the email/password of any other user in the database. That won't be the case in a real scenario.

### Cleanup

Once done, stop the Docker containers:

```bash
docker compose down
<OR>
docker-compose down
```
