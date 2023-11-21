//VARIABLES, CONSTANTS---------------------------------------------------
let currentMap = ""

const SLOT_MAX = 4

//PARENT DIVS ---------------------------------------------------
//holds all the divs
let container = document.getElementById("root")
container.className="root"

//holds the currently displayed tab
let tab = document.createElement("div")
tab.className="tab"

//MENU
function generateMenu(){
    let menu = document.createElement("div")
    menu.className = "menu"

    let options = [
        "play",
        "new game",
        "load",
        "exit",
    ]

    for(let option of options){
        let p = document.createElement("p")
        p.innerHTML = option
        p.addEventListener("click", () => {
            generateInitialData()
            generateParentInterface()
        })
        p.className = "menu_option"
        menu.appendChild(p)
    }

    container.appendChild(menu)
}

function generateInitialData(){
    initData()
}

//BATTLE INTERFACE---------------------------------------------------
let addSlots = () => {
    let topside = document.getElementById("board_topside")
    let botside = document.getElementById("board_botside")
    for(let i = 0; i<SLOT_MAX;i++){
        let slot = document.createElement("div")
        slot.className = "slot"
        slot.id = "top_slot" + i
        let overlay = document.createElement("div")
        overlay.className = "overlay"
        overlay.id = "top_overlay" + i
        slot.appendChild(overlay)
        topside.appendChild(slot)
    }
    for(let i = 0; i<SLOT_MAX;i++){
        let slot = document.createElement("div")
        slot.className = "slot"
        slot.id = "bottom_slot" + i
        botside.appendChild(slot)
    }
    if(positions.length != 0){
        for(let i = 0; i<positions.length;i++){
            if(positions[i]){
                let slot = document.getElementById("bottom_slot" + i)
                setUnit(slot, positions[i])
            }
        }
    
    }
}

let addBoard = () =>{
    let board = document.createElement("div")
    board.id = "board"
    board.className = "left"
    let panel = document.createElement("div")
    panel.id = "panel"
    panel.className = "right"

    tab.innerHTML = ""
    tab.append(board)
    tab.append(panel)
}

let addSides = () =>{
    let board = document.getElementById("board")
    let topside = document.createElement("div")
    topside.id = "board_topside"
    topside.classList.add("side","top")

    let botside = document.createElement("div")
    botside.id = "board_botside"
    botside.classList.add("side","bot")
    
    board.appendChild(topside)
    board.appendChild(botside)

    let panel = document.getElementById("panel")
    topside = document.createElement("div")
    topside.id = "panel_topside"
    topside.classList.add("panel","side","top")
    topside.innerHTML = JSON.stringify(currentMap)

    botside = document.createElement("div")
    botside.id = "panel_botside"
    botside.classList.add("panel","side")

    for(let i = 0; i<SLOT_MAX;i++){
        let slot = document.createElement("div")
        slot.className = "slot_panel"
        slot.id = "bot_slot_panel_" + i
        botside.appendChild(slot)
    }

    let button = document.createElement("button")
    button.id = "play"
    button.innerHTML = "play"
    button.addEventListener("click", () => {
        playTurn()
    })

    let button_leave = document.createElement("button")
    button_leave.id = "leave"
    button_leave.innerHTML = "leave"
    button_leave.addEventListener("click", () => {
        leaveMap()
        runPostDungeon()
    })

    let button_next = document.createElement("button")
    button_next.id = "next"
    button_next.innerHTML = "next"
    button_next.addEventListener("click", () => {
        nextLevel()
    })

    panel.appendChild(topside)
    panel.appendChild(button)
    panel.appendChild(button_next)
    panel.appendChild(button_leave)
    panel.appendChild(botside)
}

function setOpponent(){
    for(let i = 0;i < 4;i++){
        let slot = document.getElementById("top_slot"+i)
        let unitDiv = document.createElement("div")
        unitDiv.className = "card_div"

        let opponent

        if(!opponent_units[i]){
            opponent = getOpponent()
        }
        else{
            opponent = opponent_units[i]
        }
        let overlay = document.getElementById("top_overlay"+i)

        unitDiv.style.backgroundImage = `url('images/${opponent.image}')`
        unitDiv.style.backgroundSize = "contain"
        unitDiv.style.backgroundRepeat = "no-repeat"

        overlay.innerHTML = opponent.hp + "/" + opponent.maxhp
        opponent_units.push(opponent)

        slot.replaceChildren(unitDiv)
        slot.appendChild(overlay)
    }
}


function setUnit(container, info, initial){
    let unitDiv = document.createElement("div")
    unitDiv.id = "unit_" + info.uuid
    unitDiv.className = "card_div"
    unitDiv.draggable = true
    unitDiv.ondragstart = selectUnit
    unitDiv.style.backgroundImage = `url('images/${info.image}')`
    unitDiv.style.backgroundSize = "contain"
    unitDiv.style.backgroundRepeat = "no-repeat"
    let overlay = document.createElement("div")
    overlay.className = "overlay"
    overlay.id = "bot_overlay" + info.uuid
    overlay.innerHTML = info.hp + "/" + info.maxhp


    //let's keep this one on the shelves for now
    if(initial){
        let handleClick = (e) =>{
            console.log(e)
            e.target.removeEventListener("click", handleClick)
            console.log(e.tartget)
        }
        unitDiv.addEventListener("click", handleClick)
    }
    

    unitDiv.appendChild(overlay)
    container.appendChild(unitDiv)
}

function setPlayerPanel(){
    let botPanel = document.getElementById("panel_botside") 
    let slot_index = 0
    for(unit of player_units){
        if(positions.length == 0){
            let slot = document.getElementById("bot_slot_panel_" + slot_index) 
            slot_index++
            setUnit(slot, unit,1)
        }
        if(positions.find((e) => e? e.uuid == unit.uuid : false) == -1){
            setUnit(botPanel, unit)
        }
    }
}

function enableTabButton(){
    let button = document.getElementById("board_button")
    button.disabled = false
}

function displayOnSidePanel(text){
    let panel = document.getElementById("panel_topside")
    panel.innerHTML = text
}

function setBoardBg(){
    let bg = currentMap.image
    console.log(bg)
    tab.style.backgroundImage = `url('${bg}')`
    tab.style.backgroundSize = 'contain'
    
    let board = document.getElementById("board")
    board.style.backgroundColor = "#545252"
}

function generateBoard(map){
    if(map != null)
        currentMap = map
    enableTabButton()
    addBoard()
    addSides()
    addSlots()
    setBoardBg()
    initGame()
}

// EVENTS ---------------------------------------------------
function selectUnit(e){
    let index = positions.findIndex((x) => {
        if(x){
            let uuid = parseInt(e.target.id.split("_")[1])
            if(x.uuid == uuid){
                return true 
            }
            return false
        }
        return false
    })
    e.dataTransfer.setData("data", JSON.stringify({from:index,id:e.target.id}))
}

//there's just no way this is correct.
function dropUnit(e){
    e.preventDefault()
    let data = JSON.parse(e.dataTransfer.getData("data"))
    let id = data.id
    let unit_uuid = parseInt(id.split("_")[1])
    let from = data.from
    let to = e.target.id.slice(-1)
    //this can't be good
    if(e.target.children.length == 0 && !e.target.id.includes("panel")){
        e.target.appendChild(document.getElementById(id))
        for(let i = 0;i<positions.length;i++){
            if(positions[i]){
                if(positions[i].uuid == unit_uuid){
                    positions[from] = positions[i]
                    positions[i] = null
                }
            }
        }
        positions[to] = player_units.find((e) => e.uuid == unit_uuid)
    }
    else if(e.target.id.includes("bot_slot_panel_") && from == -1){
        return
    }
    else if(e.target.id.includes("bot_slot_panel_")){
        let element = document.getElementById(id)
        e.target.appendChild(element)
        let index
        for(let i = 0;i < positions.length;i++){
            if(positions[i]){
                if(positions[i].uuid == unit_uuid){
                    index = i
                }
            }
        }
        positions[index] = null
    }
    else if(e.target.children.length != 0 && e.target.id.includes("unit_")){
        let unit_index_from = id.slice(-1)
        let div_from = document.getElementById("unit_" + unit_index_from)
        let unit_index_to = e.target.children[0].id.slice(-1)
        let div_to = document.getElementById("unit_" + unit_index_to)

        //cmon this is simple
        let container_for_from_div = div_to.parentNode 
        let container_for_to_div = div_from.parentNode

        container_for_from_div.innerHTML = ""
        container_for_to_div.innerHTML = ""

        container_for_from_div.appendChild(div_from)
        container_for_to_div.appendChild(div_to)

        let positions_index_from = positions.findIndex((e) => {
            if(e){
                return e.uuid == unit_index_from
            }
            return false
        })
        let positions_index_to = positions.findIndex((e) => {
            if(e){
                return e.uuid == unit_index_to
            }
            return false
        })

        let temp_unit_from = positions[positions_index_from]
        let temp_unit_to = positions[positions_index_to]
        positions[positions_index_from] = temp_unit_to
        positions[positions_index_to] = temp_unit_from
    }
}

function setDnd(){
    //left panel
    let panel_botside = document.getElementById("panel_botside")
    panel_botside.ondrop = dropUnit
    panel_botside.ondragover = (e) => e.preventDefault()
    //slots
    for(let i = 0; i < 4; i++){
        let slot = document.getElementById("bottom_slot" + i)
        slot.ondrop = dropUnit
        slot.ondragover = (e) => { e.preventDefault() }
    }
}

//TOWN TAB -----------------------------------------------------
function generateTownRightPanel(){
    leftPanel = document.createElement("div")
    leftPanel.id = "town_right_panel"
    leftPanel.className = "right"
    for(let quest of quests){
        let div = document.createElement("div")
        div.innerHTML = quest[1] 
        div.addEventListener("click", () => {
        })
        leftPanel.appendChild(div)
    }

    tab.append(leftPanel)
}
function generateTownLeftPanel(){
    leftPanel = document.createElement("div")
    leftPanel.id = "town_left_panel"
    leftPanel.className = "left"
    for(let structure of structures){
        let div = document.createElement("div")
        div.addEventListener("click", () => {
            alert("hi :)")
        })

        let span = document.createElement("span")
        span.innerHTML = structure.name
        span.style.position = "relative"
        span.style.bottom = "100"
        span.style.fontSize = "200%"

        let image = document.createElement("img")
        image.src = "images/" + structure.image
        image.style.margin = "10"
        image.style.width = "350"
        image.style.height = "200"

        div.appendChild(image)
        div.appendChild(span)
        leftPanel.appendChild(div)
    }

    tab.append(leftPanel)
}

function generateTownPanel(){
    tab.innerHTML = ""
    generateTownLeftPanel()
    generateTownRightPanel()
}

//QUEST TAB -----------------------------------------------------

function generateQuestLeftPanel(){
    leftPanel = document.createElement("div")
    leftPanel.id = "quest_panel"
    leftPanel.className = "left"
    for(let quest of quests){
        let div = document.createElement("div")
        div.innerHTML = quest[1] 
        div.addEventListener("click", () => {
            quest[0]()
            let new_q_arr = quests.filter((e) => {
                if(!(e[1] == quest[1])){
                    return true
                }
                return false
            })
            quests = new_q_arr
            alert("you've accepted the quest!")
            generateQuestPanel()
        })
        leftPanel.appendChild(div)
    }

    tab.append(leftPanel)
}

function generateQuestPanel(){
    tab.innerHTML = ""
    generateQuestLeftPanel()
}

//MANAGEMENT TAB -----------------------------------------------------
function displayMapsOnPanel(){
    let leftPanel = document.getElementById("unit_panel")
    if(!leftPanel){
        leftPanel = document.createElement("div")
        tab.append(leftPanel)
    }
    leftPanel.id = "map_panel"
    leftPanel.className = "left"
    leftPanel.innerHTML = ""

    let unit_button = document.createElement("button")
    unit_button.innerHTML = "units >>"
    unit_button.addEventListener("click",displayUnitsOnPanel)
    leftPanel.appendChild(unit_button)

    for(let map of maps){
        let button = document.createElement("div")
        button.addEventListener("click", () =>{
            displayUnitsOnPanel(map)
            fillMapInfoPanel(map)
        })
        let image = document.createElement("img")
        image.id = map
        image.src= map.image
        image.className = "maps_img"
        let overlay = document.createElement("div")
        overlay.className = "maps_overlay"
        overlay.id = "map_overlay_" + map.name
        overlay.innerHTML = map.name
        button.appendChild(overlay)
        button.appendChild(image)

        leftPanel.appendChild(button)
    }


    
}

function displayInfo(json, keys){
    let str = ''
    if(keys == null){
        for(let key of Object.keys(json)){
            str = str + key + " - " + JSON.stringify(json[key]) + "<br>" 
        }
    }
    else{
        for(let key of keys){
            str = str + key + " - " + JSON.stringify(json[key]) + "<br>" 
        }
    }
    return str
}

function displayUnitsOnPanel(map){
    let leftPanel = document.getElementById("map_panel")
    leftPanel.innerHTML = ""
    leftPanel.id = "unit_panel"
    leftPanel.className = "left"

    let map_button = document.createElement("button")
    map_button.innerHTML = "maps <<"
    map_button.addEventListener("click", displayMapsOnPanel)
    leftPanel.appendChild(map_button)

    let startButton = document.createElement("button")
    startButton.innerHTML = "start"
    startButton.addEventListener("click", () =>{
        if(player_units.length > 0)
            generateBoard(map)
    })
    leftPanel.appendChild(startButton)

    let unitButtons = units.map((unit) => {
        let div = document.createElement("div")
        let span = document.createElement("span")
        span.innerHTML = displayInfo(unit, ["name", "damage","hp", "maxhp","level"])
        span.style.display ="inline-block"
        span.style.width = 300
        span.style.border = "solid"
        span.style.wordWrap = "break-word"
        let img = document.createElement("img")
        img.src = "images/" + unit.image
        img.width = 100
        img.height = 150
        img.addEventListener("click", () =>{
            addUnit(unit)
        })
        div.appendChild(img)
        div.appendChild(span)
        return div
    })
    unitButtons.forEach((e) => leftPanel.appendChild(e))
}

function generateRightInfoPanel(){
    let rightPanel = document.createElement("div")
    rightPanel.id = "right_panel"
    rightPanel.className = "right"

    tab.append(rightPanel)
}

function generatePlayerInfoPanel(){
    let rightPanel = document.getElementById("right_panel")
    let playerPanel = document.createElement("div")
    playerPanel.id = "player_panel"
    playerPanel.className = "management"
    playerPanel.innerHTML = displayInfo(player, ['name','resources'])

    rightPanel.append(playerPanel)
}

function generateMapInfoPanel(){
    let rightPanel = document.getElementById("right_panel")
    let mapPanel = document.createElement("div")
    mapPanel.id = "map_panel"
    mapPanel.className = "management"
    mapPanel.innerHTML = "Map"

    rightPanel.append(mapPanel)
}

//a whole function, really?
function setNrb_level(nbr){
    nbr_levels = nbr
}

function fillMapInfoPanel(map){
    let mapPanel = document.getElementById("map_panel")
    mapPanel.innerHTML = JSON.stringify(map)
    setNrb_level(map.levels)
}

//test function
function addUnit(unit){
    if(player_units.length >= 4){
        alert("too many units") 
        return
    }
    let exits = player_units.find((e) => e.uuid == unit.uuid)
    if(exits)
        return
    player_units.push(unit)
    
    let playerPanel = document.getElementById("player_panel")
    let img = document.createElement("img")
    img.src = "images/"+unit.image
    img.width = 100
    img.height = 150
    playerPanel.appendChild(img)
}


function generateManagementPanel(){
    tab.innerHTML = ""
    displayMapsOnPanel()
    generateRightInfoPanel()
    generatePlayerInfoPanel()
    generateMapInfoPanel()
}

//Unit panel ---------------------------------------------------
function generateUnitPanel(){
    generateUnitLeftPanel()
    generateUnitRightPanel()
}
function generateUnitLeftPanel(){
    tab.innerHTML = ""
    let unit_info_panel = document.createElement("div")
    unit_info_panel.id = "unit_info_panel"
    unit_info_panel.className = "unit_right"
    unit_info_panel.innerHTML = ""
    let unit_div = document.createElement("div")
    unit_div.id = "unit_div"
    unit_div.className = "unit_left"
    unit_div.innerHTML = ""

    let unitButtons = Object.keys(units).map((unit_name) => {
        let div = document.createElement("div")
        let span = document.createElement("span")
        span.innerHTML = displayInfo(units[unit_name], Object.keys(units[unit_name]).slice(0,-3))
        span.style.display ="inline-block"
        span.style.width = 300
        span.style.border = "solid"
        span.style.wordWrap = "break-word"
        let img = document.createElement("img")
        img.src = "images/" + units[unit_name].image
        img.width = 100
        img.height = 150
        img.addEventListener("click", () =>{
            showUnitInventory(unit_name)
        })
        div.appendChild(img)
        div.appendChild(span)
        return div
    })
    unitButtons.forEach((e) => unit_div.appendChild(e))

    tab.appendChild(unit_div)
    tab.appendChild(unit_info_panel)
}

function generateUnitRightPanel(){
    let panel = document.getElementById("unit_info_panel") 
    let unit_inventory = document.createElement("div")
    unit_inventory.id = "unit_inventory"
    unit_inventory.className = "unit_inventory"
    unit_inventory.style.backgroundImage = "url('images/bg/inventory.png')"
    unit_inventory.style.backgroundSize = "contain"
    unit_inventory.style.backgroundRepeat = "no-repeat"
    let player_inventory = document.createElement("div")
    player_inventory.id = "player_inventory"
    player_inventory.className = "player_inventory"

    panel.appendChild(player_inventory)
    panel.appendChild(unit_inventory)

    showPlayerInventory()
}

function showPlayerInventory(){
    let panel = document.getElementById("player_inventory")
    let inventory = player.inventory
    for(let item of inventory){
        let div = document.createElement("div")
        let img = document.createElement("img")
        img.src = "images/" + item.image
        img.width = 75
        img.heigh = 150
        let span = document.createElement('span')
        span.innerHTML = item.name

        div.appendChild(img)
        div.appendChild(span)
        panel.appendChild(div)
    }
}

function showUnitInventory(unit){
    let panel = document.getElementById("unit_inventory")
    panel.style.wordWrap = "break-word"
    panel.innerHTML = JSON.stringify(units[unit])
}

//INIT ---------------------------------------------------
function initGame(){
    setOpponent()
    setPlayerPanel()
    setDnd()
}

function generateParentInterface(){
    container.innerHTML = ""
    let player_panel = document.createElement("button")
    player_panel.innerHTML = "Maps"
    player_panel.addEventListener("click", () => generateManagementPanel())
    
    let unit_panel = document.createElement("button")
    unit_panel.innerHTML = "Units"
    unit_panel.addEventListener("click", () => generateUnitPanel())

    let quest_panel = document.createElement("button")
    quest_panel.innerHTML = "Quests"
    quest_panel.addEventListener("click", () => generateQuestPanel())

    let town_panel = document.createElement("button")
    town_panel.innerHTML = "Town"
    town_panel.addEventListener("click", () => generateTownPanel())

    let board = document.createElement("button")
    board.id = "board_button"
    board.innerHTML = "Board"
    board.addEventListener("click", () => generateBoard(currentMap.name))
    board.disabled = true

    container.appendChild(player_panel)
    container.appendChild(unit_panel)
    container.appendChild(quest_panel)
    container.appendChild(town_panel)
    container.appendChild(board)
    container.appendChild(tab)

    generateManagementPanel()
}

function generateStartInterface(){
    generateUnit()
    generateStructure()
    generateMap()
    generateParentInterface()
    //generateMenu() 
}

generateStartInterface()
