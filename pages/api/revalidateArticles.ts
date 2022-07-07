import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  /* if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  } */
  //let articleId = req.query.id as string

  try {
    const blogInv = async () => {
      await res.revalidate('/ssg/articles')
      console.log('revalidated all blogs')
      return res.json({ revalidated: true })
    }
    blogInv()

    //await res.unstable_revalidate('/ssg/articles/')
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    console.log(err)
    return res.status(500).send('Error revalidating')
  }
}
