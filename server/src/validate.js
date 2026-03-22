function validateInput(text) {
  if (!text || text.trim() === "") {
    return { valid: false, error: "Input text is required." };
  }
  if (text.length > 10000) {
    return { valid: false, error: "Input too long (max 10,000 characters)." };
  }
  return { valid: true };
}

module.exports = { validateInput };
