import SmilesDrawer from 'smiles-drawer';

// Function to fetch SMILES data from PubChem or use cached data
async function fetchSMILES(compoundName) {
  showLoader(true);
  clearErrorMessage();
  const cacheKey = `smiles_${encodeURIComponent(compoundName)}`;
  const cachedSMILES = getCachedSMILES(cacheKey);

  if (cachedSMILES) {
    displaySmilesDrawer(cachedSMILES);
    showLoader(false);
  } else {
    try {
      const smilesData = await fetchPubchemSMILES(compoundName);

      if (smilesData) {
        cacheSMILES(cacheKey, smilesData);
        displaySmilesDrawer(smilesData);
      } else {
        console.error(`SMILES data not found for ${compoundName}.`);
        displayErrorMessage(`SMILES data not found for "${compoundName}".`);
      }
    } catch (error) {
      console.error('Error fetching or displaying SMILES data:', error);
      displayErrorMessage('Error fetching or displaying SMILES data.');
    } finally {
      showLoader(false);
    }
  }
}

function showLoader(visible) {
  document.getElementById('loader').style.display = visible ? 'block' : 'none';
}

function displayErrorMessage(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.style.display = 'block';
  errorDiv.textContent = message;
}

function clearErrorMessage() {
  const errorDiv = document.getElementById('error-message');
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';
}

// Function to cache SMILES data in localStorage
function cacheSMILES(cacheKey, smilesData) {
  try {
    localStorage.setItem(cacheKey, smilesData);
  } catch (e) {
    console.warn('Local storage is full or not available.', e);
  }
}

// Function to get cached SMILES data from localStorage
function getCachedSMILES(cacheKey) {
  try {
    return localStorage.getItem(cacheKey);
  } catch (e) {
    console.warn('Local storage is not available.', e);
    return null;
  }
}

// Function to fetch SMILES data from PubChem
async function fetchPubchemSMILES(compoundName) {
  const pubChemURL = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    compoundName
  )}/property/CanonicalSMILES/JSON`;

  try {
    const response = await fetch(pubChemURL);
    if (!response.ok) {
      if (response.status === 404) {
        // Compound not found
        return null;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    const data = await response.json();
    if (data.PropertyTable && data.PropertyTable.Properties && data.PropertyTable.Properties.length > 0) {
      const smiles = data.PropertyTable.Properties[0].CanonicalSMILES;
      return smiles;
    } else {
      // Empty response
      return null;
    }
  } catch (error) {
    console.error('Error fetching SMILES data from PubChem:', error);
    throw error;
  }
}

// Function to display the molecule using SmilesDrawer
function displaySmilesDrawer(smiles) {
  const smilesDrawer = new SmilesDrawer.Drawer({
    width: 500,
    height: 500,
    bondThickness: 1.0,
    padding: 15,
  });

  SmilesDrawer.parse(
    smiles,
    function (tree) {
      smilesDrawer.draw(tree, 'smiles-canvas', 'light', false);
    },
    function (err) {
      console.error(err);
      displayErrorMessage('Error parsing SMILES data.');
    }
  );
}

// Call the function with the desired compound name
const compoundName = '{{mol}}'; // Placeholder for Anki
fetchSMILES(compoundName);

