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
        let overlay = document.createElement("div")
        overlay.className = "overlay"
        overlay.id = "bot_overlay" + i
        botside.appendChild(slot)
        slot.appendChild(overlay)
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

    panel.appendChild(topside)
    panel.appendChild(button)
    panel.appendChild(botside)
}

let uuid = 0
//test function
function addUnit(e){
    let unit = get("units",e)
    unit.uuid = uuid++
    player_units.push(unit)
}

function getOpponent(){
    let opponentType = currentMap.spawn
    let opp = opponents[opponentType]
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

function setAllCharsOnBoard(){
    for(let i = 0;i<positions.length;i++){
        let player_index = i
        let slot_index = i
        positions[slot_index] =  player_units[player_index]
        let slot = document.getElementById("bottom_slot"+slot_index)
        let overlay = document.getElementById("bot_overlay"+slot_index)
        let image = document.createElement("img")
        overlay.innerHTML = player_units[player_index].hp + '/' + player_units[player_index].maxhp
        image.src = "images/" + player_units[player_index].image
        image.className = "slotimage"
        slot.replaceChildren(image)
        slot.appendChild(overlay)
    }
}

function setCharOnBoard(e){
    let player_index = parseInt(e.target.id.slice(-1))
    let slot_index = parseInt(e.target.value) - 1
    let id = player_units[player_index].uuid

    let unit = player_units[player_index]
    if(positions.some((e) => e.uuid == unit.uuid) && slot_index != -1){
        return
    }

    if(slot_index >= 0){
        positions[slot_index] =  player_units[player_index]
        let slot = document.getElementById("bottom_slot"+slot_index)
        let overlay = document.getElementById("bot_overlay"+slot_index)
        let image = document.createElement("img")
        overlay.innerHTML = player_units[player_index].hp + '/' + player_units[player_index].maxhp
        image.src = "images/" + player_units[player_index].image
        image.className = "slotimage"
        slot.replaceChildren(image)
        slot.appendChild(overlay)
    }
    else{
        let index = positions.findIndex((e) => e.uuid == unit.uuid)
        positions[index] = {}
        let slot = document.getElementById("bottom_slot"+index)
        let overlay = document.getElementById("bot_overlay"+index)
        slot.innerHTML = ""
        overlay.innerHTML = ""
        slot.appendChild(overlay)
    }
}

function setPlayerPanel(){
    let botPanel = document.getElementById("panel_botside") 

    botPanel.innerHTML = ""
    for(char of player_units){
        let info = char
        let unitImage = document.createElement("img")
        unitImage.id = "unit_" + info.uuid
        unitImage.draggable = true
        unitImage.className = "card"
        unitImage.src = "images/" + info.image
        unitImage.ondragstart = selectUnit
        botPanel.appendChild(unitImage)
    }
}

function generateBoard(map){
    currentMap = maps[map]
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
    e.dataTransfer.setData("data", JSON.stringify({from:index,id:e.target.id}))
}

function dropUnit(e){
    e.preventDefault()
    let data = JSON.parse(e.dataTransfer.getData("data"))
    let id = data.id
    let from = data.from
    let uuid = id.split("_")[1]
    let index = e.target.id.slice(-1)
    //this can't be good
    if(e.target.children.length == 1){
        console.log(e.target)
        e.target.appendChild(document.getElementById(id))
        for(let i = 0;i<positions.length;i++){
            if(positions[i]){
                if(positions[i].uuid == uuid){
                    positions[from] = positions[i]
                    positions[i] = null
                }
            }
        }
        positions[index] = player_units.find((e) => e.uuid == uuid)
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
function generateManagementUnitPanel(){
    let unitPanel = document.createElement("div")
    unitPanel.id = "unit_panel"
    unitPanel.className = "right"

    let mapButtons = Object.keys(maps).map((e) => {
        let button = document.createElement("button")
        button.innerHTML = e + "<br/>"
        button.id = e
        button.addEventListener("click", () =>{
            generateBoard(e)
        })
        return button
    })

    let unitButtons = Object.keys(units).map((e) => {
        let div = document.createElement("div")
        let img = document.createElement("img")
        img.src = "images/" + units[e].image
        img.width = 100
        img.height = 150
        let button = document.createElement("button")
        button.innerHTML = e
        button.id = e
        button.addEventListener("click", () =>{
            addUnit(e)
        })
        div.appendChild(img)
        div.appendChild(button)
        return div
    })
    mapButtons.forEach((e) => unitPanel.appendChild(e))
    unitButtons.forEach((e) => unitPanel.appendChild(e))
    tab.append(unitPanel)
}

function generatePlayerInfoPanel(){
    let playerPanel = document.createElement("div")
    playerPanel.id = "player_panel"
    playerPanel.className = "right"
    playerPanel.innerHTML = JSON.stringify(player) + "<br/>"

    let unitImage = player_units.map((e) => {
        let img = document.createElement("img")
        img.src = "images/"+e.image
        img.width = 100
        img.height = 150
        return img
    })
    unitImage.forEach((e) => playerPanel.appendChild(e))
    tab.append(playerPanel)
}

function generateManagementPanel(){
    tab.innerHTML = "Management"
    generateManagementUnitPanel()
    generatePlayerInfoPanel()
}

//INIT ---------------------------------------------------
function initGame(){
    document.getElementById("play").addEventListener("click", () => {
        playTurn()
    })
    setOpponent()
    setPlayerPanel()
    setDnd()
}

function generateParentInterface(){
    let panel = document.createElement("button")
    panel.innerHTML = "panel"
    panel.addEventListener("click", () => generateManagementPanel())

    container.appendChild(panel)
    container.appendChild(tab)
}
generateParentInterface()
