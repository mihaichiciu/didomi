module.exports = async () => {
  const container = (global as any).__TESTCONTAINERS_POSTGRES_CONTAINER__;
  if (container) {
    console.log('Stopping PostgreSQL container');
    await container.stop();
  }
};
