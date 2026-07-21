export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode non autorisee' })
  }

  const { email } = req.body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email manquant ou invalide' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: 'dbaliguini@gmail.com',
        subject: 'Nouvel inscrit a la newsletter',
        text: `Nouvelle inscription : ${email}`,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return res.status(502).json({ error: `Erreur Resend : ${errorBody}` })
    }

    return res.status(200).json({ sent: true })
  } catch (err) {
    return res.status(500).json({ error: `Erreur serveur : ${err.message}` })
  }
}