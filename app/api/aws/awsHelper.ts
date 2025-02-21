// export const getAwsCredentials = () => {
//   const result = {
//     accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
//     secretAccessKey: String(process.env.AWS_ACCESS_KEY_SECRET),
//   }
//   return result
// }

export const awsCreds = {
  accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
  secretAccessKey: String(process.env.AWS_ACCESS_KEY_SECRET),
}
