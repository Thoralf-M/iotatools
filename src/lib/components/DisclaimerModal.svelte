<script lang="ts">
    import { disclaimerAccepted } from '../utils/local-storage-store';

    let lang: 'en' | 'de' = $state('en');
</script>

{#if !$disclaimerAccepted}
    <div class="modal-overlay">
        <div
            class="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-title"
        >
            <div class="modal-header">
                <h3 id="disclaimer-title">{lang === 'en' ? 'Disclaimer' : 'Haftungsausschluss'}</h3>
                <div class="lang-toggle">
                    <button class:active={lang === 'en'} onclick={() => (lang = 'en')}>
                        English
                    </button>
                    <button class:active={lang === 'de'} onclick={() => (lang = 'de')}>
                        Deutsch
                    </button>
                </div>
            </div>

            <div class="modal-body">
                {#if lang === 'en'}
                    <p>
                        This website is an <strong>experimental tool</strong> for interacting with the
                        IOTA blockchain. By using this website, you acknowledge and agree to the following:
                    </p>
                    <ul>
                        <li>
                            <strong>No warranty:</strong> This software is provided "as is" without any
                            warranty. Use it at your own risk.
                        </li>
                        <li>
                            <strong>No financial advice:</strong> Nothing on this website constitutes
                            financial, investment, legal, or tax advice.
                        </li>
                        <li>
                            <strong>Blockchain data:</strong> Data is retrieved from public blockchain
                            nodes and displayed as-is. We make no guarantees about its accuracy or completeness.
                        </li>
                        <li>
                            <strong>Irreversible transactions:</strong> Blockchain transactions cannot
                            be reversed. You are solely responsible for verifying all transaction details
                            before signing.
                        </li>
                        <li>
                            <strong>Key security:</strong> If you use local key storage, your private
                            keys are stored only in your browser. You are responsible for securing your
                            device.
                        </li>
                        <li>
                            <strong>No liability:</strong> The operators shall not be liable for any damages
                            arising from the use of this website, including loss of funds.
                        </li>
                    </ul>
                {:else}
                    <p>
                        Diese Website ist ein <strong>experimentelles Werkzeug</strong> zur Interaktion
                        mit der IOTA-Blockchain. Durch die Nutzung dieser Website erkennen Sie Folgendes
                        an und stimmen zu:
                    </p>
                    <ul>
                        <li>
                            <strong>Keine Gewährleistung:</strong> Diese Software wird "wie besehen" ohne
                            jegliche Garantie bereitgestellt. Die Nutzung erfolgt auf eigenes Risiko.
                        </li>
                        <li>
                            <strong>Keine Finanzberatung:</strong> Nichts auf dieser Website stellt eine
                            Finanz-, Anlage-, Rechts- oder Steuerberatung dar.
                        </li>
                        <li>
                            <strong>Blockchain-Daten:</strong> Daten werden von öffentlichen Blockchain-Knoten
                            abgerufen und unverändert angezeigt. Wir übernehmen keine Garantie für deren
                            Richtigkeit oder Vollständigkeit.
                        </li>
                        <li>
                            <strong>Unumkehrbare Transaktionen:</strong> Blockchain-Transaktionen können
                            nicht rückgängig gemacht werden. Sie sind allein für die Überprüfung aller
                            Transaktionsdetails vor dem Signieren verantwortlich.
                        </li>
                        <li>
                            <strong>Schlüsselsicherheit:</strong> Bei Nutzung der lokalen Schlüsselspeicherung
                            werden Ihre privaten Schlüssel nur in Ihrem Browser gespeichert. Sie sind
                            für die Sicherung Ihres Geräts verantwortlich.
                        </li>
                        <li>
                            <strong>Keine Haftung:</strong> Die Betreiber haften nicht für Schäden, die
                            aus der Nutzung dieser Website entstehen, einschließlich Verlust von Guthaben.
                        </li>
                    </ul>
                {/if}
            </div>

            <div class="actions">
                <button class="agree-btn" onclick={() => disclaimerAccepted.set(true)}>
                    {lang === 'en' ? 'I Understand and Agree' : 'Ich verstehe und stimme zu'}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 5000;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .modal-content {
        width: min(640px, 96vw);
        max-height: 92vh;
        overflow: auto;
        background: rgba(22, 28, 39, 0.98);
        border: 1px solid rgba(59, 130, 246, 0.4);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .modal-header h3 {
        margin: 0;
        color: rgba(255, 255, 255, 0.95);
        font-size: 1.3rem;
    }

    .lang-toggle {
        display: flex;
        gap: 0.35rem;
    }

    .lang-toggle button {
        padding: 0.25rem 0.6rem;
        border: 1px solid rgba(156, 163, 175, 0.3);
        border-radius: 4px;
        background: rgba(55, 65, 81, 0.3);
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        font-size: 0.75rem;
        transition: all 0.2s ease;
    }

    .lang-toggle button.active {
        background: rgba(59, 130, 246, 0.2);
        border-color: rgba(59, 130, 246, 0.5);
        color: rgba(255, 255, 255, 0.95);
    }

    .modal-body {
        color: rgba(255, 255, 255, 0.85);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .modal-body ul {
        padding-left: 1.2rem;
        margin: 0.75rem 0;
    }

    .modal-body li {
        margin-bottom: 0.5rem;
    }

    .actions {
        display: flex;
        justify-content: center;
    }

    .agree-btn {
        padding: 0.7rem 2rem;
        border: 1px solid rgba(59, 130, 246, 0.5);
        border-radius: 8px;
        background: rgba(59, 130, 246, 0.2);
        color: rgba(255, 255, 255, 0.95);
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .agree-btn:hover {
        border-color: rgba(59, 130, 246, 0.8);
        background: rgba(59, 130, 246, 0.35);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
</style>
