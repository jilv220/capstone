// MockDataGenerator.ts
export const generateUserData = () => {
  return {
    id: Math.floor(Math.random() * 10000),
    username: `User${Math.floor(Math.random() * 10000)}`,
    email: `user${Math.floor(Math.random() * 10000)}@example.com`,
  };
};
