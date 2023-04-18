import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from './validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';

import { UserControllers, PostControllers } from './controllers/index.js';

const app = express();
const PORT = 4444;

app.use(cors());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileSizeLimit = 1024 * 1024; // 1 MB
const limits = {
    fileSize: fileSizeLimit,
};

const fileFilter = (req, file, cb) => {
    // Проверяем тип файла
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else {
        // Отклоняем файл
        cb(
            new Error(
                'Неверный формат файла. Принимаются только файлы в форматах JPEG, PNG и JPG'
            ),
            false
        );
    }
};

const upload = multer({ storage, fileFilter, limits });

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected!'))
    .catch(err => console.log('DB error', err));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

//users
app.post(
    '/auth/login',
    loginValidation,
    handleValidationErrors,
    UserControllers.login
);
app.post(
    '/auth/register',
    registerValidation,
    handleValidationErrors,
    UserControllers.register
);
app.get('/auth/me', checkAuth, UserControllers.getMe);
app.patch('/auth/edit/:id', checkAuth, UserControllers.updateUser);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//tags

//posts
app.get('/posts', PostControllers.getAllPosts);
app.get('/posts/popular', PostControllers.getPopularPosts);
app.get('/posts/tags', PostControllers.getAllTags);
app.get(`/posts/:id`, PostControllers.getOnePost);
app.post('/posts', checkAuth, postCreateValidation, PostControllers.createPost);
app.delete('/posts/:id', checkAuth, PostControllers.deletePost);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostControllers.updatePost);

app.listen(process.env.PORT || 4444, err => {
    if (err) {
        return console.log(err);
    }

    console.log('Server started');
});
// 'mongodb+srv://admin:Pass123@cluster0.ojv9piu.mongodb.net/blog?retryWrites=true&w=majority'
