document.addEventListener("DOMContentLoaded", start);
const url = "https://spreadsheets.google.com/feeds/list/1IkL13--O3Ree1nbc8UssMo-qGr_9FG60RnvlRYirgdk/od6/public/values?alt=json";
let alleData;
let filter = "forside";

function start() {
    const filterKnapper = document.querySelectorAll("nav button");
    filterKnapper.forEach(knap => knap.addEventListener("click", filtrerAlleData));
    document.querySelector("#detalje").style.display = "none";
    skjulDetalje();
    loadData();
}

function filtrerAlleData() {
    filter = this.dataset.data;
    document.querySelector(".valgt").classList.remove("valgt");
    this.classList.add("valgt");
    vis();
}

async function loadData() {
    const response = await fetch(url);
    alleData = await response.json();
    vis();
}

function vis() {

    const skabelon = document.querySelector("template").content;
    const dest = document.querySelector("#mad-liste");
    dest.textContent = "";
    alleData.feed.entry.forEach(data => {
        if (data.gsx$kategori.$t == filter || filter == "forside") {

            //klone skabelon
            const klon = skabelon.cloneNode(true);

            console.log(klon);
            const h2 = klon.querySelector("h2");
            h2.textContent = data.gsx$navn.$t;

            const img = klon.querySelector("img");
            img.src = "billeder/" + data.gsx$billede.$t + "";
            img.src = "billeder/" + data.gsx$billede.$t + "";
            img.alt = "Billede af" + data.gsx$navn.$t;

            const p1 = klon.querySelector("p");
            const p2 = klon.querySelector("p + p");
            const p3 = klon.querySelector("p + p + p");
            const p4 = klon.querySelector("p + p + p + p");


            dest.appendChild(klon);

            dest.lastElementChild.addEventListener("click", () => {
                visDetalje(data);
            });
        }
    });
}

//func. der viser person i detalje view
function visDetalje(data) {

    document.querySelector("#detalje").style.display = "block";

    document.querySelector("#detalje .luk").addEventListener("click", skjulDetalje);

    document.querySelector("#detalje h2").textContent = data.gsx$navn.$t;

    document.querySelector("#detalje img").src = "billeder/" + data.gsx$billede.$t;
    document.querySelector("#detalje img").alt = `Portræt af ${data.gsx$billede.$t}`;
    document.querySelector("#detalje p").textContent = data.gsx$kort.$t;
    document.querySelector("#detalje p + p").textContent = data.gsx$lang.$t;
    document.querySelector("#detalje p + p + p").textContent = data.gsx$adresse.$t;
    document.querySelector("#detalje p + p + p + p").textContent = data.gsx$bedømmelse.$t;





}

function skjulDetalje() {
    document.querySelector("#detalje").style.display = "none";
}
