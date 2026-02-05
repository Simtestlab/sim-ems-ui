import { redirect } from 'next/navigation';

export default function Page({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
	const params = new URLSearchParams();
	if (searchParams) {
		for (const key of Object.keys(searchParams)) {
			const val = searchParams[key];
			if (Array.isArray(val)) {
				val.forEach(v => params.append(key, v));
			} else if (val !== undefined) {
				params.append(key, String(val));
			}
		}
	}

	const query = params.toString();
	redirect(`/livePage${query ? `?${query}` : ''}`);
}
