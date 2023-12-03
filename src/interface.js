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
function generateCreationMenu(){
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
        let loaded = load_game()
        if(loaded){
            generateParentInterface()
        }else{
            alert('no game to load')
        }
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
        generateStructure("tavern")
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

    //let body = document.getElementsByTagName("body")[0]
    //let audio = document.createElement("audio")
    //audio.autoplay = true
    //let source = document.createElement("source")
    //source.src="sounds/soundtrack.mp4"
    //source.type = "audio/ogg"
    //audio.appendChild(source)
    //body.appendChild(audio)

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

        slot.addEventListener("click", (e) => {
            let opponent = opponent_units[parseInt(e.target.id.slice(-1))]
            let div = document.getElementById("panel_topside") 
            div.innerHTML = displayOpponentInfoOnBoardPanel(opponent, ["type","name","hp","damage","armor","level","xpPerLvl","givenXp"])
        })

        
        slot.appendChild(overlay)
        slot.appendChild(animation_layer)
        topside.appendChild(slot)
    }
    for(let i = 0; i<SLOT_MAX;i++){
        let slot = document.createElement("div")
        slot.className = "slot"
        slot.id = "bottom_slot" + i

        let animation_layer = document.createElement("div")
        animation_layer.className = "overlay_animation"
        animation_layer.id = "bot_animation" + i

        slot.appendChild(animation_layer)
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

let addBoardPanels = () =>{
    let board = document.getElementById("board")

    let topside = document.createElement("div")
    topside.id = "board_topside"
    topside.classList.add("board_panel","board_top")

    let botside = document.createElement("div")
    botside.id = "board_botside"
    botside.classList.add("board_panel","board_bot")
    
    let spell_dialog = document.createElement('dialog')
    spell_dialog.id = "spell_dialog"
    spell_dialog.className = "spell_dialog"

    botside.appendChild(spell_dialog)
    
    board.appendChild(topside)
    board.appendChild(botside)

    let panel = document.getElementById("panel")

    topside = document.createElement("div")
    topside.id = "panel_topside"
    topside.classList.add("board_panel","board_top","board_top_right")
    topside.innerHTML = displayInfo(currentMap, ["name","levels","level","spawn"])

    botside = document.createElement("div")
    botside.id = "panel_botside"
    botside.classList.add("board_panel", "board_bot", "board_bot_right")

    for(let i = 0; i<SLOT_MAX;i++){
        let slot = document.createElement("div")
        slot.className = "slot_panel slot_panel_bot_right"
        slot.id = "bot_slot_panel_" + i
        botside.appendChild(slot)
    }

    let button = document.createElement("button")
    button.id = "playnext"
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
        let res = confirm("are you sure?")
        if(res){
            leaveMap()
            runPostDungeon()
        }
    })

    panel.appendChild(topside)
    panel.appendChild(button)
    panel.appendChild(button_leave)
    panel.appendChild(botside)
}

function swapPlayNext(){
    let button = document.getElementById("playnext")
    if(button.innerHTML == "Play"){
        button.id = "next"
        button.className = "board_button"
        button.innerHTML = "Next"
        button.addEventListener("click", () => {
            nextLevel()
        })
    }
    else{
        button.id = "play"
        button.className = "board_button"
        button.innerHTML = "Play"
        button.addEventListener("click", () => {
            playTurn()
        })
    }
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
        unitDiv.id = "opponent_"+i

        overlay.innerHTML = opponent.hp + "/" + opponent.maxhp
        opponent_units.push(opponent)

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
    let overlay = document.createElement("div")
    overlay.className = "overlay"
    overlay.id = "bot_overlay" + unit.uuid
    overlay.innerHTML = unit.hp + "/" + unit.maxhp

    let overlay_spells = document.createElement("div")
    overlay_spells.className = "overlay_spells"
    overlay_spells.id = "bot_overlay_spells" + unit.uuid

    if(container.id.includes("panel")){
        overlay_spells.style.visibility = "hidden"
    }

    if(!unit.selectedSpell){
        unit.selectedSpell = unit.spells[0]
    }
    let overlay_spell = document.createElement("span")
    overlay_spell.innerHTML = unit.selectedSpell
    let overlay_left_button = document.createElement("span")
    overlay_left_button.style.float = 'left'
    overlay_left_button.style.cursor = 'pointer'
    overlay_left_button.innerHTML = "<"
    let overlay_right_button = document.createElement("span")
    overlay_right_button.style.float = 'right'
    overlay_right_button.style.cursor = 'pointer'
    overlay_right_button.innerHTML = ">"
    overlay_spells.appendChild(overlay_left_button)
    overlay_spells.appendChild(overlay_spell)
    overlay_spells.appendChild(overlay_right_button)


    unitDiv.addEventListener("click", (e) => {
        let div = document.getElementById("panel_topside")
        div.innerHTML = displayUnitInfoOnBoardPanel(unit)
    })

    unitDiv.appendChild(overlay)
    unitDiv.appendChild(overlay_spells)
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

function displayOpponentInfoOnBoardPanel(opponent){
    let str = '<div style="margin:10px;">'
    str = str + opponent["name"].replaceAll("_"," ") + " - LvL " + opponent["level"] + "<br>" 
    str = str + "Hp " + opponent.hp + "/" + opponent.maxhp + "<br>" 
    //str = str + "Mana " + opponent.mana + "/" + opponent.maxmana + "<br>" 
    str = str + "Damage " + opponent.damage + "<br>" 
    str = str + "Armor " + opponent.armor + "<br>" 
    str = str + "Given Xp " + opponent.givenXp 
    str += '</div>'
    return str
    
}

function displayUnitInfoOnBoardPanel(unit){
    let str = '<div style="margin:10px;">'
    str = str + unit["name"].replaceAll("_"," ") + " - " 
        + capitalizeFirstLetter(unit["type"].replaceAll("_"," ")) 
        + ", " + capitalizeFirstLetter(unit["class"]) + " - LvL " + unit["level"] + "<br>" 
    str = str + "Hp " + unit.hp + "/" + unit.maxhp + "<br>" 
    str = str + "Mana " + unit.mana + "/" + unit.maxmana + "<br>" 
    str = str + "Damage " + unit.damage + " - Armor " + unit.armor + "<br>" 
    str = str + "Exp " + unit.exp + "/" + unit.xpPerLvl + "<br>" 
    unit.spells.forEach((e) => {
        str = str + "'" + e + "'" + " "
    })
    str += '</div>'
    return str
    
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
    addBoardPanels()
    addSlots()
    setBoardBg()
    initGame()
    addSlotEvents()
}

//utils
function displayOnSidePanel(text){
    let panel = document.getElementById("panel_topside")
    panel.innerHTML = text
}

// EVENTS ---------------------------------------------------
function selectUnit(e){
    console.log(e)
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

function dropUnit(e){
    e.preventDefault()
    let data = JSON.parse(e.dataTransfer.getData("data"))
    let id = data.id
    let unit_uuid = parseInt(id.split("_")[1])
    let from = data.from
    let to = e.target.id.slice(-1)
    //setting unit on board from the right panel
    //this is bad, alert,alert, this is bad, must fix, dangerdanger
    if(e.target.children.length == 1 && !e.target.id.includes("panel")){
        e.target.appendChild(document.getElementById(id))
        for(let i = 0;i<positions.length;i++){
            if(positions[i]){
                if(positions[i].uuid == unit_uuid){
                    positions[from] = positions[i]
                    positions[i] = null
                }
            }
        }
        document.getElementById("bot_overlay_spells"+unit_uuid).style.visibility = "visible"
        positions[to] = player_units.find((e) => e.uuid == unit_uuid)
    }
    //prevents moving within the right panel.
    else if(e.target.id.includes("bot_slot_panel_") && from == -1){
        return
    }
    //from board to right panel
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
        document.getElementById("bot_overlay_spells"+unit_uuid).style.visibility = "hidden"
    }
    //switching within board
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
    for(let unit of player_units){
        if(!unit) continue
        //spell events
        let overlay_spells = document.getElementById("bot_overlay_spells"+unit.uuid)
        overlay_spells.addEventListener("mouseover", (e) =>{
            let spell_dialog = document.getElementById("spell_dialog")
            let spell = spells.find((spell) => spell.name == unit.selectedSpell)
            spell_dialog.innerHTML = displayInfo(spell,["name","description"])
            spell_dialog.show()
        })
        overlay_spells.addEventListener("mouseout", (e) =>{
            let spell_dialog = document.getElementById("spell_dialog")
            spell_dialog.close()
        })
        //ooff
        let overlay_spell = overlay_spells.children[1]
        //todo: This is absolute trash. Using an index here is suicide. Don't say I didn't warn you, dumbass.
        overlay_spells.children[0].addEventListener("click", (e) => {
            let newspell
            let currentSpell = overlay_spell.innerHTML
            let spell_index = unit.spells.findIndex((e) => e == currentSpell)
            if(spell_index == 0)
                newspell = unit.spells[unit.spells.length-1]
            else
                newspell = unit.spells[spell_index-1]
            overlay_spell.innerHTML = newspell
            unit.selectedSpell = newspell
        })
        overlay_spells.children[2].addEventListener("click", (e) => {
            let newspell
            let currentSpell = overlay_spell.innerHTML
            let spell_index = unit.spells.findIndex((e) => e == currentSpell)
            let maxIndex = unit.spells.length-1
            if(spell_index == maxIndex)
                newspell = unit.spells[0]
            else
                newspell = unit.spells[spell_index+1]
            overlay_spell.innerHTML = newspell
            unit.selectedSpell = newspell
        })
        //click events
        let slot = document.getElementById("unit_"+unit.uuid)
        slot.ondragstart = selectUnit
        slot.addEventListener("click", () => {
            let div = document.getElementById("panel_topside")
            div.innerHTML = displayUnitInfoOnBoardPanel(unit,["name","type","lass","damage","armor","exp","xpPerLvl","level"])
        })
    }
    for(let unit of opponent_units){
        if(!unit) continue
        let slot = document.getElementById("top_animation"+unit.uuid)
        slot.addEventListener("click", () => {
            let div = document.getElementById("panel_topside")
            div.innerHTML = displayOpponentInfoOnBoardPanel(unit,["name","type","hpPerLvl","damage","armor","exp","level"])
        })
    }
    setDnd()
}

//IDLER TAB -----------------------------------------------------
function generateIdlerPanel(){
    let idlerPanel = document.createElement("div")
    idlerPanel.id = "idler_panel"
    idlerPanel.className = "idler_panel"

    tab.append(idlerPanel)
}

function generateIdlerGame(){
    let panel = document.getElementById("idler_panel")
    let game_div = document.createElement("div")
    game_div.id = "idler_game_div"
    game_div.className = "idler_game_div"

    panel.appendChild(game_div)
}

function generateIdlerMenu(){
    let panel = document.getElementById("idler_panel")
    let menu_div = document.createElement("div")
    menu_div.id = "idler_menu_div"
    menu_div.className = "idler_menu_div"

    let menu_options = ["dungeon","town"]

    for(let option of menu_options){
        let opt = document.createElement("div")
        opt.innerHTML = option
        opt.className = "idler_menu_option"
        opt.addEventListener("click", (e) =>{
            idler_generate(option)
        })
        menu_div.appendChild(opt)
    }

    panel.appendChild(menu_div)
}

function generateIdlerTab(){
    tab.innerHTML = ""
    tab.style = ""
    tab.style.backgroundImage = "url('images/bg/wall6.png')"
    tab.style.backgroundSize = "cover"
    generateIdlerPanel()
    generateIdlerMenu()
    generateIdlerGame()
    idler_generate("dungeon")
}

//PLAYER TAB -----------------------------------------------------
function generatePlayerRightPanel(){
    let rightPanel = document.createElement("div")
    rightPanel.id = "player_right_panel"
    rightPanel.className = "right player_right_panel"
    tab.append(rightPanel)
    displayWeekInfo()
}
function generatePlayerLeftPanel(){
    let leftPanel = document.createElement("div")
    leftPanel.id = "player_left_panel"
    leftPanel.className = "left player_left_panel"

    let text_div = document.createElement("div")
    text_div.id = "player_left_text"
    text_div.className = "player_left_text"
    text_div.innerHTML = displayPlayerInfo(player)

    let restButton = document.createElement("button")
    restButton.className = "button_style"
    restButton.innerHTML = "rest"
    restButton.addEventListener("click", () =>{
        alert("resting")
        runPerks()
        generatePlayerTab()
        displayWeekInfo()
    })
    leftPanel.appendChild(restButton)

    leftPanel.appendChild(text_div)


    tab.append(leftPanel)
}

function displayPlayerInfo(player){
    let str = ""
    let names = player.name.split(" ")
    for(let name of names){
        str += capitalizeFirstLetter(name) 
    }
    str += "<br>"

    for(let key of Object.keys(player.resources)){
        str += key + " = " + player.resources[key] + "<br>"
    }
    return str 
}

function displayWeekInfo(){
    let max_display = 20
    let panel = document.getElementById("player_right_panel")
    panel.innerHTML = ""
    for(let week of week_info){
        panel.innerHTML += week + "<br>"
    }
}

function generatePlayerTab(){
    tab.innerHTML = ""
    tab.style = ""
    tab.style.backgroundImage = "url('images/bg/wall4.png')"
    tab.style.backgroundSize = "cover"
    generatePlayerLeftPanel()
    generatePlayerRightPanel()
}

//TOWN TAB -----------------------------------------------------
function generateTownRightPanel(){
    let rightPanel = document.createElement("div")
    rightPanel.id = "town_right_panel"
    rightPanel.className = "right town_right"
    for(let structure of structures){
        let div = document.createElement("div")
        div.className="town_div_right"

        let span = document.createElement("div")
        span.innerHTML = capitalizeFirstLetter(structure.name) + " blueprints x" + structure.amt
        span.className="town_name"

        let info = document.createElement("div")
        info.innerHTML = displayInfo(structure,["cost"])
        info.className = "town_info"

        let image = document.createElement("img")
        image.src = structure.image
        image.className = "town_image"
        image.addEventListener("click", () => {
            addStructure(structure)
            generateTownTab()
        })

        div.appendChild(image)
        div.appendChild(span)
        div.appendChild(info)
        rightPanel.appendChild(div)
    }

    tab.append(rightPanel)
}

function displayStructInfo(struct){
    let str = ''
    str = "<span style='font-size:200%;'>" + str + struct["name"].replaceAll("_"," ") + "</span><br>" 
    str = str + "Level " + struct["level"]  + "<br>"
    str = str + struct["description"] + "<br>" 
    return str
     
}

function generateTownLeftPanel(){
    leftPanel = document.createElement("div")
    leftPanel.id = "town_left_panel"
    leftPanel.className = "left bg_panel"
    for(let structure of player_structures){
        let div = document.createElement("div")
        div.className = "town_div_left"

        let info = document.createElement("div")
        info.className = "town_struct_info"
        info.innerHTML = displayStructInfo(structure)

        let image = document.createElement("img")
        image.src = structure.image
        image.className = "town_struct_img"

        div.appendChild(image)
        div.appendChild(info)
        leftPanel.appendChild(div)
    }

    tab.append(leftPanel)
}

function generateTownTab(){
    tab.innerHTML = ""
    tab.style = ""
    tab.style.backgroundImage = "url('images/bg/town2.png')"
    tab.style.backgroundSize = "cover"
    generateTownLeftPanel()
    generateTownRightPanel()
}

//QUEST TAB -----------------------------------------------------

function generateQuestLeftPanel(){
    leftPanel = document.createElement("div")
    leftPanel.id = "quest_panel"
    leftPanel.className = "left quest_panel"
    for(let quest of quests){
        let cont = document.createElement("div")
        cont.className = "quest_text"
        cont.id = "quest_text"
        let div = document.createElement("div")
        div.className = "quest_text"
        div.innerHTML = quest[1] + ' - Level ' + quest[3] 
        div.addEventListener("click", () => {
            quest[0]()
            let new_q_arr = quests.filter((e) => {
                if(!(e[2] == quest[2])){
                    return true
                }
                return false
            })
            quests = new_q_arr
            alert("quest accepted")
            generateQuestTab()
        })
        let button = document.createElement("button")
        button.innerHTML = 'x'
        button.addEventListener("click", (e) => {
            quests = quests.filter((e) => e[2] != quest[2])   
            alert("quest removed")
            generateQuestTab()
        })
        cont.appendChild(div)
        cont.appendChild(button)
        leftPanel.appendChild(cont)
    }

    tab.style.backgroundImage = "url('images/bg/wall5.png')"
    tab.style.backgroundSize = "cover"
    tab.append(leftPanel)
}

function updateQuestPanel(){
    let cont = document.getElementById("quest_text")
    if(cont){
        generateQuestTab()
    }
}

function generateQuestTab(){
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
    unit_button.id = "unit_button_confirm"
    unit_button.className = "button_style"
    unit_button.innerHTML = "Select a Map"
    unit_button.addEventListener("click",displayUnitsOnPanel)
    leftPanel.appendChild(unit_button)

    for(let map of maps){
        let button = document.createElement("div")
        button.className = "maps_div"
        button.addEventListener("click", () =>{
            currentMap = map
            fillMapInfoPanel(map)
            document.getElementById("unit_button_confirm").innerHTML = "Confirm"
        })
        let image = document.createElement("img")
        image.id = map.name.replaceAll(" ","_")
        image.src= map.image
        image.className = "maps_img"

        button.appendChild(image)

        let text = document.createElement("span")
        text.innerHTML = displayMapText(map)
        text.className = "map_panel_text"
        button.appendChild(text)

        let remove = document.createElement("button")
        remove.innerHTML = "X"
        remove.className = "idler_map_button"
        remove.addEventListener("click", (e) => {
            let res = confirm("are you sure?")
            if(res){
                e.stopPropagation()
                maps = maps.filter((element) => element.uuid != map.uuid)
                e.target.parentElement.remove()
            }
        })

        button.appendChild(remove)

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
    map_button.innerHTML = "Change Map"
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
            toggleButtons(["player","maps","units","quests","town","board"])
        }
    })
    leftPanel.appendChild(startButton)

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
function setNbr_level(nbr){
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
    mapPanel.innerHTML += "</div><div style='float:right'>"
    mapPanel.innerHTML +=  displayMapText(map)
    mapPanel.innerHTML += "</div>"
    setNbr_level(map.levels)
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

function generateMapsTab(){
    tab.innerHTML = ""
    tab.style = ""
    tab.style.backgroundImage = "url('images/bg/hall.png')"
    tab.style.backgroundSize = "cover"
    displayMapsOnPanel()
    generateRightInfoPanel()
    generatePlayerInfoPanel()
    generateMapInfoPanel()
}

function displayMapText(map){
    let reward = map.rewards[0]
    if(reward.length != 0){
    
    }
    let str = ''
    str = "<span style='font-size:115%;'>" + str + map["name"].replaceAll("_"," ") + "</span><br>" 
    str = str + "Type - " + map["spawn"][0] + "<br>" 
    str = str + "Level " + map["level"] 
    str = str + ", Levels " + map["levels"] + "<br>" 
    if(map["description"]){
        str = str + map["description"] + "<br>" 
    }
    return str
}

// UNIT panel ---------------------------------------------------
function generateUnitPanel(){
    tab.innerHTML = ""
    tab.style = ""
    tab.style.backgroundImage = "url('images/bg/wall3.png')"
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
    helm_slot.style.left = "41%"
    helm_slot.style.bottom = "7%"

    let weapon_slot = document.createElement("div")
    weapon_slot.className = "item_slot"
    weapon_slot.id ="weapon_slot"
    weapon_slot.innerHTML = "WEAPON"
    weapon_slot.style.left = "5%"
    weapon_slot.style.top = "11%"

    let armor_slot = document.createElement("div")
    armor_slot.className = "item_slot"
    armor_slot.id ="armor_slot"
    armor_slot.innerHTML = "ARMOR"
    armor_slot.style.left = "42%"
    armor_slot.style.bottom = "18%"

    let shield_slot = document.createElement("div")
    shield_slot.className = "item_slot"
    shield_slot.id ="shield_slot"
    shield_slot.innerHTML = "SHIELD"
    shield_slot.style.left = "78%"
    shield_slot.style.bottom = "30%"

    let boots_slot = document.createElement("div")
    boots_slot.className = "item_slot"
    boots_slot.id ="boots_slot"
    boots_slot.innerHTML = "BOOTS"
    boots_slot.style.left = "42%"
    boots_slot.style.bottom = "20%"

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

    panel.appendChild(unit_inventory)

    generatePlayerInventory()
    generateUnitInventoryPanel()
}

function generatePlayerInventory(){
    panel.appendChild(player_inventory)
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

    let unit = currentUnit
    if(!unit) return
    let type = item["type"]
    if(unit.inventory[type] != null) return
    unit.inventory[type] = item
    player.inventory = player.inventory.filter((e) => e.uuid != item.uuid)

    unit.armor += item.armor
    unit.damage += item.damage

    let text_span = document.getElementById("unit_text_"+currentUnit.uuid)
    text_span.innerHTML = displayInfo(unit, Object.keys(unit).slice(0,-5))

    generatePlayerInventory()
    showUnitInventory(unit)
}

let currentUnit
function showUnitInventory(unit){
    let item_slot = document.getElementById("shield" + "_slot")
    currentUnit = unit
    for(let key of Object.keys(unit.inventory)){
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
            generatePlayerInventory()
        }
        //If the item is already in inventory, we need to avoid adding a new event
        let image = document.createElement("img")
        image.src = item.image
        image.className = "inventory_image"
        image.addEventListener("click", removeItem)

        item_slot.appendChild(image)
    }
}

// UTILS
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleButtons(names){
    let buttons = document.getElementsByClassName("tab_button")
    for(let button of buttons){
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

    let dialog = document.createElement("dialog")
    container.appendChild(dialog)

    let idler_panel = document.createElement("button")
    idler_panel.id = "idler_button"
    idler_panel.innerHTML = "Idle"
    idler_panel.addEventListener("click", () => generateIdlerTab())
    idler_panel.className = "tab_button"

    let player_panel = document.createElement("button")
    player_panel.id = "player_button"
    player_panel.innerHTML = "Player"
    player_panel.addEventListener("click", () => generatePlayerTab())
    player_panel.className = "tab_button"

    let map_panel = document.createElement("button")
    map_panel.id = "maps_button"
    map_panel.innerHTML = "Maps"
    map_panel.addEventListener("click", () => generateMapsTab())
    map_panel.className = "tab_button"
    
    let unit_panel = document.createElement("button")
    unit_panel.id = "units_button"
    unit_panel.innerHTML = "Units"
    unit_panel.addEventListener("click", () => generateUnitPanel())
    unit_panel.className = "tab_button"

    let quest_panel = document.createElement("button")
    quest_panel.id = "quests_button"
    quest_panel.innerHTML = "Quests"
    quest_panel.addEventListener("click", () => generateQuestTab())
    quest_panel.className = "tab_button"

    let town_panel = document.createElement("button")
    town_panel.id = "town_button"
    town_panel.innerHTML = "Town"
    town_panel.addEventListener("click", () => generateTownTab())
    town_panel.className = "tab_button"

    let board = document.createElement("button")
    board.id = "board_button"
    board.innerHTML = "Board"
    board.addEventListener("click", () => generateBoard(currentMap))
    board.disabled = true
    board.className = "tab_button"

    container.appendChild(idler_panel)
    container.appendChild(player_panel)
    container.appendChild(map_panel)
    container.appendChild(unit_panel)
    container.appendChild(quest_panel)
    container.appendChild(town_panel)
    container.appendChild(board)
    container.appendChild(tab)

    generateMapsTab()
}

function generateStartInterface(){
    startOnBoard()
    //startOnIdler()

    //generateCreationMenu() 
}

window.addEventListener("keydown", (e) =>{
    if(e.code == "KeyS" && e.ctrlKey){
        e.preventDefault()
        save()
        alert("saved")
    }
})

generateStartInterface()


//test function
function startOnIdler(){
    generatePlayer("bob")
    player.resources.gold = 10000
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateQuest()
    generateUnit()
    generateUnit()
    generateUnit()
    generateUnit()
    generateStructure("tavern")
    addStructure(structures[0])
    generateMap()
    generateCompletedMap()
    generateCompletedMap()
    generateCompletedMap()
    currentMap = maps[0]
    generateParentInterface()
    generateIdlerTab()
}
function startOnBoard(){
    //load_game()
    generatePlayer("bob")
    player.resources.gold = 10000
    generateUnit()
    generateUnit()
    generateUnit()
    generateUnit()
    generateUnit()
    generateUnit()
    generateUnit()
    generateUnit()
    generateUnit()
    generateStructure("forge")
    generateStructure("hall")
    let st = generateStructure("hall")
    generateStructure("hall")
    generateStructure("hall")
    generateStructure("merchant")
    generateStructure("prison")
    addStructure(structures[0])
    generateMap()
    generateMap()
    generateCompletedMap()
    generateCompletedMap()
    currentMap = maps[0]
    setNbr_level(currentMap.levels)
    player_units = [units[0],units[1],units[2],units[3]]
    generateQuest()
    generateParentInterface()
    //generateTownTab()
    //generateIdlerTab()
    //generatePlayerTab()
    
    toggleButtons(["player","maps","units","quests","town","board"])
    generateBoard(currentMap)
}
