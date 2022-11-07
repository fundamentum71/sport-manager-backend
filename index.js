import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';
import { registerValidation, loginValidation, roomCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, RoomController } from './controllers/index.js';

mongoose
	.connect(
		'mongodb+srv://admin:wwwwww@cluster0.rxaypsn.mongodb.net/blog?retryWrites=true&w=majority',
	)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err));

const app = express();

//создаем хранилище где будем сохранять картинки
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		//не получает ошибок и нужно сохранить файлы в папку uploads
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		//не получает ошибок и вытаскиваем оригинальное название
		cb(null, file.originalname);
	},
});

//добавляем логику multer в express
const upload = multer({ storage });

app.use(express.json());

//разрешаем запросы
app.use(cors());

//дает возможность обращаться к файлам в папке
app.use('/uploads', express.static('uploads'));

//запрос на загрузку картинки
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
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

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log('Server OK');
});
