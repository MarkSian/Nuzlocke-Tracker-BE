import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Used for hashing
// be sure to be case sensitive with the import path

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensures every username is unique
    },
    password: {
        type: String,
        required: true
    },
    // Array of ObjectIds referencing NuzlockeRun documents owned by this user.
    // This allows you to easily find all runs associated with a user.
    nuzlockeRuns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NuzlockeRun'
    }],
}, { timestamps: true }); // Mongoose automatically adds 'createdAt' and 'updatedAt' fields

// This middleware runs before a user document is saved to the database.
userSchema.pre('save', async function (next) {
    // Only hash the password if it's new or has been modified.
    if (!this.isModified('password')) return next();
    // Hash the password with a salt round of 10.
    // A higher number means more secure but slower hashing. 10 is a common balance.
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Continue to the next middleware or save operation
});



// Export the User model
export default mongoose.model('User', userSchema);