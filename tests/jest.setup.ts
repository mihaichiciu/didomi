import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';

module.exports = async () => {
  const container = await new PostgreSqlContainer('postgres:17').start();
  const databaseUrl = container.getConnectionUri();

  console.log('[setup] PostgreSQL running at:', databaseUrl);

  process.env.DATABASE_URL = databaseUrl;

  try {
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    });
    console.log('Prisma migrations applied');
  } catch (error) {
    console.error('Failed to run migrations', error);
    await container.stop();
    process.exit(1);
  }

  (global as any).__TESTCONTAINERS_POSTGRES_CONTAINER__ = container;
};
