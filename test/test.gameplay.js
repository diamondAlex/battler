let root = document.getElementById("root")

root.innerHTML = "GAMEPLAY TEST"


root.innerHTML += "<br>"


let tests_gameplay = [
    () => {
        generateUnit()
        let test_currentUnit = units.at(-1)
        setXp(100, [ test_currentUnit ])
        if(test_currentUnit.level == 2){
            root.innerHTML += "level test pass"
        }
        else{
            root.innerHTML += "level test failed"
        }
        units.pop()
    },
    () => {
        generateUnit()
        let test_currentUnit = units.at(-1)
        let starting_damage = test_currentUnit.damage
        let min = starting_damage + test_currentUnit.dmgPerLvl[0]
        let max = starting_damage + test_currentUnit.dmgPerLvl[1]

        setXp(100, [ test_currentUnit ])

        if(min <= test_currentUnit.damage && test_currentUnit.damage <= max){
            root.innerHTML += `damage per level test pass, expected ${min} - ${max}, got ${test_currentUnit.damage}`
        }
        else{
            root.innerHTML += `damage per level test failed, expected ${min} - ${max} got ${test_currentUnit.damage}`
        }

        units.pop()
    },
]

//tests_gameplay.forEach((test) => {
    //root.innerHTML += "<br>"
    //test()
//})
root.innerHTML += "<br>"
root.innerHTML += "<br>"
