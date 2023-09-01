function showLoadingScreen() {
    const loadingScreen = document.getElementById("hourglass");
    loadingScreen.style.display = "flex"; // Show the loading screen
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById("hourglass");
    loadingScreen.style.display = "none"; // Hide the loading screen
}

function changeLanguage() {
    showLoadingScreen();

    const languageSelect = document.getElementById("languageSwitch");
    const selectedLanguage = languageSelect.value;

    // Define translation objects for English and Spanish
    const translations = {
        en: {
            title: "Days Since Incidents",
            selectLanguage: "Select Language:",
            english: "English",
            spanish: "Español",
            severity: "Severity",
            location: "Location",
            dateAndTime: "Date and Time",
            daysSince: "Days Since",
        },
        es: {
            title: "Días desde incidentes",
            selectLanguage: "Seleccionar idioma:",
            english: "Inglés",
            spanish: "Español",
            severity: "Gravedad",
            location: "Ubicación",
            dateAndTime: "Fecha y Hora",
            daysSince: "Días desde",
        },
    };

    // Get the translation for the selected language
    const translation = translations[selectedLanguage];

    // Update page content based on the selected language
    document.title = translation.title;
    document.querySelector("label[for='languageSwitch']").textContent = translation.selectLanguage;
    document.querySelectorAll("#languageSwitch option")[0].textContent = translation.english;
    document.querySelectorAll("#languageSwitch option")[1].textContent = translation.spanish;

    // Fetch and update incident details here
    const incidentList = document.getElementById("incidentList");
    incidentList.innerHTML = ''; // Clear existing incidents

    // Fetch data from the URL
    fetch("https://days-since-incident-j7zs2.ondigitalocean.app/")
        .then((response) => response.json())
        .then((data) => {
            setTimeout(() => {
                hideLoadingScreen();

                // Sort the incidents by daysSince in ascending order (fewer days to more days)
                data.sort((a, b) => {
                    const currentDate = new Date();
                    const aDate = new Date(a.timestamp || a.updated);
                    const bDate = new Date(b.timestamp || b.updated);
                    const daysSinceA = Math.floor((currentDate - aDate) / (1000 * 60 * 60 * 24));
                    const daysSinceB = Math.floor((currentDate - bDate) / (1000 * 60 * 60 * 24));
                    return daysSinceA - daysSinceB;
                });

                data.forEach((incident) => {
                    const currentDate = new Date();
                    const incidentDate = new Date(incident.timestamp || incident.updated);
                    const daysSince = Math.floor((currentDate - incidentDate) / (1000 * 60 * 60 * 24));

                    const incidentElement = document.createElement("div");
                    incidentElement.classList.add(
                        "text-white",
                        "p-6",
                        "bg",
                        "mb-6",
                        "rounded-lg",
                        "shadow-lg",
                        "font-montserrat"
                    );

                    // Format the date and time
                    const formattedDate = incidentDate.toLocaleDateString();
                    const formattedTime = incidentDate.toLocaleTimeString();

                    incidentElement.innerHTML = `
                        <h2 class="text-xl font-semibold mb-2">${incident.title}</h2>
                        <p class="text-sm">${translation.severity}: ${incident.severity}</p>
                        <p class="text-sm">${translation.location}: ${incident.place || "Unknown"}</p>
                        <p class="text-sm">${translation.dateAndTime}: ${formattedDate} ${formattedTime}</p>
                        <p class="text-sm">${translation.daysSince}: <span class="font-bold text-lg">${daysSince}</span></p>
                    `;

                    incidentList.appendChild(incidentElement);
                });
            }, 3000);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Call the changeLanguage function to set the initial language
changeLanguage();
