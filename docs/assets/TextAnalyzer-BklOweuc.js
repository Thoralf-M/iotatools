import { p as push, f as from_html, s as sibling, c as child, O as state, b as if_block, g as get, V as user_derived, t as template_effect, d as set_text, J as set_style, E as bind_value, k as append, l as pop, G as first_child, j as set, W as delegate } from "/iota-utils/assets/index-Z8lfZefp.js";
var on_click = (_, textContent, limit) => {
  if (get(textContent).length > 0) {
    const repeatCount = Math.ceil(get(limit) / get(textContent).length);
    set(textContent, get(textContent).repeat(repeatCount).slice(0, get(limit)), true);
  }
};
var root_1 = from_html(`<span class="remaining-text svelte-12gcxyk">...</span>`);
var root_2 = from_html(`<span class="status-missing svelte-12gcxyk"> </span>`);
var root_3 = from_html(`<span class="status-more svelte-12gcxyk"> </span>`);
var root_4 = from_html(`<div>Number Range: <strong> </strong></div> <div>Number Sum: <strong> </strong></div>`, 1);
var root_5 = from_html(`<div>Longest word: <strong> </strong> </div> <div>Shortest word: <strong> </strong> </div>`, 1);
var root_6 = from_html(`<div>Longest word: <strong>-</strong></div> <div>Shortest word: <strong>-</strong></div>`, 1);
var root_7 = from_html(`<div class="metric-box svelte-12gcxyk"><h3 class="metric-title svelte-12gcxyk">Numbers Found</h3> <div class="metric-content svelte-12gcxyk" style="word-break: break-all;"> </div></div>`);
var root = from_html(`<main class="svelte-12gcxyk"><div class="text-input-container svelte-12gcxyk"><textarea id="textInput" placeholder="Paste your text here for analysis..." class="text-input svelte-12gcxyk"></textarea> <div class="controls svelte-12gcxyk"><label for="limitInput">Show first</label> <input id="limitInput" type="number" min="0" max="10000" class="limit-input svelte-12gcxyk"/> <span>chars:</span> <button class="repeat-button svelte-12gcxyk">Repeat to limit</button> <div class="preview-text svelte-12gcxyk"><span class="highlighted-text svelte-12gcxyk"> </span><!></div> <!> <!></div></div> <div class="metrics-grid svelte-12gcxyk"><div class="metric-box svelte-12gcxyk"><h3 class="metric-title svelte-12gcxyk">Basic Metrics</h3> <div class="metric-content svelte-12gcxyk"><div>Total Characters: <strong> </strong></div> <div>Characters (no spaces): <strong> </strong></div> <div>Lines: <strong> </strong></div> <div>Words: <strong> </strong></div> <div>Paragraphs: <strong> </strong></div> <div>Unique Words: <strong> </strong></div> <div>Reading Time: <strong> </strong></div></div></div> <div class="metric-box svelte-12gcxyk"><h3 class="metric-title svelte-12gcxyk">Character Analysis</h3> <div class="metric-content svelte-12gcxyk"><div>Uppercase: <strong> </strong></div> <div>Lowercase: <strong> </strong></div> <div>Digits: <strong> </strong></div> <div>Whitespace: <strong> </strong></div> <div>Special Characters: <strong> </strong></div> <div>Commas: <strong> </strong></div></div></div> <div class="metric-box svelte-12gcxyk"><h3 class="metric-title svelte-12gcxyk">Numbers & Patterns</h3> <div class="metric-content svelte-12gcxyk"><div>Number Count: <strong> </strong></div> <!></div></div> <div class="metric-box svelte-12gcxyk"><h3 class="metric-title svelte-12gcxyk">Structure Analysis</h3> <div class="metric-content svelte-12gcxyk"><div>Parentheses pairs: <strong> </strong></div> <div>Square brackets pairs: <strong> </strong></div> <div>Curly braces pairs: <strong> </strong></div> <div>Single quote pairs: <strong> </strong></div> <div>Double quote pairs: <strong> </strong></div> <div>Backtick pairs: <strong> </strong></div></div></div> <div class="metric-box svelte-12gcxyk"><h3 class="metric-title svelte-12gcxyk">Averages & Extremes</h3> <div class="metric-content svelte-12gcxyk"><div>Avg words/line: <strong> </strong></div> <div>Avg chars/word: <strong> </strong></div> <!></div></div> <div class="metric-box svelte-12gcxyk"><h3 class="metric-title svelte-12gcxyk">Format Detection</h3> <div class="metric-content svelte-12gcxyk"><div>Valid JSON: <strong> </strong></div> <div>Valid Base64: <strong> </strong></div> <div>Valid Hex: <strong> </strong></div> <div>Valid Bytes: <strong> </strong></div></div></div></div> <!></main>`);
function TextAnalyzer($$anchor, $$props) {
  push($$props, true);
  let textContent = state("");
  let limit = state(64);
  let totalChars = user_derived(() => get(textContent).length);
  let totalCharsNoSpaces = user_derived(() => get(textContent).replace(/\s/g, "").length);
  let totalLines = user_derived(() => get(textContent).split("\n").length);
  let words = user_derived(() => get(textContent).trim().split(/\s+/).filter((word) => word.length > 0));
  let totalWords = user_derived(() => get(words).length);
  let paragraphs = user_derived(() => get(textContent).split(/\n\s*\n/).filter((p) => p.trim().length > 0));
  let totalParagraphs = user_derived(() => get(paragraphs).length);
  let commaCount = user_derived(() => (get(textContent).match(/,/g) || []).length);
  let uppercaseCount = user_derived(() => (get(textContent).match(/[A-Z]/g) || []).length);
  let lowercaseCount = user_derived(() => (get(textContent).match(/[a-z]/g) || []).length);
  let digitCount = user_derived(() => (get(textContent).match(/\d/g) || []).length);
  let whitespaceCount = user_derived(() => (get(textContent).match(/\s/g) || []).length);
  let specialChars = user_derived(() => get(totalChars) - get(uppercaseCount) - get(lowercaseCount) - get(digitCount) - get(whitespaceCount));
  let numberMatches = user_derived(() => get(textContent).match(/\b\d+(\.\d+)?\b/g) || []);
  let numberCount = user_derived(() => get(numberMatches).length);
  let numberList = user_derived(() => get(numberMatches).map((n) => parseFloat(n)));
  let roundBrackets = user_derived(() => Math.min((get(textContent).match(/\(/g) || []).length, (get(textContent).match(/\)/g) || []).length));
  let squareBrackets = user_derived(() => Math.min((get(textContent).match(/\[/g) || []).length, (get(textContent).match(/\]/g) || []).length));
  let curlyBrackets = user_derived(() => Math.min((get(textContent).match(/\{/g) || []).length, (get(textContent).match(/\}/g) || []).length));
  let singleQuotes = user_derived(() => Math.floor((get(textContent).match(/'/g) || []).length / 2));
  let doubleQuotes = user_derived(() => Math.floor((get(textContent).match(/"/g) || []).length / 2));
  let backticks = user_derived(() => Math.floor((get(textContent).match(/`/g) || []).length / 2));
  let uniqueWords = user_derived(() => new Set(get(words).map((w) => w.toLowerCase())).size);
  let avgWordsPerLine = user_derived(() => get(totalLines) > 0 ? Math.round(get(totalWords) / get(totalLines) * 100) / 100 : 0);
  let avgCharsPerWord = user_derived(() => get(totalWords) > 0 ? Math.round(get(totalCharsNoSpaces) / get(totalWords) * 100) / 100 : 0);
  let sortedWords = user_derived(() => get(words).length > 0 ? [...get(words)].sort((a, b) => a.length - b.length) : []);
  let longestWord = user_derived(() => get(sortedWords).length > 0 ? get(sortedWords)[get(sortedWords).length - 1] : "");
  let shortestWord = user_derived(() => get(sortedWords).length > 0 ? get(sortedWords)[0] : "");
  let validHex = user_derived(() => (() => {
    const trimmed = get(textContent).trim();
    if (trimmed.length === 0) return false;
    return /^(0x)?[0-9A-Fa-f]+$/.test(trimmed);
  })());
  let validBytes = user_derived(() => (() => {
    const trimmed = get(textContent).trim();
    if (trimmed.length === 0) return false;
    return /^([0-9A-Fa-f]{2}[\s,]*)+$/.test(trimmed) || /^(\d{1,3}[\s,]+)*\d{1,3}$/.test(trimmed.replace(/\s+/g, " "));
  })());
  let jsonValid = user_derived(() => (() => {
    try {
      JSON.parse(get(textContent).trim());
      return true;
    } catch {
      return false;
    }
  })());
  let base64Valid = user_derived(() => (() => {
    try {
      if (get(textContent).trim().match(/^[A-Za-z0-9+/]*={0,2}$/)) {
        atob(get(textContent).trim());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  })());
  let readingTime = user_derived(() => get(totalWords) > 0 ? Math.ceil(get(totalWords) / 200) : 0);
  var main = root();
  var div = child(main);
  var textarea = child(div);
  var div_1 = sibling(textarea, 2);
  var input = sibling(child(div_1), 2);
  var button = sibling(input, 4);
  button.__click = [on_click, textContent, limit];
  var div_2 = sibling(button, 2);
  var span = child(div_2);
  var text = child(span);
  var node = sibling(span);
  {
    var consequent = ($$anchor2) => {
      var span_1 = root_1();
      append($$anchor2, span_1);
    };
    if_block(node, ($$render) => {
      if (get(textContent).length > get(limit)) $$render(consequent);
    });
  }
  var node_1 = sibling(div_2, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var span_2 = root_2();
      var text_1 = child(span_2);
      template_effect(() => set_text(text_1, `(${get(limit) - get(totalChars)} missing)`));
      append($$anchor2, span_2);
    };
    if_block(node_1, ($$render) => {
      if (get(totalChars) < get(limit) && get(totalChars) > 0) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var span_3 = root_3();
      var text_2 = child(span_3);
      template_effect(() => set_text(text_2, `(${get(totalChars) - get(limit)} more)`));
      append($$anchor2, span_3);
    };
    if_block(node_2, ($$render) => {
      if (get(totalChars) > get(limit)) $$render(consequent_2);
    });
  }
  var div_3 = sibling(div, 2);
  var div_4 = child(div_3);
  var div_5 = sibling(child(div_4), 2);
  var div_6 = child(div_5);
  var strong = sibling(child(div_6));
  var text_3 = child(strong);
  var div_7 = sibling(div_6, 2);
  var strong_1 = sibling(child(div_7));
  var text_4 = child(strong_1);
  var div_8 = sibling(div_7, 2);
  var strong_2 = sibling(child(div_8));
  var text_5 = child(strong_2);
  var div_9 = sibling(div_8, 2);
  var strong_3 = sibling(child(div_9));
  var text_6 = child(strong_3);
  var div_10 = sibling(div_9, 2);
  var strong_4 = sibling(child(div_10));
  var text_7 = child(strong_4);
  var div_11 = sibling(div_10, 2);
  var strong_5 = sibling(child(div_11));
  var text_8 = child(strong_5);
  var div_12 = sibling(div_11, 2);
  var strong_6 = sibling(child(div_12));
  var text_9 = child(strong_6);
  var div_13 = sibling(div_4, 2);
  var div_14 = sibling(child(div_13), 2);
  var div_15 = child(div_14);
  var strong_7 = sibling(child(div_15));
  var text_10 = child(strong_7);
  var div_16 = sibling(div_15, 2);
  var strong_8 = sibling(child(div_16));
  var text_11 = child(strong_8);
  var div_17 = sibling(div_16, 2);
  var strong_9 = sibling(child(div_17));
  var text_12 = child(strong_9);
  var div_18 = sibling(div_17, 2);
  var strong_10 = sibling(child(div_18));
  var text_13 = child(strong_10);
  var div_19 = sibling(div_18, 2);
  var strong_11 = sibling(child(div_19));
  var text_14 = child(strong_11);
  var div_20 = sibling(div_19, 2);
  var strong_12 = sibling(child(div_20));
  var text_15 = child(strong_12);
  var div_21 = sibling(div_13, 2);
  var div_22 = sibling(child(div_21), 2);
  var div_23 = child(div_22);
  var strong_13 = sibling(child(div_23));
  var text_16 = child(strong_13);
  var node_3 = sibling(div_23, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var fragment = root_4();
      var div_24 = first_child(fragment);
      var strong_14 = sibling(child(div_24));
      var text_17 = child(strong_14);
      var div_25 = sibling(div_24, 2);
      var strong_15 = sibling(child(div_25));
      var text_18 = child(strong_15);
      template_effect(
        ($0, $1, $2) => {
          set_text(text_17, `${$0 ?? ""} - ${$1 ?? ""}`);
          set_text(text_18, $2);
        },
        [
          () => Math.min(...get(numberList)),
          () => Math.max(...get(numberList)),
          () => get(numberList).reduce((a, b) => a + b, 0).toLocaleString()
        ]
      );
      append($$anchor2, fragment);
    };
    if_block(node_3, ($$render) => {
      if (get(numberList).length > 0) $$render(consequent_3);
    });
  }
  var div_26 = sibling(div_21, 2);
  var div_27 = sibling(child(div_26), 2);
  var div_28 = child(div_27);
  var strong_16 = sibling(child(div_28));
  var text_19 = child(strong_16);
  var div_29 = sibling(div_28, 2);
  var strong_17 = sibling(child(div_29));
  var text_20 = child(strong_17);
  var div_30 = sibling(div_29, 2);
  var strong_18 = sibling(child(div_30));
  var text_21 = child(strong_18);
  var div_31 = sibling(div_30, 2);
  var strong_19 = sibling(child(div_31));
  var text_22 = child(strong_19);
  var div_32 = sibling(div_31, 2);
  var strong_20 = sibling(child(div_32));
  var text_23 = child(strong_20);
  var div_33 = sibling(div_32, 2);
  var strong_21 = sibling(child(div_33));
  var text_24 = child(strong_21);
  var div_34 = sibling(div_26, 2);
  var div_35 = sibling(child(div_34), 2);
  var div_36 = child(div_35);
  var strong_22 = sibling(child(div_36));
  var text_25 = child(strong_22);
  var div_37 = sibling(div_36, 2);
  var strong_23 = sibling(child(div_37));
  var text_26 = child(strong_23);
  var node_4 = sibling(div_37, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var fragment_1 = root_5();
      var div_38 = first_child(fragment_1);
      var strong_24 = sibling(child(div_38));
      var text_27 = child(strong_24);
      var text_28 = sibling(strong_24);
      var div_39 = sibling(div_38, 2);
      var strong_25 = sibling(child(div_39));
      var text_29 = child(strong_25);
      var text_30 = sibling(strong_25);
      template_effect(
        ($0, $1) => {
          set_text(text_27, $0);
          set_text(text_28, ` (${get(longestWord).length ?? ""} chars)`);
          set_text(text_29, $1);
          set_text(text_30, ` (${get(shortestWord).length ?? ""} chars)`);
        },
        [
          () => get(longestWord).length > 10 ? get(longestWord).substring(0, 10) + "..." : get(longestWord),
          () => get(shortestWord).length > 10 ? get(shortestWord).substring(0, 10) + "..." : get(shortestWord)
        ]
      );
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root_6();
      append($$anchor2, fragment_2);
    };
    if_block(node_4, ($$render) => {
      if (get(totalWords) > 0) $$render(consequent_4);
      else $$render(alternate, false);
    });
  }
  var div_40 = sibling(div_34, 2);
  var div_41 = sibling(child(div_40), 2);
  var div_42 = child(div_41);
  var strong_26 = sibling(child(div_42));
  var text_31 = child(strong_26);
  var div_43 = sibling(div_42, 2);
  var strong_27 = sibling(child(div_43));
  var text_32 = child(strong_27);
  var div_44 = sibling(div_43, 2);
  var strong_28 = sibling(child(div_44));
  var text_33 = child(strong_28);
  var div_45 = sibling(div_44, 2);
  var strong_29 = sibling(child(div_45));
  var text_34 = child(strong_29);
  var node_5 = sibling(div_3, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_46 = root_7();
      var div_47 = sibling(child(div_46), 2);
      var text_35 = child(div_47);
      template_effect(($0) => set_text(text_35, $0), [() => get(numberList).join(", ")]);
      append($$anchor2, div_46);
    };
    if_block(node_5, ($$render) => {
      if (get(numberList).length > 0 && get(numberList).length <= 20) $$render(consequent_5);
    });
  }
  template_effect(
    ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) => {
      button.disabled = get(textContent).length === 0;
      set_text(text, $0);
      set_text(text_3, $1);
      set_text(text_4, $2);
      set_text(text_5, $3);
      set_text(text_6, $4);
      set_text(text_7, $5);
      set_text(text_8, $6);
      set_text(text_9, `${get(readingTime) ?? ""} min`);
      set_text(text_10, $7);
      set_text(text_11, $8);
      set_text(text_12, $9);
      set_text(text_13, $10);
      set_text(text_14, $11);
      set_text(text_15, $12);
      set_text(text_16, $13);
      set_text(text_19, get(roundBrackets));
      set_text(text_20, get(squareBrackets));
      set_text(text_21, get(curlyBrackets));
      set_text(text_22, get(singleQuotes));
      set_text(text_23, get(doubleQuotes));
      set_text(text_24, get(backticks));
      set_text(text_25, get(avgWordsPerLine));
      set_text(text_26, get(avgCharsPerWord));
      set_style(strong_26, `color: ${get(jsonValid) ? "green" : "red"};`);
      set_text(text_31, get(jsonValid) ? "Yes" : "No");
      set_style(strong_27, `color: ${get(base64Valid) ? "green" : "red"};`);
      set_text(text_32, get(base64Valid) ? "Yes" : "No");
      set_style(strong_28, `color: ${get(validHex) ? "green" : "red"};`);
      set_text(text_33, get(validHex) ? "Yes" : "No");
      set_style(strong_29, `color: ${get(validBytes) ? "green" : "red"};`);
      set_text(text_34, get(validBytes) ? "Yes" : "No");
    },
    [
      () => get(textContent).slice(0, get(limit)),
      () => get(totalChars).toLocaleString(),
      () => get(totalCharsNoSpaces).toLocaleString(),
      () => get(totalLines).toLocaleString(),
      () => get(totalWords).toLocaleString(),
      () => get(totalParagraphs).toLocaleString(),
      () => get(uniqueWords).toLocaleString(),
      () => get(uppercaseCount).toLocaleString(),
      () => get(lowercaseCount).toLocaleString(),
      () => get(digitCount).toLocaleString(),
      () => get(whitespaceCount).toLocaleString(),
      () => get(specialChars).toLocaleString(),
      () => get(commaCount).toLocaleString(),
      () => get(numberCount).toLocaleString()
    ]
  );
  bind_value(textarea, () => get(textContent), ($$value) => set(textContent, $$value));
  bind_value(input, () => get(limit), ($$value) => set(limit, $$value));
  append($$anchor, main);
  pop();
}
delegate(["click"]);
export {
  TextAnalyzer as default
};
