import { crawlUrl } from '../crawler.js';

describe('crawlUrl', () => {
  test('should throw an error for invalid URL', async () => {
    await expect(crawlUrl('invalid-url')).rejects.toThrow('Error: Invalid URL provided. Please make sure to include the protocol (http:// or https://).');
  });

  test('should return a set of links for a valid URL', async () => {
    const mockHtml = `
      <html>
        <body>
          <a href="https://example.com/page1">Page 1</a>
          <a href="https://example.com/page2">Page 2</a>
          <a href="https://example.com/page1">Page 1 Duplicate</a>
        </body>
      </html>
    `;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(mockHtml),
      })
    );

    const links = await crawlUrl('https://example.com');
    expect(links).toEqual(new Set([
      'https://example.com/page1',
      'https://example.com/page2',
    ]));
  });

  test('should handle relative URLs correctly', async () => {
    const mockHtml = `
      <html>
        <body>
          <a href="/page1">Page 1</a>
          <a href="/page2">Page 2</a>
        </body>
      </html>
    `;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(mockHtml),
      })
    );

    const links = await crawlUrl('https://example.com');
    expect(links).toEqual(new Set([
      'https://example.com/page1',
      'https://example.com/page2',
    ]));
  });
});
