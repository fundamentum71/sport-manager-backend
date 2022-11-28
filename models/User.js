import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		avatarUrl: String,
		preferredSport: String,
		age: String,
		city: String,
		gamesPlayed: Number,
		gamesLeave: Number,
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('User', UserSchema);
