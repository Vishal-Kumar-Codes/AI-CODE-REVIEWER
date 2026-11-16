const aiService = require('../services/ai.service');

module.exports.aiResponse = async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).send("code is required");
  }

  try {
    const response = await aiService(code);
    res.send(response);
  } catch (error) {
    const busy = error.status === 503 || error.status === 429;
    res.status(busy ? 503 : 500).send(busy ? "busy" : "error");
  }
};
