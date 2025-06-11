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
    starterPokemon: Object,
    currentRoute: String, // The last known route the user is tracking.
    encounters: [encounterSchema], // An array of all recorded Pokémon encounters for this run.
    boxPokemon: [encounterSchema], // Pokémon currently alive and in the PC box.
    gravePokemon: [encounterSchema], // Pokémon that have fainted during the run.
    badges: [String], // An array of names of earned gym badges.
    rivalsDefeated: [String], // An array of names of defeated rivals.
    bossesDefeated: [String], // An array of names of other major boss trainers defeated.
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields.

// Export the NuzlockeRun model
export default mongoose.model('NuzlockeRun', nuzlockeRunSchema);