let uuid = 0
//THIS ISN't USED I THINK
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
let player_structures = []
let structures = []
let completedMaps = []
let workers = []
let dead_units = []
//serialize
//not sure if this will prevent loading empty games or broken games
function load_game(){
    player = getItem("player")
    console.log(player)
    if(player.length == 0){
        return false
    }
    items = getItem("items")
    units = getItem("units")
    game_units = getItem("game_units")
    maps = getItem("maps")
    opponents = getItem("opponents")
    quests = getItem("quests")
    completedMaps = getItem("completedMaps")
    workers = getItem("workers")
    dead_units = getItem("dead_units")

    player_structures = getItem("unit_structures")
    structures = getItem("structures")
    uuid = units.length == 0 ? 0: Math.max(...(units.map((e) => e.uuid))) + 1
    item_uuid = items.length == 0 ? 0 :Math.max(...(items.map((e) => e.uuid))) + 1
    struct_uuid = structures.length == 0 ? 0: Math.max(...(structures.map((e) => e.uuid))) + 1
    map_uuid = structures.length == 0 ? 0: Math.max(...(structures.map((e) => e.uuid))) + 1
    return true
}

function save(){
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
        localStorage.setItem("unit_structures",JSON.stringify(player_structures))
        localStorage.setItem("structures",JSON.stringify(structures))
        localStorage.setItem("completedMaps",JSON.stringify(completedMaps))
        localStorage.setItem("workers",JSON.stringify(workers))
        localStorage.setItem("dead_units",JSON.stringify(workers))
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
            "gold":120
        },
        "workers":{
    
        },
        "inventory":[
        ]
    }
}

let item_uuid = 0
function generateItem(type,level){
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
            //perks:[selectRandom(template.perks)],
            armor:roll(template.armor,level),
            damage:roll(template.damage,level),
            uuid:item_uuid
        }
    items.push(item)
    player.inventory.push(item)
    item_uuid++
}

function roll(rangeArr, amt=1){
    let total = 0
    let min = rangeArr[0]
    let max = rangeArr[1]
    max = max < min ? min: max;
    for(let i=0;i<amt;i++){
        total = total + rangeArr[0] + Math.round(Math.random()*(rangeArr[1] - rangeArr[0]))
    }
    return total
}

const lvlXpRatio = 2
const givenXpRatio = 2
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
    level = roll([level <= 1 ? 1: level-1, level+2],1)
    let hp = template.stats.minHp + roll(template.stats.hpPerLvl,level)
    let status = getStatus(level)
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
        armor:template.stats.armor * level,
        speed: roll(template.stats.speed,level),
        exp: Math.round(10 * Math.pow(level, lvlXpRatio)),
        xpPerLvl:Math.round(10 * Math.pow(level, lvlXpRatio)),
        image: selectRandom(images),
        givenXp: Math.round(1 * Math.pow(level, givenXpRatio)),
        resources:{gold:10*level},
        inventory:[],
        spells:[],
        owner:"opponent"
        }
    return opponent 
}

let struct_uuid = 0
function generateStructure(type = "tavern",level=1){
    let template = structures_templates[type]
    let exists = structures.find((e) => e.name == type)
    if(exists){
        exists.amt += 1 
    }
    else{
        let structure = {
            name:template.name,
            image:template.image,
            uuid:struct_uuid,
            level:level,
            cost:{"gold":100},
            perks:template.perks,
            description:template.description,
            amt:1
        }
        struct_uuid++
        structures.push(structure)
        return structure
    }
    return null
}

function generateUnit({type, unitClass,level=1, name, image} = {}){
    if(type == null) type = selectRandom(Object.keys(types_templates))
    if(unitClass == null) unitClass = selectRandom(Object.keys(classes_templates))
    let type_template = types_templates[type]
    let class_template = classes_templates[unitClass]
    let status = getStatus(level)
    if(name == null) name = selectRandom(list_of_names.filter((e) => e[1] == 'Male'))[0]
    if(image == null) image = selectRandom(units_img_names)
    let hp = type_template.stats.minHp + 
        roll(type_template.stats.hpPerLvl,level) + 
        roll(class_template.stats.hpPerLvl,level)
    let damage = roll(type_template.stats.dmgPerLvl,level) + 
        roll(class_template.stats.dmgPerLvl,level)
    let mana = class_template.stats.mana + class_template.stats.manaPerLvl * level

    let unit = {
        name:name,
        type:type,
        class:unitClass,
        level:level,
        hp:hp,
        maxhp:hp,
        mana:mana,
        maxmana:mana,
        armor:type_template.stats.armor *level,
        speed: class_template.stats.speed * level,
        hpPerLvl:
        [   
            type_template.stats.hpPerLvl[0] + class_template.stats.hpPerLvl[0],
            type_template.stats.hpPerLvl[1] + class_template.stats.hpPerLvl[1]
        ],
        damage:damage,
        dmgPerLvl:
        [   
            type_template.stats.dmgPerLvl[0] + class_template.stats.dmgPerLvl[0],
            type_template.stats.dmgPerLvl[1] + class_template.stats.dmgPerLvl[1]
        ],
        exp: 0,
        xpPerLvl:100 * Math.pow(level, lvlXpRatio),
        buffs:[],
        inventory:{},
        spells:[],
        selectedSpell:"",
        image: image,
        uuid:uuid,
        owner:"unit"
    }
    type_template.spells.forEach((e) => {
        if(!unit.spells.includes(e)){
            unit.spells.push(e)
        }
    })
    class_template.spells.forEach((e) => {
        if(!unit.spells.includes(e)){
            unit.spells.push(e)
        }
    })
    uuid++
    units.push(unit)
}

function selectRandomKey(obj){
    let keys = Object.keys(obj)
    let select = selectRandom(keys)
    return [obj[select],select]
}

//todo change rewards from an [] to an [[]] so you can add multiple rewards, then deconstruct
let map_uuid = 0
function generateMap({type,rewards=[], level=1, levels=3,description}={}){
    let template;
    if(type == null){
        [template, type] = selectRandomKey(maps_templates) 
    }
    else{
        template = maps_templates[type]
    }
    let image = selectRandom(maps_img_names.filter((e) => e.includes(type)))

    let map_resources = template.resources[getStatus(level)]
    let map = {
            "levels":levels,
            "level":level,
            "name":selectRandom(template.name) + " " + selectRandom(template.qualifier),
            "spawn":[
                type
            ],
            "image":image,
            "rewards":[...rewards, 
                [() => {
                    for(let map_resource of map_resources){
                        if(player.resources[map_resource]){
                            player.resources[map_resource] += 10*level
                        }
                        else{
                            player.resources[map_resource] = 10
                        }
                    }
                }]
            ],
            "description":description,
            "uuid":map_uuid
        }
    map_uuid++
    maps.push(map)
    return map
}

//this can be simplified
function getRandomMapType(){
    let types = Object.keys(maps_templates)
    return selectRandom(types)
}

function getRandomUnitType(){
    let types = Object.keys(types_templates)
    return selectRandom(types)
}

function getRandomUnitClass(){
    let unitClass = Object.keys(classes_templates)
    return selectRandom(unitClass)
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

let quest_uuid = 0
function generateQuest({quest, args, description = "",level=1} = {}){
    let odds = roll([0,100],1)
    let rolled_level = roll([level,level+1],1)
    if(quest == null){
        if(odds > 85){
            let name = getRandomUnitName()
            description = "Rescue " + name
            reward = [generateUnit, {   type:getRandomUnitType(), 
                                        unitClass:getRandomUnitClass(), 
                                        level:roll([level,level+1],1), 
                                        name:name,
            }] 
            //todo, review the way to pick number of levels
            args = {type:getRandomMapType(), rewards:[reward], level:rolled_level, levels:roll([2,2+level]),description:description}
            quest = generateMap
        }
        else if(odds > 70){
            reward = [generateItem] 
            description = "Locate a new artifact"
            args = {type:getRandomMapType(), rewards:[reward], level:rolled_level, levels:roll([2,2+level]), description:description}
            quest = generateMap
        }
        else if(odds > 55){
            //todo, review the way to pick number of levels
            description = "find a new blueprint"
            reward = [generateStructure, getRandomStructure(), roll([3,level],1)] 
            args = {type:getRandomMapType(), rewards:[reward], level:rolled_level, levels:roll([2,2+level]), description:description}
            quest = generateMap
        }
        else{
            //todo, review the way to pick number of levels
            let d_type = getRandomMapType()
            description = "Explore new " + d_type + " dungeon"
            reward = [generateCompletedMap, roll([1,level+1],1)] 
            args = {type:d_type, rewards:[reward], level:rolled_level, levels:roll([2,2+level]), description:description}
            quest = generateMap
        }
    }
    let built_quest =  [() => {
        quest(args)
    }, description, quest_uuid,rolled_level]
    quest_uuid++
    quests.push(built_quest)
}

function generateCompletedMap(level){
    finishMap(generateMap({level:level}))
}

function addStructure(structure){
    if(player.resources.gold >= structure.cost["gold"]){
        let newStructs
        if(structure.amt > 1){
            structure.amt --
        }
        else{
            newStructs = structures.filter((e) => e.uuid != structure.uuid)
        }

        let existing_struct = player_structures.find((e) => e.name == structure.name)
        if(existing_struct){
            existing_struct.level += 1
        }
        else{
            player_structures.push(structure)
        }
        if(newStructs)
            structures = newStructs
        player.resources.gold -= structure.cost["gold"]
    }
    else{
        alert("No enough gold!")
    }
}

spells= [
    {
        name:"cleave",
        mana:5,
        fullname:"",
        description:"Does 5 + unit.level damage to the two leftmost units",
        action: (targets, unit) => { 
            let hits = 2
            let tries = 3
            let hitTarget = []
            while(hits > 0 && tries >= 0){
                let target = targets[tries]
                if(target.hp > 0){
                    target.hp -= 5 + unit.level 
                    hits--
                    hitTarget.push(targets[tries])
                }
                tries--
            }
            return hitTarget
        },
        animation: "animation_cleave",
        target:"opponents",
        sound: () => {
            (new Audio("sounds/sword.wav")).play()
        },
    },
    {
        name:"absorb",
        mana:5,
        fullname:"",
        description:"Does 12 + level damage to a unit, heals for 5+level if it kills it",
        action: (targets,unit) => { 
            let valid_targets = targets.filter((e) => e.hp > 0)
            if(valid_targets.length == 0) return null
            let target = selectRandom(valid_targets)
            target.hp -= 12 + unit.level
            if(target.hp <= 0){
                unit.hp += 5 + unit.level
                if(unit.hp > unit.maxhp){
                    unit.hp = unit.maxhp
                }
            }
            return [target]
        },
        animation: "animation_absorb",
        target:"opponents",
        sound: () => {
            (new Audio("sounds/magic.wav")).play()
        },
    },
    {
        name:"heal",
        mana:5,
        fullname:"",
        description:"Heals for 2+unit.level hp",
        action: (targets, unit) => { 
            for(let target of targets){
                if(target.hp < 0) continue
                target.hp += 2 + unit.level
                if(target.hp > target.maxhp){
                    target.hp = target.maxhp
                }
            }
        },
        animation: "animation_heal",
        target:"units",
        sound: () => {
            (new Audio("sounds/heal.wav")).play()
        },
    },{
        name:"thunder",
        mana:5,
        fullname:"",
        description:"Does 4 + unit.level damage to all enemies",
        action: (targets,unit) => { 
            for(let target of targets){
                target.hp -= 4 + Math.floor(unit.level)
            }
        },
        animation: "animation_thunder",
        target:"opponents",
        sound: () => {
            (new Audio("sounds/thunder.wav")).play()
        },
    },{
        name:"burn",
        mana:5,
        fullname:"",
        description:"Does 13 + unit.level * 1.5 damage to one opponent",
        action: (targets, unit) => { 
            let valid_targets = targets.filter((e) => e.hp > 0)
            if(valid_targets.length == 0) return null
            let target = selectRandom(valid_targets)
            target.hp -= 13 + Math.floor(unit.level*1.5)
            return [target]
        },
        animation: "animation_burn",
        target:"opponents",
        sound: () => {
            (new Audio("sounds/burn.wav")).play()
        },
    },{
        name:"lifesteal",
        mana:5,
        fullname:"Lifesteal",
        description:"Does 10 + 1.5 unit.level damage and heals for 5 + 1.5 unit.level",
        action: (targets, unit) => { 
            let valid_targets = targets.filter((e) => e.hp > 0)
            if(valid_targets.length == 0) return null
            let target = selectRandom(valid_targets)
            target.hp -= 10 + Math.floor(unit.level*1.5)
            unit.hp += 5 + Math.floor(unit.level*1.5)
            unit.hp = unit.hp > unit.maxhp ? unit.maxhp : unit.hp;
            return [target]
        },
        animation: "animation_burn",
        target:"opponents",
        sound: () => {
            (new Audio("sounds/burn.wav")).play()
        },
    },{
        name:"sworddance",
        mana:5,
        fullname:"Sword Dance",
        description:"Does 10 + unit.level*1.5 damage to the rightmost unit, extra damage is done to the left most unit",
        action: (targets, unit) => { 
            let valid_targets = targets.filter((e) => e.hp > 0)
            if(valid_targets.length == 0) return null
            let target = valid_targets.slice(-1)
            target[0].hp -= 10 + Math.floor(unit.level*1.5)
            if(target[0].hp < 0){
                overkill = target[0].hp * -1
                valid_targets[0].hp -= overkill
                target.push(valid_targets[0])
            }
            return target
        },
        animation: "animation_cleave",
        target:"opponents",
        sound: () => {
            (new Audio("sounds/sword.wav")).play()
        },
    }
]

let perks = {}
let week = 0
let week_info = []

function runPerks(){
    for(let structure of player_structures){
        for(let perk of structure.perks){
            perks[perk](structure)
        }
    }
    week++
}
function setupPerks(){
    perks = {
        "rest": (source) => {
            let heal = 5*source.level
            let total = 0
            for(let unit of units){
                if(player.resources.gold >= 5){
                    total+=5
                    player.resources.gold -= 5
                    unit.hp += 5
                    unit.hp = unit.hp > unit.maxhp ? unit.maxhp :unit.hp;
                    unit.mana += 5
                    unit.mana = unit.mana > unit.maxmana ? unit.maxmana :unit.mana;
                }
            }
            week_info.push("Week " + week + ": The " + source.name + " has healed your units by " + heal + "for a total of " + total + " gold.")
        },
        "interest": (source) =>{
            let interest = 
            Math.round(
                (player.resources.gold * Math.pow(1.01,source.level)) 
                - player.resources.gold
            )
            player.resources.gold += interest
            week_info.push("Week " + week + ": The " + source.name + " has earned you " + interest + " gold") 
        },
        "labor": (source) =>{
            console.log("LABOR")
            //week_info.push("Week " + week + ": The " + source.name + " has earned you " + interest) 
        },
        "upkeep": (source) =>{
            let buff = 2 * source.level
            for(let unit of units){
            }
            week_info.push("Week " + week + ": The " + source.name + " has refurbished your armors for "+ buff) 
        },
        "exotictrade": (source) =>{
            console.log("TRADE")
        },
        "inspire": (source) =>{
            let buff = 2 * source.level
            for(let unit of units){
                unit.buffs.damage = [() => {
                    unit.damage += buff
                }, () => {
                    unit.damage -= buff
                }]
            }
            week_info.push("Week " + week + ": The " + source.name + " has inspired your units to do "+ buff + " extra damage") 
        },
        "quests": (source) => {
            let level = source.level * 1
            let odds = Math.round(Math.random()*100)
            if(odds > 90){
                generateQuest({level:level})
                week_info.push("Week " + week + ": The " + source.name + " has gifted you a quest!")
            }
        },
        "feed": (source) => {
            //this is for the eventual feeding of orc recruits
            console.log("feed")
        },
    }
}
setupPerks()

function finishMap(map){
    completedMaps.push(...maps.filter((e) => e.uuid == map.uuid))
    maps = maps.filter((e) => e.uuid != map.uuid)
    map.idledUnits = []
    currentMap = ""
}
