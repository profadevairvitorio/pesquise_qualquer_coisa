document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', handleSearchClick);
});

function handleSearchClick() {
    const query = getSearchQuery();
    if (!query) return;
    search(query)
        .then(displayResults)
        .catch(handleError);
}

function getSearchQuery() {
    const searchInput = document.getElementById('searchInput');
    return searchInput.value.trim();
}

async function search(query) {
    const endpoint = buildEndpoint(query);
    const response = await fetch(endpoint);
    validateResponse(response);
    const data = await response.json();
    return data.query.search;
}

function buildEndpoint(query) {
    const baseUrl = 'https://en.wikipedia.org/w/api.php';
    const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: query,
        utf8: '',
        format: 'json',
        origin: '*',
    });
    return `${baseUrl}?${params.toString()}`;
}

function validateResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    clearResults(resultsContainer);
    results.forEach(result => {
        const resultItem = createResultItem(result);
        resultsContainer.appendChild(resultItem);
    });
}

function clearResults(container) {
    container.innerHTML = '';
}

function createResultItem(result) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `https://en.wikipedia.org/?curid=${result.pageid}`;
    a.textContent = result.title;
    li.appendChild(a);
    return li;
}

function handleError(error) {
    console.error('Fetch error:', error);
}
