// Backside JavaScript code
async function getSynonyms(compound) {
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

// Example usage
getSynonyms('{{mol}}'); // '{{mol}}' is the placeholder for Anki

