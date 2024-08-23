import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { getTranscriptDocId, fetchTranscript, getVideoTranscript } from "@agent-plane/content-agent/adapter/secondary/bucket.adapter";

const dynamoMock = mockClient(DynamoDBClient);



jest.mock('sst', () => ({
  Resource: {
    Videos: { tableName: 'MockVideosTable' },
    VideoTranscriptBucket: { name: 'MockBucket' }
  }
}));

describe('Bucket Adapter', () => {
  beforeEach(() => {
    dynamoMock.reset();
  });

  describe('getTranscriptDocId', () => {
    it('should return transcript DocId for a valid video ID', async () => {
      const mockVideoId = 'mock-video-id';
      const mockTranscriptDocId = 'mock-transcript-DocId';

      dynamoMock.on(GetItemCommand).resolves({
        Item: {
          transcriptDocId: { S: mockTranscriptDocId }
        }
      });

      const result = await getTranscriptDocId(mockVideoId);

      expect(result).toBe(mockTranscriptDocId);
      expect(dynamoMock.calls()).toHaveLength(1);
      expect(dynamoMock.call(0).args[0].input).toEqual({
        TableName: 'MockVideosTable',
        Key: {
          videoId: { S: mockVideoId }
        },
        ProjectionExpression: "transcriptDocId"
      });
    });
  });

  describe('fetchTranscript', () => {    
    it('should fetch and return transcript content', async () => {
    const mockTranscriptDocId = 'mockId';
    const mockTranscriptContent = 'This is a mock transcript';
    const s3Mock = mockClient(S3Client);
    s3Mock.on(GetObjectCommand).resolves({
      Body: new Readable({
        read() {
          this.push(mockTranscriptContent);
          this.push(null);
        }
      }) as any
    });
    
    const result = await fetchTranscript(mockTranscriptDocId);

    expect(result).toBe(mockTranscriptContent);
    expect(s3Mock.calls()).toHaveLength(1);
    expect(s3Mock.call(0).args[0].input).toEqual({
      Bucket: 'MockBucket',
      Key: mockTranscriptDocId
    });
  });
  });

  describe('getVideoTranscript', () => {
    it('should return transcript for a valid video ID', async () => {
      const mockVideoId = 'mock-video-id';
      const mockTranscriptDocId = 'mock-transcript-DocId';
      const mockTranscriptContent = 'This is a mock transcript';

      dynamoMock.on(GetItemCommand).resolves({
        Item: {
          transcriptDocId: { S: mockTranscriptDocId }
        }
      });
      const s3Mock = mockClient(S3Client);
      s3Mock.on(GetObjectCommand).resolves({
        Body: new Readable({
          read() {
            this.push(mockTranscriptContent);
            this.push(null);
          }
        }) as any
      });

      const result = await getVideoTranscript(mockVideoId);

      expect(result).toBe(mockTranscriptContent);
      expect(dynamoMock.calls()).toHaveLength(1);
      expect(s3Mock.calls()).toHaveLength(1);
    });
  });
});