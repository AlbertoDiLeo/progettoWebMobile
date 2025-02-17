

document.addEventListener("DOMContentLoaded", async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const heroId = queryParams.get("id");

    if (!heroId) {
        document.body.innerHTML = "<div class='container'><h3>Errore: Nessun ID specificato</h3></div>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/marvel/hero/${heroId}`);
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
    //document.body.style.backgroundImage = `url(${hero.image})`;
    document.body.style.backgroundImage = `url('/front-end/images/background.jpg')`;
    riempiLista("hero-series", hero.series);
    riempiLista("hero-events", hero.events);
    riempiLista("hero-comics", hero.comics);
}

function riempiLista(idLista, elementi) {
    const lista = document.getElementById(idLista);
    lista.innerHTML = "";

    if (elementi.length === 0) {
        lista.innerHTML = "<p class='text-center'>Nessun dato disponibile</p>";
        return;
    }

    elementi.forEach(elemento => {
        const div = document.createElement("div");
        div.className = "p-2 bg-dark text-white rounded my-2 text-center";
        div.textContent = elemento;
        lista.appendChild(div);
    });
}

function goBack() {
    window.history.back();
}