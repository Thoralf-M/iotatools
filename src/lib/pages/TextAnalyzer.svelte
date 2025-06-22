<script lang="ts">
    let textContent: string = $state('');

    // Separate reactive variables for each metric to avoid derived state issues
    let totalChars = $derived(textContent.length);
    let totalCharsNoSpaces = $derived(textContent.replace(/\s/g, '').length);
    let totalLines = $derived(textContent.split('\n').length);
    let words = $derived(
        textContent
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0),
    );
    let totalWords = $derived(words.length);
    let paragraphs = $derived(textContent.split(/\n\s*\n/).filter((p) => p.trim().length > 0));
    let totalParagraphs = $derived(paragraphs.length);

    // Character analysis
    let commaCount = $derived((textContent.match(/,/g) || []).length);
    let uppercaseCount = $derived((textContent.match(/[A-Z]/g) || []).length);
    let lowercaseCount = $derived((textContent.match(/[a-z]/g) || []).length);
    let digitCount = $derived((textContent.match(/\d/g) || []).length);
    let whitespaceCount = $derived((textContent.match(/\s/g) || []).length);
    let specialChars = $derived(
        totalChars - uppercaseCount - lowercaseCount - digitCount - whitespaceCount,
    );

    // Number analysis
    let numberMatches = $derived(textContent.match(/\b\d+(\.\d+)?\b/g) || []);
    let numberCount = $derived(numberMatches.length);
    let numberList = $derived(numberMatches.map((n) => parseFloat(n)));

    // Bracket and quote pairs
    let roundBrackets = $derived(
        Math.min((textContent.match(/\(/g) || []).length, (textContent.match(/\)/g) || []).length),
    );
    let squareBrackets = $derived(
        Math.min((textContent.match(/\[/g) || []).length, (textContent.match(/\]/g) || []).length),
    );
    let curlyBrackets = $derived(
        Math.min((textContent.match(/\{/g) || []).length, (textContent.match(/\}/g) || []).length),
    );
    let singleQuotes = $derived(Math.floor((textContent.match(/'/g) || []).length / 2));
    let doubleQuotes = $derived(Math.floor((textContent.match(/"/g) || []).length / 2));
    let backticks = $derived(Math.floor((textContent.match(/`/g) || []).length / 2));

    // Word analysis
    let uniqueWords = $derived(new Set(words.map((w) => w.toLowerCase())).size);
    let avgWordsPerLine = $derived(
        totalLines > 0 ? Math.round((totalWords / totalLines) * 100) / 100 : 0,
    );
    let avgCharsPerWord = $derived(
        totalWords > 0 ? Math.round((totalCharsNoSpaces / totalWords) * 100) / 100 : 0,
    );
    let sortedWords = $derived(
        words.length > 0 ? [...words].sort((a, b) => a.length - b.length) : [],
    );
    let longestWord = $derived(sortedWords.length > 0 ? sortedWords[sortedWords.length - 1] : '');
    let shortestWord = $derived(sortedWords.length > 0 ? sortedWords[0] : '');

    // Validation metrics
    let validHex = $derived(
        (() => {
            const trimmed = textContent.trim();
            if (trimmed.length === 0) return false;
            // Allow hex with or without 0x prefix
            return /^(0x)?[0-9A-Fa-f]+$/.test(trimmed);
        })(),
    );

    let validBytes = $derived(
        (() => {
            const trimmed = textContent.trim();
            if (trimmed.length === 0) return false;
            // Check if it's a valid byte string (hex pairs or space/comma separated bytes)
            return (
                /^([0-9A-Fa-f]{2}[\s,]*)+$/.test(trimmed) ||
                /^(\d{1,3}[\s,]+)*\d{1,3}$/.test(trimmed.replace(/\s+/g, ' '))
            );
        })(),
    );

    // Format validation
    let jsonValid = $derived(
        (() => {
            try {
                JSON.parse(textContent.trim());
                return true;
            } catch {
                return false;
            }
        })(),
    );

    let base64Valid = $derived(
        (() => {
            try {
                if (textContent.trim().match(/^[A-Za-z0-9+/]*={0,2}$/)) {
                    atob(textContent.trim());
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        })(),
    );

    // Reading time
    let readingTime = $derived(totalWords > 0 ? Math.ceil(totalWords / 200) : 0);
</script>

<main>
    <div style="margin-bottom: 1em;">
        <textarea
            id="textInput"
            bind:value={textContent}
            placeholder="Paste your text here for analysis..."
            style="width: 98%; height: 150px; font-family: monospace; border: 1px solid #ccc; border-radius: 4px; padding: 0.5em;"
        ></textarea>
    </div>
    <div class="metrics-grid">
        <!-- Basic Metrics -->
        <div class="metric-box">
            <h3 class="metric-title">Basic Metrics</h3>
            <div class="metric-content">
                <div>Total Characters: <strong>{totalChars.toLocaleString()}</strong></div>
                <div>
                    Characters (no spaces): <strong>{totalCharsNoSpaces.toLocaleString()}</strong>
                </div>
                <div>Lines: <strong>{totalLines.toLocaleString()}</strong></div>
                <div>Words: <strong>{totalWords.toLocaleString()}</strong></div>
                <div>Paragraphs: <strong>{totalParagraphs.toLocaleString()}</strong></div>
                <div>Unique Words: <strong>{uniqueWords.toLocaleString()}</strong></div>
                <div>Reading Time: <strong>{readingTime} min</strong></div>
            </div>
        </div>

        <!-- Character Analysis -->
        <div class="metric-box">
            <h3 class="metric-title">Character Analysis</h3>
            <div class="metric-content">
                <div>Uppercase: <strong>{uppercaseCount.toLocaleString()}</strong></div>
                <div>Lowercase: <strong>{lowercaseCount.toLocaleString()}</strong></div>
                <div>Digits: <strong>{digitCount.toLocaleString()}</strong></div>
                <div>Whitespace: <strong>{whitespaceCount.toLocaleString()}</strong></div>
                <div>Special Characters: <strong>{specialChars.toLocaleString()}</strong></div>
                <div>Commas: <strong>{commaCount.toLocaleString()}</strong></div>
            </div>
        </div>

        <!-- Numbers & Patterns -->
        <div class="metric-box">
            <h3 class="metric-title">Numbers & Patterns</h3>
            <div class="metric-content">
                <div>Number Count: <strong>{numberCount.toLocaleString()}</strong></div>
                {#if numberList.length > 0}
                    <div>
                        Number Range: <strong
                            >{Math.min(...numberList)} - {Math.max(...numberList)}</strong
                        >
                    </div>
                    <div>
                        Number Sum: <strong
                            >{numberList.reduce((a, b) => a + b, 0).toLocaleString()}</strong
                        >
                    </div>
                {/if}
            </div>
        </div>

        <!-- Structure Analysis -->
        <div class="metric-box">
            <h3 class="metric-title">Structure Analysis</h3>
            <div class="metric-content">
                <div>Parentheses pairs: <strong>{roundBrackets}</strong></div>
                <div>Square brackets pairs: <strong>{squareBrackets}</strong></div>
                <div>Curly braces pairs: <strong>{curlyBrackets}</strong></div>
                <div>Single quote pairs: <strong>{singleQuotes}</strong></div>
                <div>Double quote pairs: <strong>{doubleQuotes}</strong></div>
                <div>Backtick pairs: <strong>{backticks}</strong></div>
            </div>
        </div>

        <!-- Averages & Extremes -->
        <div class="metric-box">
            <h3 class="metric-title">Averages & Extremes</h3>
            <div class="metric-content">
                <div>Avg words/line: <strong>{avgWordsPerLine}</strong></div>
                <div>Avg chars/word: <strong>{avgCharsPerWord}</strong></div>
                {#if totalWords > 0}
                    <div>
                        Longest word: <strong
                            >{longestWord.length > 10
                                ? longestWord.substring(0, 10) + '...'
                                : longestWord}</strong
                        >
                        ({longestWord.length} chars)
                    </div>
                    <div>
                        Shortest word: <strong
                            >{shortestWord.length > 10
                                ? shortestWord.substring(0, 10) + '...'
                                : shortestWord}</strong
                        >
                        ({shortestWord.length} chars)
                    </div>
                {:else}
                    <div>Longest word: <strong>-</strong></div>
                    <div>Shortest word: <strong>-</strong></div>
                {/if}
            </div>
        </div>

        <!-- Format Detection -->
        <div class="metric-box">
            <h3 class="metric-title">Format Detection</h3>
            <div class="metric-content">
                <div>
                    Valid JSON: <strong style="color: {jsonValid ? 'green' : 'red'};"
                        >{jsonValid ? 'Yes' : 'No'}</strong
                    >
                </div>
                <div>
                    Valid Base64: <strong style="color: {base64Valid ? 'green' : 'red'};"
                        >{base64Valid ? 'Yes' : 'No'}</strong
                    >
                </div>
                <div>
                    Valid Hex: <strong style="color: {validHex ? 'green' : 'red'};"
                        >{validHex ? 'Yes' : 'No'}</strong
                    >
                </div>
                <div>
                    Valid Bytes: <strong style="color: {validBytes ? 'green' : 'red'};"
                        >{validBytes ? 'Yes' : 'No'}</strong
                    >
                </div>
            </div>
        </div>
    </div>

    {#if numberList.length > 0 && numberList.length <= 20}
        <div class="metric-box">
            <h3 class="metric-title">Numbers Found</h3>
            <div class="metric-content" style="word-break: break-all;">
                {numberList.join(', ')}
            </div>
        </div>
    {/if}
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1em;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1em;
        margin-top: 1em;
    }

    .metric-box {
        border: 1px solid #545454;
        border-radius: 8px;
        padding: 1em;
        margin-top: 1em;
    }

    .metric-title {
        margin: 0 0 0.5em 0;
        color: #818181;
    }

    .metric-content {
        font-family: monospace;
    }
</style>
