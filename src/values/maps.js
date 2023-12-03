//These will basically be classes
//Class idea: cleric, warrior, mage, Legio Negra (maybe be more creative, dork)
//should have a unit type, then the necessary info to generate
//the unit depending on level.
// stats are multipliers (so scaling per lvl)
let maps_templates = {
    //these are pretty weak, I got all the art from some random prompt, dont invest in that too much
    "apparition":{
        "name": ["Plane", "Dimension", "Passage", "Tunnels","Labyrinth"],
        "qualifier":["of Nightmares", "of The Dark", "of The Unseen", "of Suffering"],
        "resources":{
            //think of a mechanic that has to do with essence, like essence of hate, essence of fear, maybe related to buffing items?
            "low":["bronze","essence"],
            "mid":["silver"],
            "high":["gold"],
            "top":["gems"],
        }
    },
    "orc":{
        "name": ["Den", "Cave", "Grotto", "Tunnels","Pit"],
        "qualifier":["of Orcs", "of Greenskins", "of Goblins", "of The Skinner"],
        "resources":{
            //corpses could have necro related mechanic, as well as feeding for orc god
            "low":["bronze","scraps"],
            "mid":["silver","limbs"],
            "high":["gold","corpses"],
            //the spiceeeee melangeeeee
            "top":["gems","melange"],
        }
    },
    "demon":{
        "name": ["Portal", "Gateway", "Mines", "Depths"],
        "qualifier":["of Hell", "of Nowhere","of Flames","of Evil"],
        "resources":{
            "low":["bronze","sulfur"],
            "mid":["silver","ashes"],
            //souls can be a mechanic to bring back dead?
            //this could imply that unit death are permanent
            //and that idle should stop at 1hp
            //maybe have some odds of dying adventuring?
            "high":["gold","souls"],
            //x amounts of puzzlebox could open a realm to a new
            //unit type, THE CENOBITES WOWWWWWW (so smart)
            "top":["gems","puzzlebox"],
        }
    },
}
