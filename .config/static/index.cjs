// const { createHmac } = require('node:crypto');

// // кодируем название папки в бакете (имя пакета) в sha256 для секурности
// let target = `${createHmac('sha256', process.env.npm_package_name)
//   .update(process.env.npm_package_name)
//   .digest('hex')}/${process.env.npm_package_version}`;

// if (process.env.DEPLOY_FROM_BRANCH) {
//   target = `test/${process.env.DEPLOY_FROM_BRANCH}`
// }

// module.exports = {
//     bucket: 'infradev-static',
//     static: {
//         path: 'build',
//         sources: ['**/*'],
//         ignore: ['**/bundle-stats/**'],
//         existsStrategy: 'overwrite',
//         target,
//     },
//     s3: {
//         accessKeyId: process.env.S3_ACCESS_KEY_ID,
//         secretAccessKey: process.env.S3_ACCESS_SECRET_KEY,
//     },
// }
