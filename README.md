# Student Management REST API

A simple Student Management REST API made with Node.js and Express.js. This project performs basic CRUD operations on student records using an in-memory array.

## Student Details

- Name: Rajiv Jadon
- Roll No: 2501010174
- Course: Web Development III
- Assignment: Lab Assignment 2 - Student Management REST API

## Project Files

```text
student-management-api/
├── app.js
├── package.json
├── test-api.js
├── test_api.js
├── .env.example
├── .gitignore
├── README.md
├── data/
│   └── students.js
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
└── routes/
    └── studentRoutes.js
```

## How to Run

Install the packages:

```bash
npm install
```

Start the server:

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

For development:

```bash
npm run dev
```

## Run Tests

```bash
npm test
```

## API Routes

### GET /

Shows the API welcome message and available routes.

### GET /students

Returns all students.

You can filter by course:

```text
GET /students?course=Computer%20Science
```

### GET /students/:id

Returns one student by ID.

### POST /students

Adds a new student.

Example body:

```json
{
  "name": "Karan Mehta",
  "course": "Cyber Security",
  "age": 20,
  "email": "karan@example.com"
}
```

Name and course are required.

### PUT /students/:id

Updates an existing student. Only the fields that need to be changed have to be sent.

Example:

```json
{
  "course": "Web Development",
  "age": 21
}
```

### DELETE /students/:id

Deletes a student by ID.

## Middleware

The project has a small custom logger which prints the request time, method and URL in the terminal.

There is also a 404 handler for routes that do not exist and a common error handler for server errors and invalid JSON.

## Testing

The test file checks the main API operations, invalid student IDs, validation and an unknown route.
