import RoomModel from '../models/Room.js';

export const getAll = async (req, res) => {
	try {
		//получаем все посты и связываем их с таблицей users
		const rooms = await RoomModel.find().populate('user').exec();

		res.json(rooms);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось загрузить комнаты',
		});
	}
};

//export const getLastTags = async (req, res) => {
//	try {
//		//возьмем тэги с последних 5ти статей
//		const posts = await RoomModel.find().limit(5).exec();
//		const tags = posts
//			.map((obj) => obj.tags)
//			.flat()
//			.slice(0, 5);

//		res.json(tags);
//	} catch (error) {
//		console.log(error);
//		res.status(500).json({
//			message: 'Не удалось получить статьи',
//		});
//	}
//};

export const getOne = async (req, res) => {
	try {
		//вытаскиваем id комнаты
		const roomId = req.params.id;

		//найти комнату по id
		RoomModel.findOneAndUpdate(
			{
				_id: roomId,
			},
			{
				//показать только одну комнату
				$inc: { viewsCount: 1 },
			},
			{
				//после обновления вернуть
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: 'Не удалось загрузить комнату',
					});
				}
				if (!doc) {
					return res.status(404).json({
						message: 'Статья не найдена',
					});
				}
				res.json(doc);
			},
		).populate('user');
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось загузить комнату',
		});
	}
};

export const remove = async (req, res) => {
	try {
		//вытаскиваем id комнаты
		const roomId = req.params.id;

		RoomModel.findOneAndDelete(
			{
				_id: roomId,
			},
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: 'Не удалось удалить комнату',
					});
				}
				if (!doc) {
					return res.status(404).json({
						message: 'Комната не найдена',
					});
				}

				res.json({
					success: true,
				});
			},
		);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось загрузить комнату',
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new RoomModel({
			title: req.body.title,
			preferredSport: req.body.preferredSport,
			time: req.body.time,
			date: req.body.date,
			place: req.body.place,
			dateCreatedRoom: new Date().toLocaleString(),
			//вытащит после авторизации
			user: req.userId,
		});

		const room = await doc.save();

		res.json(room);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось создать комнату',
		});
	}
};

export const update = async (req, res) => {
	try {
		//вытаскиваем id статьи
		const roomId = req.params.id;

		await RoomModel.updateOne(
			{
				_id: roomId,
			},
			{
				title: req.body.title,
				preferredSport: req.body.preferredSport,
				time: req.body.time,
				date: req.body.date,
				place: req.body.place,
				//вытащит после авторизации
				user: req.userId,
			},
		);

		res.json({
			success: true,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось обновить комнату',
		});
	}
};
