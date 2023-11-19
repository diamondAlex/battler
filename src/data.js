//THIS ISN't USED I THINK
let uuid = 0
let pipes = {
    "units":[
        function addInventory(units){
            for(let unit of units){
                unit.inventory = []
            }
            return units 
        },
        function addUUID(units){
            for(let unit of units){
                unit.uuid = uuid
                uuid++
            }
            return units 
        }
    ],
    "opponents":[
        function addInventory(opponents){
            for(let key of Object.keys(opponents)){
                opponents[key].inventory = []
            }
            return opponents 
        },
    ],
    "opponent_units":[
        function setStats(opponent){
            let level = currentMap.level
            opponent.level = level
        },
        function getRandomItem(opponent){
            let index = Math.floor(Math.random()* (items.length -1))
            let odds = Math.floor(Math.random()*10*opponent.level)
            if(odds > 75){
                opponent.inventory.push(items[index])
            }
        }
    ]
}

//-------------------- DATA --------------------
let player_units = []
let opponent_units = []
let positions = []

//order id important as pipes might rely on items or units
let items = getItem("items")
let player = getItem("player")
let units = getItem("units")
let game_units = getItem("game_units")
let maps = getItem("maps")
let opponents = getItem("opponents")
let quests = getItem("quests")

let nbr_levels = 0

//serialize
function insert(type, value){
    let content = localStorage.getItem(type)
    let json
    if(content){
        json = JSON.parse(content)
    }
    json = Object.assign(value,json)

    localStorage.setItem(type, JSON.stringify(json))
}

function remove(type, key){
    let content = localStorage.getItem(type)
    let json = JSON.parse(content)

    if(json[key]){
        delete json[key]
    }

    localStorage.setItem(type, JSON.stringify(json))
}

function update(type, value){
    let content = localStorage.getItem(type)
    let json = JSON.parse(content)
    let key = Object.keys(value)[0]

    if(json){
        delete json[key]
    }
    else{
        return
    }
    json = Object.assign(value, json)

    localStorage.setItem(type, JSON.stringify(json))
}

function getUnit(key){
}

function getItem(type){
    let content = localStorage.getItem(type)
    if(!content){
        localStorage.setItem(type, JSON.stringify([]))
        return []
    }
    content = JSON.parse(content)
    return content
}

function clearOpponents(){
    opponent_units = []    
}


//UTILS

function getOpponent(){
    let opponentTypes = currentMap.spawn
    let type = selectRandom(opponentTypes)
    let opp = generateOpponent(type, currentMap.level)
    pipes['opponent_units'].forEach((e) => e(opp))
    return opp
}


//Generators
function initData(){
    generatePlayer()
    generateUnit()
}

function generatePlayer(){
    let player ={
        "name": "bob",
        "resources":{
            "gold":0
        },
        "inventory":[
        ]
    }
}

function generateItem(){
    let item =  
        {
            "name": "helm",
            "image": "items/helm.png",
            "value":0,
            "effects":[]
        }
    return item
}

function roll(rangeArr, amt){
    let total = rangeArr[0]
    for(let i=0;i<amt;i++){
        total = total + Math.floor(Math.random()*(rangeArr[1] - rangeArr[0]))
    }
    return total
}

const lvlXpRatio = 1.5
const givenXpRatio = 1.3
function getStatus(lvl){ 
    if(lvl < 15) return "low"
    else if(lvl < 50) return "mid"
    else if(lvl < 90) return "high"
    else return "top"
}

function selectRandom(list){
    let index = Math.floor(Math.random() * list.length)    
    return list[index]
}

function generateOpponent(type,level){
    let template = opponents_templates[type]
    let hp = template.stats.minHp + roll(template.stats.hpPerLvl,level)
    let status = getStatus(level)

    let opponent = {
            type:type,
            name: selectRandom(template.name[status]) + ", " 
                + selectRandom(template.qualifier[status]),
            hp:hp,
            maxhp:hp,
            damage:template.stats.damage * level,
            level:level,
            exp: 10 * Math.pow(level, lvlXpRatio),
            xpPerLvl:10 * Math.pow(level, lvlXpRatio),
            image: selectRandom(template.images[status]),
            givenXp: 1 * Math.pow(level, givenXpRatio),
            inventory:[],
            spells:[]
        }
    return opponent 
}

function generateUnit(type="legio_nigra",level=1){
    let template = units_templates[type]
    let hp = template.stats.minHp + roll(template.stats.hpPerLvl,level)
    let status = getStatus(level)

    let unit = {
        name:"Sorus",
        hp:hp,
        maxhp:hp,
        hpPerLvl: template.stats.hpPerLvl,
        damage:template.stats.damage * level,
        dmgPerLvl:template.stats.dmgPerLvl,
        level:level,
        exp: 0,
        xpPerLvl:10 * Math.pow(level, lvlXpRatio),
        image: selectRandom(template.images[status]),
        givenXp: 10 * Math.pow(level, givenXpRatio),
        inventory:[],
        spells:[],
        uuid:uuid
    }
    uuid++
    units.push(unit)
}

function generateMap(rewards = []){
    let map = {
            "levels":3,
            "level":10,
            "name":"Den of Evil",
            "spawn":[
                "orc"
            ],
            "image":"images/maps/orc_1.png",
            "rewards":rewards
        }
    maps.push(map)
}

function generateQuest(reward, type){

    let quest = () => {
        reward(type)
    }
    return quest
}
