import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = ({ url }) => {
	const base = url.origin;
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>si Docs</ShortName>
  <Description>Search the SI documentation index.</Description>
  <Url type="text/html" method="get" template="${escapeXml(`${base}/docs/search?q={searchTerms}`)}" />
  <Url type="application/json" method="get" template="${escapeXml(`${base}/docs/search.json`)}" />
</OpenSearchDescription>`;

	return text(body, {
		headers: {
			'content-type': 'application/opensearchdescription+xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
