
document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");

    try {
        const albumResponse = await fetch("http://localhost:5000/api/album", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        if (!albumResponse.ok) {
            throw new Error("Errore nel recupero dell'album");
        }

        const albumData = await albumResponse.json();

        albumContainer.innerHTML = "";

        albumData.figurine.forEach(hero => {
            const card = document.createElement("div");
            card.className = "col";

            card.innerHTML = `
                <div class="card shadow-sm ${hero.found ? "" : "opacity-50"}">
                    <img src="${hero.image}" class="card-img-top ${hero.found ? '' : 'blurred'}" alt="${hero.name}">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title">${hero.name}</h5>
                            ${hero.found && hero.count > 1 ? `<span class="badge bg-danger">x${hero.count}</span>` : ""}
                        </div>
                        ${hero.found ? `<button class="btn btn-info view-details" data-id="${hero.idMarvel}">🔍 Vedi dettagli</button>` : ""}
                    </div>
                </div>
            `;

            albumContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Errore nel recupero dell'album:", error);
    }
});





