const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err.message || err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Lỗi hệ thống bên trong'

    });
};

module.exports = {
    errorHandler
};