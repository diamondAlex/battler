function populateLocalStorage(){
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

populateLocalStorage()
