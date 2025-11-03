import { SESClient, SendEmailCommand, VerifyEmailIdentityCommand, GetIdentityVerificationAttributesCommand } from '@aws-sdk/client-ses'
import { awsCreds } from 'app/api/aws/awsHelper'

export type EmailMessage = {
  from: string
  to: string
  subject: string
  html: string
}

export async function sendEmail(message: EmailMessage) {
  const client = new SESClient({
    credentials: awsCreds,
  })
  const command = new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        message.to,
        /* more To-email addresses */
      ],
    },
    Message: {
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: message.html,
        },
        //  Text: {
        //    Charset: 'UTF-8',
        //    Data: 'TEXT_FORMAT_BODY',
        //  },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: message.subject,
      },
    },
    Source: message.from,
    ReplyToAddresses: [
      /* more items */
    ],
  })
  try {
    return await client.send(command)
  } catch (caught) {
    if (caught instanceof Error && caught.name === 'MessageRejected') {
      const messageRejectedError = caught
      return messageRejectedError
    }
    throw caught
  }
}

export async function verifyEmailIdentity(email: string) {
  const client = new SESClient({
    credentials: awsCreds,
  })
  const command = new VerifyEmailIdentityCommand({ EmailAddress: email })
  try {
    return (await client.send(command)).$metadata
  } catch (err) {
    console.log('Failed to verify email identity.', err)
    return err
  }
}

export async function getSesVerificationAttributes(email: string) {
  const client = new SESClient({
    credentials: awsCreds,
    region: 'us-east-1',
  })
  const command = new GetIdentityVerificationAttributesCommand({
    Identities: [email],
  })
  const response = await client.send(command)
  return response
}
