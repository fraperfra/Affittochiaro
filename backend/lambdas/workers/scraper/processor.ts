import { SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event) => {
  try {
    console.log('Scraper processor triggered with', event.Records.length, 'messages');
    // TODO: Implement scraper processor
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
