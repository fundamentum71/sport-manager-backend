import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		preferredSport: {
			type: String,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		dateCreatedRoom: {
			type: String,
			required: true,
		},
		place: {
			type: String,
			required: true,
		},
		joined: {
			type: Array,
			default: [],
		},
		visitors: {
			type: Array,
			default: [],
		},

		viewsCount: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Room', RoomSchema);
