import type { MetadataRoute } from 'next'

import { appPath } from '@/lib/app-path'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: appPath('/'),
      disallow: appPath('/private/'),
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  }
}
