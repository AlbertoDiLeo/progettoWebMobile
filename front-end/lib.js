
function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

//function setLocalStorage(chiave, valore){
    //  localStorage.setItem(chiave, JSON.stringify(valore))
//}

function setLocalStorage(chiave, valore){
    localStorage.setItem(chiave, valore);
}



function getLocalStorage(chiave){
    return JSON.parse(localStorage.getItem(chiave))
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');

    // Se l'elemento non esiste, esci dalla funzione
    if (!notification) return;

    // Se è la prima volta che viene chiamata, svuota e prepara il contenitore
    if (!notification.dataset.initialized) {
        notification.innerHTML = "<ul class='mb-0'></ul>";
        notification.dataset.initialized = "true";
    }

    // Rimuove le classi precedenti e imposta il tipo di alert
    notification.className = 'alert alert-dismissible fade show';
    notification.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');

    // Recupera la lista UL e aggiunge il nuovo messaggio
    const messageList = notification.querySelector("ul");
    const newMessage = document.createElement("li");
    newMessage.textContent = message;
    messageList.appendChild(newMessage);

    // Mostra l'alert
    notification.classList.remove('d-none');

    // Resetta il timer per nascondere la notifica dopo 5 secondi
    clearTimeout(notification.hideTimeout);
    notification.hideTimeout = setTimeout(() => {
        notification.classList.add('d-none');
        notification.dataset.initialized = ""; // Reset per la prossima volta
    }, 5000);
}


let debounceTimer; // Per evitare troppe chiamate API

async function checkUsernameAvailability(name) {
    clearTimeout(debounceTimer); // Reset del timer

    // Controlli iniziali per evitare chiamate inutili
    if (!name) {
        updateUsernameFeedback("", ""); // Reset messaggio se l'input è vuoto
        return;
    }
    if (name.length < 3) {
        updateUsernameFeedback("⚠️ Il nome deve essere di almeno 3 caratteri.", "warning");
        return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
        updateUsernameFeedback("❌ Il nome può contenere solo lettere e numeri.", "danger");
        return;
    }

    // Evita chiamate API se l'utente continua a digitare rapidamente (debounce di 500ms)
    debounceTimer = setTimeout(async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/check-username/${name}`);
            const data = await response.json();

            if (data.available) {
                updateUsernameFeedback("✅ Nome disponibile!", "success");
            } else {
                updateUsernameFeedback("❌ Nome già in uso! Scegline un altro.", "danger");
            }
        } catch (error) {
            console.error("Errore nel controllo del nome utente:", error);
            updateUsernameFeedback("⚠️ Errore nel controllo del nome. Riprova.", "danger");
        }
    }, 500); // Attende 500ms prima di eseguire la chiamata API
}


function updateUsernameFeedback(message, type) {
    const feedbackElement = document.getElementById("usernameFeedback");

    if (!feedbackElement) return; // Se non esiste l'elemento, esci

    feedbackElement.textContent = message;
    feedbackElement.className = ""; // Reset classi
    feedbackElement.classList.add("mt-1"); // Margine sopra

    if (type === "success") {
        feedbackElement.classList.add("text-success"); // Verde
    } else if (type === "danger") {
        feedbackElement.classList.add("text-danger"); // Rosso
    } else if (type === "warning") {
        feedbackElement.classList.add("text-warning"); // Giallo
    }
}







function checkPasswordStrength(password) {
    const feedbackElement = document.getElementById("passwordFeedback");

    if (!feedbackElement) return; // Se l'elemento non esiste, esci

    if (password.length < 3) {
        feedbackElement.textContent = ""; // Nessun feedback prima di 3 caratteri
        return;
    }

    let strength = 0;
    let suggestion = "";

    // Controlli progressivi
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        suggestion = "Password debole. Aggiungi almeno una lettera maiuscola.";
    }

    if (/\d/.test(password)) {
        strength += 1;
    } else if (strength === 1) {
        suggestion = "Password debole. Aggiungi almeno un numero.";
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 1;
    } else if (strength === 2) {
        suggestion = "Password moderata. Aggiungi almeno un carattere speciale (!@#$%^&*).";
    }

    if (password.length >= 8) {
        strength += 1;
    } else if (strength === 3) {
        suggestion = "Password moderata. Usa almeno 8 caratteri.";
    }

    // Cambiamo il messaggio in base alla sicurezza della password
    feedbackElement.className = "form-text mt-1"; // Reset classi

    if (strength === 4) {
        feedbackElement.textContent = "✅ Password Sicura!";
        feedbackElement.classList.add("text-success"); 
    } else if (strength >= 2) {
        feedbackElement.textContent = suggestion;
        feedbackElement.classList.add("text-warning"); 
    } else {
        feedbackElement.textContent = suggestion;
        feedbackElement.classList.add("text-danger"); 
    }
}



function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash"); // Cambia l'icona
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye"); // Ripristina l'icona originale
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("confirmLogout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Rimuove il token di autenticazione
            localStorage.removeItem("token");

            // Reindirizza alla pagina di login dopo il logout
            window.location.href = "login.html";
        });
    }
});
  

function getFromMarvel(url, query=""){
    var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
    var timestamp = Date.now();
    var publicApiKey = "ae3722da329ca6192752b69bf1949849"
    var privateApiKey = "28b93c8575a58b679760cc6693fa070460753c47"
    //var publicApiKey = "b620e750d0cfcaa8ff3b70679002bd0b"
    //var privateApiKey = "afe0fa822ec6013974fe93dcbbee931147b02a24"
    var parameters = `ts=${timestamp}&apikey=${publicApiKey}&hash=${MD5(timestamp+privateApiKey+publicApiKey)}&`
  
    return fetch(`http://gateway.marvel.com/v1/${url}?${parameters}${query}`)
    .then(response => response.json())
    .catch(error => console.log('error', error));
  }
  
function getRandomInt(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;
}
  