// Get molecule name from ?mol=aspirin
// otherwise: Replace {{mol}} with paracetamol for web viewing
// In Anki: {{mol}} is replaced internally so our replacement doesn't take place
export function resolveCompoundName() {
	const urlParams = new URLSearchParams(window.location.search);
	let compoundName = urlParams.get("mol");
	if (!compoundName || compoundName.trim() === "") {
		compoundName = "{{mol}}"; // Placeholder for Anki
		if (compoundName.includes("{{")) {
			compoundName = "paracetamol"; // Default molecule
		}
	}
	return compoundName;
}

export function getCachedData(cacheKey) {
	try {
		return localStorage.getItem(cacheKey);
	} catch (e) {
		console.warn("Local storage is not available.", e);
		return null;
	}
}

export function generateCache(cacheKey, data) {
	try {
		localStorage.setItem(cacheKey, data);
	} catch (e) {
		console.warn("Local storage is full or not available.", e);
	}
}

export function showLoader(visible) {
	document.getElementById('loader').style.display = visible ? 'block' : 'none';
}

export function displayErrorMessage(message) {
	const errorDiv = document.getElementById('error-message');
	errorDiv.style.display = 'block';
	errorDiv.textContent = message;
}

export function clearErrorMessage() {
	const errorDiv = document.getElementById('error-message');
	errorDiv.style.display = 'none';
	errorDiv.textContent = '';
}

export async function getSynonyms(compound) {
	const encodedCompound = encodeURIComponent(compound);

	try {
		const response = await fetch(
			`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodedCompound}/synonyms/JSON`
		);
		const data = await response.json();

		const synonyms = data.InformationList.Information[0].Synonym.filter((synonym) =>
			/[a-zA-Z]/.test(synonym)
		).slice(0, 3);

		const answerDiv = document.getElementById('answer');
		answerDiv.innerHTML = '';
		synonyms.forEach((synonym) => {
			const p = document.createElement('p');
			p.textContent = synonym;
			answerDiv.appendChild(p);
		});
	} catch (error) {
		console.error('Error fetching synonyms:', error);
		const answerDiv = document.getElementById('answer');
		answerDiv.textContent = 'Error fetching synonyms.';
	}
}
