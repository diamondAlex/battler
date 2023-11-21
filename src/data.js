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
let structures = getItem("quests")

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
    console.log("GENERATING ITEM")
    let item =  
        {
            "name": "helm",
            "image": "items/helm.png",
            "value":0,
            "effects":[]
        }
    items.push(item)
    player.inventory.push(item)
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

function generateStructure(type = "fort",level=3){
    let template = structures_templates[type]
    let structure = {
        name:template.name,
        image:template.image,
        level:level,
        perks:["heal"],
        description:`Starting structures, heal your units every dungeon, 
        (unlocks basic shop?)`
    }
    structures.push(structure)
}

function generateUnit(type="legio_nigra",level=1, name){
    let template = units_templates[type]
    if(name == null) name = selectRandom(list_of_names.filter((e) => e[1] == 'Male'))[0]
    let hp = template.stats.minHp + roll(template.stats.hpPerLvl,level)
    let status = getStatus(level)

    let unit = {
        name:name,
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

function selectRandomKey(obj){
    let keys = Object.keys(obj)
    let select = selectRandom(keys)
    return [obj[select],select]
}

function generateMap(type,rewards, level, levels){
    let map_type;
    if(type == null){
        [map_type, type] = selectRandomKey(maps_templates) 
    }
    else{
        map_type = maps_templates[type]
    }
    if(rewards == null){
        //temporary
        rewards = []
    }
    if(level == null){
        //temporary
        level = 1
    }
    if(levels == null){
        levels = 2
    }
    let map = {
            "levels":levels,
            "level":level,
            "name":map_type.name,
            "spawn":[
                type
            ],
            "image":"images/maps/" + maps_img_names.pop(),
            "rewards":[rewards, [() => player.resources.gold += 10*level]]
        }
    maps.push(map)
}

function getRandomMapType(){
    let types = Object.keys(maps_templates)
    return selectRandom(types)
}

function getRandomUnitType(){
    let types = Object.keys(units_templates)
    return selectRandom(types)
}

function getRandomUnitName(){
    let name = selectRandom(list_of_names)
    return name[0]
}

function generateQuest(quest, args, description = "",level=1){
    let odds = roll([0,100],1)
    if(quest == null){
        if(odds > 0){
            let name = getRandomUnitName()
            reward = [generateUnit, getRandomUnitType(), roll([1,level],1), name] 
            //todo, review the way to pick number of levels
            args = [getRandomMapType(), reward, roll([1,level],1), roll([2,level])]
            description = "Rescue " + name
            quest = generateMap
        }
        else if(odds > 50){
            //todo, review the way to pick number of levels
            args = [getRandomMapType(), [], roll([1,level],1), roll([2,level])]
            description = "Explore new dungeon"
            quest = generateMap
        }
        else{
            reward = [generateItem] 
            args = [getRandomMapType(), reward, roll([1,level],1), roll([2,level])]
            description = "Locate a new artifact"
            quest = generateMap
        }
    }
    return [() => {
        quest(...args)
    }, description]
}

//add a bunch of resource types, and make them rewards
//items/maps/unit should all be quest based
function generateReward(){
    let types = ["quest", "gold", "essence"]
    let type = selectRandom(types)
}
