import PostModel from '../models/Post.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user')
            .sort({ createdAt: -1 })
            .exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Нет удалось получить статьи',
        });
    }
};

export const getPopularPosts = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user')
            .sort({ viewsCount: -1 })
            .exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Нет удалось получить статьи',
        });
    }
};

export const getAllTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map(item => item.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Нет удалось получить статьи',
        });
    }
};

export const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            }
        ).populate('user');

        return res.json(doc);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Нет удалось получить статьи',
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.findOneAndDelete({
            _id: postId,
        });

        return res.json({
            message: 'Статья была удалена!',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Нет удалось удалить статью',
        });
    }
};

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(', '),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Нет удалось создать статью',
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(', '),
                user: req.userId,
            }
        );

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Нет удалось обновить статью',
        });
    }
};
