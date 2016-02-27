import env from 'node-env-file';
// export all
const ENV = env('.env');
console.log(ENV);
