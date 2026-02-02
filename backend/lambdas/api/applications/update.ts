import { APIGatewayProxyHandler } from 'aws-lambda';
import { success, internalError } from '../../shared/utils/response';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // TODO: Implement updateApplication
    return success({ message: 'Not implemented yet' });
  } catch (error) {
    console.error('Error:', error);
    return internalError('Internal server error');
  }
};
