document.getElementById("buy-pack-btn").addEventListener("click", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/album/buy-pack", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Errore nell'acquisto del pacchetto");
        }

        const data = await response.json();
        const packPreview = document.getElementById("pack-preview");
        const confirmPackBtn = document.getElementById("confirm-pack-btn");

        console.log("✅ Figurine trovate:", data.newFigurine);
        
        packPreview.innerHTML = "";
        data.newFigurine.forEach(figurina => {
            const card = document.createElement("div");
            card.className = "col";
            card.innerHTML = `
                <div class="card">
                    <img src="${figurina.image}" class="card-img-top" alt="${figurina.name}">
                    <div class="card-body">
                        <h5 class="card-title">${figurina.name}</h5>
                    </div>
                </div>
            `;
            packPreview.appendChild(card);
        });

        packPreview.classList.remove("d-none");
        confirmPackBtn.classList.remove("d-none");

    } catch (error) {
        console.error("❌ Errore:", error);
    }
});
