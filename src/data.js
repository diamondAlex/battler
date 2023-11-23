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
let items = []
let player
let units = []
let game_units = []
let maps = []
let opponents = []
let quests = []
let unit_structures = []
let structures = []

let spells
//serialize
function load_game(){
    items = getItem("items")
    player = getItem("player")
    units = getItem("units")
    game_units = getItem("game_units")
    maps = getItem("maps")
    opponents = getItem("opponents")
    quests = getItem("quests")

    unit_structures = getItem("unit_structures")
    structures = getItem("structures")
}

function save(){
    console.log("saving")
    //temp
    let onBoard = 0
    if(onBoard){
        //save board state 
    }
    else{
        //ooff
        localStorage.setItem("items",JSON.stringify(items))
        localStorage.setItem("player",JSON.stringify(player))
        localStorage.setItem("units",JSON.stringify(units))
        localStorage.setItem("game_units",JSON.stringify(game_units))
        localStorage.setItem("maps",JSON.stringify(maps))
        localStorage.setItem("opponents",JSON.stringify(opponents))
        localStorage.setItem("quests",JSON.stringify(quests))
        localStorage.setItem("unit_structures",JSON.stringify(unit_structures))
        localStorage.setItem("structures",JSON.stringify(structures))
    }
}

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
    return opp
}


//Generators
function initData(){
    generatePlayer()
    generateUnit()
}

function generatePlayer(name){
    player ={
        "name": name,
        "resources":{
            "gold":0
        },
        "inventory":[
        ]
    }
}

let item_uuid = 0
function generateItem(type,level){
    console.log("GENERATING ITEM")
    if(type == null){
        type = selectRandom(Object.keys(items_templates))    
    }
    if(level == null){
        level = roll([1,10],1)
    }
    let template = items_templates[type]
    let item =  
        {
            name:selectRandom(template.quality) + " " 
                    + selectRandom(template.names) + " "
                    + selectRandom(template.qualifier),
            type:type,
            image: selectRandom(template.images),
            perks:[selectRandom(template.perks)],
            armor:roll(template.armor,level),
            uuid:item_uuid
        }
    items.push(item)
    console.log("ADDING ITEM")
    player.inventory.push(item)
    item_uuid++
}

function roll(rangeArr, amt=1){
    let total = rangeArr[0]
    let min = rangeArr[0]
    let max = rangeArr[1]
    max = max < min ? min: max;
    for(let i=0;i<amt;i++){
        total = total + Math.floor(Math.random()*(rangeArr[1] - rangeArr[0]))
    }
    return total
}

const lvlXpRatio = 1.5
const givenXpRatio = 1.3
function getStatus(lvl){ 
    if(lvl < 5) return "low"
    else if(lvl < 10) return "mid"
    else if(lvl < 20) return "high"
    else return "top"
}

function selectRandom(list){
    try{
        let index = Math.floor(Math.random() * list.length)    
        return list[index]
    }catch(err){
        console.log(err)
        console.log(list)
    }
}

function generateOpponent(type,level){
    let template = opponents_templates[type]
    let hp = template.stats.minHp + roll(template.stats.hpPerLvl,level)
    let status = getStatus(level)
    level = roll([level <= 1 ? 1: level-1, level+3],1)
    let images = opponents_img_names.filter((e) => e.includes(status))
    images = images.filter((e) => e.includes(type))
    let opponent = {
            type:type,
            name: selectRandom(template.name[status]) + ", " 
                + selectRandom(template.qualifier[status]),
            hp:hp,
            maxhp:hp,
            damage:template.stats.damage * level,
            level:level,
            exp: Math.round(10 * Math.pow(level, lvlXpRatio)),
            xpPerLvl:Math.round(10 * Math.pow(level, lvlXpRatio)),
            image: selectRandom(images),
            givenXp: Math.round(1 * Math.pow(level, givenXpRatio)),
            resources:{gold:10*level},
            inventory:[],
            spells:[]
        }
    return opponent 
}

let struct_uuid = 0
function generateStructure(type = "fort",level=3){
    let template = structures_templates[type]
    let structure = {
        name:template.name,
        image:template.image,
        uuid:struct_uuid,
        level:level,
        cost:{"gold":100},
        perks:["heal"],
        inventory:{},
        description:`Starting structures, heal your units every dungeon, 
        (unlocks basic shop?)`
    }
    struct_uuid++
    structures.push(structure)
}

function generateUnit(type="legio_nigra",level=1, name, image){
    let template = units_templates[type]
    let status = getStatus(level)
    if(name == null) name = selectRandom(list_of_names.filter((e) => e[1] == 'Male'))[0]
    if(image == null) image = selectRandom(template.images[status])
    let hp = template.stats.minHp + roll(template.stats.hpPerLvl,level)

    let unit = {
        name:name,
        type:type,
        hp:hp,
        maxhp:hp,
        hpPerLvl: template.stats.hpPerLvl,
        damage:template.stats.damage * level,
        dmgPerLvl:template.stats.dmgPerLvl,
        level:level,
        exp: 0,
        xpPerLvl:10 * Math.pow(level, lvlXpRatio),
        image: image,
        givenXp: 10 * Math.pow(level, givenXpRatio),
        inventory:{},
        spells:["heal","thunder"],
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

//todo change rewards from an [] to an [[]] so you can add multiple rewards, then deconstruct
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
        levels = 3
    }
    let map = {
            "levels":levels,
            "level":level,
            "name":selectRandom(map_type.name) + " " + selectRandom(map_type.qualifier),
            "spawn":[
                type
            ],
            "image":"images/maps/" + maps_img_names.pop(),
            "rewards":[rewards, [() => {
                console.log("SHOULD REWARD GOLD")
                player.resources.gold += 10*level
            }]]
        }
    maps.push(map)
}

//this can be simplified
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

function getRandomStructure(){
    let types = Object.keys(structures_templates)
    return selectRandom(types)
}
getRandomStructure()

function generateQuest({quest, args, description = "",level=1} = {}){
    console.log(level)
    let odds = roll([0,100],1)
    if(quest == null){
        if(odds > 80){
            let name = getRandomUnitName()
            reward = [generateUnit, getRandomUnitType(), roll([level,level+3],1), name] 
            //todo, review the way to pick number of levels
            args = [getRandomMapType(), reward, roll([level,10],1), roll([2,4+level])]
            description = "Rescue " + name
            quest = generateMap
        }
        //else if(odds > 50){
            ////todo, review the way to pick number of levels
            //args = [getRandomMapType(), [], roll([level,10],1), roll([2,4+level])]
            //description = "Explore new dungeon"
            //quest = generateMap
        //}
        else if(odds > 70){
            //todo, review the way to pick number of levels
            reward = [generateStructure, getRandomStructure(), roll([3,level],1)] 
            args = [getRandomMapType(), reward, roll([level,10],1), roll([2,4+level])]
            description = "find a new structure blueprint"
            quest = generateMap
        }
        else{
            reward = [generateItem] 
            args = [getRandomMapType(), reward, roll([level,10],1), roll([2,4+level])]
            description = "Locate a new artifact"
            quest = generateMap
        }
    }
    let built_quest =  [() => {
        quest(...args)
    }, description]
    console.log(args)
    console.log(built_quest)
    return built_quest
}

//add a bunch of resource types, and make them rewards
//items/maps/unit should all be quest based
function generateReward(){
    let types = ["quest", "gold", "essence"]
    let type = selectRandom(types)
}

function addStructure(structure){
    let newStructs = structures.filter((e) => e.uuid != structure.uuid)
    if(player.resources.gold >= structure.cost["gold"]){
        unit_structures.push(structure)
        structures = newStructs
        player.resources.gold -= structure.cost["gold"]
    }
}


function generateSpell(){
    spells = [
        {
            name:"heal",
            action: () => { console.log("casted heal") },
            animation: "animation_heal",
            target:"units",
            sound: () => {console.log("no sound effect")},
        },{
            name:"thunder",
            action: () => { console.log("casted thunder") },
            animation: "animation_thunder",
            target:"opponents",
            sound: () => {
                (new Audio("sounds/thunder.wav")).play()
            },
        }
    ]
}

generateSpell()
