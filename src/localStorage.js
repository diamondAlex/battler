function populateLocalStorage(){
    populateMaps() 
    populatePlayer()
    populateItems()
}

function populatePlayer(){
    let player = {
        "name": "bob",
        "resources":{
            "gold":0
        },
        "inventory":[
            {
                "name": "helm",
                "image": "items/helm.png",
                "value":0,
                "effects":[]
            },
            {
                "name": "helm",
                "image": "items/helm.png",
                "value":0,
                "effects":[]
            },
            {
                "name": "helm",
                "image": "items/helm.png",
                "value":0,
                "effects":[]
            },
        ]
    }
    localStorage.setItem("player", JSON.stringify(player))
}

function populateItems(){
    let items = [
        {
            "name": "helm",
            "image": "items/helm.png",
            "value":0,
            "effects":[]
        }
    ]
    localStorage.setItem("items", JSON.stringify(items))
}

function populateMaps(){
    let maps = [
        {
            "levels":3,
            "level":1,
            "name":"Den of Evil",
            "spawn":[
                "orc",
            ],
            "image":"images/maps/orc_1.png"
        },
        {
            "levels":2,
            "level":4,
            "name":"Depths of Moria",
            "spawn":[
                "orc",
            ],
            "image":"images/maps/dungeon2.png"
        }
    ]

    localStorage.setItem("maps", JSON.stringify(maps))
}

populateLocalStorage()
