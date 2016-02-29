import env from 'node-env-file';
const ENV = env('.env');
console.log(ENV);
export default ENV;
