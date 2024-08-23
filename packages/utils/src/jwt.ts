import jwt from 'jsonwebtoken';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export interface JwtPayload {
  sub: string;
  [key: string]: any;
}

export function verifyJwt(token: string, publicKey: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    if (!decoded) {
      throw new Error('Invalid token');
    }
    return decoded as JwtPayload;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    throw new Error('Invalid token');
  }
}

export function authMiddleware(event: APIGatewayProxyEventV2): JwtPayload {
  const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
  const token = event.headers.authorization?.split(' ')[1];
  if (!publicKey) {
    throw new Error('Missing CLERK_PEM_PUBLIC_KEY');
  }

  if (!token) {
    throw new Error('No token provided');
  }
  const formattedPublicKey = publicKey.replace(/\\n/g, '\n')	
  .replace(/^-----BEGIN PUBLIC KEY-----/, '-----BEGIN PUBLIC KEY-----\n')	
  .replace(/-----END PUBLIC KEY-----$/, '\n-----END PUBLIC KEY-----');
  return verifyJwt(token, formattedPublicKey);
}