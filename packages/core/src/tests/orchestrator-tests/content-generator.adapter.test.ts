import { contentGeneratorJobAdapter } from '@services/content-generator/adapters/primary/content-generator.adapter'
import { generateContentUsecase } from '@services/content-generator/usecases/generate-content.usecase';
import { SQSEvent} from 'aws-lambda';
import { randomUUID } from 'crypto';

jest.mock('@services/content-generator/usecases/generate-content.usecase');


describe('contentGeneratorJobAdapter', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error if SQS Records are missing', async () => {
    const mockEvent: SQSEvent = { Records: [] };

    await expect(contentGeneratorJobAdapter(mockEvent)).rejects.toThrow('Missing SQS Records');
  });

  it('should process a single SQS record successfully', async () => {
    const mockTranscript = 'Mock transcript';
    const mockGeneratedContent = 'Generated content';
    const mockVideoId = randomUUID();
    const mockJobId = randomUUID();

    (generateContentUsecase as jest.Mock).mockResolvedValue(mockGeneratedContent);

    const mockEvent: SQSEvent = {
      Records: [
        {
          body: JSON.stringify({
            jobId: mockJobId,
            userId: 'user123',
            videoId: mockVideoId,
            targetPlatform: 'LINKEDIN',
            prompt: 'Create a post',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        },
      ] as any,
    };

    const result = await contentGeneratorJobAdapter(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([mockGeneratedContent]);
   
    expect(generateContentUsecase).toHaveBeenCalled()
  });

  it('should process multiple SQS records', async () => {
    const mockTranscript1 = 'Mock transcript 1';
    const mockTranscript2 = 'Mock transcript 2';
    const mockGeneratedContent1 = 'Generated content 1';
    const mockGeneratedContent2 = 'Generated content 2';
    const mockVideoId1 = randomUUID();
    const mockVideoId2 = randomUUID();


    (generateContentUsecase as jest.Mock)
      .mockResolvedValueOnce(mockGeneratedContent1)
      .mockResolvedValueOnce(mockGeneratedContent2);

    const mockEvent: SQSEvent = {
      Records: [
        {
          body: JSON.stringify({
            jobId: randomUUID(),
            userId: 'user123',
            videoId: mockVideoId1,
            targetPlatform: 'LINKEDIN',
            prompt: 'Create a post',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        },
        {
          body: JSON.stringify({
            jobId: randomUUID(),
            userId: 'user456',
            videoId: mockVideoId2,
            targetPlatform: 'TWITTER',
            prompt: 'Write a tweet',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        },
      ] as any,
    };

    const result = await contentGeneratorJobAdapter(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([mockGeneratedContent1, mockGeneratedContent2]);
    expect(generateContentUsecase).toHaveBeenCalledTimes(2);
  });


});