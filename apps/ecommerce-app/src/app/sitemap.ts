import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://amy-store.site',
      lastModified: new Date(),
    },
  ];
}
