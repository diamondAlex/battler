const ITERATION_TIME = 5000
let current_dialog = ""
let idler_selected_unit = ""

//the engine shouldn't be working on intervals it should take a start time and end time to simulated idling
function runIdlerEngine(){
    for(let map of completedMaps){
            if(map.idledUnits.length > 0){
                for(let unit of map.idledUnits){
                    if(unit.hp > 1){
                        setXp(5 * map.level, [unit]) 
                        unit.hp -= 1
                        //update dialog?
                        if(current_dialog == unit.uuid){
                            document.getElementById("dialog_idler").innerHTML = displayUnitInfoOnBoardPanel(unit)
                        }
                    }
                }
            let amt = map.idledUnits.length
            if(amt > 0){
                let odds = Math.floor(Math.random()*100)
                let cap = 90 - (map.level* amt)
                if(odds > cap){
                    generateQuest({level:map.level})
                    updateQuestPanel()
                }
                odds = Math.floor(Math.random()*100)
                cap = 95 - (map.level* amt)
                if(odds > cap){
                    addWorker()
                }
            }
        }
    }
}

function addWorker(map){
    let types = map.spawn    
    let type = selectRandom(types)
    player.workers[type] ? player.workers[type] += 1: player.workers[type] = 1;
}

function idler_timer(){
    console.log("starting timer")
    setInterval(runIdlerEngine, ITERATION_TIME)
}
idler_timer()

function idler_generate(option){
    switch ( option ){
        case "dungeon":
            idler_generate_dungeon()
            break;
        case "town":
            idler_generate_town()
    }
}

//INTERFACE
function idler_generate_town(){
    let panel = document.getElementById("idler_game_div")
    panel.innerHTML = ""
    let struct_div = document.createElement("div")
    struct_div.id = "idler_struct_div"
    struct_div.className = "idler_struct_div"

    let worker_div = document.createElement("div")
    worker_div.id = "idler_worker_div"
    worker_div.className = "idler_worker_div"

    panel.appendChild(struct_div)
    panel.appendChild(worker_div)

    for(let struct of player_structures){
        let item = document.createElement("div")
        item.id = "idler_struct_div" + struct.uuid
        item.className = "idler_item"

        let dialog = document.createElement("dialog")
        dialog.id = "dialog_struct_" + struct.uuid
        dialog.className = "idler_dialog"

        item.appendChild(dialog)

        let image = document.createElement("img")
        image.id = "idler_struct_img" + struct.uuid
        image.className = "idler_item_struct_img"
        image.src = struct.image

        image.addEventListener("mouseover", (e) => {
            let id = e.target.id.slice(-1)
            const dialog = document.getElementById("dialog_struct_" + id)
            dialog.innerHTML = struct.name
            dialog.show()
        })
        image.addEventListener("mouseout", (e) => {
            let id = e.target.id.slice(-1)
            const dialog = document.getElementById("dialog_struct_" + id)
            dialog.close()
        })

        item.appendChild(image)
        struct_div.appendChild(item)
    }
    
    for(let type of Object.keys(player.workers)){
        let div = document.createElement("div")
        div.style.margin = "5px"
        let img = document.createElement("img")
        img.src = "images/workers/worker_orc.png"
        img.width = 40
        img.height = 80
        div.innerHTML += player.workers[type] + " x " 
        div.appendChild(img)
        worker_div.appendChild(div)
    }
}
function idler_generate_dungeon(){
    let dialog_panel = document.getElementById("idler_panel")

    const dialog = document.createElement("dialog")
    dialog.id = "dialog_idler"
    dialog.className = "idler_dialog"
    dialog_panel.appendChild(dialog)

    let panel = document.getElementById("idler_game_div")
    panel.innerHTML = ""

    let map_div = document.createElement("div")
    map_div.id = "idler_map_div"
    map_div.className = "idler_map_div"
    
    panel.appendChild(map_div)
    
    let unit_div = document.createElement("div")
    unit_div.id = "idler_unit_div"
    unit_div.className = "idler_unit_div"

    panel.appendChild(unit_div)
    
    for(let map of completedMaps){
        let button = document.createElement("button")
        button.innerHTML = "x"
        button.className = "idler_map_button"
        button.value = map.uuid

        //remove a map
        button.addEventListener("click" ,(e) =>{
            e.stopPropagation()
            let res = confirm("Are you sure?")
            if(res){
                completedMaps = completedMaps.filter((map) => map.uuid != e.target.value)
                e.target.parentElement.remove()
            }
        })

        let item = document.createElement("div")
        item.id = "idler_map_div" + map.uuid
        item.value = map.uuid
        item.className = "idler_item"

        let image = document.createElement("img")
        image.id = "idler_map_img" + map.uuid
        image.className = "idler_item_map_img"
        image.src = map.image
        image.value = map.uuid

        item.addEventListener("click", setIdleUnit)
        image.addEventListener("mouseover", (e) => {
            let dialog = document.getElementById("dialog_idler")
            current_dialog = -1
            dialog.innerHTML = displayInfo(map,["name","level","levels", "spawn"])
            dialog.show()
        })
        image.addEventListener("mouseout", (e) => {
            let dialog = document.getElementById("dialog_idler")
            dialog.close()
        })

        item.appendChild(image)
        item.appendChild(button)
        map_div.appendChild(item)

        let units = map.idledUnits

        for(let unit of units){
            let image = document.createElement("img")
            image.value = unit.uuid
            image.id = "idler_unit_img" + unit.uuid
            image.className = "idler_map_unit_img"
            image.src = unit.image

            image.addEventListener("click", rightPanelEvents)
            image.addEventListener("mouseover", eventMouseIn)        
            image.addEventListener("mouseout",  eventMouseOut)
            item.appendChild(image)
        }
    }

    //units that are not idling
    let units_for_right_panel = findNonIdledUnits()
    for(let unit of units_for_right_panel){
        let item = document.createElement("div")
        item.id = "idler_unit_div" + unit.uuid
        item.className = "idler_item_unit"

        let image = document.createElement("img")
        image.value = unit.uuid
        image.id = "idler_unit_img" + unit.uuid
        image.className = "idler_item_img_unit"
        image.src = unit.image

        image.addEventListener("click", idler_unit_select_event)
        image.addEventListener("mouseover", eventMouseIn)        
        image.addEventListener("mouseout",  eventMouseOut)
        item.appendChild(image)
        unit_div.appendChild(item)
    }
}

function findNonIdledUnits(){
    let idledUnits = []
    completedMaps.forEach((e) => idledUnits.push(...e.idledUnits))
    let idledUuids = idledUnits.map((e) => e.uuid)
    let filtered = units.filter((e) => !idledUuids.includes(e.uuid))
    
    return filtered
}

function findIdledUnits(){
    let idledUnits = []
    completedMaps.forEach((e) => idledUnits.push(...e.idledUnits))
    return idledUnits
}

//set the selected unit to idle 
function setIdleUnit(e){
    if(idler_selected_unit != null){
        let unit = units.find((unit) => unit.uuid == idler_selected_unit.value) 
        let map = completedMaps.find((map) => map.uuid == e.target.value)
        if(map.idledUnits.length < 4){
            map.idledUnits.push(unit)
            alert("You've reach the max unit per map")
        }
        else{
            return
        }

        idler_selected_unit.className = "idler_map_unit_img"

        let newElement = idler_selected_unit.cloneNode(true)
        newElement.value = idler_selected_unit.value
        newElement.addEventListener("click", rightPanelEvents)
        newElement.addEventListener("mouseover", eventMouseIn)
        newElement.addEventListener("mouseout", eventMouseOut)

        e.target.appendChild(newElement) 
        idler_selected_unit.remove()
        idler_selected_unit = null
    }
}

function removeIdlingUnit(uuid){
    for(let map of completedMaps){
        map.idledUnits = map.idledUnits.filter((e) => e.uuid != uuid)
    }
}

//adds the events units on the right panel need
function rightPanelEvents(e){
    e.stopPropagation()
    let unit_div = document.getElementById("idler_unit_div")
    let dialog = document.getElementById("dialog_idler")
    dialog.close()
    removeIdlingUnit(e.target.value)
    let target_div = document.getElementById("idler_unit_div" + e.target.value)
    if(!target_div){
        target_div = document.createElement("div")
        target_div.id = "idler_unit_div" + e.target.value
        target_div.className = "idler_item_unit"

        unit_div.appendChild(target_div)
    }
    e.target.className = "idler_item_img_unit"
    let newDiv = e.target.cloneNode(true)
    newDiv.value = e.target.value
    newDiv.addEventListener("mouseover", eventMouseIn)
    newDiv.addEventListener("mouseout", eventMouseOut)
    target_div.appendChild(newDiv)
    e.target.remove()
    newDiv.addEventListener("click", idler_unit_select_event)
}

function switchUnitPanel(e){
    e.stopPropagation()

    let dialog = document.getElementById("dialog_idler")
    dialog.close()

    //removing unit from idling
    idler_unit_list = idler_unit_list.filter((unit) => unit.uuid != e.target.value)

    //rebuilding the container div for image, as it gets removed.
    let item = document.createElement("div")
    item.id = "idler_unit_div" + unit.uuid
    item.className = "idler_item_unit"

    e.target.className = "idler_item_img_unit"

    let target_div = document.getElementById("idler_unit_div")

    item.appendChild(e.target)
    target_div.appendChild(item)
}

function eventMouseOut(e){
    let dialog = document.getElementById("dialog_idler")
    current_dialog = ""
    dialog.close()
}
function eventMouseIn(e){
    let unit = units.filter((unit) => unit.uuid == e.target.value)[0]
    let dialog = document.getElementById("dialog_idler")
    current_dialog = unit.uuid
    dialog.innerHTML = displayUnitInfoOnBoardPanel(unit)
    dialog.show()
}
function idler_unit_select_event(e){
    let current_target = document.querySelector(".idler_selected_img")
    if(current_target){
        current_target.classList.remove("idler_selected_img")
    }
    idler_selected_unit = e.target
    e.target.classList.add("idler_selected_img")
}

//GAMEPLAY
let rewardsQueue = []
function generateIdlerReward(){
    let odds = roll([0,100],1)
    if(odds > 80){
        //resources 

        () => {
            
        }
    }else if(odds >60){
        //blueprint
    }else if(odds >40){
        //worker?
    }else if(odds >20){
        //item_blueprint?
    }
}

