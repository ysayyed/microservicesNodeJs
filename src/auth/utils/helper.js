export const createToken = (id, email, role) => {
  const token = Jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 60,
  });
  return token;
};

export function generateOtp() {
  const charset = "0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}
