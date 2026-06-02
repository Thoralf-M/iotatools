import { b as sibling, i as if_block, g as get, t as template_effect, A as set_class, k as delegated, s as set, d as append, o as state, h as child, q as from_html, r as delegate } from "./index-uOmwErIb.js";
var root_1 = from_html(
  `<h1>Disclaimer</h1> <h2>1. General</h2> <p>This website ("iotatools.dev") is an experimental, open-source tool for interacting with
            the IOTA blockchain. It is provided "as is" and "as available" without warranty of any
            kind, express or implied. Use of this website is entirely at your own risk.</p> <h2>2. No Financial Advice</h2> <p>Nothing on this website constitutes financial, investment, legal, or tax advice. The
            information and tools provided are for informational and educational purposes only. You
            should consult a qualified professional before making any financial decisions.</p> <h2>3. Blockchain Data</h2> <p>Blockchain data displayed on this website is retrieved directly from public blockchain
            nodes and shown as-is. While we strive for accuracy, we make no guarantees regarding the
            completeness, correctness, or timeliness of the data. Network delays, node
            desynchronization, or other technical issues may cause inaccurate or outdated
            information to be displayed.</p> <h2>4. Transaction Irreversibility</h2> <p>Blockchain transactions are irreversible once confirmed. You are solely responsible for
            verifying all transaction details (recipient addresses, amounts, gas fees) before
            signing and submitting. The operators of this website cannot reverse, cancel, or modify
            any transaction.</p> <h2>5. Private Keys and Security</h2> <p>If you use the local key storage features, your private keys are stored exclusively in
            your browser's local storage. We never transmit or store your keys on any server.
            However, you are responsible for securing your own device and browser environment. We
            are not liable for any loss of funds due to compromised devices, phishing, or other
            security breaches.</p> <h2>6. Third-Party Services</h2> <p>This website may interact with third-party services, including but not limited to
            blockchain nodes, faucet endpoints, and hardware wallet interfaces. We are not
            responsible for the availability, accuracy, or security of these external services.</p> <h2>7. Limitation of Liability</h2> <p>To the fullest extent permitted by law, the operators of this website shall not be
            liable for any direct, indirect, incidental, consequential, or special damages arising
            from the use of or inability to use this website, including but not limited to loss of
            funds, data loss, or business interruption.</p> <h2>8. Experimental Software</h2> <p>This website is experimental software under active development. Features may change,
            break, or be removed without notice. Always verify critical operations independently and
            do not rely solely on this tool for important transactions.</p>`,
  1
);
var root_2 = from_html(
  `<h1>Haftungsausschluss</h1> <h2>1. Allgemeines</h2> <p>Diese Website ("iotatools.dev") ist ein experimentelles, quelloffenes Werkzeug zur
            Interaktion mit der IOTA-Blockchain. Sie wird "wie besehen" und "wie verfügbar" ohne
            jegliche ausdrückliche oder stillschweigende Gewährleistung bereitgestellt. Die Nutzung
            dieser Website erfolgt vollständig auf eigenes Risiko.</p> <h2>2. Keine Finanzberatung</h2> <p>Nichts auf dieser Website stellt eine Finanz-, Anlage-, Rechts- oder Steuerberatung dar.
            Die bereitgestellten Informationen und Werkzeuge dienen ausschließlich
            Informationszwecken und der Bildung. Sie sollten einen qualifizierten Fachberater
            konsultieren, bevor Sie finanzielle Entscheidungen treffen.</p> <h2>3. Blockchain-Daten</h2> <p>Die auf dieser Website angezeigten Blockchain-Daten werden direkt von öffentlichen
            Blockchain-Knoten abgerufen und unverändert dargestellt. Obwohl wir uns um Genauigkeit
            bemühen, übernehmen wir keine Garantie für die Vollständigkeit, Richtigkeit oder
            Aktualität der Daten. Netzwerkverzögerungen, Desynchronisation von Knoten oder andere
            technische Probleme können dazu führen, dass ungenaue oder veraltete Informationen
            angezeigt werden.</p> <h2>4. Unumkehrbarkeit von Transaktionen</h2> <p>Blockchain-Transaktionen sind nach der Bestätigung unwiderruflich. Sie sind allein dafür
            verantwortlich, alle Transaktionsdetails (Empfängeradressen, Beträge, Gasgebühren) vor
            dem Signieren und Absenden zu überprüfen. Die Betreiber dieser Website können keine
            Transaktionen rückgängig machen, stornieren oder ändern.</p> <h2>5. Private Schlüssel und Sicherheit</h2> <p>Wenn Sie die lokale Schlüsselspeicherung nutzen, werden Ihre privaten Schlüssel
            ausschließlich im lokalen Speicher Ihres Browsers gespeichert. Wir übertragen oder
            speichern Ihre Schlüssel niemals auf einem Server. Sie sind jedoch selbst für die
            Sicherung Ihres Geräts und Ihrer Browser-Umgebung verantwortlich. Wir haften nicht für
            den Verlust von Guthaben durch kompromittierte Geräte, Phishing oder andere
            Sicherheitsverletzungen.</p> <h2>6. Dienste Dritter</h2> <p>Diese Website kann mit Diensten Dritter interagieren, einschließlich, aber nicht
            beschränkt auf Blockchain-Knoten, Faucet-Endpunkte und Hardware-Wallet-Schnittstellen.
            Wir sind nicht verantwortlich für die Verfügbarkeit, Genauigkeit oder Sicherheit dieser
            externen Dienste.</p> <h2>7. Haftungsbeschränkung</h2> <p>Soweit gesetzlich zulässig, haften die Betreiber dieser Website nicht für direkte,
            indirekte, zufällige, Folge- oder besondere Schäden, die aus der Nutzung oder der
            Unmöglichkeit der Nutzung dieser Website entstehen, einschließlich, aber nicht
            beschränkt auf Verlust von Guthaben, Datenverlust oder Betriebsunterbrechung.</p> <h2>8. Experimentelle Software</h2> <p>Diese Website ist experimentelle Software in aktiver Entwicklung. Funktionen können sich
            ohne Vorankündigung ändern, fehlerhaft sein oder entfernt werden. Überprüfen Sie
            kritische Vorgänge stets unabhängig und verlassen Sie sich bei wichtigen Transaktionen
            nicht ausschließlich auf dieses Werkzeug.</p>`,
  1
);
var root = from_html(`<main><div class="lang-toggle svelte-16ofwrz"><button>English</button> <button>Deutsch</button></div> <!></main>`);
function Disclaimer($$anchor) {
  let lang = state("en");
  var main = root();
  var div = child(main);
  var button = child(div);
  let classes;
  var button_1 = sibling(button, 2);
  let classes_1;
  var node = sibling(div, 2);
  {
    var consequent = ($$anchor2) => {
      var fragment = root_1();
      append($$anchor2, fragment);
    };
    var alternate = ($$anchor2) => {
      var fragment_1 = root_2();
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if (get(lang) === "en") $$render(consequent);
      else $$render(alternate, -1);
    });
  }
  template_effect(() => {
    classes = set_class(button, 1, "svelte-16ofwrz", null, classes, { active: get(lang) === "en" });
    classes_1 = set_class(button_1, 1, "svelte-16ofwrz", null, classes_1, { active: get(lang) === "de" });
  });
  delegated("click", button, () => set(lang, "en"));
  delegated("click", button_1, () => set(lang, "de"));
  append($$anchor, main);
}
delegate(["click"]);
export {
  Disclaimer as default
};
