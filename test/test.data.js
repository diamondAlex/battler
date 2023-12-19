root.innerHTML += "DATA TESTS "
root.innerHTML += "<br>"
let tests_data = [
    () => {
        let input = [0,5]
        let res = roll(input,1)
        if(res < input[0] || res > input[1]){
            root.innerHTML += `roll test FAILED expected ${input[0]} - ${input[1]} got ${res} `
        }
        else{
            root.innerHTML += `roll test PASSED expected ${input[0]} - ${input[1]} got ${res} `
        }
    },
    () => {
        let input = [3,8]
        let res = roll(input,2)
        if(res < input[0]*2 || res > input[1]*2){
            root.innerHTML += `roll test FAILED expected ${input[0]*2} - ${input[1]*2} got ${res} w/ ${input[0]},${input[1]}`
        }
        else{
            root.innerHTML += `roll test PASSED expected ${input[0]*2} - ${input[1]*2} got ${res} `
        }
    },
    () => {
        let input = [1,2]
        let res = roll(input,2)
        if(res < input[0]*2 || res > input[1]*2){
            root.innerHTML += `roll test FAILED expected ${input[0]*2} - ${input[1]*2} got ${res} `
        }
        else{
            root.innerHTML += `roll test PASSED expected ${input[0]*2} - ${input[1]*2} got ${res} `
        }
    },
    () => {
        for(let i=0;i<3;i++){
            let unit = generateUnit()
            root.innerHTML += JSON.stringify(unit) + "<br/><br/>"
        }
    },
]

//tests_data.forEach((test) => {
    //root.innerHTML += "<br>"
    //test()
//})
tests_data[3]()
