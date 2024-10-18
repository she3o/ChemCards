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

