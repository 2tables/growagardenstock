/*
api.joshlei.com/v2/growagarden/stock
api.joshlei.com/v2/growagarden/weather
*/
mode = 'seed'; // 'seed', 'gear', 'egg'

async function getStock(){
    data = await fetchApi('stock')

    console.log(data)

    console.log(data.seed_stock)
    console.log(data.gear_stock)
    console.log(data.egg_stock)
    switch (mode) {
        case 'seed':
            seed_html = ''
            for (i=0; i < data.seed_stock.length; i++) {
                seed = data.seed_stock[i]
                seed_html += `
                    <div class="item">
                        <img src="${seed.icon}" alt="${seed.display_name}"><br>
                        <div class="item_name">
                            <span style="font-weight: bold; text-shadow: 0 4px black">${seed.display_name}</span><br>
                            <span style="color: #AAAAAA">x${seed.quantity} Stock</span>
                        </div>
                    </div>`
            }
            document.getElementById('stock').innerHTML = seed_html;
            break;
        case 'gear':
            gear_html = ''
            for (i=0; i < data.gear_stock.length; i++) {
                gear = data.gear_stock[i]
                gear_html += `
                    <div class="item">
                        <img src="${gear.icon}" alt="${gear.display_name}"><br>
                        <div class="item_name">
                            <span style="font-weight: bold; text-shadow: 0 4px black">${gear.display_name}</span><br>
                            <span style="color: #AAAAAA">x${gear.quantity} Stock</span>
                        </div>
                    </div>`
            }
            document.getElementById('stock').innerHTML = gear_html;
            break;
        case 'egg':
            egg_html = ''
            for (i=0; i < data.egg_stock.length; i++) {
                egg = data.egg_stock[i]
                egg_html += `
                    <div class="item">
                        <img src="${egg.icon}" alt="${egg.display_name}"><br>
                        <div class="item_name">
                            <span style="font-weight: bold; text-shadow: 0 4px black">${egg.display_name}</span><br>
                            <span style="color: #AAAAAA">x${egg.quantity} Stock</span>
                        </div>
                    </div>`
            }
            document.getElementById('stock').innerHTML = egg_html;
            break;
        case 'merchant':
            merchant_html = ''
            for (i=0; i < data.travelingmerchant_stock.stock.length; i++) {
                merchant = data.travelingmerchant_stock.stock[i]
                merchant_html += `
                    <div class="item">
                        <img src="${merchant.icon}" alt="${merchant.display_name}"><br>
                        <div class="item_name">
                            <span style="font-weight: bold; text-shadow: 0 4px black">${merchant.display_name}</span><br>
                            <span style="color: #AAAAAA">x${merchant.quantity} Stock</span>
                        </div>
                    </div>`
            }
            document.getElementById('stock').innerHTML = merchant_html;
            break;   
    }
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
            data1 = await fetchApi('info/' + weather.weather_id)
            weatherdata1 = await data1.json()
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
