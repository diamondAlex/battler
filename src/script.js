let player = []
let opponent = []

let positions = []

let character = () => {
    return {
        test: {
            hp:10,
            damage:1,
            image:Math.ceil(Math.random()*10).toString() + ".png"
        }
    }
}

let setOpponent = () => {
    for(let i = 0; i<SLOT_MAX;i++){
        opponent.push(character())
    }
}

let setPlayer = () => {
    for(let i = 0; i<SLOT_MAX;i++){
        player.push(character())
    }
    console.log(player)
}

let setCharOnBoard = (e) => {
    let player_index = parseInt(e.target.id.slice(-1))
    let slot_index = parseInt(e.target.value) - 1
    if(!positions[slot_index]){
        positions[slot_index] =  player[player_index]
        let slot = document.getElementById("bottom_slot"+slot_index)
        let image = document.createElement("img")
        image.src = "images/" + player[player_index].test.image
        image.className = "slot"
        slot.append(image)
    }
    
}

let setPanels = () =>{
    let topPanel = document.getElementById("panel_topside") 

    topPanel.innerHTML = ""
    for(char of opponent){
        let info = char.test
        topPanel.innerHTML += `
            <span>
            <img src=${"images/" + info.image} class="card"> 
            <select id="card">
                <option value="" selected disabled hidden>slot</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
            </select>
            <span>
        `
    }

    let botPanel = document.getElementById("panel_botside") 

    let x =0
    botPanel.innerHTML = ""
    for(char of player){
        let info = char.test
        botPanel.innerHTML += `
            <span>
            <img src=${"images/" + info.image} class="card"> 
            <select onchange="setCharOnBoard(event)" id=${"card" + x.toString()}>
                <option value="" selected disabled hidden>slot</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
            </select>
            <span>
        `
        x++
    }

}

setPlayer()
setOpponent()
setPanels()
