//These will basically be classes
//Class idea: cleric, warrior, mage, Legio Negra (maybe be more creative, dork)
//should have a unit type, then the necessary info to generate
//the unit depending on level.
// stats are multipliers (so scaling per lvl)
let units_templates = {
    "legio_nigra":{
        "stats":{
            "minHp": 25,
            "hpPerLvl":[4,8], 
            "damage":6,
            //should this be a range?
            "dmgPerLvl":[1,2],
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
            "low":["units/sting.png"],
            "mid":["units/sting.png"],
            "high":["units/sting.png"],
            "top":["units/sting.png"]
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
            "low":["char_f_1.png","char_f_2.png","char_f_3.png","char_fg_4.png","char_m_1.png","char_m_2.png","char_m_3.png","char_m_4.png","char_m_5.png","char_m_6.png"],
            "mid":["char_f_1.png","char_f_2.png","char_f_3.png","char_fg_4.png","char_m_1.png","char_m_2.png","char_m_3.png","char_m_4.png","char_m_5.png","char_m_6.png"],
            "high":["char_f_1.png","char_f_2.png","char_f_3.png","char_fg_4.png","char_m_1.png","char_m_2.png","char_m_3.png","char_m_4.png","char_m_5.png","char_m_6.png"],
            "top":["char_f_1.png","char_f_2.png","char_f_3.png","char_fg_4.png","char_m_1.png","char_m_2.png","char_m_3.png","char_m_4.png","char_m_5.png","char_m_6.png"],
        }
    }
}


