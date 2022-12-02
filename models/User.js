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
		gamesPlayed: {
			type: Number,
			default: 0,
		},
		gamesLeave: {
			type: Number,
			default: 0,
		},
		avatarUrl: String,
		preferredSport: String,
		age: String,
		city: String,
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('User', UserSchema);
