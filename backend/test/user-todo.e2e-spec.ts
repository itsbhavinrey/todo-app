import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('User-Todo Integration (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('User Management', () => {
    it('should create a user', () => {
      const timestamp = Date.now();
      return request(app.getHttpServer())
        .post('/users')
        .send({
          username: `testuser${timestamp}`,
          email: `test${timestamp}@example.com`,
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('username', `testuser${timestamp}`);
          expect(res.body).toHaveProperty(
            'email',
            `test${timestamp}@example.com`,
          );
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should login a user', async () => {
      const timestamp = Date.now();
      // First create a user
      await request(app.getHttpServer())
        .post('/users')
        .send({
          username: `testuser${timestamp}`,
          email: `test${timestamp}@example.com`,
          password: 'password123',
        });

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: `test${timestamp}@example.com`,
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Login successful');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('should get current user after login', () => {
      return request(app.getHttpServer())
        .post('/auth/me')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
        });
    });
  });

  describe('Todo Management', () => {
    let userId: number;
    let timestamp: number;

    beforeEach(async () => {
      timestamp = Date.now();
      // Create and login user
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: `todouser${timestamp}`,
          email: `todo${timestamp}@example.com`,
          password: 'password123',
        });

      userId = userResponse.body.id;

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: `todo${timestamp}@example.com`,
          password: 'password123',
        });
    });

    it('should create a todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('userId', userId);
          expect(res.body).toHaveProperty('title', 'Test Todo');
          expect(res.body).toHaveProperty('description', 'Test Description');
          expect(res.body).toHaveProperty('completed', false);
        });
    });

    it('should get all todos for user', async () => {
      // Create a todo first
      await request(app.getHttpServer()).post('/todos').send({
        title: 'Test Todo',
        description: 'Test Description',
      });

      return request(app.getHttpServer())
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('userId');
          expect(res.body[0].userId).toBe(userId);
        });
    });

    it('should update a todo', async () => {
      // Create a todo first
      const todoResponse = await request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        });

      const todoId = todoResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/todos/${todoId}`)
        .send({
          title: 'Updated Todo',
          completed: true,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('title', 'Updated Todo');
          expect(res.body).toHaveProperty('completed', true);
        });
    });

    it('should toggle todo completion', async () => {
      // Create a todo first
      const todoResponse = await request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        });

      const todoId = todoResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/todos/${todoId}/toggle`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('completed', true);
        });
    });

    it('should delete a todo', async () => {
      // Create a todo first
      const todoResponse = await request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        });

      const todoId = todoResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/todos/${todoId}`)
        .expect(204);
    });
  });

  describe('Authentication Required', () => {
    it('should require login to access todos', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Please login first');
        });
    });

    it('should require login to create todos', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        })
        .expect(401);
    });
  });

  describe('User Isolation', () => {
    let user1Id: number;
    let user2Id: number;
    let user1TodoId: number;

    beforeEach(async () => {
      // Create two users
      const user1Response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'user1',
          email: 'user1@example.com',
          password: 'password123',
        });

      const user2Response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'user2',
          email: 'user2@example.com',
          password: 'password123',
        });

      user1Id = user1Response.body.id;
      user2Id = user2Response.body.id;

      // Login as user1 and create a todo
      await request(app.getHttpServer()).post('/auth/login').send({
        email: 'user1@example.com',
        password: 'password123',
      });

      const todoResponse = await request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'User1 Todo',
          description: 'User1 Description',
        });

      user1TodoId = todoResponse.body.id;
    });

    it('should not allow user2 to access user1 todos', async () => {
      // Login as user2
      await request(app.getHttpServer()).post('/auth/login').send({
        email: 'user2@example.com',
        password: 'password123',
      });

      // Try to access user1's todo
      return request(app.getHttpServer())
        .get(`/todos/${user1TodoId}`)
        .expect(404);
    });

    it('should not allow user2 to update user1 todos', async () => {
      // Login as user2
      await request(app.getHttpServer()).post('/auth/login').send({
        email: 'user2@example.com',
        password: 'password123',
      });

      // Try to update user1's todo
      return request(app.getHttpServer())
        .patch(`/todos/${user1TodoId}`)
        .send({
          title: 'Hacked Todo',
        })
        .expect(404);
    });
  });
});
