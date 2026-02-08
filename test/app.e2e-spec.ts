import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';

/**
 * E2E tests for core API flows.
 *
 * NOTE: These tests require a running PostgreSQL database.
 * Set up a test database and configure env vars before running:
 *   DATABASE_NAME=atoutsservice_test
 *   JWT_SECRET=test-secret-key-at-least-32-characters-long
 *
 * Run with: npm run test:e2e
 */
describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('GET / should return 200', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200);
    });
  });

  describe('Auth Flow', () => {
    it('POST /auth/login with invalid credentials should return 401', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'noone@test.fr', password: 'wrongpassword' })
        .expect(401);
    });

    it('POST /auth/login with missing fields should return 400', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.fr' })
        .expect(400);
    });

    it('GET /auth/me without token should return 401', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });

    it('POST /auth/register without token should return 401', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@test.fr', password: 'password123', full_name: 'New User' })
        .expect(401);
    });
  });

  describe('Quote Requests', () => {
    it('POST /quote-requests should create a new quote (public)', () => {
      return request(app.getHttpServer())
        .post('/quote-requests')
        .send({
          first_name: 'Jean',
          last_name: 'Dupont',
          email: 'jean@test.fr',
          phone: '06 12 34 56 78',
          project_type: 'peinture',
          message: 'Je veux repeindre mon salon de 30m2',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.first_name).toBe('Jean');
          expect(res.body.status).toBe('nouveau');
          expect(res.body.id).toBeDefined();
        });
    });

    it('POST /quote-requests with missing fields should return 400', () => {
      return request(app.getHttpServer())
        .post('/quote-requests')
        .send({ first_name: 'Jean' })
        .expect(400);
    });

    it('POST /quote-requests should reject extra fields', () => {
      return request(app.getHttpServer())
        .post('/quote-requests')
        .send({
          first_name: 'Jean',
          last_name: 'Dupont',
          email: 'jean@test.fr',
          phone: '06 12 34 56 78',
          message: 'Test',
          malicious_field: 'hacked',
        })
        .expect(400);
    });

    it('GET /quote-requests without auth should return 401', () => {
      return request(app.getHttpServer())
        .get('/quote-requests')
        .expect(401);
    });

    it('GET /quote-requests/stats without auth should return 401', () => {
      return request(app.getHttpServer())
        .get('/quote-requests/stats')
        .expect(401);
    });
  });

  describe('Portfolio (public)', () => {
    it('GET /portfolio should return 200', () => {
      return request(app.getHttpServer())
        .get('/portfolio')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /portfolio/category/peinture should return 200', () => {
      return request(app.getHttpServer())
        .get('/portfolio/category/peinture')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('POST /portfolio without auth should return 401', () => {
      return request(app.getHttpServer())
        .post('/portfolio')
        .send({ title: 'Test', imageUrl: '/uploads/test.jpg' })
        .expect(401);
    });
  });

  describe('Before/After (public)', () => {
    it('GET /before-after should return 200', () => {
      return request(app.getHttpServer())
        .get('/before-after')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /before-after/category/peinture should return 200', () => {
      return request(app.getHttpServer())
        .get('/before-after/category/peinture')
        .expect(200);
    });

    it('POST /before-after without auth should return 401', () => {
      return request(app.getHttpServer())
        .post('/before-after')
        .send({
          title: 'Test',
          beforeImageUrl: '/uploads/before.jpg',
          afterImageUrl: '/uploads/after.jpg',
          category: 'peinture',
        })
        .expect(401);
    });
  });

  describe('Upload', () => {
    it('POST /upload/image without auth should return 401', () => {
      return request(app.getHttpServer())
        .post('/upload/image')
        .expect(401);
    });
  });
});
