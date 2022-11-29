import express from 'express';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import {
	registerValidation,
	loginValidation,
	roomCreateValidation,
	updateUserValidation,
} from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, RoomController } from './controllers/index.js';

mongoose
	.connect(
		'mongodb+srv://admin:wwwwww@cluster0.rxaypsn.mongodb.net/blog?retryWrites=true&w=majority',
	)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err));

const app = express();

let avatarUrl;
//создаем хранилище где будем сохранять картинки
const storage = multer.diskStorage({
	//где будет сохраняться,фукция ожидает параметры (запрос,файл, колбек)
	destination: (req, file, cb) => {
		//не получает ошибок и нужно сохранить файлы в папку uploads
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	//как будет называться
	filename: (_, file, cb) => {
		//не получает ошибок и вытаскиваем оригинальное название
		cb(null, (avatarUrl = uuidv4() + '.jpg'));
	},
});

//добавляем логику multer в express
const upload = multer({ storage });

app.use(express.json());

//разрешаем запросы
app.use(cors());

//дает возможность обращаться к файлам в папке(проверит есть ли файл в папке )
app.use('/uploads', express.static('uploads'));

//запрос на загрузку картинки
app.post('/upload', checkAuth, upload.single('avatar'), (req, res) => {
	//вернем ответ
	res.json({
		url: `/uploads/${avatarUrl}`,
	});
});

app.post('/deleteAvatar', checkAuth, (req, res) => {
	try {
		console.log(req.body.avatarImg);
		const avatarDelete = req.body.deletePhoto.slice(9);
		console.log('удаление req', avatarDelete);
		fs.unlink(`uploads/${avatarDelete}`, (err) => {
			if (err) throw err; // не удалось удалить файл
			console.log('Файл успешно удалён');
		});
		res.status(200).json({
			message: 'Фотография удалена',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось удалить фотографию',
		});
	}
});

//авторизация
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

//регистрация
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

//получение информации о себе
app.get('/auth/me', checkAuth, UserController.getMe);

//получение всех комнат
app.get('/rooms', RoomController.getAll);
//получение всех тэгов
//app.get('/tags', PostController.getLastTags);
//получить одну комнату
app.get('/rooms/:id', RoomController.getOne);
//создать комнату
app.post('/rooms', checkAuth, roomCreateValidation, handleValidationErrors, RoomController.create);
//удалить комнату
app.delete('/rooms/:id', checkAuth, RoomController.remove);
//обновить комнату
app.patch(
	'/rooms/:id',
	checkAuth,
	roomCreateValidation,
	handleValidationErrors,
	RoomController.update,
);
//получение всех пользователей
app.get('/users', checkAuth, UserController.getAll);
//получение пользователя по id
app.get('/users/:id', checkAuth, UserController.getOne);

//редактирование профиля
app.patch(
	'/users/:id',
	checkAuth,
	updateUserValidation,
	handleValidationErrors,
	UserController.update,
);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log('Server OK');
});
