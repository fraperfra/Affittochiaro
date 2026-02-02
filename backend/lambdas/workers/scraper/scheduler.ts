import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  try {
    console.log('Scraper scheduler triggered');
    // TODO: Implement scraper scheduler
    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
