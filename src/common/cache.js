export function getCachedData(cacheKey) {
	try {
		return localStorage.getItem(cacheKey);
	} catch (e) {
		console.warn('Local storage is not available.', e);
		return null;
	}
}

export function cacheData(cacheKey, data) {
	try {
		localStorage.setItem(cacheKey, data);
	} catch (e) {
		console.warn('Local storage is full or not available.', e);
	}
}

