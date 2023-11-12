//data
let player_units = []

let positions = []

let opponent_units = []

let player = getItem("player")

let units = getItem("units")
let maps = getItem("maps")
let opponents = getItem("opponents")

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

function get(type, key){
    let content = localStorage.getItem(type)
    let json = JSON.parse(content)
    let value = json[key]
    return value
}

function getItem(type){
    let content = localStorage.getItem(type)
    return JSON.parse(content)
}
