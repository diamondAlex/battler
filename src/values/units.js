//These will basically be classes
//Class idea: cleric, warrior, mage, Legio Negra (maybe be more creative, dork)
//should have a unit type, then the necessary info to generate
//the unit depending on level.
// stats are multipliers (so scaling per lvl)
// find a better way to link images
let units_templates = {
    "legio_nigra":{
        "stats":{
            "minHp": 30,
            "hpPerLvl":[5,12], 
            "damage":7,
            //should this be a range?
            "dmgPerLvl":[2,3],
            "armor":3
        },
        //work in process, this is just some latin
        "qualifier":{
            "low":["Legionarius"],
            "mid":["Nigra Centurio"],
            "high":["Domini Veneficus"],
            "top":["Deus Tenebrarum", "Nigra Stella"]
        },
        "spells":{
            "low":[],
            "mid":[],
            "high":[],
            "top":[]
        },
        "images":{
            "low":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "mid":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "high":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "top":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
        }
    },
    "cleric":{
        "stats":{
            "minHp": 20,
            "hpPerLvl":[4,5], 
            "damage":5,
            //should this be a range?
            "dmgPerLvl":[1,2],
            "armor":5
        },
        //work in process, this is just some latin
        "qualifier":{
            "low":["Legionarius"],
            "mid":["Nigra Centurio"],
            "high":["Domini Veneficus"],
            "top":["Deus Tenebrarum", "Nigra Stella"]
        },
        "spells":{
            "low":["heal"],
            "mid":["heal"],
            "high":["heal"],
            "top":["heal"]
        },
        "images":{
            "low":["units/char_f_1.png","units/char_f_2.png","units/char_f_3.png","units/char_fg_4.png","units/char_m_1.png","units/char_m_2.png","units/char_m_3.png","units/char_m_4.png","units/char_m_5.png","units/char_m_6.png"],
            "mid":["units/char_f_1.png","units/char_f_2.png","units/char_f_3.png","units/char_fg_4.png","units/char_m_1.png","units/char_m_2.png","units/char_m_3.png","units/char_m_4.png","units/char_m_5.png","units/char_m_6.png"],
            "high":["units/char_f_1.png","units/char_f_2.png","units/char_f_3.png","units/char_fg_4.png","units/char_m_1.png","units/char_m_2.png","units/char_m_3.png","units/char_m_4.png","units/char_m_5.png","units/char_m_6.png"],
            "top":["units/char_f_1.png","units/char_f_2.png","units/char_f_3.png","units/char_fg_4.png","units/char_m_1.png","units/char_m_2.png","units/char_m_3.png","units/char_m_4.png","units/char_m_5.png","units/char_m_6.png"],
        }
    },
    "mage":{
        "stats":{
            "minHp": 20,
            "hpPerLvl":[4,5], 
            "damage":5,
            //should this be a range?
            "dmgPerLvl":[1,2],
            "armor":5
        },
        //work in process, this is just some latin
        "qualifier":{
            "low":["Legionarius"],
            "mid":["Nigra Centurio"],
            "high":["Domini Veneficus"],
            "top":["Deus Tenebrarum", "Nigra Stella"]
        },
        "spells":{
            "low":["heal"],
            "mid":["heal"],
            "high":["heal"],
            "top":["heal"]
        },
        "images":{
            "low":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "mid":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "high":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "top":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
        }
    },
    "warlock":{
        "stats":{
            "minHp": 20,
            "hpPerLvl":[4,5], 
            "damage":5,
            //should this be a range?
            "dmgPerLvl":[1,2],
            "armor":5
        },
        //work in process, this is just some latin
        "qualifier":{
            "low":["Legionarius"],
            "mid":["Nigra Centurio"],
            "high":["Domini Veneficus"],
            "top":["Deus Tenebrarum", "Nigra Stella"]
        },
        "spells":{
            "low":["heal"],
            "mid":["heal"],
            "high":["heal"],
            "top":["heal"]
        },
        "images":{
            "low":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "mid":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "high":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "top":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
        }
    },
    "rogue":{
        "stats":{
            "minHp": 20,
            "hpPerLvl":[4,5], 
            "damage":5,
            //should this be a range?
            "dmgPerLvl":[1,2],
            "armor":5
        },
        //work in process, this is just some latin
        "qualifier":{
            "low":["Legionarius"],
            "mid":["Nigra Centurio"],
            "high":["Domini Veneficus"],
            "top":["Deus Tenebrarum", "Nigra Stella"]
        },
        "spells":{
            "low":["heal"],
            "mid":["heal"],
            "high":["heal"],
            "top":["heal"]
        },
        "images":{
            "low":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "mid":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "high":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
            "top":["units/new_1.png","units/new_2.png","units/new_3.png","units/new_4.png","units/new_5.png","units/new_6.png","units/new_7.png","units/new_8.png","units/new_9.png","units/new_10.png","units/new_11.png"],
        }
    }
}

