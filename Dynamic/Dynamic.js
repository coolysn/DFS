/**
 *  Sisend:
 *    1. real: tehingute arv N (1 ≤ N ≤ 10000)
 *    2. real: N täisarvu – iga tehingu kasum või kahjum
 * */

//vaatame läbi kõikvõimalikud lõigud
// Iga algusindeksi i jaoks liidame järjest elemente kuni lõpuni ja
// jätame meelde suurima nähtud summa.
function joumeetod(a) {
    let parim = 0; // 0, sest kui kasumlikku lõiku pole, on vastus 0
    for (let i = 0; i < a.length; i++) {
        let summa = 0;
        for (let j = i; j < a.length; j++) {
            summa += a[j];
            parim = Math.max(parim, summa);
        }
    }
    return parim;
}

// Alamprobleem: dp[i] = suurim summa lõigul, mis LÕPEB täpselt kohal i.
//
// Iga uue elemendi juures on kaks võimalust:
//   a) pikendada eelmist lõiku:  dp[i-1] + a[i]
//   b) alustada siit uut lõiku:  a[i]
// Valime suurema
//
// Vastus = max(0, suurim dp[i]), sest parim lõik lõpeb KUSAGIL.
// Keerukus: aeg O(N), mälu O(N).
function dpTabeliga(a) {
    const dp = new Array(a.length);
    dp[0] = a[0];
    let parim = dp[0];

    for (let i = 1; i < a.length; i++) {
        dp[i] = Math.max(a[i], dp[i - 1] + a[i]);
        parim = Math.max(parim, dp[i]);
    }
    return { vastus: Math.max(0, parim), tabel: dp };
}

// Kadane'i algoritm
// dp[i] arvutamiseks on vaja ainult dp[i-1], seega pole kogu tabelit
// vaja hoida – piisab ühest muutujast
//
// Kui alustame praegune = 0, siis max(x, 0 + x) = x, st esimene samm
// toimib automaatselt õigesti ja vastus ei lähe kunagi alla 0.
//
// Keerukus: aeg O(N), mälu O(1).
function kokkuhoidlikDP(a) {
    let praegune = 0; // parim summa lõigul, mis lõpeb praegusel kohal
    let parim = 0;    // parim summa üldse (vähemalt 0)
    for (const x of a) {
        praegune = Math.max(x, praegune + x);
        parim = Math.max(parim, praegune);
    }
    return parim;
}

// LISA: lõigu taastamine
// Peale summa tahame teada ka, MILLISED tehingud lõiku kuuluvad.
// Selleks jätame meelde, kust praegune lõik algas, ja iga kord, kui
// leiame uue parima summa, salvestame selle lõigu alguse ja lõpu.
function leiaLoik(a) {
    let praegune = 0, parim = 0;
    let algus = 0, parimAlgus = 0, parimLopp = -1;

    for (let i = 0; i < a.length; i++) {
        if (praegune + a[i] < a[i]) { // eelmine summa oli negatiivne
            praegune = a[i];          // -> alustame uut lõiku
            algus = i;
        } else {
            praegune += a[i];         // -> pikendame lõiku
        }
        if (praegune > parim) {
            parim = praegune;
            parimAlgus = algus;
            parimLopp = i;
        }
    }
    return { summa: parim, loik: a.slice(parimAlgus, parimLopp + 1) };
}

function trykiTabel(a) {
    const { tabel } = dpTabeliga(a);
    let parim = -Infinity;
    console.log("  i |   a[i] |  dp[i] | parim seni | märkus");
    console.log("----+--------+--------+------------+--------------");
    for (let i = 0; i < a.length; i++) {
        parim = Math.max(parim, tabel[i]);
        const uus = i > 0 && tabel[i] === a[i] && tabel[i - 1] < 0;
        console.log(
            String(i).padStart(3) + " | " +
            String(a[i]).padStart(6) + " | " +
            String(tabel[i]).padStart(6) + " | " +
            String(parim).padStart(10) + " | " +
            (uus ? "uus algus" : "")
        );
    }
}

// TESTID
function testid() {
    const juhud = [
        { a: [12, -4, -10, 4, 9], oodatav: 13 },
        {
            a: [-896, 995, -588, -23, 648, -980, 51, -705, -620, -640,
                915, 663, 444, 307, -207, 81, -763, -993, 24, 665],
            oodatav: 2329
        },
        { a: [-5, -1, -3], oodatav: 0 },  // kasumlikke tehinguid pole
        { a: [7], oodatav: 7 },           // üks tehing
        { a: [3, -1, 3], oodatav: 5 },    // väike miinus tasub läbida
    ];

    for (const { a, oodatav } of juhud) {
        const v1 = joumeetod(a);
        const v2 = dpTabeliga(a).vastus;
        const v3 = kokkuhoidlikDP(a);
        const { summa, loik } = leiaLoik(a);
        const ok = [v1, v2, v3, summa].every(v => v === oodatav);
        console.log(
            (ok ? "OK  " : "VIGA") +
            ` [${a.length > 6 ? a.slice(0, 6).join(", ") + ", ..." : a.join(", ")}]` +
            ` -> ${v3} (oodatav ${oodatav}), lõik: [${loik.join(", ")}]`
        );
    }

    console.log("\nDP tabel näite 1 jaoks:");
    trykiTabel([12, -4, -10, 4, 9]);
}

testid();
