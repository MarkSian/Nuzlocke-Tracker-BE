import mongoose from 'mongoose';

// Encounter Schema
const encounterSchema = new mongoose.Schema({
    routeName: String, // E.g., "Route 101", "Petalburg City"
    pokemonId: Number, // The official PokeAPI ID for the Pokémon species (e.g., 25 for Pikachu).
    pokemonName: String, // The pokemon's name.
    nickname: String, // The user-given nickname for this specific Pokémon.
    status: { // The current state of the Pokémon in the Nuzlocke.
        type: String,
        enum: ['Captured', 'Fainted', 'Skipped', 'Upcoming'], // Defined allowed values.
        default: 'Upcoming' // Default status when a new encounter is recorded.
    },
    nature: String, // The Pokémon's nature (e.g., "Adamant", "Timid"). ** This can be taken out if not needed.
    image: String, // URL to the Pokémon's sprite/image, from PokeAPI.
});

// NuzlockeRun Schema 
const nuzlockeRunSchema = new mongoose.Schema({
    userId: { // A reference to the User document who owns this specific Nuzlocke run.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameVersion: String, // The Pokémon game version (e.g., "Emerald", "Ruby", "Sapphire").
    runName: String,
    currentRoute: String, // The last known route the user is tracking.
    encounters: [encounterSchema], // An array of all recorded Pokémon encounters for this run.
    boxPokemon: [encounterSchema], // Pokémon currently alive and in the PC box.
    gravePokemon: [encounterSchema], // Pokémon that have fainted during the run.
    badges: [String], // An array of names of earned gym badges.
    rivalsDefeated: [String], // An array of names of defeated rivals.
    bossesDefeated: [String], // An array of names of other major boss trainers defeated.
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields.

// Example of how a NuzlockeRun document:
// {
//   "gameVersion": "Emerald",
//   "runName": "Hoenn Adventure",
//   "currentRoute": "Route 110",
//   "encounters": [
//     {
//       "routeName": "Route 101",
//       "pokemonId": 261,
//       "pokemonName": "Poochyena",
//       "nickname": "Shadow",
//       "status": "Captured",
//       "nature": "Adamant",
//       "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/261.png"
//     }
//   ],
//   "boxPokemon": [
//     {
//       "routeName": "Route 102",
//       "pokemonId": 263,
//       "pokemonName": "Zigzagoon",
//       "nickname": "Zippy",
//       "status": "Captured",
//       "nature": "Jolly",
//       "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/263.png"
//     }
//   ],
//   "gravePokemon": [
//     {
//       "routeName": "Route 104",
//       "pokemonId": 265,
//       "pokemonName": "Wurmple",
//       "nickname": "Silky",
//       "status": "Fainted",
//       "nature": "Calm",
//       "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/265.png"
//     }
//   ],
//   "badges": ["Stone Badge", "Knuckle Badge"],
//   "rivalsDefeated": ["May", "Brendan"],
//   "bossesDefeated": ["Roxanne", "Brawly"]
// }

// Export the NuzlockeRun model
export default mongoose.model('NuzlockeRun', nuzlockeRunSchema);