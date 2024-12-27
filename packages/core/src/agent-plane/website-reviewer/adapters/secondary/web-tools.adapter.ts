export const webTools = {
  urlToMarkdown: async (url: string): Promise<string> => {
    try {
      const mdUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
      const response = await fetch(mdUrl);
      if (!response.ok) {
        throw new Error(`Failed to convert URL to markdown: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error converting URL to markdown:', error);
      throw error;
    }
  }
};
