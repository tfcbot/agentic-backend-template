import { reviewWebsite } from '@agent-plane/website-reviewer/adapters/secondary/openai.adapter';
import { WebsiteReviewSchema } from '@agent-plane/website-reviewer/metadata/website-reviewer.schema';
import { webTools } from '@agent-plane/website-reviewer/adapters/secondary/web-tools.adapter';

// Mock SST Resource
jest.mock('sst', () => ({
  Resource: {
    OpenAIApiKey: { value: process.env.OPENAI_API_KEY }
  }
}));

// Mock web tools adapter
// jest.mock('@agent-plane/website-reviewer/adapters/secondary/web-tools.adapter', () => ({
//   webTools: {
//     urlToMarkdown: jest.fn().mockResolvedValue(`
//       # Test Website
      
//       This is a test website content in markdown format.
      
//       ## Features
//       - Feature 1
//       - Feature 2
      
//       ## Call to Action
//       Sign up now!
//     `)
//   }
// }));

describe('Website Review Agent', () => {
  const testUrl = 'https://thumbagents.com';

  it('should generate a website review', async () => {
    const review = await reviewWebsite(testUrl);

    // Verify the review structure matches the schema
    expect(() => WebsiteReviewSchema.parse(review)).not.toThrow();

    // Verify the review contains all required sections
    expect(review.copywriting_analysis).toBeDefined();
    expect(review.copywriting_analysis.headline_effectiveness).toBeDefined();
    expect(review.copywriting_analysis.value_proposition).toBeDefined();
    expect(review.copywriting_analysis.persuasion_elements).toBeDefined();
    expect(review.copywriting_analysis.call_to_action).toBeDefined();
    expect(review.copywriting_analysis.content_engagement).toBeDefined();
    expect(review.copywriting_analysis.conversion_optimization).toBeDefined();
    expect(review.copywriting_analysis.recommendations).toBeDefined();


  }, 30000); // Increased timeout for OpenAI API call

  it('should handle website content conversion errors', async () => {
    // Mock urlToMarkdown to throw an error
    (webTools.urlToMarkdown as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to convert URL to markdown')
    );

    await expect(reviewWebsite(testUrl)).rejects.toThrow();
  });

  it('should retry on temporary failures', async () => {
    // Mock urlToMarkdown to fail once then succeed
    (webTools.urlToMarkdown as jest.Mock)
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValueOnce('# Test Website\n\nContent here');

    const review = await reviewWebsite(testUrl);
    expect(review).toBeDefined();
    expect(webTools.urlToMarkdown).toHaveBeenCalledTimes(2);
  });

  it('should include emotional analysis in the review', async () => {
    const review = await reviewWebsite(testUrl);
    
    expect(review.copywriting_analysis.headline_effectiveness.emotional_appeal)
      .toBeGreaterThanOrEqual(0);
    expect(review.copywriting_analysis.headline_effectiveness.emotional_appeal)
      .toBeLessThanOrEqual(10);
    expect(review.copywriting_analysis.content_engagement.emotional_triggers)
      .toBeInstanceOf(Array);
  });
});