import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log('WebSocket connect:', event.requestContext.connectionId);
    return { statusCode: 200, body: 'Connected' };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Failed to connect' };
  }
};
