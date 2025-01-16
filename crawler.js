import cheerio from 'cheerio';

// Custom headers to mimic a regular browser
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
};

async function crawlUrl(url) {
  try {
    // Validate URL
    new URL(url);

    console.log(`Crawling: ${url}`);
    const response = await fetch(url, { headers });
    const html = await response.text();

    // Parse HTML and extract links
    const $ = cheerio.load(html);
    const links = new Set();

    $('a').each((i, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, url).href;
          links.add(absoluteUrl);
        } catch (error) {
          console.warn(`Invalid URL: ${href}`);
        }
      }
    });

    console.log(`Found ${links.size} unique links:`);
    links.forEach(link => console.log(link));

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Invalid URL')) {
      console.error('Error: Invalid URL provided. Please make sure to include the protocol (http:// or https://).');
    } else {
      console.error('An error occurred:', error.message);
    }
  }
}

// Example usage
const targetUrl = 'https://comick.io/comic/a-tale-of-the-two-tigers';
crawlUrl(targetUrl);

