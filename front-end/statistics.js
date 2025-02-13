
document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/album", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Errore nel recupero dell'album");
        }

        const albumData = await response.json();
        const figurine = albumData.figurine;

        // Recupera il numero totale di figurine possibili (100 nel tuo caso)
        const totalFigurines = 100;

        // Conta le figurine trovate
        const foundFigurines = figurine.filter(hero => hero.found).length;

        // Conta le figurine mancanti
        const missingFigurines = totalFigurines - foundFigurines;

        // Calcola la percentuale di completamento
        const completionPercentage = ((foundFigurines / totalFigurines) * 100).toFixed(2);

        // Conta il numero totale di doppioni
        const totalDuplicates = figurine.reduce((acc, hero) => acc + (hero.count - 1 > 0 ? hero.count - 1 : 0), 0);

        // Percentuale di doppioni (ha senso?) forse è meglio doppione *100/totaletrovate+doppione
        const duplicatePercentage = foundFigurines > 0 ? ((totalDuplicates / foundFigurines) * 100).toFixed(2) : 0;

        // Recupera il numero totale di pacchetti aperti (ogni pacchetto ha 5 figurine)
        const packsOpened = Math.floor(figurine.reduce((acc, hero) => acc + hero.count, 0) / 5);

        // Trova il supereroe più trovato
        const mostFoundHero = figurine.reduce((max, hero) => (hero.count > max.count ? hero : max), { name: "Nessuno", count: 0 });

        // Trova il supereroe più raro (il minimo tra quelli trovati almeno una volta)
        const foundFigurinesList = figurine.filter(hero => hero.found);
        const rarestHero = foundFigurinesList.length > 0 
            ? foundFigurinesList.reduce((min, hero) => (hero.count < min.count ? hero : min), foundFigurinesList[0]) 
            : { name: "Nessuno", count: 0 };

        // Trova l'ultima figurina trovata
        const lastFoundHero = figurine.length > 0 ? figurine[figurine.length - 1] : { name: "Nessuno" };

        // Aggiorna il DOM con i dati calcolati
        document.getElementById("completion").textContent = completionPercentage;
        document.getElementById("found").textContent = foundFigurines;
        document.getElementById("missing").textContent = missingFigurines;
        document.getElementById("duplicates").textContent = totalDuplicates;
        document.getElementById("duplicate-percentage").textContent = duplicatePercentage;
        document.getElementById("packs-opened").textContent = packsOpened;
        document.getElementById("most-found").textContent = mostFoundHero.name + " (x" + mostFoundHero.count + ")";
        document.getElementById("rarest").textContent = rarestHero.name + " (x" + rarestHero.count + ")";
        document.getElementById("last-found").textContent = lastFoundHero.name;
    
    } catch (error) {
        console.error("Errore nel calcolo delle statistiche:", error);
    }
});

