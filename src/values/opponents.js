//should have a unit type, then the necessary info to generate
//the unit depending on level.
// stats are multipliers (so scaling per lvl)
let opponents_templates = {
    "orc":{
        "stats":{
            "minHp": 5,
            "hpPerLvl":[5,15], 
            "damage":1,
            "armor":1
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
        "images":{
            "low":["opponents/orc_low_1.png"],
            "mid":["opponents/orc_mid_1.png","opponents/orc_mid_2.png"],
            "high":["opponents/orc_high_1.png"],
            "top":[]
        }
    }
}
