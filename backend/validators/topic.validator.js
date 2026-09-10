const validateTopic = (req, res, next) => {
    const { topicName } = req.body;
    const { imageFile } = req.file;
    const errors = [];
    if (!topicName || !topicName.trim()) errors.push("Tên chủ đề không được để trống");
    if (topicName.length > 50) errors.push("Tên chủ đề không được vượt quá 50 ký tự");
    if (topicName.length < 3) errors.push("Tên chủ đề không được nhỏ hơn 3 ký tự");

    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validateTopic };