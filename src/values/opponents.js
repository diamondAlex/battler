// opp ideas : Undead/necro, vampire?, manbearpig
// having regular class as opponents? Like having factions and shit
let opponents_templates = {
    "demon":{
        "stats":{
            "minHp": 5,
            "hpPerLvl":[5,12], 
            "damage":1,
            "armor":1
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
        "images":{
        }
    },
    "orc":{
        "stats":{
            "minHp": 5,
            "hpPerLvl":[5,12], 
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
