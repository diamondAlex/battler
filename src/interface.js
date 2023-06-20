let container = document.getElementById("root")
container.className="root"

const SLOT_MAX = 4

let addSlots = () => {
    let topside = document.getElementById("board_topside")
    let botside = document.getElementById("board_botside")

    for(let i = 0; i<SLOT_MAX;i++){
        let slot = document.createElement("div")
        slot.className = "slot"
        slot.id = "top_slot" + i
        topside.appendChild(slot)
    }

    for(let i = 0; i<SLOT_MAX;i++){
        let slot = document.createElement("div")
        slot.className = "slot"
        slot.id = "bottom_slot" + i
        botside.appendChild(slot)
    }
    
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

    panel.appendChild(topside)
    panel.appendChild(botside)
}

let addBoard = () =>{
    let board = document.createElement("div")
    board.id = "board"
    board.className = "left"
    let panel = document.createElement("div")
    panel.id = "panel"
    panel.className = "right"


    container.append(board)
    container.append(panel)
}

let generateInterface = () =>{
    addBoard()
    addSides()
    addSlots()
}

generateInterface()
