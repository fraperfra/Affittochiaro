import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  try {
    console.log('Notification sender triggered');
    // TODO: Implement notification sender
    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
