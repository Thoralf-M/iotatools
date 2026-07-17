import { Dt as pop, E as set_style, I as if_block, Mt as reset, Ot as push, R as set_text, U as delegate, V as from_html, W as delegated, Y as get, _t as remove_textarea_child, ct as sibling, ft as set, gt as user_derived, h as bind_value, it as template_effect, jt as next, ot as child, pt as state, st as first_child, v as remove_input_defaults, z as append } from "./disclose-version-CpEJO7r1.js";
//#region src/lib/pages/text-analyzer/TextAnalyzer.svelte
var root = from_html(`<span class="remaining-text svelte-pkncbu">...</span>`);
var root_1 = from_html(`<span class="status-missing svelte-pkncbu"> </span>`);
var root_2 = from_html(`<span class="status-more svelte-pkncbu"> </span>`);
var root_3 = from_html(`<div>Number Range: <strong> </strong></div> <div>Number Sum: <strong> </strong></div>`, 1);
var root_4 = from_html(`<div>Longest word: <strong> </strong> </div> <div>Shortest word: <strong> </strong> </div>`, 1);
var root_5 = from_html(`<div>Longest word: <strong>-</strong></div> <div>Shortest word: <strong>-</strong></div>`, 1);
var root_6 = from_html(`<div class="metric-box svelte-pkncbu"><h3 class="metric-title svelte-pkncbu">Numbers Found</h3> <div class="metric-content svelte-pkncbu" style="word-break: break-all;"> </div></div>`);
var root_7 = from_html(`<main class="svelte-pkncbu"><div class="text-input-container svelte-pkncbu"><textarea id="textInput" placeholder="Paste your text here for analysis..." class="text-input svelte-pkncbu"></textarea> <div class="controls svelte-pkncbu"><label for="limitInput">Show first</label> <input id="limitInput" type="number" min="0" max="10000" class="limit-input svelte-pkncbu"/> <span>chars:</span> <button class="repeat-button svelte-pkncbu">Repeat to limit</button> <div class="preview-text svelte-pkncbu"><span class="highlighted-text svelte-pkncbu"> </span><!></div> <!> <!></div></div> <div class="metrics-grid svelte-pkncbu"><div class="metric-box svelte-pkncbu"><h3 class="metric-title svelte-pkncbu">Basic Metrics</h3> <div class="metric-content svelte-pkncbu"><div>Total Characters: <strong> </strong></div> <div>Characters (no spaces): <strong> </strong></div> <div>Lines: <strong> </strong></div> <div>Words: <strong> </strong></div> <div>Paragraphs: <strong> </strong></div> <div>Unique Words: <strong> </strong></div> <div>Reading Time: <strong> </strong></div></div></div> <div class="metric-box svelte-pkncbu"><h3 class="metric-title svelte-pkncbu">Character Analysis</h3> <div class="metric-content svelte-pkncbu"><div>Uppercase: <strong> </strong></div> <div>Lowercase: <strong> </strong></div> <div>Digits: <strong> </strong></div> <div>Whitespace: <strong> </strong></div> <div>Special Characters: <strong> </strong></div> <div>Commas: <strong> </strong></div></div></div> <div class="metric-box svelte-pkncbu"><h3 class="metric-title svelte-pkncbu">Numbers & Patterns</h3> <div class="metric-content svelte-pkncbu"><div>Number Count: <strong> </strong></div> <!></div></div> <div class="metric-box svelte-pkncbu"><h3 class="metric-title svelte-pkncbu">Structure Analysis</h3> <div class="metric-content svelte-pkncbu"><div>Parentheses pairs: <strong> </strong></div> <div>Square brackets pairs: <strong> </strong></div> <div>Curly braces pairs: <strong> </strong></div> <div>Single quote pairs: <strong> </strong></div> <div>Double quote pairs: <strong> </strong></div> <div>Backtick pairs: <strong> </strong></div></div></div> <div class="metric-box svelte-pkncbu"><h3 class="metric-title svelte-pkncbu">Averages & Extremes</h3> <div class="metric-content svelte-pkncbu"><div>Avg words/line: <strong> </strong></div> <div>Avg chars/word: <strong> </strong></div> <!></div></div> <div class="metric-box svelte-pkncbu"><h3 class="metric-title svelte-pkncbu">Format Detection</h3> <div class="metric-content svelte-pkncbu"><div>Valid JSON: <strong> </strong></div> <div>Valid Base64: <strong> </strong></div> <div>Valid Hex: <strong> </strong></div> <div>Valid Bytes: <strong> </strong></div></div></div></div> <!></main>`);
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
	var main = root_7();
	var div = child(main);
	var textarea = child(div);
	remove_textarea_child(textarea);
	var div_1 = sibling(textarea, 2);
	var input = sibling(child(div_1), 2);
	remove_input_defaults(input);
	var button = sibling(input, 4);
	var div_2 = sibling(button, 2);
	var span = child(div_2);
	var text = child(span, true);
	reset(span);
	var node = sibling(span);
	var consequent = ($$anchor) => {
		append($$anchor, root());
	};
	if_block(node, ($$render) => {
		if (get(textContent).length > get(limit)) $$render(consequent);
	});
	reset(div_2);
	var node_1 = sibling(div_2, 2);
	var consequent_1 = ($$anchor) => {
		var span_2 = root_1();
		var text_1 = child(span_2);
		reset(span_2);
		template_effect(() => set_text(text_1, `(${get(limit) - get(totalChars)} missing)`));
		append($$anchor, span_2);
	};
	if_block(node_1, ($$render) => {
		if (get(totalChars) < get(limit) && get(totalChars) > 0) $$render(consequent_1);
	});
	var node_2 = sibling(node_1, 2);
	var consequent_2 = ($$anchor) => {
		var span_3 = root_2();
		var text_2 = child(span_3);
		reset(span_3);
		template_effect(() => set_text(text_2, `(${get(totalChars) - get(limit)} more)`));
		append($$anchor, span_3);
	};
	if_block(node_2, ($$render) => {
		if (get(totalChars) > get(limit)) $$render(consequent_2);
	});
	reset(div_1);
	reset(div);
	var div_3 = sibling(div, 2);
	var div_4 = child(div_3);
	var div_5 = sibling(child(div_4), 2);
	var div_6 = child(div_5);
	var strong = sibling(child(div_6));
	var text_3 = child(strong, true);
	reset(strong);
	reset(div_6);
	var div_7 = sibling(div_6, 2);
	var strong_1 = sibling(child(div_7));
	var text_4 = child(strong_1, true);
	reset(strong_1);
	reset(div_7);
	var div_8 = sibling(div_7, 2);
	var strong_2 = sibling(child(div_8));
	var text_5 = child(strong_2, true);
	reset(strong_2);
	reset(div_8);
	var div_9 = sibling(div_8, 2);
	var strong_3 = sibling(child(div_9));
	var text_6 = child(strong_3, true);
	reset(strong_3);
	reset(div_9);
	var div_10 = sibling(div_9, 2);
	var strong_4 = sibling(child(div_10));
	var text_7 = child(strong_4, true);
	reset(strong_4);
	reset(div_10);
	var div_11 = sibling(div_10, 2);
	var strong_5 = sibling(child(div_11));
	var text_8 = child(strong_5, true);
	reset(strong_5);
	reset(div_11);
	var div_12 = sibling(div_11, 2);
	var strong_6 = sibling(child(div_12));
	var text_9 = child(strong_6);
	reset(strong_6);
	reset(div_12);
	reset(div_5);
	reset(div_4);
	var div_13 = sibling(div_4, 2);
	var div_14 = sibling(child(div_13), 2);
	var div_15 = child(div_14);
	var strong_7 = sibling(child(div_15));
	var text_10 = child(strong_7, true);
	reset(strong_7);
	reset(div_15);
	var div_16 = sibling(div_15, 2);
	var strong_8 = sibling(child(div_16));
	var text_11 = child(strong_8, true);
	reset(strong_8);
	reset(div_16);
	var div_17 = sibling(div_16, 2);
	var strong_9 = sibling(child(div_17));
	var text_12 = child(strong_9, true);
	reset(strong_9);
	reset(div_17);
	var div_18 = sibling(div_17, 2);
	var strong_10 = sibling(child(div_18));
	var text_13 = child(strong_10, true);
	reset(strong_10);
	reset(div_18);
	var div_19 = sibling(div_18, 2);
	var strong_11 = sibling(child(div_19));
	var text_14 = child(strong_11, true);
	reset(strong_11);
	reset(div_19);
	var div_20 = sibling(div_19, 2);
	var strong_12 = sibling(child(div_20));
	var text_15 = child(strong_12, true);
	reset(strong_12);
	reset(div_20);
	reset(div_14);
	reset(div_13);
	var div_21 = sibling(div_13, 2);
	var div_22 = sibling(child(div_21), 2);
	var div_23 = child(div_22);
	var strong_13 = sibling(child(div_23));
	var text_16 = child(strong_13, true);
	reset(strong_13);
	reset(div_23);
	var node_3 = sibling(div_23, 2);
	var consequent_3 = ($$anchor) => {
		var fragment = root_3();
		var div_24 = first_child(fragment);
		var strong_14 = sibling(child(div_24));
		var text_17 = child(strong_14);
		reset(strong_14);
		reset(div_24);
		var div_25 = sibling(div_24, 2);
		var strong_15 = sibling(child(div_25));
		var text_18 = child(strong_15, true);
		reset(strong_15);
		reset(div_25);
		template_effect(($0, $1, $2) => {
			set_text(text_17, `${$0 ?? ""} - ${$1 ?? ""}`);
			set_text(text_18, $2);
		}, [
			() => Math.min(...get(numberList)),
			() => Math.max(...get(numberList)),
			() => get(numberList).reduce((a, b) => a + b, 0).toLocaleString()
		]);
		append($$anchor, fragment);
	};
	if_block(node_3, ($$render) => {
		if (get(numberList).length > 0) $$render(consequent_3);
	});
	reset(div_22);
	reset(div_21);
	var div_26 = sibling(div_21, 2);
	var div_27 = sibling(child(div_26), 2);
	var div_28 = child(div_27);
	var strong_16 = sibling(child(div_28));
	var text_19 = child(strong_16, true);
	reset(strong_16);
	reset(div_28);
	var div_29 = sibling(div_28, 2);
	var strong_17 = sibling(child(div_29));
	var text_20 = child(strong_17, true);
	reset(strong_17);
	reset(div_29);
	var div_30 = sibling(div_29, 2);
	var strong_18 = sibling(child(div_30));
	var text_21 = child(strong_18, true);
	reset(strong_18);
	reset(div_30);
	var div_31 = sibling(div_30, 2);
	var strong_19 = sibling(child(div_31));
	var text_22 = child(strong_19, true);
	reset(strong_19);
	reset(div_31);
	var div_32 = sibling(div_31, 2);
	var strong_20 = sibling(child(div_32));
	var text_23 = child(strong_20, true);
	reset(strong_20);
	reset(div_32);
	var div_33 = sibling(div_32, 2);
	var strong_21 = sibling(child(div_33));
	var text_24 = child(strong_21, true);
	reset(strong_21);
	reset(div_33);
	reset(div_27);
	reset(div_26);
	var div_34 = sibling(div_26, 2);
	var div_35 = sibling(child(div_34), 2);
	var div_36 = child(div_35);
	var strong_22 = sibling(child(div_36));
	var text_25 = child(strong_22, true);
	reset(strong_22);
	reset(div_36);
	var div_37 = sibling(div_36, 2);
	var strong_23 = sibling(child(div_37));
	var text_26 = child(strong_23, true);
	reset(strong_23);
	reset(div_37);
	var node_4 = sibling(div_37, 2);
	var consequent_4 = ($$anchor) => {
		var fragment_1 = root_4();
		var div_38 = first_child(fragment_1);
		var strong_24 = sibling(child(div_38));
		var text_27 = child(strong_24, true);
		reset(strong_24);
		var text_28 = sibling(strong_24);
		reset(div_38);
		var div_39 = sibling(div_38, 2);
		var strong_25 = sibling(child(div_39));
		var text_29 = child(strong_25, true);
		reset(strong_25);
		var text_30 = sibling(strong_25);
		reset(div_39);
		template_effect(($0, $1) => {
			set_text(text_27, $0);
			set_text(text_28, ` (${get(longestWord).length ?? ""} chars)`);
			set_text(text_29, $1);
			set_text(text_30, ` (${get(shortestWord).length ?? ""} chars)`);
		}, [() => get(longestWord).length > 10 ? get(longestWord).substring(0, 10) + "..." : get(longestWord), () => get(shortestWord).length > 10 ? get(shortestWord).substring(0, 10) + "..." : get(shortestWord)]);
		append($$anchor, fragment_1);
	};
	var alternate = ($$anchor) => {
		var fragment_2 = root_5();
		next(2);
		append($$anchor, fragment_2);
	};
	if_block(node_4, ($$render) => {
		if (get(totalWords) > 0) $$render(consequent_4);
		else $$render(alternate, -1);
	});
	reset(div_35);
	reset(div_34);
	var div_40 = sibling(div_34, 2);
	var div_41 = sibling(child(div_40), 2);
	var div_42 = child(div_41);
	var strong_26 = sibling(child(div_42));
	var text_31 = child(strong_26, true);
	reset(strong_26);
	reset(div_42);
	var div_43 = sibling(div_42, 2);
	var strong_27 = sibling(child(div_43));
	var text_32 = child(strong_27, true);
	reset(strong_27);
	reset(div_43);
	var div_44 = sibling(div_43, 2);
	var strong_28 = sibling(child(div_44));
	var text_33 = child(strong_28, true);
	reset(strong_28);
	reset(div_44);
	var div_45 = sibling(div_44, 2);
	var strong_29 = sibling(child(div_45));
	var text_34 = child(strong_29, true);
	reset(strong_29);
	reset(div_45);
	reset(div_41);
	reset(div_40);
	reset(div_3);
	var node_5 = sibling(div_3, 2);
	var consequent_5 = ($$anchor) => {
		var div_46 = root_6();
		var div_47 = sibling(child(div_46), 2);
		var text_35 = child(div_47, true);
		reset(div_47);
		reset(div_46);
		template_effect(($0) => set_text(text_35, $0), [() => get(numberList).join(", ")]);
		append($$anchor, div_46);
	};
	if_block(node_5, ($$render) => {
		if (get(numberList).length > 0 && get(numberList).length <= 20) $$render(consequent_5);
	});
	reset(main);
	template_effect(($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) => {
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
	}, [
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
	]);
	bind_value(textarea, () => get(textContent), ($$value) => set(textContent, $$value));
	bind_value(input, () => get(limit), ($$value) => set(limit, $$value));
	delegated("click", button, () => {
		if (get(textContent).length > 0) {
			const repeatCount = Math.ceil(get(limit) / get(textContent).length);
			set(textContent, get(textContent).repeat(repeatCount).slice(0, get(limit)), true);
		}
	});
	append($$anchor, main);
	pop();
}
delegate(["click"]);
//#endregion
export { TextAnalyzer as default };
