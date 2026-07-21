export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode non autorisee' })
  }

  const { title, techStack } = req.body

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Titre manquant ou invalide' })
  }

  const stackText = Array.isArray(techStack) && techStack.length > 0
    ? techStack.join(', ')
    : 'non precisee'

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content:
              'Tu rediges des descriptions de projets techniques courtes et sobres, en francais, sans superlatifs vides (evite "passionnant", "revolutionnaire"). Deux phrases maximum. Ne mets aucun guillemet autour de ta reponse.',
          },
          {
            role: 'user',
            content: `Titre du projet : ${title}\nStack technique : ${stackText}\n\nRedige une description courte et factuelle de ce projet.`,
          },
        ],
        max_tokens: 150,
        temperature: 0.6,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return res.status(502).json({ error: `Erreur Groq : ${errorBody}` })
    }

    const data = await response.json()
    const description = data.choices?.[0]?.message?.content?.trim()

    if (!description) {
      return res.status(502).json({ error: 'Reponse vide de Groq' })
    }

    return res.status(200).json({ description })
  } catch (err) {
    return res.status(500).json({ error: `Erreur serveur : ${err.message}` })
  }
}