

document.addEventListener("DOMContentLoaded", async () => {

    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    console.log("Token:", token); // Debug

    const albumContainer = document.getElementById("album-container");
    const emptyMessage = document.getElementById("empty-message");

    try {
        const response = await fetch("http://localhost:5000/api/album", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Invia il token al server
            }
        });


        console.log("Risposta ricevuta:", response); // Debug

        if (!response.ok) {
            const error = await response.json();
            console.error("Errore API:", error.message); // Log dell'errore API
            throw new Error("Errore nel caricamento dell'album");
        }

        const album = await response.json();

        console.log("Album ricevuto:", album); // Debug
        
        if (album.figurine.length === 0) {
            emptyMessage.classList.remove("d-none");
        } else {
            album.figurine.forEach(figurina => {
                const card = document.createElement("div");
                card.className = "col";
                card.innerHTML = `
                    <div class="card shadow-sm">
                        <img src="${figurina.image}" class="card-img-top" alt="${figurina.name}">
                        <div class="card-body">
                            <h5 class="card-title">${figurina.name}</h5>
                            <p class="card-text">${figurina.description || "Nessuna descrizione disponibile"}</p>
                            <a href="hero.html?id=${figurina.idMarvel}" class="btn btn-primary">Dettagli</a>
                        </div>
                    </div>
                `;
                albumContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Errore:", error);
        emptyMessage.textContent = "Errore nel caricamento dell'album.";
        emptyMessage.classList.remove("d-none");
    }
});
