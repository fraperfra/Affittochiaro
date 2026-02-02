import { SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event) => {
  try {
    console.log('Matching calculator triggered with', event.Records.length, 'messages');
    // TODO: Implement matching calculator
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
