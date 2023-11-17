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
        },
        "inventory":{}
    }
    localStorage.setItem("player", JSON.stringify(player))
}

function populateMaps(){
    let maps = {
        "default":{
            "levels":5,
            "level":1,
            "name":"default",
            "spawn":[
                "orc_l_1",
                "orc_l_2",
                "orc_l_3",
            ]
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
            gold:10,
            givenXp:10
        },
        "orc_l_1":{
            hp:20,
            maxhp:20,
            damage:3,
            exp:0,
            xpPerLvl:10,
            image:"orc_l_1.png",
            gold:10,
            givenXp:20
        },
        "orc_l_2":{
            hp:35,
            maxhp:35,
            damage:2,
            exp:0,
            xpPerLvl:10,
            image:"orc_l_2.png",
            gold:10,
            givenXp:20
        },
        "orc_l_3":{
            hp:50,
            maxhp:50,
            damage:5,
            exp:0,
            xpPerLvl:10,
            image:"orc_l_3.png",
            gold:10,
            givenXp:30
        },
    }
    localStorage.setItem("opponents", JSON.stringify(opponent))
}

function populateUnits(){
    let units = {
        "1":{
            name:"",
            hp:100,
            maxhp:100,
            damage:5,
            exp:0,
            xpPerLvl:10,
            lvl:0,
            image:"char_f_1.png"
        },
        "2":{
            name:"",
            hp:10,
            maxhp:10,
            damage:1,
            exp:0,
            xpPerLvl:10,
            lvl:0,
            image:"char_f_2.png",
            spell:"heal"
        }
    }
    localStorage.setItem("units", JSON.stringify(units))
}

populateLocalStorage()
