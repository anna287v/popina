document.addEventListener("DOMContentLoaded", start);
const url = "https://spreadsheets.google.com/feeds/list/1IkL13--O3Ree1nbc8UssMo-qGr_9FG60RnvlRYirgdk/od6/public/values?alt=json";
//en konstant variabel - det i gåseøjne angiver hvad man vil hente ned
let alleData;
let filter = "forside";

function start() {
    const filterKnapper = document.querySelectorAll("nav button"); //selector all - vælger alle buttons inde i nav'en
    filterKnapper.forEach(knap => knap.addEventListener("click", filtrerAlleData)); //knap er vores variabel navn, som man selv finder på
    document.querySelector("#detalje").style.display = "none";
    skjulDetalje(); //kaldes på funtionen skulDetalje, da pop-up vinduet ikke skal vises i funktionen start
    loadData(); //kaldet på funtionen loadData, da dataen skal loades fra sheetet
}

//funktionen der filtrerer data fra vores sheet (json)
function filtrerAlleData() {
    filter = this.dataset.data; //sæt variabel "filter" til aktuel værdi
    document.querySelector(".valgt").classList.remove("valgt"); //fjern klassen valgt fra aktuel knap
    this.classList.add("valgt");
    vis(); //kald funktionen vis igen med nyt filter
}

//en variabel som kan indeholde den materiale vi henter ned
async function loadData() {
    const response = await fetch(url);
    alleData = await response.json(); //her henter vi dataen fra sheetet og sætter sespons ind i alleData array'et
    vis(); //kald funktionen vis
}

function splash() {


}

function vis() { //den funktion der bliver kaldt, når selve siden skal vises

    const skabelon = document.querySelector("template").content;
    const dest = document.querySelector("#mad-liste");
    dest.textContent = ""; //twxtContent bruges til rene tekster
    alleData.feed.entry.forEach(data => { //loop igennem json data
        if (data.gsx$kategori.$t == filter || filter == "forside") { //tjek hvilken kategori spisestedet har og sammenlign med filter og vis alle

            //klone skabelon
            const klon = skabelon.cloneNode(true);

            console.log(klon);
            const h2 = klon.querySelector("h2");
            h2.textContent = data.gsx$navn.$t; //overskrift på restaurant - hentes fra sheet

            const img = klon.querySelector("img");
            img.src = "billeder/" + data.gsx$billede.$t + ""; //kalder på billeder fra mappen + parrer dem med billeddata fra sheetet
            img.alt = "Billede af" + data.gsx$navn.$t; //navn på restaurant der hører til billede - data hentet fra sheetet

            const p1 = klon.querySelector("p"); //vores første linje tekst - p
            const p2 = klon.querySelector("p + p"); //vores anden linje tekst - p
            const p3 = klon.querySelector("p + p + p"); //vores tredje linje tekst - p
            const p4 = klon.querySelector("p + p + p + p"); //vores fjerde linje tekst - p


            dest.appendChild(klon); //append child bruges til html tilføjelser

            dest.lastElementChild.addEventListener("click", () => {
                visDetalje(data); //her er click det event der skal ske - sætningen ovenover er en array function
            });
        }
    });
}

//func. der viser restauranterne i detalje view
function visDetalje(data) {

    document.querySelector("#detalje").style.display = "block";

    document.querySelector("#detalje .luk").addEventListener("click", skjulDetalje); //funktion der får pop-up vinduet til at lukke igen

    document.querySelector("#detalje h2").textContent = data.gsx$navn.$t; //overskrift i pop-up - hentes fra sheet

    document.querySelector("#detalje img").src = "billeder/" + data.gsx$billede.$t; //billedet i pop-up - hentes fra sheet
    document.querySelector("#detalje img").alt = `Portræt af ${data.gsx$billede.$t}`;
    document.querySelector("#detalje p").textContent = data.gsx$kort.$t; //kort tekst om restaurant i pop-up - hentes fra sheet
    document.querySelector("#detalje p + p").textContent = data.gsx$lang.$t; //lang tekst om restaurant i pop-up - hentes fra sheet
    document.querySelector("#detalje p + p + p").textContent = data.gsx$adresse.$t; //adresse på restaurant - hentes fra sheet
    document.querySelector("#detalje p + p + p + p").textContent = data.gsx$bedømmelse.$t; //stjernebedømmelse - hentes fra sheet
}

function skjulDetalje() { //når pop-up vinduet er lukket, kaldes der på selve sitet
    document.querySelector("#detalje").style.display = "none";
}
