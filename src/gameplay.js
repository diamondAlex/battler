//the implementation lacks consistency, opp and player turns are built different
function playTurn(){
    //player turn
    for(let i = positions.length -1;i>=0;i--){
        let unit = positions[i]
        if(!unit) continue
        let index = pickOpponent(opponent_units)
        if(index == -1) continue
        let opp = opponent_units[index]
        if(!(unit.hp <= 0 || opp.hp <= 0)){
            opp.hp = opp.hp - unit.damage
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
            unit.hp = unit.hp - opp.damage
            if(unit.hp <= 0){
                dies(unit, 'bot')
            }
        }
    }
    for(let i = positions.length -1;i>=0;i--){
        let unit = positions[i]
        if(!unit) continue
        if(unit.spells.length != 0){
            spells[unit.spells]() 
        }
    }
    updateHps()

    if(!checkForOppAlive()){
        nbr_levels--
        if(nbr_levels > 0){
            betweenRound()
            clearOpponents()
            generateBoard() 
        }
        else{
            alert("Dungeon over") 
            resetHp()
        }

    }
}

function resetHp(){
    for(let unit of positions){
        if(unit){
            unit.hp = unit.maxhp
        }
    }
}

function betweenRound(){
    let heal = roll([5,10],1)
    for(unit of positions){
        if(unit){
            if(unit.hp < unit.maxhp){
                unit.hp = unit.hp + heal > unit.maxhp ? unit.maxhp : unit.hp + heal;
            }
        }
    }

    alert(`your units healed for ${heal} hp`)

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
        player.resources.gold = player.resources.gold + opponent_units[unit].gold
        if(opponent_units[unit].inventory.length != 0){
            console.log("adding item")
            player.inventory.push(...opponent_units[unit].inventory)
        }
    }
    else{
        let overlay = document.getElementById(side + "_overlay" +unit.uuid)
        overlay.classList.add("dead")
        unit.dead = true
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
