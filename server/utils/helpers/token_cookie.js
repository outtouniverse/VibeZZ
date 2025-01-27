import jwt from 'jsonwebtoken';

const token_cookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: process.env.NODE_ENV === 'production',
  });
  return token;
};

export default token_cookie;