document.getElementById('crawlerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const url = document.getElementById('urlInput').value;

    const statusElement = document.getElementById('status');
    const linksListElement = document.getElementById('linksList');

    statusElement.textContent = 'Crawling...';
    linksListElement.innerHTML = '';

    try {
        const response = await fetch('/api/crawl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch the page');
        }

        const data = await response.json();
        const links = data.links;

        statusElement.textContent = `Found ${links.length} unique links:`;
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
});
