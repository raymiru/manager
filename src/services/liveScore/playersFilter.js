const da = require('./steamApi');
const axios = require('axios').default;
const to = require('await-to-js').default;
const heroes = [
    {
        name: 'antimage',
        id: 1,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/antimage_sb.png'
    }
    ,
    {
        name: 'axe',
        id: 2,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/axe_sb.png'
    }
    ,
    {
        name: 'bane',
        id: 3,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/bane_sb.png'
    }
    ,
    {
        name: 'bloodseeker',
        id: 4,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/bloodseeker_sb.png'
    }
    ,
    {
        name: 'crystal_maiden',
        id: 5,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/crystal_maiden_sb.png'
    }
    ,
    {
        name: 'drow_ranger',
        id: 6,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/drow_ranger_sb.png'
    }
    ,
    {
        name: 'earthshaker',
        id: 7,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/earthshaker_sb.png'
    }
    ,
    {
        name: 'juggernaut',
        id: 8,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/juggernaut_sb.png'
    }
    ,
    {
        name: 'mirana',
        id: 9,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/mirana_sb.png'
    }
    ,
    {
        name: 'nevermore',
        id: 11,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/nevermore_sb.png'
    }
    ,
    {
        name: 'morphling',
        id: 10,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/morphling_sb.png'
    }
    ,
    {
        name: 'phantom_lancer',
        id: 12,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/phantom_lancer_sb.png'
    }
    ,
    {
        name: 'puck',
        id: 13,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/puck_sb.png'
    }
    ,
    {
        name: 'pudge',
        id: 14,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/pudge_sb.png'
    }
    ,
    {
        name: 'razor',
        id: 15,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/razor_sb.png'
    }
    ,
    {
        name: 'sand_king',
        id: 16,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/sand_king_sb.png'
    }
    ,
    {
        name: 'storm_spirit',
        id: 17,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/storm_spirit_sb.png'
    }
    ,
    {
        name: 'sven',
        id: 18,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/sven_sb.png'
    }
    ,
    {
        name: 'tiny',
        id: 19,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/tiny_sb.png'
    }
    ,
    {
        name: 'vengefulspirit',
        id: 20,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/vengefulspirit_sb.png'
    }
    ,
    {
        name: 'windrunner',
        id: 21,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/windrunner_sb.png'
    }
    ,
    {
        name: 'zuus',
        id: 22,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/zuus_sb.png'
    }
    ,
    {
        name: 'kunkka',
        id: 23,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/kunkka_sb.png'
    }
    ,
    {
        name: 'lina',
        id: 25,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/lina_sb.png'
    }
    ,
    {
        name: 'lich',
        id: 31,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/lich_sb.png'
    }
    ,
    {
        name: 'lion',
        id: 26,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/lion_sb.png'
    }
    ,
    {
        name: 'shadow_shaman',
        id: 27,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/shadow_shaman_sb.png'
    }
    ,
    {
        name: 'slardar',
        id: 28,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/slardar_sb.png'
    }
    ,
    {
        name: 'tidehunter',
        id: 29,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/tidehunter_sb.png'
    }
    ,
    {
        name: 'witch_doctor',
        id: 30,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/witch_doctor_sb.png'
    }
    ,
    {
        name: 'riki',
        id: 32,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/riki_sb.png'
    }
    ,
    {
        name: 'enigma',
        id: 33,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/enigma_sb.png'
    }
    ,
    {
        name: 'tinker',
        id: 34,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/tinker_sb.png'
    }
    ,
    {
        name: 'sniper',
        id: 35,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/sniper_sb.png'
    }
    ,
    {
        name: 'necrolyte',
        id: 36,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/necrolyte_sb.png'
    }
    ,
    {
        name: 'warlock',
        id: 37,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/warlock_sb.png'
    }
    ,
    {
        name: 'beastmaster',
        id: 38,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/beastmaster_sb.png'
    }
    ,
    {
        name: 'queenofpain',
        id: 39,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/queenofpain_sb.png'
    }
    ,
    {
        name: 'venomancer',
        id: 40,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/venomancer_sb.png'
    }
    ,
    {
        name: 'faceless_void',
        id: 41,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/faceless_void_sb.png'
    }
    ,
    {
        name: 'skeleton_king',
        id: 42,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/skeleton_king_sb.png'
    }
    ,
    {
        name: 'death_prophet',
        id: 43,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/death_prophet_sb.png'
    }
    ,
    {
        name: 'phantom_assassin',
        id: 44,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/phantom_assassin_sb.png'
    }
    ,
    {
        name: 'pugna',
        id: 45,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/pugna_sb.png'
    }
    ,
    {
        name: 'templar_assassin',
        id: 46,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/templar_assassin_sb.png'
    }
    ,
    {
        name: 'viper',
        id: 47,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/viper_sb.png'
    }
    ,
    {
        name: 'luna',
        id: 48,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/luna_sb.png'
    }
    ,
    {
        name: 'dragon_knight',
        id: 49,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/dragon_knight_sb.png'
    }
    ,
    {
        name: 'dazzle',
        id: 50,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/dazzle_sb.png'
    }
    ,
    {
        name: 'rattletrap',
        id: 51,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/rattletrap_sb.png'
    }
    ,
    {
        name: 'leshrac',
        id: 52,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/leshrac_sb.png'
    }
    ,
    {
        name: 'furion',
        id: 53,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/furion_sb.png'
    }
    ,
    {
        name: 'life_stealer',
        id: 54,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/life_stealer_sb.png'
    }
    ,
    {
        name: 'dark_seer',
        id: 55,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/dark_seer_sb.png'
    }
    ,
    {
        name: 'clinkz',
        id: 56,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/clinkz_sb.png'
    }
    ,
    {
        name: 'omniknight',
        id: 57,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/omniknight_sb.png'
    }
    ,
    {
        name: 'enchantress',
        id: 58,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/enchantress_sb.png'
    }
    ,
    {
        name: 'huskar',
        id: 59,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/huskar_sb.png'
    }
    ,
    {
        name: 'night_stalker',
        id: 60,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/night_stalker_sb.png'
    }
    ,
    {
        name: 'broodmother',
        id: 61,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/broodmother_sb.png'
    }
    ,
    {
        name: 'bounty_hunter',
        id: 62,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/bounty_hunter_sb.png'
    }
    ,
    {
        name: 'weaver',
        id: 63,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/weaver_sb.png'
    }
    ,
    {
        name: 'jakiro',
        id: 64,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/jakiro_sb.png'
    }
    ,
    {
        name: 'batrider',
        id: 65,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/batrider_sb.png'
    }
    ,
    {
        name: 'chen',
        id: 66,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/chen_sb.png'
    }
    ,
    {
        name: 'spectre',
        id: 67,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/spectre_sb.png'
    }
    ,
    {
        name: 'doom_bringer',
        id: 69,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/doom_bringer_sb.png'
    }
    ,
    {
        name: 'ancient_apparition',
        id: 68,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/ancient_apparition_sb.png'
    }
    ,
    {
        name: 'ursa',
        id: 70,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/ursa_sb.png'
    }
    ,
    {
        name: 'spirit_breaker',
        id: 71,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/spirit_breaker_sb.png'
    }
    ,
    {
        name: 'gyrocopter',
        id: 72,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/gyrocopter_sb.png'
    }
    ,
    {
        name: 'alchemist',
        id: 73,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/alchemist_sb.png'
    }
    ,
    {
        name: 'invoker',
        id: 74,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/invoker_sb.png'
    }
    ,
    {
        name: 'silencer',
        id: 75,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/silencer_sb.png'
    }
    ,
    {
        name: 'obsidian_destroyer',
        id: 76,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/obsidian_destroyer_sb.png'
    }
    ,
    {
        name: 'lycan',
        id: 77,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/lycan_sb.png'
    }
    ,
    {
        name: 'brewmaster',
        id: 78,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/brewmaster_sb.png'
    }
    ,
    {
        name: 'shadow_demon',
        id: 79,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/shadow_demon_sb.png'
    }
    ,
    {
        name: 'lone_druid',
        id: 80,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/lone_druid_sb.png'
    }
    ,
    {
        name: 'chaos_knight',
        id: 81,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/chaos_knight_sb.png'
    }
    ,
    {
        name: 'meepo',
        id: 82,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/meepo_sb.png'
    }
    ,
    {
        name: 'treant',
        id: 83,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/treant_sb.png'
    }
    ,
    {
        name: 'ogre_magi',
        id: 84,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/ogre_magi_sb.png'
    }
    ,
    {
        name: 'undying',
        id: 85,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/undying_sb.png'
    }
    ,
    {
        name: 'rubick',
        id: 86,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/rubick_sb.png'
    }
    ,
    {
        name: 'disruptor',
        id: 87,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/disruptor_sb.png'
    }
    ,
    {
        name: 'nyx_assassin',
        id: 88,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/nyx_assassin_sb.png'
    }
    ,
    {
        name: 'naga_siren',
        id: 89,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/naga_siren_sb.png'
    }
    ,
    {
        name: 'keeper_of_the_light',
        id: 90,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/keeper_of_the_light_sb.png'
    }
    ,
    {
        name: 'wisp',
        id: 91,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/wisp_sb.png'
    }
    ,
    {
        name: 'visage',
        id: 92,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/visage_sb.png'
    }
    ,
    {
        name: 'slark',
        id: 93,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/slark_sb.png'
    }
    ,
    {
        name: 'medusa',
        id: 94,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/medusa_sb.png'
    }
    ,
    {
        name: 'troll_warlord',
        id: 95,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/troll_warlord_sb.png'
    }
    ,
    {
        name: 'centaur',
        id: 96,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/centaur_sb.png'
    }
    ,
    {
        name: 'magnataur',
        id: 97,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/magnataur_sb.png'
    }
    ,
    {
        name: 'shredder',
        id: 98,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/shredder_sb.png'
    }
    ,
    {
        name: 'bristleback',
        id: 99,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/bristleback_sb.png'
    }
    ,
    {
        name: 'tusk',
        id: 100,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/tusk_sb.png'
    }
    ,
    {
        name: 'skywrath_mage',
        id: 101,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/skywrath_mage_sb.png'
    }
    ,
    {
        name: 'abaddon',
        id: 102,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/abaddon_sb.png'
    }
    ,
    {
        name: 'elder_titan',
        id: 103,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/elder_titan_sb.png'
    }
    ,
    {
        name: 'legion_commander',
        id: 104,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/legion_commander_sb.png'
    }
    ,
    {
        name: 'ember_spirit',
        id: 106,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/ember_spirit_sb.png'
    }
    ,
    {
        name: 'earth_spirit',
        id: 107,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/earth_spirit_sb.png'
    }
    ,
    {
        name: 'terrorblade',
        id: 109,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/terrorblade_sb.png'
    }
    ,
    {
        name: 'phoenix',
        id: 110,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/phoenix_sb.png'
    }
    ,
    {
        name: 'oracle',
        id: 111,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/oracle_sb.png'
    }
    ,
    {
        name: 'techies',
        id: 105,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/techies_sb.png'
    }
    ,
    {
        name: 'winter_wyvern',
        id: 112,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/winter_wyvern_sb.png'
    }
    ,
    {
        name: 'arc_warden',
        id: 113,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/arc_warden_sb.png'
    }
    ,
    {
        name: 'abyssal_underlord',
        id: 108,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/abyssal_underlord_sb.png'
    }
    ,
    {
        name: 'monkey_king',
        id: 114,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/monkey_king_sb.png'
    }
    ,
    {
        name: 'pangolier',
        id: 120,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/pangolier_sb.png'
    }
    ,
    {
        name: 'dark_willow',
        id: 119,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/dark_willow_sb.png'
    }
    ,
    {
        name: 'grimstroke',
        id: 121,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/grimstroke_sb.png'
    }
    ,
    {
        name: 'mars',
        id: 129,
        imgSrc: 'http://cdn.dota2.com/apps/dota2/images/heroes/mars_sb.png'
    }
];


module.exports = async match_id => {
try {

    let radiant_team;
    let dire_team;
    let err, result;
    [err, result] = await to(axios.get(`https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v1/?key=4DA49E795D91371C6C5226728380F221&match_id=${match_id}`));
    let data = result.data;
    if (err) console.error(err);

    if (data.result.games[0].scoreboard.radiant.picks && data.result.games[0].scoreboard.dire.picks) {
        radiant_team = data.result.games[0].scoreboard.radiant.picks;
        dire_team = data.result.games[0].scoreboard.dire.picks;

        radiant_team.forEach(radiant => {
            heroes.forEach(hero => {
                if (radiant.hero_id === hero.id) {
                    radiant.imgSrc = hero.imgSrc
                }
            })
        });

        dire_team.forEach(dire => {
            heroes.forEach(hero => {
                if (dire.hero_id === hero.id) {
                    dire.imgSrc = hero.imgSrc
                }
            })
        })
    } else {
        radiant_team = [];
        dire_team = [];
    }

    return {
        radiant_team,
        dire_team
    }
} catch (e) {
    console.error(e)
}
};



