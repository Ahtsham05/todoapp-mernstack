import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'todoApp API',
      version: '1.0.0',
      description: 'API documentation for my TodoAPP project',
    },
    servers: [
      {
        url: 'http://localhost:8000/api/v1', // ✅ match your actual base URL
      },
    ],
  },
  apis: ['./src/routes/*.js'], // ✅ adjust path based on where your route files live
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
