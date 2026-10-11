/** Resolve application-owned URLs under the build-time deployment prefix. */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '')

export function appPath(path: `/${string}`) {
  return `${BASE_PATH}${path}`
}
