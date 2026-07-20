const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const URL_PATTERN = /^https?:\/\/.+/

export function validateSlug(slug) {
  if (!slug || slug.trim().length === 0) {
    return 'Le slug est obligatoire.'
  }
  if (!SLUG_PATTERN.test(slug)) {
    return 'Le slug ne doit contenir que des lettres minuscules, chiffres et tirets (ex: mon-projet).'
  }
  if (slug.length > 100) {
    return 'Le slug est trop long (100 caractères maximum).'
  }
  return null
}

export function validateRequiredText(value, fieldLabel, maxLength = 255) {
  if (!value || value.trim().length === 0) {
    return `${fieldLabel} est obligatoire.`
  }
  if (value.length > maxLength) {
    return `${fieldLabel} est trop long (${maxLength} caractères maximum).`
  }
  return null
}

export function validateOptionalUrl(value, fieldLabel) {
  if (!value || value.trim().length === 0) {
    return null
  }
  if (!URL_PATTERN.test(value.trim())) {
    return `${fieldLabel} doit être une URL valide commençant par http:// ou https://`
  }
  return null
}

export function validateProjectForm(form) {
  const errors = {}

  const titleError = validateRequiredText(form.title, 'Le titre')
  if (titleError) errors.title = titleError

  const slugError = validateSlug(form.slug)
  if (slugError) errors.slug = slugError

  const shortDescError = validateRequiredText(form.short_description, 'La description courte', 500)
  if (shortDescError) errors.short_description = shortDescError

  const githubError = validateOptionalUrl(form.github_url, 'Le lien GitHub')
  if (githubError) errors.github_url = githubError

  const liveError = validateOptionalUrl(form.live_url, 'Le lien démo')
  if (liveError) errors.live_url = liveError

  const coverError = validateOptionalUrl(form.cover_image_url, "L'URL de l'image de couverture")
  if (coverError) errors.cover_image_url = coverError

  return errors
}

export function validatePostForm(form) {
  const errors = {}

  const titleError = validateRequiredText(form.title, 'Le titre')
  if (titleError) errors.title = titleError

  const slugError = validateSlug(form.slug)
  if (slugError) errors.slug = slugError

  const excerptError = validateRequiredText(form.excerpt, "L'extrait", 300)
  if (excerptError) errors.excerpt = excerptError

  const contentError = validateRequiredText(form.content, 'Le contenu', 50000)
  if (contentError) errors.content = contentError

  const coverError = validateOptionalUrl(form.cover_image_url, "L'URL de l'image de couverture")
  if (coverError) errors.cover_image_url = coverError

  return errors
}