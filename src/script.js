let playTurn = () => {
    console.log("playing turn")
    for(let i = positions.length -1;i>=0;i--){
        let unit = positions[i]
        if(!unit) continue
        let index = pickOpponent()
        if(index == -1) continue
        let opp = opponent_units[index]
        if(!(unit.hp <= 0 || opp.hp <= 0)){
            console.log("player hit")
            opp.hp = opp.hp - unit.damage
            if(opp.hp <= 0){
                dies(opponent_units.length - 1, 'top')
            }
        }
    }
    for(let i = opponent_units.length -1;i>=0;i--){
        let unit = positions[positions.length - 1]
        let opp = opponent_units[i]
        if(!(unit.hp <= 0 || opp.hp <= 0)){
            console.log("opp hit")
            unit.hp = unit.hp - opp.damage
            if(unit.hp <= 0){
                dies(positions.length - 1, 'bot')
            }
        }
    }
    updateHps()

    if(!checkForOppAlive()){
       alert("all dead") 
    }
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
    console.log(opponent_units)
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
    console.log(player)
}

function updateHps(){
    for(let i = 0;i<positions.length;i++){
        let overlay = document.getElementById("bot_overlay"+i)
        let unit = positions[i]
        if(!unit) continue
        overlay.innerHTML = unit.hp + '/' + unit.maxhp
    }
    for(let i = 0;i<opponent_units.length;i++){
        let overlay = document.getElementById("top_overlay"+i)
        let unit = opponent_units[i]
        console.log(unit)
        overlay.innerHTML = unit.hp + '/' + unit.maxhp
    }
}
