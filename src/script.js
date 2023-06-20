let player = []
let opponent = []

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

let setPanels = () =>{
    let topPanel = document.getElementById("panel_topside") 

    let x =0
    topPanel.innerHTML = ""
    for(char of opponent){
        let info = char.test
        topPanel.innerHTML += `
            <span>
            <img src=${"images/" + info.image} class="card"> 
            <select id=${"card" + x.toString()}>
                <option value='test'>test</option>
                <option value='test'>test</option>
                <option value='test'>test</option>
            </select>
            <span>
        `
        x++
    }

    let botPanel = document.getElementById("panel_botside") 

    botPanel.innerHTML = ""
    for(char of player){
        let info = char.test
        botPanel.innerHTML += `
            <span>
            <img src=${"images/" + info.image} class="card"> 
            <select id=${"card" + x.toString()}>
                <option value='test'>test</option>
                <option value='test'>test</option>
                <option value='test'>test</option>
            </select>
            <span>
        `
        x++
    }

}

setPlayer()
setOpponent()
setPanels()
