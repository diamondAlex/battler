//pipes used to add info to initial data
let pipes = {
    "units":[
        function addInventory(units){
            for(let key of Object.keys(units)){
                units[key].inventory = {}
            }
            return units 
        }
    ],
    "opponents":[
        function addInventory(units){
            for(let key of Object.keys(units)){
                units[key].inventory = {}
            }
            return units 
        }
    ]
}

//data
let player_units = []
let opponent_units = []
let positions = []

let player = getItem("player")
let units = getItem("units")
let maps = getItem("maps")
let opponents = getItem("opponents")

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
    let unit = units[key]
    return unit
}

function getItem(type){
    let content = localStorage.getItem(type)
    content = JSON.parse(content)
    if(pipes[type]){
        pipes[type].forEach((e) => e(content))
    }
    return content
}

function clearOpponents(){
    opponent_units = []    
}
