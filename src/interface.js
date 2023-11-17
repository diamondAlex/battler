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

    botside = document.createElement("div")
    botside.id = "panel_botside"
    botside.classList.add("panel","side","bot")

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
    })

    panel.appendChild(topside)
    panel.appendChild(button)
    panel.appendChild(button_leave)
    panel.appendChild(botside)
}

function getOpponent(){
    let opponentTypes = currentMap.spawn
    let index = Math.floor(Math.random()*3)
    let opp = opponents[opponentTypes[index]]
    let newOpp = {}
    return Object.assign(newOpp, opp)
}

function setOpponent(){
    for(let i = 0;i < 2;i++){
        let slot = document.getElementById("top_slot"+i)
        let image = document.createElement("img")
        let opponent = getOpponent()
        let overlay = document.getElementById("top_overlay"+i)

        overlay.innerHTML = opponent.hp + "/" + opponent.maxhp
        opponent_units.push(opponent)
        image.src = "images/" + opponent.image
        image.className = "slotimage"

        slot.replaceChildren(image)
        slot.appendChild(overlay)
    }
}

function setUnit(container, info){
    let unitDiv = document.createElement("div")
    unitDiv.id = "unit_" + info.uuid
    unitDiv.className = "card_div"
    unitDiv.draggable = true
    unitDiv.ondragstart = selectUnit
    let unitImage = document.createElement("img")
    unitImage.className = "card"
    unitImage.draggable = false
    unitImage.src = "images/" + info.image
    let overlay = document.createElement("div")
    overlay.className = "overlay"
    overlay.id = "bot_overlay" + info.uuid
    overlay.innerHTML = info.hp + "/" + info.maxhp

    unitDiv.appendChild(unitImage)
    unitDiv.appendChild(overlay)
    container.appendChild(unitDiv)
}
function setPlayerPanel(){

    let botPanel = document.getElementById("panel_botside") 
    botPanel.innerHTML = ""
    console.log(positions)
    for(char of player_units){
        if(positions.length == 0){
            let info = char
            setUnit(botPanel, info)
        }
        if(positions.find((e) => e? e.uuid == char.uuid : false) == -1){
            console.log('char not in positions')
            let info = char
            setUnit(botPanel, info)
        }
    }
}

function enableTabButton(){
    let button = document.getElementById("board_button")
    button.disabled = false
}

function generateBoard(map){
    if(map != null)
        currentMap = maps[map]
    enableTabButton()
    addBoard()
    addSides()
    addSlots()
    initGame()
}

// EVENTS ---------------------------------------------------
function selectUnit(e){
    let index = positions.findIndex((x) => {
        if(x){
            let uuid = e.target.id.split("_")[1]
            return x.uuid == uuid
        }
        return false
    })
    console.log(e.target)
    console.log(e.target.id)
    e.dataTransfer.setData("data", JSON.stringify({from:index,id:e.target.id}))
}

function dropUnit(e){
    e.preventDefault()
    let data = JSON.parse(e.dataTransfer.getData("data"))
    let id = data.id
    let uuid = id.split("_")[1]
    let from = data.from
    let to = e.target.id.slice(-1)
    //this can't be good
    if(e.target.children.length == 0){
        e.target.appendChild(document.getElementById(id))
        for(let i = 0;i<positions.length;i++){
            if(positions[i]){
                if(positions[i].uuid == uuid){
                    positions[from] = positions[i]
                    positions[i] = null
                }
            }
        }
        positions[to] = player_units.find((e) => e.uuid == uuid)
    }
    else if(e.target.id == "panel_botside"){
        let element = document.getElementById(id)
        e.target.appendChild(element)
        let index
        for(let i = 0;i < positions.length;i++){
            if(positions[i]){
                if(positions[i].uuid = uuid){
                    index = i
                }
            }
        }
        positions[index] = null
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

//MANAGEMENT TAB -----------------------------------------------------
function displayMapsOnPanel(){
    let leftPanel = document.createElement("div")
    leftPanel.id = "map_panel"
    leftPanel.className = "left"
    leftPanel.innerHTML = ""

    let mapButtons = Object.keys(maps).map((e) => {
        let button = document.createElement("button")
        button.innerHTML = e + " - map <br/>"
        button.id = e
        button.addEventListener("click", () =>{
            displayUnitsOnPanel(e)
            fillMapInfoPanel(e)
        })
        return button
    })

    mapButtons.forEach((e) => leftPanel.appendChild(e))
    tab.append(leftPanel)
    
}

function displayInfo(json, keys){
    let str = ''
    if(keys == null){
        for(let key of Object.keys(json)){
            str = str + key + " - " + json[key] + "<br>" 
        }
    }
    else{
        for(let key of keys){
            str = str + key + " - " + json[key] + "<br>" 
        }
    }
    return str
}

function displayUnitsOnPanel(e){
    let leftPanel = document.getElementById("map_panel")
    leftPanel.id = "unit_panel"
    leftPanel.className = "left"
    leftPanel.innerHTML = ""

    let unitButtons = Object.keys(units).map((unit_name) => {
        let div = document.createElement("div")
        let span = document.createElement("span")
        span.innerHTML = displayInfo(units[unit_name], ["name", "hp"])
        span.style.display ="inline-block"
        span.style.width = 300
        span.style.border = "solid"
        span.style.wordWrap = "break-word"
        let img = document.createElement("img")
        img.src = "images/" + units[unit_name].image
        img.width = 100
        img.height = 150
        let button = document.createElement("button")
        button.innerHTML = unit_name
        button.id = unit_name
        button.addEventListener("click", () =>{
            addUnit(unit_name)
        })
        div.appendChild(img)
        div.appendChild(span)
        div.appendChild(button)
        return div
    })
    unitButtons.forEach((e) => leftPanel.appendChild(e))

    let startButton = document.createElement("button")
    startButton.innerHTML = "start"
    startButton.addEventListener("click", () =>{
        generateBoard(e)
    })

    leftPanel.appendChild(startButton)
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
    playerPanel.innerHTML = JSON.stringify(player) + "<br/>"

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

function fillMapInfoPanel(e){
    let mapPanel = document.getElementById("map_panel")
    mapPanel.innerHTML = JSON.stringify(maps[e])
    setNrb_level(maps[e].levels)
}

let uuid = 0
//test function
function addUnit(unit_name){
    if(player_units.length >= 4){
        alert("too many units") 
        return
    }
    let exits = player_units.find((e) => e.name == unit_name)
    if(exits)
        return
    let unit = getUnit(unit_name)
    unit.uuid = uuid++
    player_units.push(unit)
    
    let playerPanel = document.getElementById("player_panel")
    let img = document.createElement("img")
    img.src = "images/"+unit.image
    img.width = 100
    img.height = 150
    playerPanel.appendChild(img)
}


function generateManagementPanel(){
    tab.innerHTML = "Management"
    displayMapsOnPanel()
    generateRightInfoPanel()
    generatePlayerInfoPanel()
    generateMapInfoPanel()
}

//Unit panel ---------------------------------------------------
function generateUnitPanel(){
    tab.innerHTML = ""
    let unit_panel = document.createElement("div")
    unit_panel.id = "unit_panel"
    unit_panel.className = "right"
    unit_panel.innerHTML = ""
    let unit_div = document.createElement("div")
    unit_div.id = "unit_div"
    unit_div.className = "left"
    unit_div.innerHTML = ""

    let unitButtons = Object.keys(units).map((unit_name) => {
        let div = document.createElement("div")
        let span = document.createElement("span")
        span.innerHTML = displayInfo(units[unit_name], null)
        span.style.display ="inline-block"
        span.style.width = 300
        span.style.border = "solid"
        span.style.wordWrap = "break-word"
        let img = document.createElement("img")
        img.src = "images/" + units[unit_name].image
        img.width = 100
        img.height = 150
        let button = document.createElement("button")
        button.innerHTML = unit_name
        button.id = unit_name
        button.addEventListener("click", () =>{
            showUnit(unit_name)
        })
        div.appendChild(img)
        div.appendChild(span)
        div.appendChild(button)
        return div
    })
    unitButtons.forEach((e) => unit_div.appendChild(e))

    tab.appendChild(unit_div)
    tab.appendChild(unit_panel)
}

function showUnit(unit){
    let panel = document.getElementById("unit_panel")
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
    let player_panel = document.createElement("button")
    player_panel.innerHTML = "Player"
    player_panel.addEventListener("click", () => generateManagementPanel())
    
    let unit_panel = document.createElement("button")
    unit_panel.innerHTML = "Units"
    unit_panel.addEventListener("click", () => generateUnitPanel())

    let board = document.createElement("button")
    board.id = "board_button"
    board.innerHTML = "Board"
    board.addEventListener("click", () => generateBoard(currentMap.name))
    board.disabled = true

    container.appendChild(player_panel)
    container.appendChild(unit_panel)
    container.appendChild(board)
    container.appendChild(tab)
}
generateParentInterface()
