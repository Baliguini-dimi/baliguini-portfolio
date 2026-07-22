const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5 Mo
const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024 // 20 Mo

async function readFileSignature(file, byteCount) {
  const buffer = await file.slice(0, byteCount).arrayBuffer()
  return new Uint8Array(buffer)
}

function matchesSignature(bytes, signature) {
  return signature.every((byte, index) => bytes[index] === byte)
}

export async function detectRealImageType(file) {
  const bytes = await readFileSignature(file, 12)

  if (matchesSignature(bytes, [0xff, 0xd8, 0xff])) {
    return 'image/jpeg'
  }

  if (matchesSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png'
  }

  if (matchesSignature(bytes, [0x52, 0x49, 0x46, 0x46])) {
    const webpMarker = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
    if (webpMarker === 'WEBP') {
      return 'image/webp'
    }
  }

  return null
}

export async function detectRealDocumentType(file) {
  const bytes = await readFileSignature(file, 4)

  if (matchesSignature(bytes, [0x25, 0x50, 0x44, 0x46])) {
    return 'application/pdf'
  }

  if (
    matchesSignature(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
    matchesSignature(bytes, [0x50, 0x4b, 0x05, 0x06])
  ) {
    return 'application/zip'
  }

  return null
}

export async function validateImageFile(file) {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, error: 'Le fichier depasse la taille maximale de 5 Mo.' }
  }

  const realType = await detectRealImageType(file)

  if (!realType) {
    return {
      valid: false,
      error: "Ce fichier n'est pas une image valide (JPEG, PNG ou WEBP). Verifie que le fichier n'a pas ete renomme.",
    }
  }

  return { valid: true, realType }
}

export async function validateDocumentFile(file) {
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return { valid: false, error: 'Le fichier depasse la taille maximale de 20 Mo.' }
  }

  const realType = await detectRealDocumentType(file)

  if (!realType) {
    return {
      valid: false,
      error: "Ce fichier n'est pas un PDF ou un ZIP valide. Verifie que le fichier n'a pas ete renomme.",
    }
  }

  return { valid: true, realType }
}

export function getExtensionForType(mimeType) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
    'application/zip': 'zip',
  }
  return map[mimeType] ?? 'bin'
}