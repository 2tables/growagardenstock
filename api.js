const BASE_URL = 'https://api.joshlei.com/v2/growagarden/';
const JSTUDIO_KEY = 'js_01b807c05e82f9df286fc1335695e9a770a383402f2a1b44270680df01cdacaa';

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