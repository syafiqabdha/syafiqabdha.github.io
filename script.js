document.addEventListener("DOMContentLoaded", () => {
	// --- Existing Selectors ---
	const levelSelector = document.getElementById("level-selector");
	const floorPlans = document.querySelectorAll(".floor-plan");
	const unitButtonContainers = document.querySelectorAll(".unit-buttons");
	const unitSelectorButtons = document.querySelectorAll(".unit-selector-button");
	const detailsContent = document.getElementById("details-content");
	const levelButtons = document.querySelectorAll(".level-button");
	const currentYearSpan = document.getElementById("current-year");

	// --- New Selectors for Magnify Modal ---
	const magnifyModal = document.getElementById("magnify-modal");
	const modalImg = document.getElementById("magnified-img");
	const closeModalBtn = document.querySelector(".modal-close");
	const clickablePlans = document.querySelectorAll(".clickable-plan"); // Select clickable images

	// Initial message
	const initialDetailsMessage =
		'<p>Select a unit button above to see its details.</p><div id="download-button-container"></div>';

	// Set current year in footer
	if (currentYearSpan) {
		currentYearSpan.textContent = new Date().getFullYear();
	}

	// --- Level Switching ---
	levelSelector.addEventListener("click", (e) => {
		if (e.target.classList.contains("level-button")) {
			const targetLevel = e.target.dataset.level;
			levelButtons.forEach((button) => {
				button.classList.toggle(
					"active",
					button.dataset.level === targetLevel,
				);
			});
			floorPlans.forEach((plan) => {
				plan.classList.toggle("active", plan.id === `level-${targetLevel}`);
			});
			unitButtonContainers.forEach((container) => {
				container.classList.toggle(
					"active",
					container.id === `level-${targetLevel}-buttons`,
				);
			});
			clearButtonSelection();
			detailsContent.innerHTML = initialDetailsMessage;
		}
	});

	// --- Unit Button Click Handling ---
	unitSelectorButtons.forEach((button) => {
		button.addEventListener("click", () => {
			clearButtonSelection();
			button.classList.add("selected");

			const unitData = {
				unitId: button.dataset.unitId || "N/A",
				status: button.dataset.status || "N/A",
				area: button.dataset.area || "N/A",
				water: button.dataset.water || "N/A",
				acPower: button.dataset.acPower || "N/A",
				other: button.dataset.other || "N/A",
				detailPlanUrl: button.dataset.detailPlan,
				unitNo: button.dataset.unitNo || button.dataset.unitId || "N/A",
				fcuUnits: button.dataset.fcuUnits || "N/A",
				elecIsolator: button.dataset.elecIsolator || "N/A",
				elecPhase: button.dataset.elecPhase || "N/A",
				emergencyLight: button.dataset.emergencyLight || "N/A",
				exitSignage: button.dataset.exitSignage || "N/A",
				paSpeaker: button.dataset.paSpeaker || "N/A",
				fibrePort: button.dataset.fibrePort || "N/A",
				dataPort: button.dataset.dataPort || "N/A",
				waterPipeDia: button.dataset.waterPipeDia || "N/A",
				floorTrap: button.dataset.floorTrap || "N/A",
				gasPipe: button.dataset.gasPipe || "N/A",
				kitchenEa: button.dataset.kitchenEa || "N/A",
				kitchenFa: button.dataset.kitchenFa || "N/A",
				sprinkler: button.dataset.sprinkler || "N/A",
			};

			const detailsGrid = document.createElement("div");
			detailsGrid.id = "details-grid";
			let gridHTML = `
                <p><strong>Unit No:</strong> ${escapeHTML(unitData.unitNo)}</p>
                <p><strong>Status:</strong> ${escapeHTML(unitData.status)}</p>
                <p><strong>Area:</strong> ${escapeHTML(unitData.area)}</p>
                <p><strong>Water Point:</strong> ${escapeHTML(unitData.water)}</p>
                <p><strong>A/C Power:</strong> ${escapeHTML(unitData.acPower)}</p>
                <p><strong>FCU Units:</strong> ${escapeHTML(unitData.fcuUnits)}</p>
                <p><strong>Elect. Isolator:</strong> ${escapeHTML(unitData.elecIsolator)}</p>
                <p><strong>Elect. Phase:</strong> ${escapeHTML(unitData.elecPhase)}</p>
                <p><strong>Emergency Lights:</strong> ${escapeHTML(unitData.emergencyLight)}</p>
                <p><strong>Exit Signage:</strong> ${escapeHTML(unitData.exitSignage)}</p>
                <p><strong>PA Speaker:</strong> ${escapeHTML(unitData.paSpeaker)}</p>
                <p><strong>Fibre Port:</strong> ${escapeHTML(unitData.fibrePort)}</p>
                <p><strong>Data Ports:</strong> ${escapeHTML(unitData.dataPort)}</p>
                <p><strong>Water Pipe Ø:</strong> ${escapeHTML(unitData.waterPipeDia)}</p>
                <p><strong>Floor Traps:</strong> ${escapeHTML(unitData.floorTrap)}</p>
                <p><strong>Gas Pipe:</strong> ${escapeHTML(unitData.gasPipe)}</p>
                <p><strong>Kitchen EA:</strong> ${escapeHTML(unitData.kitchenEa)}</p>
                <p><strong>Kitchen FA:</strong> ${escapeHTML(unitData.kitchenFa)}</p>
                <p><strong>Sprinkler:</strong> ${escapeHTML(unitData.sprinkler)}</p>
                <p><strong>Notes:</strong> ${escapeHTML(unitData.other)}</p>
            `;
			detailsGrid.innerHTML = gridHTML;
			detailsContent.innerHTML = "";
			detailsContent.appendChild(detailsGrid);

			const downloadContainer = document.createElement("div");
			downloadContainer.id = "download-button-container";
			detailsContent.appendChild(downloadContainer);

			if (unitData.detailPlanUrl) {
				const planLink = document.createElement("a");
				planLink.href = unitData.detailPlanUrl;
				planLink.download = `Unit_${unitData.unitId}_Plan${getFileExtension(unitData.detailPlanUrl)}`;
				planLink.textContent = "Download Unit Plan";
				planLink.classList.add("download-button", "plan");
				planLink.setAttribute("role", "button");
				downloadContainer.appendChild(planLink);
			} else {
				const noPlanMsg = document.createElement("p");
				noPlanMsg.innerHTML = "<small>No detailed plan available.</small>";
				downloadContainer.appendChild(noPlanMsg);
			}

			const infoLink = document.createElement("a");
			infoLink.textContent = "Download Unit Info (TXT)";
			infoLink.classList.add("download-button", "info");
			infoLink.setAttribute("role", "button");
			infoLink.href = "#";

			const textContent = `Unit Information - ${unitData.unitNo}
------------------------------------------
Unit No:          ${unitData.unitNo}
Status:           ${unitData.status}
Area:             ${unitData.area}
Water Point:      ${unitData.water}
A/C Power:        ${unitData.acPower}
FCU Units:        ${unitData.fcuUnits}
Elect. Isolator:  ${unitData.elecIsolator}
Elect. Phase:     ${unitData.elecPhase}
Emergency Lights: ${unitData.emergencyLight}
Exit Signage:     ${unitData.exitSignage}
PA Speaker:       ${unitData.paSpeaker}
Fibre Port:       ${unitData.fibrePort}
Data Ports:       ${unitData.dataPort}
Water Pipe Dia:   ${unitData.waterPipeDia}
Floor Traps:      ${unitData.floorTrap}
Gas Pipe:         ${unitData.gasPipe}
Kitchen EA:       ${unitData.kitchenEa}
Kitchen FA:       ${unitData.kitchenFa}
Sprinkler:        ${unitData.sprinkler}
Notes:            ${unitData.other}
------------------------------------------
Generated: ${new Date().toLocaleString()}
`;
			const blob = new Blob([textContent], { type: "text/plain" });
			const infoFileURL = URL.createObjectURL(blob);
			infoLink.href = infoFileURL;
			infoLink.download = `Unit_${unitData.unitId}_Info.txt`;
			infoLink.addEventListener("click", (e) => {
				setTimeout(() => URL.revokeObjectURL(infoFileURL), 100);
			});
			downloadContainer.appendChild(infoLink);

			if (unitData.status.toLowerCase() === "leased") {
				const leasedMsg = document.createElement("p");
				leasedMsg.style.color = "red";
				leasedMsg.style.fontWeight = "bold";
				leasedMsg.style.marginTop = "1rem";
                leasedMsg.style.textAlign = "center"; // Center leased message
				leasedMsg.textContent = "Note: This unit is currently leased.";
				detailsContent.appendChild(leasedMsg);
			}
		});
	});

	// --- Magnify Floor Plan Logic ---
	clickablePlans.forEach(img => {
		img.addEventListener('click', function() {
			if (magnifyModal && modalImg) {
				magnifyModal.style.display = "block";
				modalImg.src = this.src;
                modalImg.alt = this.alt; // Copy alt text
			}
		});
	});

	// Close modal when clicking the close button
	if (closeModalBtn) {
		closeModalBtn.onclick = function() {
			if (magnifyModal) {
				magnifyModal.style.display = "none";
			}
		}
	}

	// Close modal when clicking outside the image content
	if (magnifyModal) {
		magnifyModal.onclick = function(event) {
            // Check if the click target is the modal background itself
			if (event.target == magnifyModal) {
				magnifyModal.style.display = "none";
			}
		}
	}


	// --- Helper Functions ---
	function clearButtonSelection() {
		unitSelectorButtons.forEach((btn) => btn.classList.remove("selected"));
	}

	function getFileExtension(filename) {
		if (!filename || typeof filename !== "string") return "";
		const lastDotIndex = filename.lastIndexOf(".");
		if (lastDotIndex === -1) return "";
		return filename.substring(lastDotIndex);
	}

	function escapeHTML(str) {
		if (!str) return "";
		str = String(str);
		return str.replace(/[&<>"']/g, function (match) {
			return {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#39;",
			}[match];
		});
	}

	// --- Initialization ---
	floorPlans.forEach((plan, index) => {
		plan.classList.toggle("active", index === 0);
	});
	unitButtonContainers.forEach((container, index) => {
		container.classList.toggle("active", index === 0);
	});
	levelButtons.forEach((button, index) => {
		button.classList.toggle("active", index === 0);
	});
	detailsContent.innerHTML = initialDetailsMessage;
});
