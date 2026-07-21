export async function generateProjectDescription(title, techStack) {
  const response = await fetch('/api/generate-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, techStack }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error ?? 'Impossible de generer la description')
  }

  return data.description
}