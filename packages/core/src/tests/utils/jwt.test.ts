import { verifyJwt, JwtPayload } from '@utils/jwt';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Utility', () => {
  const mockPublicKey = '-----BEGIN PUBLIC KEY-----\nMIBCgKCAQEdsfsdfs0283480fsdYrclAX/\n9vCC9e4YE/uIHUMfTqiyrqtGJSOaw2LjHldbunH0vrpdQEkdL8GdwD28Ujs5HQjU\nGhEhPuAkLF5m0c7XeopXB9UBkfltORQNTQeeN0gDMM488Grp9yiwIk459aEl3JMg\nGzvwNaMCJxNnDBda9nFGoNsfYm7Fq6ax6iSQD++sijON5kaI4ap/6N9r3C49uH2r\nYOV2qeK5OA9rA9Bgp5A1ChjntETWh7Ap+T3Z2X3v1JZaXE3kkVclgvrvREOb92U+\nYnWzf+/q6vpabQVZ9HfK0eXl0kgPm8uIpu7GC0A23ZoUwb9CYrIM0HybGlSvAA5V\nowIDAQAX\n-----END PUBLIC KEY-----';

  beforeEach(() => {
    jest.resetAllMocks();
    console.error = jest.fn();
  });

  it('should verify a valid JWT', () => {
    const validPayload: JwtPayload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
    (jwt.verify as jest.Mock).mockReturnValue(validPayload);

    const validToken = 'valid.token.here';
    const result = verifyJwt(validToken, mockPublicKey);
    expect(result).toEqual(validPayload);
    expect(jwt.verify).toHaveBeenCalledWith(validToken, mockPublicKey, { algorithms: ['RS256'] });
  });

  it('should throw an error for an invalid JWT', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid token');
    });

    const invalidToken = 'invalid.token.here';
    expect(() => verifyJwt(invalidToken, mockPublicKey)).toThrow('Invalid token');
  });

  it('should throw an error for a JWT with invalid signature', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid signature');
    });

    const invalidSignatureToken = 'invalid.signature.token';
    expect(() => verifyJwt(invalidSignatureToken, mockPublicKey)).toThrow('Invalid token');
  });

  it('should throw an error when jwt.verify returns null', () => {
    (jwt.verify as jest.Mock).mockReturnValue(null);

    const token = 'null.return.token';
    expect(() => verifyJwt(token, mockPublicKey)).toThrow('Invalid token');
  });
});