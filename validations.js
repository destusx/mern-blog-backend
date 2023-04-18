import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('fullName', 'Укажите имя').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isString().isLength({ min: 10 }),
    body('text', 'Введите текст статьи').isString().isLength({ min: 20 }),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
