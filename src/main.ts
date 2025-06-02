import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const apiYamlPath = path.join(__dirname, '..', 'doc', 'api.yaml');
  const swaggerDocument = YAML.load(apiYamlPath);

  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/doc`);
  });
}

bootstrap();
