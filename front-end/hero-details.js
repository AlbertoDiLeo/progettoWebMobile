

document.addEventListener("DOMContentLoaded", async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const heroId = queryParams.get("id");

    if (!heroId) {
        document.body.innerHTML = "<div class='container'><h3>Errore: Nessun ID specificato</h3></div>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/hero/${heroId}`);
        if (!response.ok) throw new Error("Errore nel recupero dei dettagli");

        const hero = await response.json();
        mostraDettagli(hero);
    } catch (error) {
        console.error("Errore:", error);
        document.body.innerHTML = "<div class='container'><h3>Errore nel caricamento del supereroe</h3></div>";
    }
});

function mostraDettagli(hero) {
    document.getElementById("hero-name").textContent = hero.name;
    document.getElementById("hero-image").src = hero.image;
    document.getElementById("hero-description").textContent = hero.description || "Nessuna descrizione disponibile.";

    riempiLista("hero-series", hero.series);
    riempiLista("hero-events", hero.events);
    riempiLista("hero-comics", hero.comics);
}

function riempiLista(idLista, elementi) {
    const lista = document.getElementById(idLista);
    lista.innerHTML = "";

    if (elementi.length === 0) {
        lista.innerHTML = "<li class='list-group-item'>Nessun dato disponibile</li>";
        return;
    }

    elementi.forEach(elemento => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = elemento;
        lista.appendChild(li);
    });
}

function goBack() {
    window.history.back();
}
