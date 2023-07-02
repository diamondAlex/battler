//we'll see if this is fine
let files = {
    "player" : "../data/players.js",
    "units" : "../data/units.js"
}

let insert = (type, value) =>{
    let content = localStorage.getItem(type)
    let json
    if(content){
        json = JSON.parse(content)
    }
    json = Object.assign(value,json)

    localStorage.setItem(type, JSON.stringify(json))
}

let remove = (type, key) =>{
    let content = localStorage.getItem(type)
    let json = JSON.parse(content)

    if(json[key]){
        delete json[key]
    }

    localStorage.setItem(type, JSON.stringify(json))

}

let update = (type, value) =>{
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
