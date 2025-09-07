# User & Todo API Testing Guide

## User Management API

### 1. Create User

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com", "password": "password123"}'
```

### 2. Login User

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### 3. Get Current User

```bash
curl -X POST http://localhost:3001/auth/me
```

### 4. Get All Users

```bash
curl http://localhost:3001/users
```

### 5. Get Single User

```bash
curl http://localhost:3001/users/1
```

### 6. Update User

```bash
curl -X PATCH http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -d '{"username": "john_updated"}'
```

### 7. Logout

```bash
curl -X POST http://localhost:3001/auth/logout
```

## User-Specific Todo API

**Note: You must login first before accessing todo endpoints!**

### 1. Create Todo (User-Specific)

```bash
# First login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# Then create todo
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn NestJS", "description": "Build a todo app with NestJS"}'
```

### 2. Get All User's Todos

```bash
curl http://localhost:3001/todos
```

### 3. Get Single Todo (User-Specific)

```bash
curl http://localhost:3001/todos/1
```

### 4. Update Todo (User-Specific)

```bash
curl -X PATCH http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn NestJS - Updated", "completed": true}'
```

### 5. Toggle Todo Complete Status

```bash
curl -X PATCH http://localhost:3001/todos/1/toggle
```

### 6. Delete Todo (User-Specific)

```bash
curl -X DELETE http://localhost:3001/todos/1
```

## Complete Workflow Example

### Step 1: Create User

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "email": "alice@example.com", "password": "password123"}'
```

### Step 2: Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "password123"}'
```

### Step 3: Create Todo

```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs"}'
```

### Step 4: Get All Todos

```bash
curl http://localhost:3001/todos
```

### Step 5: Update Todo

```bash
curl -X PATCH http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## Expected Response Formats

### User Response

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Todo Response

```json
{
  "id": 1,
  "userId": 1,
  "title": "Learn NestJS",
  "description": "Build a todo app with NestJS",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Login Response

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### 401 Unauthorized (Not Logged In)

```json
{
  "statusCode": 401,
  "message": "Please login first",
  "error": "Unauthorized"
}
```

### 404 Not Found (Todo Not Belongs to User)

```json
{
  "statusCode": 404,
  "message": "Todo with ID 1 not found",
  "error": "Not Found"
}
```

### 409 Conflict (Email/Username Already Exists)

```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```
