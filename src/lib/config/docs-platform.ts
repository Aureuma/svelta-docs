export type DocsVersion = {
	id: string;
	label: string;
	status: 'current' | 'maintenance' | 'preview';
	description: string;
	default?: boolean;
};

export type DocsLocale = {
	id: string;
	label: string;
	status: 'default' | 'planned' | 'preview';
	description: string;
	default?: boolean;
};

export const docsVersions: DocsVersion[] = [
	{
		id: 'current',
		label: 'Current',
		status: 'current',
		description: 'Stable documentation surface for the latest release line.',
		default: true
	},
	{
		id: 'next',
		label: 'Next',
		status: 'preview',
		description: 'Preview channel for upcoming documentation structure and API changes.'
	}
];

export const docsLocales: DocsLocale[] = [
	{
		id: 'en',
		label: 'English',
		status: 'default',
		description: 'Canonical source locale for this documentation set.',
		default: true
	},
	{
		id: 'es',
		label: 'Spanish',
		status: 'planned',
		description: 'Scaffolded locale target for future translated content.'
	},
	{
		id: 'ja',
		label: 'Japanese',
		status: 'planned',
		description: 'Scaffolded locale target for future translated content.'
	}
];

export const defaultDocsVersion = docsVersions.find((version) => version.default) ?? docsVersions[0];
export const defaultDocsLocale = docsLocales.find((locale) => locale.default) ?? docsLocales[0];

export function getDocsVersion(id: string | null | undefined): DocsVersion {
	return docsVersions.find((version) => version.id === id) ?? defaultDocsVersion;
}

export function getDocsLocale(id: string | null | undefined): DocsLocale {
	return docsLocales.find((locale) => locale.id === id) ?? defaultDocsLocale;
}

export function isSupportedDocsVersion(id: string): boolean {
	return docsVersions.some((version) => version.id === id);
}

export function isSupportedDocsLocale(id: string): boolean {
	return docsLocales.some((locale) => locale.id === id);
}
