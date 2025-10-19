import app from '#src/app.js';
import request from 'supertest';

describe('API endpoints', () => {
  describe('GET /health', () => {
    it('should return health', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return API message', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'WrapJet-Prod-Scale-API is running !!'
      );
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for nonexistent route', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('message', 'Route not found');
    });
  });
});
