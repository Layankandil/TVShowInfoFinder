// Event listener for the search form submission
document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    fetchShows(document.getElementById('query').value);
});

// Clear results button
document.getElementById('clearResults').addEventListener('click', () => {
    document.getElementById('results').innerHTML = '';
    document.getElementById('query').value = '';
    document.getElementById('errorMessage').style.display = 'none';
});

// Live feedback on keyup event
document.getElementById('query').addEventListener('keyup', () => {
    if (this.value.length > 0) {
        document.getElementById('errorMessage').style.display = 'none';
    }
});

// Fetch shows from the API
function fetchShows(query) {
    const url = `https://api.tvmaze.com/search/shows?q=${query}`;
    const loadingDiv = document.getElementById('loading');
    
    loadingDiv.style.display = 'block';

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch data. Please try again later.');
            return response.json();
        })
        .then(data => {
            loadingDiv.style.display = 'none';
            if (data.length === 0) return showError('No shows found for your search.');
            displayResults(data);
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            showError(error.message);
        });
}

// Display results on the page
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = data.map(item => {
        const show = item.show;
        return `
            <div class="show-card">
                <h2>${show.name}</h2>
                <img src="${show.image ? show.image.medium : 'https://via.placeholder.com/210x295'}" alt="${show.name}">
                <p><strong>Description:</strong> ${show.summary ? show.summary.replace(/<\/?[^>]+(>|$)/g, "") : "No summary available."}</p>
                <p><strong>Genres:</strong> ${show.genres.join(', ')}</p>
                <p><strong>Rating:</strong> ${show.rating.average || 'N/A'}</p>
                <p><strong>Premiered:</strong> ${show.premiered || 'N/A'}</p>
                <p><strong>Status:</strong> ${show.status || 'N/A'}</p>
                <p><strong>End Date:</strong> ${show.ended || 'Ongoing'}</p>
                <p><strong>Language:</strong> ${show.language || 'N/A'}</p>
                <p><strong>Network:</strong> ${show.network ? show.network.name : 'N/A'}</p>
            </div>
        `;
    }).join('');
}

// Show error messages to the user
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}