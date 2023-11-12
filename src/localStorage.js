function populateLocalStorage(){
    populateMaps() 
    populateOpponents()
    populateUnits()
    populatePlayer()
}

function populatePlayer(){
    let player = {
        "name": "bob",
        "ressources":{
            "gold":0
        }
    }
    localStorage.setItem("player", JSON.stringify(player))
}

function populateMaps(){
    let maps = {
        "default":{
            "spawn":"sting"
        }
    }
    localStorage.setItem("maps", JSON.stringify(maps))
}

function populateOpponents(){
    let opponent = {
        "sting":{
            hp:10,
            maxhp:10,
            damage:1,
            exp:0,
            xpPerLvl:10,
            image:"sting.png",
            gold:10
        }
    }
    localStorage.setItem("opponents", JSON.stringify(opponent))
}

function populateUnits(){
    let units = {
        "1":{
            hp:100,
            maxhp:100,
            damage:5,
            exp:0,
            xpPerLvl:10,
            image:"1.png"
        },
        "2":{
            hp:10,
            maxhp:10,
            damage:1,
            exp:0,
            xpPerLvl:10,
            image:"2.png"
        }
    }
    localStorage.setItem("units", JSON.stringify(units))
}

populateLocalStorage()
