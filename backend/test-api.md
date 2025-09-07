# Todo API Testing Guide

## API Endpoints

### 1. Create Todo

```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn NestJS", "description": "Build a todo app with NestJS"}'
```

### 2. Get All Todos

```bash
curl http://localhost:3001/todos
```

### 3. Get Single Todo

```bash
curl http://localhost:3001/todos/1
```

### 4. Update Todo

```bash
curl -X PATCH http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn NestJS - Updated", "completed": true}'
```

### 5. Toggle Todo Complete Status

```bash
curl -X PATCH http://localhost:3001/todos/1/toggle
```

### 6. Delete Todo

```bash
curl -X DELETE http://localhost:3001/todos/1
```

## Expected Response Format

### Todo Object

```json
{
  "id": 1,
  "title": "Learn NestJS",
  "description": "Build a todo app with NestJS",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Title is required",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Todo with ID 999 not found",
  "error": "Not Found"
}
```
