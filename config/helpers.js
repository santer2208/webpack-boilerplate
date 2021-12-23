const isDev = process.env.NODE_ENV === 'development';
const suffix = (isDev) => (isDev ? '' : '.min');
const project = process.env.NODE_PROJECT;
module.exports = { isDev, suffix, project };
