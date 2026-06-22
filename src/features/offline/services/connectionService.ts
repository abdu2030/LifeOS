export async function checkConnection() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false
  }

  try {
    await fetch('/favicon.svg?lifeos-healthcheck=' + Date.now(), {
      cache: 'no-store',
      method: 'HEAD',
    })
    return true
  } catch {
    return false
  }
}
