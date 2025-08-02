const BASE_URL = 'https://api.joshlei.com/v2/growagarden/';
const JSTUDIO_KEY = 'js_' + process.env.JSTUDIO_KEY;

async function fetchApi(endpoint, params = '') {
    const url = BASE_URL + endpoint + params;
    const response = await fetch(url, {
        headers: {
            'jstudio-key': JSTUDIO_KEY
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

// Make fetchApi available globally without overwriting fetch
window.fetchApi = fetchApi;