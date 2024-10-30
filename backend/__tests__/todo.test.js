const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/index');

let mongoServer;

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}, 15000);

beforeEach(async () => {
  // Clear collections between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 15000);

describe('Todo API Tests', () => {
  test('GET /api/todos should return empty array initially', async () => {
    const response = await request(app)
      .get('/api/todos')
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/todos should create new todo', async () => {
    const todoData = {
      title: 'Test Todo',
      description: 'Test Description',
      deadline: new Date().toISOString()
    };

    const response = await request(app)
      .post('/api/todos')
      .send(todoData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(todoData.title);
  });
});