document.getElementById('crawlerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('urlInput').value;
    crawlUrl(url);
});

async function crawlUrl(url) {
    const statusElement = document.getElementById('status');
    const linksListElement = document.getElementById('linksList');

    statusElement.textContent = 'Crawling...';
    linksListElement.innerHTML = '';

    try {
        // Validate URL
        new URL(url);

        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status.http_code !== 200) {
            throw new Error('Failed to fetch the page');
        }

        const html = data.contents;
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

        statusElement.textContent = `Found ${links.size} unique links:`;
        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link;
            a.textContent = link;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            li.appendChild(a);
            linksListElement.appendChild(li);
        });

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Invalid URL')) {
            statusElement.textContent = 'Error: Invalid URL provided. Please make sure to include the protocol (http:// or https://).';
        } else {
            statusElement.textContent = `An error occurred: ${error.message}`;
        }
    }
}
