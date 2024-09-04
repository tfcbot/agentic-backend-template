import {  getUserContentAdapter} from '@orchestrator/adapters/primary/user.adapter';
import { getUserContentUseCase } from '@orchestrator/usecases/retrieve-user-content.usecase';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { authMiddleware } from '@utils/jwt';

jest.mock('@orchestrator/usecases/retrieve-user-content.usecase');
jest.mock('@utils/jwt');

describe('User Adapter Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully retrieve user info', async () => {
    const mockUserId = 'user123';
    const mockUserContent = {
      content: [
        { userId: mockUserId, contentId: 'content1', text: 'Sample content 1' },
        { userId: mockUserId, contentId: 'content2', text: 'Sample content 2' },
      ],
    };

    (authMiddleware as jest.Mock).mockReturnValue({ sub: mockUserId });
    (getUserContentUseCase as jest.Mock).mockResolvedValue(mockUserContent);

    const mockEvent: Partial<APIGatewayProxyEventV2> = {
      headers: {
        authorization: 'Bearer mockToken',
      },
      version: '2.0',
    };
    const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result: {} = await getUserContentAdapter(mockEvent as APIGatewayProxyEventV2);
    const parsedResult = JSON.parse(JSON.stringify(result));
    expect(parsedResult.statusCode).toBe(200);
    expect(authMiddleware).toHaveBeenCalledWith(mockEvent);
    expect(getUserContentUseCase).toHaveBeenCalledWith({ userId: mockUserId });
  });

  it('should return 401 for unauthorized access', async () => {
    (authMiddleware as jest.Mock).mockImplementation(() => {
      throw new Error('No token provided');
    });

    const mockEvent: Partial<APIGatewayProxyEventV2> = {
      headers: {},
      version: '2.0',
    };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await getUserContentAdapter(mockEvent as APIGatewayProxyEventV2);
    const parsedResult = JSON.parse(JSON.stringify(result));

    expect(parsedResult.statusCode).toBe(401);
    expect(parsedResult.body).toContain('Unauthorized');
    expect(authMiddleware).toHaveBeenCalledWith(mockEvent);
    expect(getUserContentUseCase).not.toHaveBeenCalled();
  });

  it('should return 500 for internal server error', async () => {
    const mockUserId = 'user123';
    (authMiddleware as jest.Mock).mockReturnValue({ sub: mockUserId });
    (getUserContentUseCase as jest.Mock).mockRejectedValue(new Error('Database error'));

    const mockEvent: Partial<APIGatewayProxyEventV2> = {
      headers: {
        authorization: 'Bearer mockToken',
      },
      version: '2.0',
    };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await getUserContentAdapter(mockEvent as APIGatewayProxyEventV2);
    const parsedResult = JSON.parse(JSON.stringify(result));

    expect(parsedResult.statusCode).toBe(500);
    expect(parsedResult.body).toContain('Internal Server Error');
    expect(authMiddleware).toHaveBeenCalledWith(mockEvent);
    expect(getUserContentUseCase).toHaveBeenCalledWith({ userId: mockUserId });
  });
});