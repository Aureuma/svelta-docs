export function getDocsHrefForSlug(slug: string): string {
  return slug === 'index' ? '/docs' : `/docs/${slug}`;
}
