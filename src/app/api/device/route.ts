import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Received device info:', req.body);
    res.status(200).json({ message: 'Device info received' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
