export default () => ({
  SECRET: process.env.SECRET,
  EXPIRES_IN: process.env.EXPIRES_IN,
  TEMPLATE: process.env.TEMPLATE,
  PORT: process.env.PORT,
  SENDER: process.env.SENDER,
  PASSWORD: process.env.SENDER_PASSWORD,
  HOST: process.env.HOST,
  IPFS_PORT: process.env.IPFS_PORT,
  PROTOCOL: process.env.PROTOCOL,
  UPLOAD_PATH: process.env.PATH_IPFS,
  EMAIL: process.env.EMAIL,
});
