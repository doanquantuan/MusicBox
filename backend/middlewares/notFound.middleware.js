const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy trang - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {
    notFound
};
