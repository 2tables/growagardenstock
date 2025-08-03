window.addEventListener("error", (event) => {
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
  return true;
});
//throw new TypeError('This is a test error'); // This will trigger the error handler


/*
api.joshlei.com/v2/growagarden/stock
api.joshlei.com/v2/growagarden/weather
*/
rarityColors = {
    'Common': '#a9a9a9',
    'Uncommon': '#52a961',
    'Rare': '#0776fd',
    'Legendary': '#fdfd00',
    'Mythical': '#a955fe',
    'Divine': '#fd5400',
    'Prismatic': 'red; animation: rainbow 10s infinite linear; -webkit-animation: rainbow 3s infinite linear;',
}

mode = 'seed'; // 'seed', 'gear', 'egg'

async function getStock(){
    data = await fetchApi('stock')

    console.log(data)

    console.log(data.seed_stock)
    console.log(data.gear_stock)
    console.log(data.egg_stock)
    switch (mode) {
        case 'seed':
            seed_html = '';
            // Fetch all seed info in parallel and store in an array
            seedInfos = await Promise.all(
                data.seed_stock.map(seed => fetchApi('info/' + seed.item_id))
            );
            for (let i = 0; i < data.seed_stock.length; i++) {
                seed = data.seed_stock[i];
                seedInfo = seedInfos[i];
                seed_html += `
                    <div class="item">
                        <img src="${seed.icon}" alt="${seed.display_name}"><br>
                        <div class="item_name"><span class="item_section">
                            <span style="font-weight: bold; text-shadow: 0 4px black">${seed.display_name}</span>
                                <span style="color: #AAAAAA; font-size: 25px;">${seed.quantity}x</span>
		                        <br>
	                            <span style="font-weight: bold; color: #06FD11">${Number(seedInfo.price).toLocaleString()}&cent;</span>
		                        <br>
		                        <span class="rarity" style="background-color: ${rarityColors[seedInfo.rarity]}">${seedInfo.rarity}</span>
		</span>
                        </div>
                    </div>`;
            document.getElementById('stock').innerHTML = seed_html;
            }
            break;
        case 'gear':
            gear_html = ''
            gearInfos = await Promise.all(
                data.gear_stock.map(gear => fetchApi('info/' + gear.item_id))
            );

            for (let i = 0; i < data.gear_stock.length; i++) {
                gear = data.gear_stock[i];
                gearInfo = gearInfos[i];
                gear_html += `
                    <div class="item">
                        <img src="${gear.icon}" alt="${gear.display_name}"><br>
                        <div class="item_name"><span class="item_section">
                            <span style="font-weight: bold; text-shadow: 0 4px black">${gear.display_name}</span>
                                <span style="color: #AAAAAA; font-size: 25px;">${gear.quantity}x</span>
		                        <br>
	                            <span style="font-weight: bold; color: #06FD11">${Number(gearInfo.price).toLocaleString()}&cent;</span>
		                        <br>
		                        <span class="rarity" style="background-color: ${rarityColors[gearInfo.rarity]}">${gearInfo.rarity}</span>
		                        </span>
                        </div>
                    </div>`;
            document.getElementById('stock').innerHTML = gear_html;
            }
            break;
        case 'egg':
            egg_html = ''
            eggInfos = await Promise.all(
                data.egg_stock.map(egg => fetchApi('info/' + egg.item_id))
            );
            for (let i = 0; i < data.egg_stock.length; i++) {
                egg = data.egg_stock[i];
                eggInfo = eggInfos[i];
                egg_html += `
                    <div class="item">
                        <img src="${egg.icon}" alt="${egg.display_name}"><br>
                        <div class="item_name"><span class="item_section">
                            <span style="font-weight: bold; text-shadow: 0 4px black">${egg.display_name}</span>
                                <span style="color: #AAAAAA; font-size: 25px;">${egg.quantity}x</span>
		                        <br>
	                            <span style="font-weight: bold; color: #06FD11">${Number(eggInfo.price).toLocaleString()}&cent;</span>
		                        <br>
		                        <span class="rarity" style="background-color: ${rarityColors[eggInfo.rarity]}">${eggInfo.rarity}</span>
		                        </span>
                        </div>
                    </div>`;
            }
            document.getElementById('stock').innerHTML = egg_html;
            break;
        case 'merchant':
            merchant_html = ''
            merchantInfos = await Promise.all(
                data.travelingmerchant_stock.stock.map(merchant => fetchApi('info/' + merchant.item_id))
            );
            for (let i = 0; i < data.travelingmerchant_stock.stock.length; i++) {
                merchant = data.travelingmerchant_stock.stock[i];
                merchantInfo = merchantInfos[i];
                merchant_html += `
                    <div class="item">
                        <img src="${merchant.icon}" alt="${merchant.display_name}"><br>
                        <div class="item_name"><span class="item_section">
                            <span style="font-weight: bold; text-shadow: 0 4px black">${merchant.display_name}</span>
                                <span style="color: #AAAAAA; font-size: 25px;">${merchant.quantity}x</span>
		                        <br>
	                            <span style="font-weight: bold; color: #06FD11">${Number(merchantInfo.price).toLocaleString()}&cent;</span>
		                        <br>
		                        <span class="rarity" style="background-color: ${rarityColors[merchantInfo.rarity]}">${merchantInfo.rarity}</span>
		                        </span>
                        </div>
                    </div>`;
            }
            document.getElementById('stock').innerHTML = merchant_html;
            break;   
        default:
            document.getElementById('stock').innerHTML = `<div class="error">...Got it.</div>`;
            break;
    }
    seed_html = '';
    gear_html = '';
    egg_html = '';
    merchant_html = '';
}

getStock();
hovered = '';
setInterval(function(){
    time = new Date();
    // seed shop datatocks every 5 minutes
    if (time.getMinutes() % 5 == 0 && time.getSeconds() == 5) {
        getStock();
    }
    if(mode == 'egg'){
        document.getElementById('timer').innerHTML = `Restocks in ${(time.getMinutes() % 30 - 29) * -1}:${((time.getSeconds() - 60) * -1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
    } else if (mode == 'merchant') {
        document.getElementById('timer').innerHTML = `Restocks in ${(time.getHours() % 12 - 3)}:${((time.getMinutes() - 60) * -1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} (${data.travelingmerchant_stock.merchantName})`
    } else {
        document.getElementById('timer').innerHTML = `Restocks in ${(time.getMinutes() % 5 - 4) * -1}:${((time.getSeconds() - 60) * -1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
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
                <span style="color: #AAAAAA">Ends in ${Math.floor((document.getElementById(hovered).getAttribute('end') - Date.now() / 1000) / 60)}:${Math.floor((document.getElementById(hovered).getAttribute('end') - Date.now() / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</span>
            </div>`;
        document.getElementById('weatherinfo').innerHTML = weather_info;

    }

}, 1)

function switchMode(tab){
    mode = tab;
    if (tab == 'egg'){
        document.getElementById('timer').style.background = '#FD952E';
    } else if (tab == 'gear'){
        document.getElementById('timer').style.background = '#2f73da';
    } else if (tab == 'merchant') {
        document.getElementById('timer').style.background = '#12B4FD';
    } else {
        document.getElementById('timer').style.background = '#55AD3B';
    }
    getStock();
}

async function getWeather(){
    weatherdata = await fetchApi('weather')

    console.log(weatherdata)

    weather_html = `<div class="weather">`
    for (i=0; i < weatherdata.weather.length; i++) {
        weather = weatherdata.weather[i]
        if(weather.active){
            weatherdata1 = await fetchApi('info/' + weather.weather_id)
            console.log(weatherdata1);
            weather_html += `
                <div class="weather_item">
                    <img src="${weather.icon}" id="${weather.weather_id}" name="${weatherdata1.display_name}" desc="${weatherdata1.description}" end="${weather.end_duration_unix}" onmouseleave="unhover()" onmouseover="hover('${weather.weather_id}')" ><br>
                </div>`
        }
        if(weather.weather_id == hovered && !weather.active){
            hovered = "";
        }
    }
    weather_html += `</div>`

    document.getElementById('weather').innerHTML = weather_html;
}
function hover(id){
    hovered = id;
    document.getElementById('weatherinfo').style.display = 'block';
}
function unhover(){
    hovered = '';
    document.getElementById('weatherinfo').style.display = 'none';
}
addEventListener("mousemove", (event) => {
    document.getElementById('weatherinfo').style.left = (event.pageX - document.getElementById('weatherinfo').offsetWidth) + 'px';
    document.getElementById('weatherinfo').style.top = (event.pageY - document.getElementById('weatherinfo').offsetHeight) + 'px';
})

setInterval(getWeather, 10000)
getWeather();




