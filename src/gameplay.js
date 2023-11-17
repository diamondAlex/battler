function playTurn(){
    console.log(positions)
    console.log(player_units)
    for(let i = positions.length -1;i>=0;i--){
        let unit = positions[i]
        if(!unit) continue
        let index = pickOpponent()
        if(index == -1) continue
        let opp = opponent_units[index]
        if(!(unit.hp <= 0 || opp.hp <= 0)){
            opp.hp = opp.hp - unit.damage
            if(opp.hp <= 0){
                dies(opponent_units.length - 1, 'top')
                setXp(unit, opp.givenXp)
            }
        }
    }
    for(let i = opponent_units.length -1;i>=0;i--){
        let unit = positions[positions.length - 1]
        if (!unit) continue
        let opp = opponent_units[i]
        if(!(unit.hp <= 0 || opp.hp <= 0)){
            unit.hp = unit.hp - opp.damage
            if(unit.hp <= 0){
                dies(positions.length - 1, 'bot')
            }
        }
    }
    for(let i = positions.length -1;i>=0;i--){
        let unit = positions[i]
        if(!unit) continue
        if(unit.spell){
            spells[unit.spell]() 
        }
    }
    updateHps()

    if(!checkForOppAlive()){
        if(nbr_levels > 0){
            nbr_levels--
            alert("all dead") 
            clearOpponents()
            generateBoard() 
        }
        else{
            alert("Dungeon over") 
        }

    }
}

let spells = {
    "heal": () => {
        for(let i = positions.length -1;i>=0;i--){
            let unit = positions[i]
            if(unit){
                unit.hp = unit.hp + 5
                if(unit.hp > unit.maxhp){
                    unit.hp = unit.maxhp
                }
            }
        }
    }
}

function setXp(unit, givenXp){
    unit.exp = unit.exp + givenXp
    if(unit.exp >= unit.xpPerLvl){
        unit.lvl = unit.lvl + 1 
        unit.xpPerLvl = unit.xpPerLvl *2

        unit.maxhp = unit.maxhp + 10
        unit.damage = unit.damage + 1
    }
}

function leaveMap(){
    player_units = []
    opponent_units = []
    positions = []
    generateManagementPanel()
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

function pickOpponent(){
    let len = opponent_units.length - 1
    while(opponent_units[len].hp <= 0){
        len--
        if(len == -1)
            return len
    }
    return len
}

function dies(index, side){
    let overlay = document.getElementById(side + "_overlay" +index)
    overlay.classList.add("dead")
    player.ressources.gold = player.ressources.gold + opponent_units[index].gold
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
