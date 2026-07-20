const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 Mo, cohérent avec le bucket Supabase

const SIGNATURES = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // 'RIFF', vérifié plus finement ci-dessous
}

async function readFileSignature(file, byteCount) {
  const buffer = await file.slice(0, byteCount).arrayBuffer()
  return new Uint8Array(buffer)
}

function matchesSignature(bytes, signature) {
  return signature.every((byte, index) => bytes[index] === byte)
}

export async function detectRealImageType(file) {
  const bytes = await readFileSignature(file, 12)

  if (matchesSignature(bytes, SIGNATURES['image/jpeg'][0])) {
    return 'image/jpeg'
  }

  if (matchesSignature(bytes, SIGNATURES['image/png'][0])) {
    return 'image/png'
  }

  if (matchesSignature(bytes, SIGNATURES['image/webp'][0])) {
    // RIFF est un conteneur générique, on vérifie aussi les octets 8-11 = 'WEBP'
    const webpMarker = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
    if (webpMarker === 'WEBP') {
      return 'image/webp'
    }
  }

  return null
}

export async function validateImageFile(file) {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'Le fichier dépasse la taille maximale de 5 Mo.' }
  }

  const realType = await detectRealImageType(file)

  if (!realType) {
    return {
      valid: false,
      error: "Ce fichier n'est pas une image valide (JPEG, PNG ou WEBP). Vérifie que le fichier n'a pas été renommé.",
    }
  }

  return { valid: true, realType }
}

export function getExtensionForType(mimeType) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  return map[mimeType] ?? 'bin'
}