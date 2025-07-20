/*
api.joshlei.com/v2/growagarden/stock
api.joshlei.com/v2/growagarden/weather
*/

/*

carrot
strawberry
blueberry
orange_tulip
tomato
corn
daffodil
watermelon
pumpkin
apple
bamboo
coconut
cactus
dragon_fruit
mango
grape
mushroom
pepper
cacao
beanstalk
ember_lily
sugar_apple
burning_bud
giant_pinecone

*/
mode = 'seed'; // 'seed', 'gear', 'egg'

async function getStock(){
    res = await fetch('https://api.joshlei.com/v2/growagarden/stock')
    data = await res.json()

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
    }
}

getStock();


setInterval(function(){
    time = new Date();
    // seed shop restocks every 5 minutes
    if (time.getMinutes() % 5 == 0 && time.getSeconds() == 5) {
        getStock();
    }
    if(mode == 'egg'){
        document.getElementById('timer').innerHTML = `Restocks in ${(time.getMinutes() % 30 - 29) * -1}:${((time.getSeconds() - 60) * -1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
    } else {
        document.getElementById('timer').innerHTML = `Restocks in ${(time.getMinutes() % 5 - 4) * -1}:${((time.getSeconds() - 60) * -1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
    }
}, 1)

function switchMode(tab){
    mode = tab;
    if (tab == 'egg'){
        document.getElementById('timer').style.background = '#FD952E';
    } else if (tab == 'gear'){
        document.getElementById('timer').style.background = '#2f73da';
    } else {
        document.getElementById('timer').style.background = '#55AD3B';
    }
    getStock();
}