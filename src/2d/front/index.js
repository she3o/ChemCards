import SmilesDrawer from 'smiles-drawer';
import { showLoader, displayErrorMessage, clearErrorMessage } from '../../common/loader';
import { getCachedData, cacheData } from '../../common/cache';

// Function to fetch SMILES data from PubChem or use cached data
async function fetchSMILES(compoundName) {
  showLoader(true);
  clearErrorMessage();
  const cacheKey = `smiles_${encodeURIComponent(compoundName)}`;
  const cachedSMILES = getCachedData(cacheKey);

  if (cachedSMILES) {
    displaySmilesDrawer(cachedSMILES);
    showLoader(false);
  } else {
    try {
      const smilesData = await fetchPubchemSMILES(compoundName);

      if (smilesData) {
        cacheData(cacheKey, smilesData);
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

// Function to fetch SMILES data from PubChem
async function fetchPubchemSMILES(compoundName) {
  const pubChemURL = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    compoundName
  )}/property/CanonicalSMILES/TXT`;

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
    const smiles = await response.text(); // Handle plain text response
    if (smiles.trim()) {
      return smiles.trim(); // Return the SMILES string, ensuring it's trimmed
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

