// opp ideas : Undead/necro, vampire?, manbearpig
// having regular class as opponents? Like having factions and shit
let opponents_templates = {
    "demon":{
        "stats":{
            "minHp": 7,
            "hpPerLvl":[3,5], 
            "damage":1,
            "armor":2,
            "speed":[1,2]
        },
        "name":{
            "low":["Grimsnarl", "Maledrax", "Slinker", "Gloomfiend", "Shadowclaw"],
            "mid":["Zarvox", "Neltharion", "Lysander", "Morgorath", "Sylvanius"],
            "high":[, "Asmodeus", "Mephistopheles",  "Belial"],
            "top":["Beelzebub","Lucifer"]
        },
        "qualifier":{
            "low":["Imp", "Fiend", "Hellion"],
            "mid":["Hellspawn","Maleficious", "Devilkin"],
            "high":["Diabolo", "Prime Evil", "Incubus"],
            "top":["Lord of The Underground", "Prince of Madness"]
        },
        "spells":{
            "low":[],
            "mid":[],
            "high":[],
            "top":[]
        },
    },
    "orc":{
        "stats":{
            "minHp": 10,
            "hpPerLvl":[2,5], 
            "damage":1,
            "armor":1,
            "speed":[1,2]
        },
        "name":{
            "low":["Grunk", "Murg", "Grog", "Dorg", "Snag", "Thruk", "Zug", "Vorg", "Narb", "Grob", "Glunk", "Drub", "Snik", "Rurg", "Throg", "Krog", "Brug", "Zog", "Snarl", "Grish"],
            "mid":["Mordak", "Zarak", "Drogash", "Urzoth", "Krakor", "Borgash", "Azrak", "Gnarok", "Vorgruk"],
            "high":["Thrazgash", "Gorgalurk", "Nazgharok", "Durnagorim", "Thrakazgul"],
            "top":["Gorvathrokhan","Gro'magarnok"]
        },
        "qualifier":{
            "low":["Peon", "Footman", "Lackey"],
            "mid":["Warrior","Marauder", "Axeman"],
            "high":["Ravager", "Crusher", "Slayer", "Mauler", "Slaughterer"],
            "top":["Golden God of Hunger", "The World Ender"]
        },
        "spells":{
            "low":[],
            "mid":[],
            "high":[],
            "top":[]
        },
    },
    "apparition":{
        "stats":{
            "minHp": 5,
            "hpPerLvl":[2,3], 
            "damage":2,
            "armor":4,
            "speed":[1,2]
        },
        "name":{
            "low":["Spirit"],
            "mid":["Shadow"],
            "high":["Ghost"],
            "top":["Dream"]
        },
        "qualifier":{
            "low":["of Fear"],
            "mid":["of Pain"],
            "high":["of The Fallen"],
            "top":["of Eternity"]
        },
        "spells":{
            "low":[],
            "mid":[],
            "high":[],
            "top":[]
        },
    }
}
