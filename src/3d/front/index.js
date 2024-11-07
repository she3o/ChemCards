import * as $3Dmol from '3dmol';
import { showLoader, displayErrorMessage, clearErrorMessage } from '../../common/lib';
import { getCachedData, generateCache } from '../../common/lib';
import { resolveCompoundName } from '../../common/lib'


// Function to fetch SDF data from PubChem or use cached data
async function loadAndDisplay(compoundName) {
  showLoader(true);
  clearErrorMessage();
  const cacheKey = `sdf_${encodeURIComponent(compoundName)}`;
  const cacheData = getCachedData(cacheKey);

  if (cacheData) {
    renderMoleculeWith3Dmol(cacheData);
    showLoader(false);
  } else {
    try {
      const fetchedData = await fetchSDFDataFromPubchem(compoundName);

      if (fetchedData) {
        generateCache(cacheKey, fetchedData);
        renderMoleculeWith3Dmol(fetchedData);
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

// Function to fetch SDF data from PubChem
async function fetchSDFDataFromPubchem(compoundName) {
  const pubChemURL = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    compoundName,
  )}/SDF?record_type=3d`;

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
    const sdfData = await response.text();
    if (sdfData.trim() === "") {
      // Empty response
      return null;
    }
    return sdfData;
  } catch (error) {
    console.error("Error fetching SDF data from PubChem:", error);
    throw error;
  }
}

// Function to display the 3Dmol viewer with SDF data
function renderMoleculeWith3Dmol(sdfData) {
  const viewerElement = document.getElementById("viewer3D");
  viewerElement.innerHTML = ""; // Clear any previous content
  const viewer = $3Dmol.createViewer(viewerElement);

  viewer.addModel(sdfData, "sdf", { onemol: true });

  viewer.setStyle(
    {},
    { sphere: { radius: 0.4 }, stick: { radius: 0.1, colorscheme: "default" } },
  );

  viewer.setStyle(
    { elem: "H" },
    {
      sphere: { radius: 0.15, opacity: 0.1 },
      stick: { radius: 0.1 },
    },
  );

  viewer.addSurface($3Dmol.SurfaceType.VDW, {
    opacity: 0.45,
    color: "white", // You can change the color as needed
  });

  viewer.zoomTo(); // Zoom to fit the structure
  viewer.setBackgroundColor("black"); // Set the background color
  viewer.spin(); // Enable animation to continuously rotate the molecule
  viewer.render(); // Render the viewer
}

// Call the function with the desired compound name
const compoundName = resolveCompoundName();
loadAndDisplay(compoundName);
