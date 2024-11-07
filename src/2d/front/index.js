import { showLoader, displayErrorMessage, clearErrorMessage } from '../../common/lib';
import { getCachedData, generateCache } from '../../common/lib';
import { resolveCompoundName } from '../../common/lib'


// Function to fetch SMILES data from PubChem or use cached data
async function loadAndDisplay(compoundName) {
  showLoader(true);
  clearErrorMessage();

  const cacheKey = `smiles_${encodeURIComponent(compoundName)}`;
  const cacheData = getCachedData(cacheKey);

  if (cacheData) {
    renderMoleculeWithSmilesDrawer(cacheData);
    showLoader(false);
  } else {
    try {
      const fetchedData = await fetchSMILESDataFromPubchem(compoundName);

      if (fetchedData) {
        generateCache(cacheKey, fetchedData);
        renderMoleculeWithSmilesDrawer(fetchedData);
      } else {
        console.error(`Requested data not found for ${compoundName}.`);
        displayErrorMessage(`Requested data not found for "${compoundName}".`);
      }
    } catch (error) {
      console.error("Error fetching or displaying requested data:", error);
      displayErrorMessage("Error fetching or displaying requested data.");
    } finally {
      showLoader(false);
    }
  }
}

// Function to fetch SMILES data from PubChem
async function fetchSMILESDataFromPubchem(compoundName) {
  const pubChemURL = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    compoundName,
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
      return smiles.trim();
    } else {
      // Empty response
      return null;
    }
  } catch (error) {
    console.error("Error fetching SMILES data from PubChem:", error);
    throw error;
  }
}

// Function to display the molecule using SmilesDrawer
function renderMoleculeWithSmilesDrawer(smiles) {
  const smilesDrawer = new SmilesDrawer.Drawer({
    width: 500,
    height: 500,
    bondThickness: 1.0,
    padding: 15,
  });

  SmilesDrawer.parse(
    smiles,
    function (tree) {
      smilesDrawer.draw(tree, "smiles-canvas", "light", false);
    },
    function (err) {
      console.error(err);
      displayErrorMessage("Error parsing SMILES data.");
    },
  );
}

// Call the function with the desired compound name
const compoundName = resolveCompoundName();
loadAndDisplay(compoundName);
