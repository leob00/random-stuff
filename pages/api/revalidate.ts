import { getRules } from 'lib/drupalApi'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  /* if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  } */

  try {
    let rules = await getRules()
    const ruleInv = async (id: string) => {
      await res.revalidate(`/ssg/rules/${id}`)
    }
    rules.forEach((rule) => {
      ruleInv(rule.id)
    })

    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
