import type { DocsPage } from '$lib/types/docs';

export type DocsPageSeo = {
	title: string;
	description: string;
	canonicalUrl: string;
	keywords: string[];
	og: {
		title: string;
		description: string;
		type: 'article';
		url: string;
	};
	twitter: {
		card: 'summary';
		title: string;
		description: string;
	};
	jsonLd: string;
};

export function buildDocsPageSeo(page: DocsPage, canonicalUrl: string): DocsPageSeo {
	const title = `${page.title} - Documentation`;
	const description = page.description || page.title;
	const keywords = [page.section.label, ...page.tags];

	return {
		title,
		description,
		canonicalUrl,
		keywords,
		og: {
			title: page.title,
			description,
			type: 'article',
			url: canonicalUrl
		},
		twitter: {
			card: 'summary',
			title: page.title,
			description
		},
		jsonLd: JSON.stringify(
			{
				'@context': 'https://schema.org',
				'@type': 'TechArticle',
				headline: page.title,
				description,
				keywords,
				url: canonicalUrl,
				dateModified: page.updatedAt
			},
			null,
			2
		)
	};
}
