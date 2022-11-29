import { body } from 'express-validator';

//регистрация
export const registerValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
	body('fullName', 'Укажите имя').isLength({ min: 3 }),
	body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

//проверку на авторизацию
export const loginValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

//проверка обновления профиля
export const updateUserValidation = [
	body('fullName', 'Неверно указано имя').optional().isString(),
	body('preferredSport', 'Неверно указан вид спорта').optional().isString(),
	body('age', 'Укажите возраст').optional().isString(),
	body('city', 'Неверно указан город(string)').optional().isString(),
	body('avatarUrl', 'Неверная ссылка на аватарку').optional(),
];

//валидация для комнат

//для создания комнаты
export const roomCreateValidation = [
	body('title', 'Введите название комнаты').isLength({ min: 3 }).isString(),
	body('preferredSport', 'Укажите вид спорта').isLength({ min: 3 }).isString(),
	body('time', 'Укажите время').isLength({ min: 3 }).isString(),
	body('date', 'Укажите дату').isLength({ min: 3 }).isString(),
	body('place', 'Укажите место').isLength({ min: 3 }).isString(),
];
