let turnEnded = 0
let dungeonEnded = 0
//the implementation lacks consistency, opp and player turns are built different
async function playTurn(){
    if(!positions.find((e) => e != null)) return
    disableBoardButtons()
    //player turn
    if(turnEnded == 0 && dungeonEnded ==0){
        for(let i = positions.length -1;i>=0;i--){
            let unit = positions[i]
            if(!unit) continue
            let index = pickOpponent(opponent_units)
            if(index == -1) continue
            let opp = opponent_units[index]
            //let div = document.getElementById("board_topside")
            //div.classList.add("animation_div")
            if(!(unit.hp <= 0 || opp.hp <= 0)){
                if(calculateDodge(opp)) {
                    opp.hp = opp.hp - unit.damage
                }
                await attack(unit,"bot")
                await castSpells(unit)
                if(opp.hp <= 0){
                    dies(index, 'top')
                    setXp(opp.givenXp)
                }
            }
        }
        //opponent turn
        for(let i = opponent_units.length -1;i>=0;i--){
            let unit = positions[pickOpponent(positions)]
            let opp = opponent_units[i]
            if(!(unit.hp <= 0 || opp.hp <= 0)){
                if(calculateDodge(unit)) { 
                    unit.hp = unit.hp - opp.damage 
                }
                await attack(opp,"top")
                //await castSpells(unit)
                if(unit.hp <= 0){
                    unit.hp = 0
                    dies(unit, 'bot')
                    if(!checkForUnitAlive()){
                        alert("You have been felled! Retreat back to your town")
                        leaveMap()
                    }
                }
            }
        }
        if(!checkForOppAlive()){
            nbr_levels--
            if(nbr_levels > 0){
                turnEnded = 1 
                betweenRound()
            }
            else{
                addSlotEvents()
                enableBoardButtons()
                dungeonEnded = 1
                displayOnSidePanel("Dungeon Ended")
                addQuest()
                runReward()
            }

        }
    }
    //this is bad. fix the path the code takes to avoid doubling
    addSlotEvents()
    enableBoardButtons()
}

function calculateDodge(unit){
    let armor = unit.armor
    let dodge = Math.log(armor) * 10
    let odds = Math.ceil(Math.random()*100)

    if(dodge < odds){
        return 1
    }
    else{
        displayOnSidePanel("Dodged!")
        return 0
    }
}

async function attack(unit, side){
    let targetDiv
    let animation
    if(side == 'bot'){
        targetDiv = document.getElementById("unit_" + unit.uuid)
        animation = "animation_attack"
    }
    else{
        targetDiv = document.getElementById("opponent_" + unit.uuid)
        animation = "animation_attack_opp"
    }
    if(!targetDiv.classList.contains(animation)){
        targetDiv.classList.add(animation)
    }

    updateHps()

    let play = (new Audio("sounds/sword.wav")).play()

    await (new Promise((resolve) => {
        setTimeout(() => {
            if(targetDiv.classList.contains(animation)){
                targetDiv.classList.remove(animation)
                let new_div = targetDiv.cloneNode(true)
                targetDiv.parentNode.replaceChild(new_div, targetDiv)
            }
            resolve()
        }, 1200)
    }))
}

async function castSpells(unit){
    if(unit.spells.length != 0){
        for(let spell of unit.spells){
            let spell_info = spells.find((e) => e.name == spell)
            let targets = spell_info.target == 'units' ? player_units : opponent_units; 
            let target = spell_info.action(targets)
            //this is kicking the can down the road and I don't approve of it.
            if(target == null) continue
            let targetDiv
            spell_info.sound()
            if(target){
                console.log(target)
                if(spell_info.target == "opponents"){
                    targetDiv = document.getElementById("top_animation"+target.uuid)
                }
                else if(spell_info.target == "units"){
                    targetDiv = document.getElementById("bottom_slot"+target.uuid)
                }
                console.log(targetDiv)
            }
            else if(spell_info.target == "opponents"){
                targetDiv = document.getElementById("board_topside")
            }
            else if(spell_info.target == "units"){
                targetDiv = document.getElementById("board_botside")
            }
            if(!targetDiv.classList.contains(spell_info.animation)){
                targetDiv.classList.add(spell_info.animation)
            }
            updateHps()
            await (new Promise((resolve) => {
                setTimeout(() => {
                    if(targetDiv.classList.contains(spell_info.animation)){
                        targetDiv.classList.remove(spell_info.animation)
                        let new_div = targetDiv.cloneNode(true)
                        targetDiv.parentNode.replaceChild(new_div, targetDiv)
                    }
                    resolve()
                }, 1200)
            }))
        }
    }
    
}

function nextLevel(){
    if(turnEnded == 1 && dungeonEnded == 0){
        clearOpponents()
        generateBoard() 
        turnEnded = 0
    }
}

function runReward(){
    if(currentMap.rewards.length != 0){
        for(let reward of currentMap.rewards){
            if(reward.length!=0){
                if(reward[0]){
                    reward[0](...(reward.slice(1)))
                }
            }
        }
        displayOnSidePanel(`Dungeon Over, You've been gifted a reward`)
        currentMap.rewards = []
    }
}

function addQuest(){
    let odds = Math.floor(Math.random()* 100)
    if(odds >= 0){
        let newQuest = generateQuest({level:currentMap.level})
        quests.push(newQuest)
        displayOnSidePanel(`Dungeon Over, You've been given a new Quest!`)
    }
}

function betweenRound(){
    let heal = roll([2,5],1)
    for(unit of positions){
        if(unit){
            if(unit.hp < unit.maxhp){
                unit.hp = unit.hp + heal > unit.maxhp ? unit.maxhp : unit.hp + heal;
            }
        }
    }

    displayOnSidePanel(`your units have healed for ${heal}`)

}

//let spells = {
    //"heal": (level) => {
        //let heal = roll([5,10],level)
        //if(positions.length != 0){
            //for(let unit of positions){
                //if(unit){
                    //unit.hp = unit.hp + heal
                    //if(unit.hp > unit.maxhp){
                        //unit.hp = unit.maxhp
                    //}
                //}
            //}
        //}
        //else{
            //for(let unit of units){
                //if(unit){
                    //unit.hp = unit.hp + heal
                    //if(unit.hp > unit.maxhp){
                        //unit.hp = unit.maxhp
                    //}
                //}
            //}
            
        //}
    //}
//}

function setXp(givenXp){
    for(let unit of positions){
        if(unit){
            unit.exp = unit.exp + givenXp
            if(unit.exp >= unit.xpPerLvl){
                let lvlUpHp = roll(unit.hpPerLvl,1)
                unit.level = unit.level + 1 
                unit.xpPerLvl = unit.xpPerLvl * lvlXpRatio
                unit.exp = 0
                unit.maxhp = unit.maxhp + lvlUpHp
                unit.hp = unit.hp + lvlUpHp
                unit.damage = unit.damage + roll(unit.dmgPerLvl,1)
            }
        }
    }
}

function leaveMap(){
    dungeonEnded = 0
    turnEnded = 0
    player_units = []
    opponent_units = []
    positions = []
    toggleButtons(["board","maps","units","quests","town"])
    generateManagementPanel()
}

function checkForUnitAlive(){
    let alive = false
    positions.forEach((e) => {
        if(e){
            if(e.hp > 0){
                alive = true
            }
        }
    })
    return alive
}

function checkForOppAlive(){
    let alive = false
    opponent_units.forEach((e) => {
        if(e.hp > 0){
            alive = true
        }
    })
    return alive
}

//finds opponent with hp > 0
function pickOpponent(list){
    for(let i =list.length; i>=0; i--){
        if(list[i]){
            if(list[i].hp > 0){
                return i
            }
        }
    }
    return -1
}

function dies(unit, side){
    if(side == 'top'){
        let overlay = document.getElementById(side + "_overlay" +unit)
        overlay.classList.add("dead")
        let opp = opponent_units[unit]
        if(opp.resources.length != 0){
            for(let key of Object.keys(opp.resources)){
                player.resources[key] += opp.resources[key]
            }
        }
        if(opp.inventory.length != 0){
            console.log("adding item")
            player.inventory.push(...opp.inventory)
        }
    }
    else{
        let overlay = document.getElementById(side + "_overlay" +unit.uuid)
        overlay.classList.add("dead")
    }
}

function updateHps(){
    for(let i = 0;i<positions.length;i++){
        if(positions[i]){
            let id = positions[i].uuid
            let overlay = document.getElementById("bot_overlay"+id)
            let unit = positions[i]
            if(!unit) continue
            overlay.innerHTML = unit.hp + '/' + unit.maxhp
        }
    }
    for(let i = 0;i<opponent_units.length;i++){
        let overlay = document.getElementById("top_overlay"+i)
        let unit = opponent_units[i]
        overlay.innerHTML = unit.hp + '/' + unit.maxhp
    }
}

//this is very dubious
function runPostDungeon(){
    for(let structure of unit_structures){
        if(structure.perks.length != 0){
            for(let perk of structure.perks){
                perk.action(units)
            }
        }
    }
    //TEMP
    let heal = roll([2,5],1)
    for(unit of positions){
        if(unit){
            if(unit.hp < unit.maxhp){
                unit.hp = unit.hp + heal > unit.maxhp ? unit.maxhp : unit.hp + heal;
            }
        }
    }
}
