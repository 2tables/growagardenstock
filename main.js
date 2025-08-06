errorelem = false;
window.addEventListener("error", (event) => {
    if (errorelem) {
        return true; // If an error is already being displayed, ignore further errors
    }
    //black screen (but kinda transparent) before error
    errorelem = document.createElement('div');
    errorelem.className = 'black';
    document.body.appendChild(errorelem);

    //error handler
    console.log(event);
    errorelem = document.createElement('div');
    errorelem.className = 'error';
    errorelem.innerHTML = `
        <h1>Whoops!</h1>
        Looks like an error occurred. Sorry about that!<br>
        <span style="color: #AAAAAA; font-size: 12px;">
            ${event.message}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;at ${event.filename.replace(window.origin + "/", "")}:${event.lineno}:${event.colno}
        </span><br>
        <button onclick="window.location.reload()">Reload</button>
        <button onclick="history.back()">Leave</button>`;
    document.body.appendChild(errorelem);
    errorelem.style.top = (window.innerHeight / 2 - errorelem.offsetHeight / 2) + 'px';
    errorelem.style.left = (window.innerWidth / 2 - errorelem.offsetWidth / 2) + 'px';
    return true;
});
//throw new TypeError('This is a test error'); // This will trigger the error handler


/*
api.joshlei.com/v2/growagarden/stock
api.joshlei.com/v2/growagarden/weather
*/
const rarityColors = {
    'Common': '#a9a9a9',
    'Uncommon': '#52a961',
    'Rare': '#0776fd',
    'Legendary': '#fdfd00',
    'Mythical': '#a955fe',
    'Divine': '#fd5400',
    'Prismatic': 'red; animation: rainbow 10s infinite linear; -webkit-animation: rainbow 3s infinite linear;'
}

let mode = 'seed'; // 'seed', 'gear', 'egg'
let hovered = '';

// okay, so the merchant appears every 4 hours, being 12am, 4am, 8am, 12pm, 4pm, 8pm utc, and they're available for 30 minutes
// so i need to do getUTCHours() % 4 and then make it so it works
seedRestock = 0;
eggRestock = 0;
setInterval(function () {
    time = new Date();
    // seed shop restocks every 5 minutes
    if (time.getMinutes() % 5 == 0 && time.getSeconds() == 5) {
        getStock();
    }
    if (mode == 'egg') {
        distance = eggRestock - time.getTime() / 1000;
        document.getElementById('timer').innerHTML = `Restocks in ${Math.floor(distance / 60)}:${Math.floor(distance % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`
    } else if (mode == 'merchant') {
        document.getElementById('timer').innerHTML = `Restocks in ${(time.getUTCHours() % 4 - 4) * -1}:${((time.getMinutes() - 60) * -1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })} (${data.travelingmerchant_stock.merchantName})`
    } else {
        distance = seedRestock - time.getTime() / 1000;
        document.getElementById('timer').innerHTML = `Restocks in ${Math.floor(distance / 60)}:${Math.floor(distance % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`
    }

    if (hovered !== '') {
        weather_info = "";
        weather_info += `
            <div class="weathername">
                ${document.getElementById(hovered).getAttribute('name')}
            </div>`;
        weather_info += `
            <div class="weatherdesc">
                ${document.getElementById(hovered).getAttribute('desc')}<br>
                <span style="color: #AAAAAA">Ends in ${Math.floor((document.getElementById(hovered).getAttribute('end') - Date.now() / 1000) / 60)}:${Math.floor((document.getElementById(hovered).getAttribute('end') - Date.now() / 1000) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</span>
            </div>`;
        document.getElementById('weatherinfo').innerHTML = weather_info;

    }

}, 100)

async function renderItems(items, infos) {
    let html = '';
    items.forEach((item, i) => {
        let info = infos[i];
        html += `
            <div class="item">
                <img src="${item.icon}" alt="${item.display_name}"><br>
                <div class="item_name">
                <span class="item_section">
                    <span style="font-weight: bold; text-shadow: 0 4px black">${item.display_name}</span>
                        <span style="color: #AAAAAA; font-size: 25px;">
                            ${item.quantity}x
                       </span>
		               <br>
	                    <span style="font-weight: bold; color: #06FD11">
                          ${Number(info.price).toLocaleString()}&cent;
                        </span>
		                   <br>
		                <span class="rarity" style="background-color: ${rarityColors[info.rarity]}">
                           ${info.rarity}
                        </span>
	                </span>
                </span>
                <span class="item_section">
                    <span class="item_desc">
                        ${info.description}
                    </span>
                </div>
            </div>`
    });
    document.getElementById("stock").innerHTML = html;
}


async function getStock() {
    data = await fetchApi('stock')

    console.log(data)

    console.log(data.seed_stock)
    console.log(data.gear_stock)
    console.log(data.egg_stock)

    seedRestock = data.seed_stock[0].end_date_unix;
    eggRestock = new Date(`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${Math.floor(new Date().getHours())+Math.floor((new Date().getMinutes() % 60) / 30)}:${Math.floor(((new Date().getMinutes() + 30) % 60) / 30) * 30}:00`).getTime() / 1000;


    switch (mode) {
        case 'seed':
            seedInfos = await Promise.all(
                data.seed_stock.map(seed => fetchApi('info/' + seed.item_id))
            );
            renderItems(data.seed_stock, seedInfos);
            break;
        case 'gear':
            gearInfos = await Promise.all(
                data.gear_stock.map(gear => fetchApi('info/' + gear.item_id))
            );
            renderItems(data.gear_stock, gearInfos);
            break;
        case 'egg':
            eggInfos = await Promise.all(
                data.egg_stock.map(egg => fetchApi('info/' + egg.item_id))
            );
            renderItems(data.egg_stock, eggInfos);
            break;
        case 'merchant':
            merchantInfos = await Promise.all(
                data.travelingmerchant_stock.stock.map(merchant => fetchApi('info/' + merchant.item_id))
            );
            if (data.travelingmerchant_stock.stock[0].end_date_unix < time.getDate() / 1000) {
                renderItems(data.travelingmerchant_stock.stock, merchantInfos);
            } else {
                document.getElementById('stock').innerHTML = `No merchant yet`
            }
            break;
        default:
            document.getElementById('stock').innerHTML = `...okay.`
            break;
    }
    seed_html = '';
    gear_html = '';
    egg_html = '';
    merchant_html = '';
}

getStock();
hovered = '';

function switchMode(tab) {
    mode = tab;
    if (tab == 'egg') {
        document.getElementById('timer').style.background = '#FD952E';
    } else if (tab == 'gear') {
        document.getElementById('timer').style.background = '#2f73da';
    } else if (tab == 'merchant') {
        document.getElementById('timer').style.background = '#12B4FD';
    } else {
        document.getElementById('timer').style.background = '#55AD3B';
    }
    getStock();
}

async function getWeather() {
    weatherdata = await fetchApi('weather')

    console.log(weatherdata)

    weather_html = `<div class="weather">`
    for (i = 0; i < weatherdata.weather.length; i++) {
        weather = weatherdata.weather[i]
        if (weather.active) {
            weatherdata1 = await fetchApi('info/' + weather.weather_id)
            console.log(weatherdata1);
            weather_html += `
                <div class="weather_item">
                    <img src="${weather.icon}" id="${weather.weather_id}" name="${weatherdata1.display_name}" desc="${weatherdata1.description}" end="${weather.end_duration_unix}" onmouseleave="unhover()" onmouseover="hover('${weather.weather_id}')" ><br>
                </div>`
        }
        if (weather.weather_id == hovered && !weather.active) {
            hovered = "";
        }
    }
    weather_html += `</div>`

    document.getElementById('weather').innerHTML = weather_html;
}
function hover(id) {
    hovered = id;
    document.getElementById('weatherinfo').style.display = 'block';
}
function unhover() {
    hovered = '';
    document.getElementById('weatherinfo').style.display = 'none';
}
addEventListener("mousemove", (event) => {
    document.getElementById('weatherinfo').style.left = (event.pageX - document.getElementById('weatherinfo').offsetWidth) + 'px';
    document.getElementById('weatherinfo').style.top = (event.pageY - document.getElementById('weatherinfo').offsetHeight) + 'px';
})

setInterval(getWeather, 10000)
getWeather();



