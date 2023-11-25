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
        "load",
        "exit",
    ]

    for(let option of options){
        let p = document.createElement("p")
        p.id = "menu_" + option
        p.innerHTML = option
        p.className = "menu_option"
        menu.appendChild(p)
    }

    container.appendChild(menu)

    let play = document.getElementById("menu_play")
    play.addEventListener("click", () => {
        generateCreationPage()
    })
    
    let load = document.getElementById("menu_load")
    load.addEventListener("click", () => {
        load_game()
        generateParentInterface()
    })
}

function generateInitialData(){
    initData()
}

//CREATE---------------------------------------------------

function generateCreationImgPanel(){
    let panel = document.createElement("div")
    panel.id = "creation_img_panel"
    panel.className = "creation_img_panel"
    for(let name of units_img_names){
        let div = document.createElement("div")
        div.className = "creation_img_div"
        let img = document.createElement("img")
        img.src = name
        img.className="creation_img"
        img.id = name
        img.addEventListener("click", (e) =>{
            let div = document.getElementById("unit_creation_img") 
            div.innerHTML =""
            let img = document.createElement("img")
            img.src = name
            img.className = "creation_img_right"
            div.appendChild(img)
        })
        div.appendChild(img)
        panel.appendChild(div)
    }
    tab.appendChild(panel)
}
function generateCreationRightPanel(){
    let panel = document.createElement("div")
    panel.id = "creation_right_panel"
    panel.className = "creation_right_panel"
    let unit_img = document.createElement("div")
    unit_img.id = "unit_creation_img"
    unit_img.className = "unit_creation_img"

    let unit_text = document.createElement("div")
    unit_text.id = "unit_creation_text"
    unit_text.className = "unit_creation_text"

    panel.appendChild(unit_img)
    panel.appendChild(unit_text)
    tab.appendChild(panel)

    generateCreationInfo()
}

function generateCreationInfo(){
    let div = document.getElementById("unit_creation_text")
    let player_name = document.createElement("textarea")
    player_name.className = "creation_text_area"
    let span = document.createElement("div") 
    span.className = "unit_creation_input"
    span.innerHTML = "Player Name : "
    span.appendChild(player_name)
    div.appendChild(span)
    
    let unit_name = document.createElement("textarea")
    unit_name.className = "creation_text_area"
    span = document.createElement("div") 
    span.className = "unit_creation_input"
    span.innerHTML = "Unit name : "
    span.appendChild(unit_name)
    div.appendChild(span)

    let unit_class = document.createElement("select")
    unit_class.className="unit_creation_input_select creation_text_area"
    for(let type of Object.keys(classes_templates)){
        let option = document.createElement("option")
        option.className="unit_creation_input_select"
        option.value = type
        option.innerHTML = type.split("_").map((e)=> capitalizeFirstLetter(e)).join(" ")
        unit_class.appendChild(option)
    }

    span = document.createElement("div") 
    span.className = "unit_creation_input"
    span.innerHTML = "Unit class : "
    span.appendChild(unit_class)
    div.appendChild(span)

    let unit_type = document.createElement("select")
    unit_type.className="unit_creation_input_select creation_text_area"
    for(let type of Object.keys(types_templates)){
        let option = document.createElement("option")
        option.className="unit_creation_input_select"
        option.value = type
        option.innerHTML = type.split("_").map((e)=> capitalizeFirstLetter(e)).join(" ")
        unit_type.appendChild(option)
    }

    span = document.createElement("div") 
    span.className = "unit_creation_input"
    span.innerHTML = "Unit type : "
    span.appendChild(unit_type)
    div.appendChild(span)

    let start = (e) => {
        let image
        try{
            image = document.getElementById("unit_creation_img").children[0].src
        }
        catch(err){
            alert("plz select an image")
            return
        }
        if(player_name.value == ""){
            alert("need a player name")
            return
        }
        if(unit_name.value == ""){
            alert("need a unit name")
            return
        }
        if(unit_class.value == ""){
            alert("need a unit class")
            return
        }
        if(unit_type.value == ""){
            alert("need a unit type")
            return
        }
        generatePlayer(player_name.value)
        generateUnit({type:unit_type.value,unitClass:unit_class.value,level:1,name:unit_name.value,image:image})
        generateMap()
        generateParentInterface()
    }

    let button = document.createElement("button")
    button.className = "button_style"
    button.innerHTML = "start!"
    button.addEventListener('click', start)
    div.appendChild(button)
    let controller = new AbortController()
    let signal = controller.signal
    window.addEventListener("keydown", (e) => {
        if((e.code == "Enter" || e.code == "NumpadEnter") && unit_class.value != "" && player_name.value != "" && unit_name.value != "" && unit_type.value != ""){
            try{
                image = document.getElementById("unit_creation_img").children[0].src
            }
            catch(err){
                alert("plz select an image")
                return
            }
            start(e) 
            controller.abort()
        }
    },{signal:signal})
}

function generateCreationPage(){
    container.innerHTML = ""
    tab.innerHTML = ""
    tab.style = ""
    tab.style.background = "black"
    container.appendChild(tab)
    generateCreationImgPanel()
    generateCreationRightPanel()
}
//BOARD---------------------------------------------------
let addSlots = () => {
    let topside = document.getElementById("board_topside")
    let botside = document.getElementById("board_botside")
    for(let i = 0; i<SLOT_MAX;i++){
        //THIS IS BAD BECAUSE IT IS LATER REPLACED SO IT'S CONFUSING
        let slot = document.createElement("div")
        slot.className = "slot"
        slot.id = "top_slot" + i
        let overlay = document.createElement("div")
        overlay.className = "overlay"
        overlay.id = "top_overlay" + i

        let animation_layer = document.createElement("div")
        animation_layer.className = "overlay_animation"
        animation_layer.id = "top_animation" + i
        
        let test = document.createElement("div")
        test.id= "sup"

        slot.appendChild(overlay)
        slot.appendChild(test)
        slot.appendChild(animation_layer)
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

function disableBoardButtons(){
    let buttons = document.querySelectorAll("button.board_button")
    for(let button of buttons){
        button.disabled = true
    }
}
function enableBoardButtons(){
    let buttons = document.querySelectorAll("button.board_button")
    for(let button of buttons){
        button.disabled = false
    }
    
}

let addBoard = () =>{
    let board = document.createElement("div")
    board.id = "board"
    board.className = "left board"
    let panel = document.createElement("div")
    panel.id = "panel"
    panel.className = "right board"

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
    topside.classList.add("panel","side","top_panel")
    topside.innerHTML = displayInfo(currentMap, ["name","levels","level","spawn"])

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
    button.className = "board_button"
    button.innerHTML = "Play"
    button.addEventListener("click", () => {
        playTurn()
    })

    let button_leave = document.createElement("button")
    button_leave.id = "leave"
    button_leave.className = "board_button"
    button_leave.innerHTML = "Leave"
    button_leave.addEventListener("click", () => {
        leaveMap()
        runPostDungeon()
    })

    let button_next = document.createElement("button")
    button_next.id = "next"
    button_next.className = "board_button"
    button_next.innerHTML = "Next"
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
        opponent.uuid = i

        let overlay = document.getElementById("top_overlay"+i)
        let animation = document.getElementById("top_animation"+i)

        
        unitDiv.style.backgroundImage = `url('${opponent.image}')`
        unitDiv.style.backgroundSize = "cover"
        unitDiv.id = "opponent_"+i

        overlay.innerHTML = opponent.hp + "/" + opponent.maxhp
        opponent_units.push(opponent)

        unitDiv.addEventListener("click", (e) => {
            let div = document.getElementById("panel_topside") 
            div.innerHTML = displayInfo(opponent, ["type","name","hp","damage","armor","level","xpPerLvl","givenXp"])
        })

        slot.replaceChildren(unitDiv)
        slot.appendChild(overlay)
        slot.appendChild(animation)
    }
}


function setUnit(container, unit){
    let unitDiv = document.createElement("div")
    unitDiv.id = "unit_" + unit.uuid
    unitDiv.className = "card_div"
    unitDiv.draggable = true
    unitDiv.ondragstart = selectUnit
    unitDiv.style.backgroundImage = `url('${unit.image}')`
    unitDiv.style.backgroundSize = "cover"
    unitDiv.style.backgroundRepeat = "no-repeat"
    let overlay = document.createElement("div")
    overlay.className = "overlay"
    overlay.id = "bot_overlay" + unit.uuid
    overlay.innerHTML = unit.hp + "/" + unit.maxhp


    unitDiv.addEventListener("click", (e) => {
        let div = document.getElementById("panel_topside")
        div.innerHTML = displayInfo(unit,["name","type","class","hpPerLvl","damage","armor","exp","xpPerLvl","level"])
    })

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
            setUnit(slot, unit)
        }
        if(positions.find((e) => e? e.uuid == unit.uuid : false) == -1){
            setUnit(botPanel, unit)
        }
    }
}

function setBoardBg(){
    let bg = currentMap.image
    tab.style.backgroundImage = `url('${bg}')`
    tab.style.backgroundSize = 'contain'
}

function generateBoard(map){
    tab.innerHTML = ""
    tab.style = ""
    if(map != null)
        currentMap = map
    addBoard()
    addSides()
    addSlots()
    setBoardBg()
    initGame()
}

//utils
function displayOnSidePanel(text){
    let panel = document.getElementById("panel_topside")
    panel.innerHTML = text
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

function addSlotEvents(){
    for(let unit of positions){
        if(!unit) continue
        console.log(unit)
        let slot = document.getElementById("unit_"+unit.uuid)
        slot.ondragstart = selectUnit
        slot.addEventListener("click", () => {
            let div = document.getElementById("panel_topside")
            div.innerHTML = displayInfo(unit,["name","type","lass","damage","armor","exp","xpPerLvl","level"])
        })
    }
    for(let unit of opponent_units){
        if(!unit) continue
        let slot = document.getElementById("opponent_"+unit.uuid)
        slot.addEventListener("click", () => {
            let div = document.getElementById("panel_topside")
            div.innerHTML = displayInfo(unit,["name","type","hpPerLvl","damage","armor","exp","level"])
        })
    }
    setDnd()
}

//TOWN TAB -----------------------------------------------------
function generateTownRightPanel(){
    let rightPanel = document.createElement("div")
    rightPanel.id = "town_right_panel"
    rightPanel.className = "right town_right"
    for(let structure of structures){
        let div = document.createElement("div")
        div.className="town_div"

        let span = document.createElement("span")
        span.innerHTML = structure.name
        span.className="town_name"

        let info = document.createElement("span")
        info.innerHTML = displayInfo(structure,["cost"])
        info.className = "town_info"

        let image = document.createElement("img")
        image.src = structure.image
        image.className = "town_image"
        image.addEventListener("click", () => {
            addStructure(structure)
            generateTownPanel()
        })

        div.appendChild(image)
        div.appendChild(span)
        div.appendChild(info)
        rightPanel.appendChild(div)
    }

    tab.style.backgroundImage = "url('images/bg/town.png')"
    tab.style.backgroundSize = "cover"
    tab.append(rightPanel)
}
function generateTownLeftPanel(){
    leftPanel = document.createElement("div")
    leftPanel.id = "town_left_panel"
    leftPanel.className = "left"
    for(let structure of unit_structures){
        let div = document.createElement("div")
        div.style.width = "100%"
        div.style.height = "38%"
        div.style.padding = "10"

        let span = document.createElement("span")
        span.innerHTML = structure.name
        span.style.width = "30%"
        span.style.fontSize = "200%"

        let info = document.createElement("span")
        info.style.wordWrap = "break-word"
        info.innerHTML = "<br>" + displayInfo(structure,["name","level","perks","description"])
        info.style.float="left"
        info.style.width = "40%"
        info.style.height = "20%"
        info.style.fontSize = "100%"

        let image = document.createElement("img")
        image.src = structure.image
        image.style.float = "left"
        image.style.marginRight = "10"
        image.style.width = "350"
        image.style.height = "200"

        div.appendChild(image)
        div.appendChild(span)
        div.appendChild(info)
        leftPanel.appendChild(div)
    }

    tab.append(leftPanel)
}

function generateTownPanel(){
    tab.innerHTML = ""
    tab.style = ""
    generateTownLeftPanel()
    generateTownRightPanel()
}

//QUEST TAB -----------------------------------------------------

function generateQuestLeftPanel(){
    leftPanel = document.createElement("div")
    leftPanel.id = "quest_panel"
    leftPanel.className = "left quest_panel"
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

    tab.style.backgroundImage = "url('images/bg/quest.png')"
    tab.style.backgroundSize = "cover"
    tab.append(leftPanel)
}

function generateQuestPanel(){
    tab.innerHTML = ""
    tab.style = ""
    generateQuestLeftPanel()
}

//MANAGEMENT TAB MAPS-----------------------------------------------------
function displayMapsOnPanel(){
    let leftPanel = document.getElementById("unit_panel")
    if(!leftPanel){
        leftPanel = document.createElement("div")
        tab.append(leftPanel)
    }
    leftPanel.id = "map_panel"
    leftPanel.className = "left bg_panel"
    leftPanel.innerHTML = ""

    let unit_button = document.createElement("button")
    unit_button.className = "button_style"
    unit_button.innerHTML = "Select Units"
    unit_button.addEventListener("click",displayUnitsOnPanel)
    leftPanel.appendChild(unit_button)

    for(let map of maps){
        let button = document.createElement("div")
        button.className = "maps_div"
        button.addEventListener("click", () =>{
            currentMap = map
            fillMapInfoPanel(map)
        })
        let image = document.createElement("img")
        image.id = map.name.replaceAll(" ","_")
        image.src= map.image
        image.className = "maps_img"
        let overlay = document.createElement("div")
        overlay.className = "maps_overlay"
        overlay.id = "map_overlay_" + map.name.replaceAll(" ","_")
        overlay.innerHTML = map.name
        button.appendChild(overlay)
        button.appendChild(image)

        leftPanel.appendChild(button)
    }
}

function displayUnitsOnPanel(){
    let leftPanel = document.getElementById("map_panel")
    if(!leftPanel) leftPanel = document.getElementById("unit_panel")
    leftPanel.innerHTML = ""
    leftPanel.id = "unit_panel"
    leftPanel.className = "left bg_panel"

    let map_button = document.createElement("button")
    map_button.className = "button_style"
    map_button.innerHTML = "maps <<"
    map_button.addEventListener("click", () =>{
        displayMapsOnPanel()
    })
    leftPanel.appendChild(map_button)

    let startButton = document.createElement("button")
    startButton.className = "button_style"
    startButton.innerHTML = "start"
    startButton.addEventListener("click", () =>{
        if(player_units.length > 0 && currentMap != ""){
            generateBoard(currentMap)
            toggleButtons(["maps","units","quests","town","board"])
        }
    })
    leftPanel.appendChild(startButton)
    let skipButton = document.createElement("button")
    skipButton.className = "button_style"
    skipButton.innerHTML = "skip"
    skipButton.addEventListener("click", () =>{
        let lowhp = units.filter((e) => e.hp < e.maxhp)
        if(lowhp.length == 0) alert("no units are injured")
        if(player.resources.gold >= 5){
            player.resources.gold -= 5
            runPostDungeon()
            displayUnitsOnPanel()
            //updateUnitText()
        }
        else{
            alert("You have ran out of money. Get fukt")
        }
    })
    leftPanel.appendChild(skipButton)

    let unitButtons = units.map((unit) => {
        let div = document.createElement("div")
        div.className ="unit_info_div"

        let span = document.createElement("span")
        span.innerHTML = displayInfo(unit, ["name","type","class", "damage","hp", "maxhp","level"])
        span.className = "unit_info"

        let img = document.createElement("img")
        img.src = unit.image
        img.className ="unit_info_img"
        img.addEventListener("click", () =>{
            if(unit.hp > 0){
                addUnit(unit)
            }else{
                alert("unit is too low hp")
            }
        })
        div.appendChild(img)
        div.appendChild(span)
        return div
    })
    unitButtons.forEach((e) => leftPanel.appendChild(e))
    displayUnitsOnRightPanel()
}

function updateUnitText(){
    let div = document.getElementById("unit_panel")
    for(let child in div.children){
        if(child.className == "unit_info_div"){
            let span = child.children.filter((e) => e.className == "unit_info")
        }
    }
}

function generateRightInfoPanel(){
    let rightPanel = document.createElement("div")
    rightPanel.id = "right_panel"
    rightPanel.className = "right bg_panel"
    tab.append(rightPanel)
}

function generatePlayerInfoPanel(){
    let rightPanel = document.getElementById("right_panel")
    let playerPanel = document.createElement("div")
    playerPanel.id = "player_panel"
    playerPanel.className = "management_top bg_panel"
    playerPanel.innerHTML = `<div style='text-decoration:underline;'>Selected Units<div>`

    rightPanel.append(playerPanel)
}

function generateMapInfoPanel(){
    let rightPanel = document.getElementById("right_panel")
    let mapPanel = document.createElement("div")
    mapPanel.id = "map_info_panel"
    mapPanel.className = "management_bot"
    mapPanel.innerHTML = "<div style='text-decoration:underline'>Map<div>"

    rightPanel.append(mapPanel)
}

//a whole function, really?
function setNrb_level(nbr){
    nbr_levels = nbr
}

function fillMapInfoPanel(map){
    let mapPanel = document.getElementById("map_info_panel")
    let img = document.createElement("img")
    img.src = map.image
    img.width = 100
    img.heigh = 150
    mapPanel.innerHTML = "<div style='text-decoration:underline'>Map<div><div>"
    mapPanel.appendChild(img)
    mapPanel.innerHTML += "</div><div>"
    mapPanel.innerHTML +=  displayInfo(map,["name","level","levels","spawn"])
    mapPanel.innerHTML += "</div>"
    setNrb_level(map.levels)
}

function addUnit(unit){
    if(player_units.length >= 4){
        alert("too many units") 
        return
    }
    let exits = player_units.find((e) => e.uuid == unit.uuid)
    if(exits)
        return
    player_units.push(unit)
    
    displayUnitsOnRightPanel()
}

function displayUnitsOnRightPanel(){
    let playerPanel = document.getElementById("player_panel")
    playerPanel.innerHTML = ""
    playerPanel.innerHTML = `<div style='text-decoration:underline;'>Selected Units<div>`
    for(let unit of player_units){
        let img = document.createElement("img")
        img.id = "unit_right_man_panel_" + unit.uuid
        img.src = unit.image
        img.className ="unit_info_img unit_right_man"
        img.addEventListener("click", (event) => {
            player_units = player_units.filter((e) => e.uuid != unit.uuid)
            let img = document.getElementById("unit_right_man_panel_" + unit.uuid)
            img.remove()
        })
        playerPanel.appendChild(img)
    }
}

function generateManagementPanel(){
    tab.innerHTML = ""
    tab.style = ""
    tab.style.backgroundImage = "url('images/bg/maps.png')"
    tab.style.backgroundSize = "cover"
    displayMapsOnPanel()
    generateRightInfoPanel()
    generatePlayerInfoPanel()
    generateMapInfoPanel()
}

// UNIT panel ---------------------------------------------------
function generateUnitPanel(){
    tab.innerHTML = ""
    tab.style = ""
    tab.style.backgroundImage = "url('images/bg/units.png')"
    tab.style.backgroundSize = "cover"

    generateUnitLeftPanel()
    generateUnitRightPanel()
}
function generateUnitLeftPanel(){
    let unit_info_panel = document.createElement("div")
    unit_info_panel.id = "unit_info_panel"
    unit_info_panel.className = "unit_right bg_panel"
    unit_info_panel.innerHTML = ""
    let unit_div = document.createElement("div")
    unit_div.id = "unit_div"
    unit_div.className = "unit_left bg_panel"
    unit_div.innerHTML = ""

    let unitButtons = units.map((unit) => {
        let div = document.createElement("div")
        div.className = "unit_info_div"
        let span = document.createElement("span")
        span.id = "unit_text_" + unit.uuid
        span.innerHTML = displayInfo(unit, Object.keys(unit).slice(0,-5))
        span.className = "unit_info"
        let img = document.createElement("img")
        img.src = unit.image
        img.className = "unit_info_img"
        img.addEventListener("click", () =>{
            currentUnit = unit
            generateUnitRightPanel()
        })
        div.appendChild(img)
        div.appendChild(span)
        return div
    })
    unitButtons.forEach((e) => unit_div.appendChild(e))

    tab.appendChild(unit_div)
    tab.appendChild(unit_info_panel)
}

function generateUnitInventoryPanel(){
    let panel = document.getElementById("unit_info_panel") 
    let unit_inventory = document.getElementById("unit_inventory")
    unit_inventory.className = "unit_inventory"

    if(!currentUnit){
        unit_inventory.innerHTML = "Select a unit"
        panel.appendChild(unit_inventory)
        return 
    }
    
    //todo make this a loop
    unit_inventory.id = "unit_inventory"
    unit_inventory.className = "unit_inventory"
    unit_inventory.style.backgroundImage = "url('images/bg/inventory.png')"
    unit_inventory.style.backgroundSize = "cover"

    let helm_slot = document.createElement("div")
    helm_slot.className = "item_slot"
    helm_slot.id ="helm_slot"
    helm_slot.innerHTML = "HELM"
    helm_slot.style.left = "42%"
    helm_slot.style.top = "2%"

    let weapon_slot = document.createElement("div")
    weapon_slot.className = "item_slot"
    weapon_slot.id ="weapon_slot"
    weapon_slot.innerHTML = "WEAPON"
    weapon_slot.style.left = "5%"
    weapon_slot.style.top = "30%"

    let armor_slot = document.createElement("div")
    armor_slot.className = "item_slot"
    armor_slot.id ="armor_slot"
    armor_slot.innerHTML = "ARMOR"
    armor_slot.style.left = "42%"
    armor_slot.style.bottom = "5%"

    let shield_slot = document.createElement("div")
    shield_slot.className = "item_slot"
    shield_slot.id ="shield_slot"
    shield_slot.innerHTML = "SHIELD"
    shield_slot.style.left = "78%"
    shield_slot.style.bottom = "2%"

    let boots_slot = document.createElement("div")
    boots_slot.className = "item_slot"
    boots_slot.id ="boots_slot"
    boots_slot.innerHTML = "BOOTS"
    boots_slot.style.left = "42%"
    boots_slot.style.top = "15%"

    let info_slot = document.createElement("div")
    info_slot.className = "info_slot"
    info_slot.id ="info_slot"
    info_slot.innerHTML = currentUnit.name
    info_slot.style.left = "2%"
    info_slot.style.top = "2%"

    unit_inventory.appendChild(info_slot)
    unit_inventory.appendChild(helm_slot)
    unit_inventory.appendChild(weapon_slot)
    unit_inventory.appendChild(armor_slot)
    unit_inventory.appendChild(shield_slot)
    unit_inventory.appendChild(boots_slot)

    panel.appendChild(unit_inventory)

    if(currentUnit){
        showUnitInventory(currentUnit)
    }
}


function generateUnitRightPanel(){
    let panel = document.getElementById("unit_info_panel") 
    panel.innerHTML = ""
    let player_inventory = document.createElement("div")
    player_inventory.id = "player_inventory"
    player_inventory.className = "player_inventory"
    let unit_inventory = document.createElement("div")
    unit_inventory.id = "unit_inventory"

    panel.appendChild(player_inventory)
    panel.appendChild(unit_inventory)

    showPlayerInventory()

    generateUnitInventoryPanel()
}

function showPlayerInventory(){
    let panel = document.getElementById("player_inventory")
    panel.innerHTML = ""
    let inventory = player.inventory
    for(let item of inventory){
        let div = document.createElement("div")
        div.className = "player_inventory_div"
        let img = document.createElement("img")
        img.className = "player_inventory_img"
        img.src = item.image
        img.width = 90
        img.heigh = 180
        img.addEventListener("click", (e) =>{
            addItemToUnit(item) 
        })
        let span = document.createElement('span')
        span.innerHTML = item.name
        span.className = "player_inventory_info"


        div.appendChild(img)
        div.appendChild(span)
        panel.appendChild(div)
    }
}

function addItemToUnit(item){
    let item_slot = document.getElementById("shield" + "_slot")
    console.log(item_slot)

    let unit = currentUnit
    if(!unit) return
    let type = item["type"]
    unit.inventory[type] = item
    player.inventory = player.inventory.filter((e) => e.uuid != item.uuid)

    unit.armor += item.armor
    unit.damage += item.armor

    let text_span = document.getElementById("unit_text_"+currentUnit.uuid)
    text_span.innerHTML = displayInfo(unit, Object.keys(unit).slice(0,-5))

    showPlayerInventory()
    showUnitInventory(unit)
}

let currentUnit
function showUnitInventory(unit){
    let item_slot = document.getElementById("shield" + "_slot")
    console.log(item_slot)
    console.log(item_slot.children)
    currentUnit = unit
    for(let key of Object.keys(unit.inventory)){
        console.log(key)
        let item = unit.inventory[key]
        let item_slot = document.getElementById(key + "_slot")
        item_slot.innerHTML = ""
        item_slot.className = "item_slot"

        let removeItem = () =>{
            let item = currentUnit.inventory[key]
            currentUnit.armor -= item.armor
            currentUnit.damage -= item.damage
            let text_span = document.getElementById("unit_text_"+currentUnit.uuid)
            text_span.innerHTML = displayInfo(unit, Object.keys(unit).slice(0,-5))
            player.inventory.push(item)
            delete currentUnit.inventory[key]
            let item_slot = document.getElementById(key + "_slot")
            item_slot.innerHTML = key
            item_slot.className = "item_slot"
            item_slot.removeEventListener("click", removeItem)
            showPlayerInventory()
        }
        //If the item is already in inventory, we need to avoid adding a new event
        let image = document.createElement("img")
        image.src = item.image
        image.className = "inventory_image"
        //todo actually fix this bug
        if(key == "helm"){
            image.style.position = "relative"
            image.style.bottom = 23
            image.style.right = 3
        }
        image.addEventListener("click", removeItem)

        item_slot.appendChild(image)
    }
}

// UTILS
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleButtons(names){
    for(let name of names){
        let button = document.getElementById(name+"_button")
        button.disabled ? button.disabled = false: button.disabled = true;
    }
}

//todo modify to print array proper
function displayInfo(json, keys){
    let str = ''
    if(keys == null){
        for(let key of Object.keys(json)){
            str = str + capitalizeFirstLetter(key) + "\t" + JSON.stringify(json[key]).replaceAll("_"," ") + "<br>" 
        }
    }
    else{
        for(let key of keys){
            if(json[key] == null) continue
            str = str + capitalizeFirstLetter(key) + "\t" + JSON.stringify(json[key]).replaceAll("_"," ") + "<br>" 
        }
    }
    return str
}

//INIT ---------------------------------------------------
function initGame(){
    setOpponent()
    setPlayerPanel()
    setDnd()
}

function generateParentInterface(){
    container.innerHTML = ""
    tab.innerHTML = ""
    let player_panel = document.createElement("button")
    player_panel.id = "maps_button"
    player_panel.innerHTML = "Maps"
    player_panel.addEventListener("click", () => generateManagementPanel())
    player_panel.className = "tab_button"
    
    let unit_panel = document.createElement("button")
    unit_panel.id = "units_button"
    unit_panel.innerHTML = "Units"
    unit_panel.addEventListener("click", () => generateUnitPanel())
    unit_panel.className = "tab_button"

    let quest_panel = document.createElement("button")
    quest_panel.id = "quests_button"
    quest_panel.innerHTML = "Quests"
    quest_panel.addEventListener("click", () => generateQuestPanel())
    quest_panel.className = "tab_button"

    let town_panel = document.createElement("button")
    town_panel.id = "town_button"
    town_panel.innerHTML = "Town"
    town_panel.addEventListener("click", () => generateTownPanel())
    town_panel.className = "tab_button"

    let board = document.createElement("button")
    board.id = "board_button"
    board.innerHTML = "Board"
    board.addEventListener("click", () => generateBoard(currentMap))
    board.disabled = true
    board.className = "tab_button"

    container.appendChild(player_panel)
    container.appendChild(unit_panel)
    container.appendChild(quest_panel)
    container.appendChild(town_panel)
    container.appendChild(board)
    container.appendChild(tab)

    //generateUnit()
    //generateUnit()
    //generateUnit()
    //generateUnit()
    //generateMap()
    //generateMap()
    //generateMap()
    //generateMap()
    //generateItem()
    //generateItem()
    //generateItem()
    //generateItem()
    generateItem()
    //generateStructure()
    //generateStructure()
    //generateStructure()
    //generateStructure()
    //generateStructure()
    generateManagementPanel()
}

function generateStartInterface(){
    //load_game()
    //generateParentInterface()
    generateMenu() 
}

window.addEventListener("keydown", (e) =>{
    if(e.code == "KeyS" && e.ctrlKey){
        e.preventDefault()
        save()
        alert("saved")
    }
})

generateStartInterface()
