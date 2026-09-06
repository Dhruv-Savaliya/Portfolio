import { MetadataRoute } from 'next';

const BASE_URL = 'https://devdhruv.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work/bizdhan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/work/clearclaim`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/work/smart-receipt`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
