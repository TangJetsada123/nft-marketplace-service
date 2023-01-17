export default () => ({
  secret: process.env.SECRET,
  signOptions: process.env.EXPIRESIN,
});
