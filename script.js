document.getElementById('crawlerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const url = document.getElementById('urlInput').value;
    const statusElement = document.getElementById('status');
    const linksListElement = document.getElementById('linksList');
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-primary';
    spinner.role = 'status';
    const spinnerSpan = document.createElement('span');
    spinnerSpan.className = 'sr-only';
    spinnerSpan.textContent = 'Loading...';
    spinner.appendChild(spinnerSpan);
    statusElement.textContent = '';
    statusElement.appendChild(spinner);
    linksListElement.innerHTML = '';

    try {
        const links = await crawlUrl(url);
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
        statusElement.innerHTML = `<div class="alert alert-danger" role="alert">${error.message}</div>`;
    } finally {
        spinner.remove();
    }
});

async function crawlUrl(url) {
    const statusElement = document.getElementById('status');
    const linksListElement = document.getElementById('linksList');

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

        return links;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Invalid URL')) {
            throw new Error('Error: Invalid URL provided. Please make sure to include the protocol (http:// or https://).');
        } else {
            throw new Error(`An error occurred: ${error.message}`);
        }
    }
}
