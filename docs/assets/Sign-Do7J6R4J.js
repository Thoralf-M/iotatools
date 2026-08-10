import { $ as untrack, Ct as get$1, Dt as pop, I as if_block, Mt as reset, N as each, Ot as push, P as index, R as set_text, S as set_value, U as delegate, V as from_html, W as delegated, Y as get, _t as remove_textarea_child, ct as sibling, dt as mutate, ft as set, it as template_effect, jt as next, nt as legacy_pre_effect_reset, ot as child, s as init, tt as legacy_pre_effect, u as bind_this, ut as mutable_source, vt as setup_stores, y as set_attribute, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import "./legacy-DxVWxrJw.js";
import { n as getSelectedChain, o as Transaction, s as TransactionDataBuilder, t as getClient } from "./client-BTFoHz6u.js";
import { L as iotaBcs, Q as toBase64, Z as fromBase64, l as parseSerializedSignature } from "./keypair-DsT3ivIR.js";
import { f as getActiveWallet, t as activeAddress } from "./signer-data-D1Egmbld.js";
import { a as MoveAuthenticatorDetails, c as parsePartialSignatures, d as verifyTransactionSignature, f as require_buffer, i as TransactionView, l as publicKeyFromRawBytes, o as copyToClipboard, u as verifyPersonalMessageSignature } from "./index-BfoTUhj-.js";
import { n as updatePageQueryParams, r as usePageQueryParams } from "./page-query-params-jtrmSRj_.js";
import { t as JsonToggleView } from "./JsonToggleView-I_OHyvOi.js";
//#region src/lib/pages/sign/sign-utils.ts
var import_buffer = require_buffer();
async function verifySignature(txBytesInput, signatureResult) {
	let status = "checking";
	let error = "";
	let pubkeyPairs = null;
	try {
		const inputString = txBytesInput.trim();
		const signatureString = signatureResult.trim();
		if (!signatureString) {
			status = null;
			return {
				status,
				error,
				pubkeyPairs
			};
		}
		try {
			const parsed = parseSerializedSignature(signatureString);
			if (parsed.signatureScheme === "MultiSig") {
				pubkeyPairs = parsePartialSignatures(parsed.multisig).map((sig) => ({
					signatureScheme: sig.signatureScheme,
					publicKey: sig.publicKey,
					signature: sig.signature
				}));
				status = "valid";
			} else if (parsed.signatureScheme === "MoveAuthenticator") {
				const moveAuth = parsed.moveAuthenticator;
				if (moveAuth.$kind !== "V1") throw new Error(`Unsupported MoveAuthenticator version: ${moveAuth.$kind}`);
				const v1 = moveAuth.V1;
				if (v1.objectToAuthenticate.$kind !== "Object") throw new Error("MoveAuthenticator objectToAuthenticate must be an Object");
				return {
					status: "on_chain_only",
					error,
					pubkeyPairs: [],
					moveAuthenticator: {
						version: "V1",
						callArgs: v1.callArgs,
						typeArgs: v1.typeArgs,
						objectToAuthenticate: v1.objectToAuthenticate.Object
					}
				};
			} else {
				const pubKey = publicKeyFromRawBytes(parsed.signatureScheme, parsed.publicKey);
				pubkeyPairs = [{
					signatureScheme: parsed.signatureScheme,
					publicKey: pubKey,
					signature: parsed.signature
				}];
			}
		} catch (e) {
			console.error("Error parsing signature:", e);
			status = "invalid";
			error = `Parsing failed: ${e}`;
			return {
				status,
				error,
				pubkeyPairs
			};
		}
		if (pubkeyPairs && pubkeyPairs.length === 1 && inputString) {
			const pair = pubkeyPairs[0];
			try {
				if ((await verifyTransactionSignature(fromBase64(inputString), signatureString)).toBase64() !== pair.publicKey.toBase64()) {
					status = "invalid";
					error = "Public key mismatch";
					return {
						status,
						error,
						pubkeyPairs
					};
				}
				status = "valid";
			} catch {
				try {
					if ((await verifyPersonalMessageSignature(new TextEncoder().encode(inputString), signatureString)).toBase64() !== pair.publicKey.toBase64()) {
						status = "invalid";
						error = "Public key mismatch";
						return {
							status,
							error,
							pubkeyPairs
						};
					}
					status = "valid";
				} catch (e2) {
					status = "invalid";
					error = `Verification failed: ${e2}`;
					return {
						status,
						error,
						pubkeyPairs
					};
				}
			}
		} else if (pubkeyPairs && pubkeyPairs.length > 1) status = "valid";
		else status = null;
	} catch (e) {
		status = "invalid";
		error = `Verification error: ${e}`;
	}
	return {
		status,
		error,
		pubkeyPairs
	};
}
//#endregion
//#region src/lib/pages/sign/Sign.svelte
var root = from_html(`<div class="dry-run-result svelte-2sgbh3"><button class="dry-run-close svelte-2sgbh3" aria-label="Close dry run result" title="Close">&#10005;</button> <div class="dry-run-title">Dry Run Result</div> <!></div>`);
var root_1 = from_html(`<button class="remove-signature-button svelte-2sgbh3" title="Remove this signature">Remove</button>`);
var root_2 = from_html(`<div style="margin-top: 8px; padding: 8px; border-radius: 4px;">🔍 Verifying signature...</div>`);
var root_3 = from_html(`<div style="margin-top: 8px; padding: 8px; border-radius: 4px;">✓ Signature is valid</div>`);
var root_4 = from_html(`<div style="margin-top: 4px; font-size: 12px;"> </div>`);
var root_5 = from_html(`<div style="margin-top: 8px; padding: 8px; border-radius: 4px;">✗ Invalid signature <!></div>`);
var root_6 = from_html(`<div style="margin-top: 8px; padding: 8px; border-radius: 4px;">ⓘ Signature parsed. MoveAuthenticator validity depends on on-chain execution
                        and cannot be verified here.</div>`);
var root_7 = from_html(`<div class="signature-details-container svelte-2sgbh3"><div class="signature-item svelte-2sgbh3"><div class="signature-header svelte-2sgbh3">MoveAuthenticator</div> <div class="signature-details svelte-2sgbh3"><!></div></div></div>`);
var root_8 = from_html(`<div class="signature-item svelte-2sgbh3"><div class="signature-header svelte-2sgbh3"> </div> <div class="signature-details svelte-2sgbh3"><div class="detail-item svelte-2sgbh3"><span class="detail-label svelte-2sgbh3">Public key:</span> <span class="detail-value svelte-2sgbh3"> </span> <button class="copy-button svelte-2sgbh3">Copy</button></div> <div class="detail-item svelte-2sgbh3"><span class="detail-label svelte-2sgbh3">Public key with flag:</span> <span class="detail-value svelte-2sgbh3"> </span> <button class="copy-button svelte-2sgbh3">Copy</button></div> <div class="detail-item svelte-2sgbh3"><span class="detail-label svelte-2sgbh3">Address:</span> <span class="detail-value svelte-2sgbh3"> </span> <button class="copy-button svelte-2sgbh3">Copy</button></div> <div class="detail-item svelte-2sgbh3"><span class="detail-label svelte-2sgbh3">Signature:</span> <span class="detail-value svelte-2sgbh3"> </span> <button class="copy-button svelte-2sgbh3">Copy</button></div></div></div>`);
var root_9 = from_html(`<div class="signature-details-container svelte-2sgbh3"></div>`);
var root_10 = from_html(`<div class="signature-block svelte-2sgbh3"><div class="signature-block-header svelte-2sgbh3"><span></span> <!></div> <textarea placeholder="Signature (base64)" class="signature-textarea svelte-2sgbh3"></textarea> <!> <!> <!> <!> <!> <!></div>`);
var root_11 = from_html(`<div style="margin-top: 20px;"><div style="margin-bottom: 6px; font-weight: bold; display: flex; align-items: center; gap: 10px;">Signed Transaction Bytes <button class="copy-button svelte-2sgbh3" style="padding: 4px 10px; font-size: 12px;">Copy</button></div> <textarea readonly="" placeholder="Signed transaction bytes (base64)" class="signature-textarea svelte-2sgbh3" style="height: 100px;"></textarea> <div style="margin-top: 4px; font-size: 12px; color: #666;">This combines the transaction bytes with all signatures and can be submitted to
                    the network.</div></div>`);
var root_12 = from_html(`<div style="margin: 20px 0;"><!></div>`);
var root_13 = from_html(`<div style="color: #ef4444; margin: 10px 0;"> </div>`);
var root_14 = from_html(`<main><div><div style="float: left; display: flex; align-items: center; gap: 10px;"><span>Tx bytes base64 encoded or message:</span> <button style="padding: 4px 8px; font-size: 12px;" class="svelte-2sgbh3">Example tx</button></div> <div class="box"><textarea placeholder="base64 transaction bytes or message" class="svelte-2sgbh3"></textarea></div></div> <div style="margin-top: 20px; display: flex; gap: 10px;"><button class="svelte-2sgbh3">Sign Tx</button> <button class="svelte-2sgbh3">Sign Message</button> <button class="svelte-2sgbh3">Dry Run</button></div> <!> <div><div class="signatures-header svelte-2sgbh3"><span style="font-weight: bold;"> </span> <button class="add-signature-button svelte-2sgbh3">+ Add signature</button></div> <!> <!> <button class="svelte-2sgbh3">Submit Signed Tx</button></div> <!> <!> <!></main>`);
function Sign($$anchor, $$props) {
	push($$props, false);
	const $queryParamValues = () => store_get(queryParamValues, "$queryParamValues", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	const signaturesKey = mutable_source();
	const queryParamValues = usePageQueryParams({
		tx: "",
		signature: ""
	});
	const MAX_SIGNATURES = 20;
	function createSignatureEntry(value = "") {
		return {
			value,
			status: null,
			error: "",
			pubkeyPairs: null,
			moveAuthenticator: null
		};
	}
	let error = mutable_source("");
	let value = mutable_source();
	let signatures = mutable_source([createSignatureEntry()]);
	let submitResult = mutable_source(null);
	let signatureTypeLabel = mutable_source("");
	let txBytesInput = mutable_source("");
	let dryRunResult = mutable_source();
	let signedTxBytes = mutable_source("");
	let lastSignatureParam = "";
	async function dryRunTransaction() {
		try {
			set(error, "");
			set(dryRunResult, "");
			const inputString = get(txBytesInput).trim();
			if (!inputString) {
				set(error, "Please enter transaction bytes");
				return;
			}
			let txBytes;
			try {
				txBytes = fromBase64(inputString);
			} catch (e) {
				set(error, "Invalid base64 transaction bytes");
				return;
			}
			const result = await getClient().dryRunTransactionBlock({ transactionBlock: txBytes });
			set(dryRunResult, result);
		} catch (e) {
			set(error, `Error dry running transaction: ${e}`);
		}
	}
	function syncSignaturesFromUrl(urlValue) {
		if (urlValue === lastSignatureParam) return;
		lastSignatureParam = urlValue;
		set(signatures, urlValue ? urlValue.split(",").map((v) => createSignatureEntry(v)) : [createSignatureEntry()]);
	}
	function updateTxBytes(newTxBytes) {
		set(txBytesInput, newTxBytes);
		updatePageQueryParams({ tx: newTxBytes || null });
		processTransactionBytes(newTxBytes);
	}
	function pushSignaturesToUrl() {
		const param = get(signatures).map((s) => s.value.trim()).filter(Boolean).join(",");
		lastSignatureParam = param;
		updatePageQueryParams({ signature: param || null });
	}
	function updateSignatureValue(index, newValue) {
		mutate(signatures, get(signatures)[index].value = newValue);
		set(signatures, [...get(signatures)]);
		pushSignaturesToUrl();
	}
	function addSignatureField() {
		if (get(signatures).length >= MAX_SIGNATURES) return;
		set(signatures, [...get(signatures), createSignatureEntry()]);
	}
	function removeSignatureField(index) {
		if (get(signatures).length <= 1) return;
		set(signatures, get(signatures).filter((_, i) => i !== index));
		pushSignaturesToUrl();
	}
	function addOrFillSignature(signature) {
		const emptyIndex = get(signatures).findIndex((s) => !s.value.trim());
		if (emptyIndex >= 0) {
			mutate(signatures, get(signatures)[emptyIndex].value = signature);
			set(signatures, [...get(signatures)]);
		} else if (get(signatures).length < MAX_SIGNATURES) set(signatures, [...get(signatures), createSignatureEntry(signature)]);
		else {
			set(error, `Maximum of ${MAX_SIGNATURES} signatures reached`);
			return;
		}
		pushSignaturesToUrl();
	}
	function processTransactionBytes(inputString) {
		if (!inputString) {
			set(value, null);
			return;
		}
		try {
			let txBytes = fromBase64(inputString);
			set(value, TransactionDataBuilder.fromBytes(txBytes));
			mutate(value, get(value).transactionBytes = inputString);
		} catch (e) {
			console.log("error TransactionDataBuilder", e);
			try {
				const signedData = iotaBcs.SenderSignedData.parse(fromBase64(inputString));
				set(value, signedData[0]);
				mutate(value, get(value).rawTransaction = inputString);
				const v1Data = signedData[0].intentMessage.value.V1;
				if (v1Data.kind && v1Data.kind.ProgrammableTransaction) {
					const txDataBuilder = new TransactionDataBuilder({
						version: 2,
						sender: v1Data.sender,
						inputs: v1Data.kind.ProgrammableTransaction.inputs,
						commands: v1Data.kind.ProgrammableTransaction.commands,
						gasData: v1Data.gasData,
						expiration: v1Data.expiration
					});
					mutate(value, get(value).transactionBytes = toBase64(txDataBuilder.build()));
				}
			} catch (e) {
				console.log("error SenderSignedData", e);
				set(value, e);
			}
		}
	}
	let txBytesTextarea = mutable_source();
	const exampleTx = "AAACAAgAypo7AAAAAAAg0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpECAgABAQAAAQEDAAAAAAEBANKra+ym7GUCu4vTTXPpQ8bRIIfMk38vrNsEbPtnkEqRAhqhmE/Wz9u5hD63usyXx55ZG8kDHwdq9KNGKDXH3pQ2Mj0AAAAAAAAgnPGssCCNJPH94p+4VvX3Fzp32jLZO9zsO5eMsp4LujqznOy0o0pHmEqaslIo0HQKO7U5nouSh6qph3HYLxK94jM9AAAAAAAAIMX/XZSN7Cn09U1FYXDGPcaUk5v9VkmnwMeY1geClYzW0qtr7KbsZQK7i9NNc+lDxtEgh8yTfy+s2wRs+2eQSpHoAwAAAAAAAOBvPAAAAAAAAA==";
	function insertExampleTx() {
		updateTxBytes(exampleTx);
	}
	async function signTransaction() {
		try {
			set(error, "");
			const inputString = get(txBytesInput).trim();
			if (!inputString) {
				set(error, "Please enter transaction bytes");
				return;
			}
			const wallet = getActiveWallet();
			const senderAddress = get$1(activeAddress);
			if (!wallet) {
				set(error, "No wallet available");
				return;
			}
			if (!wallet.signTransaction) {
				set(error, "Current wallet does not support transaction signing");
				return;
			}
			let transactionBytes;
			try {
				transactionBytes = fromBase64(inputString);
			} catch (e) {
				set(error, "Invalid base64 transaction bytes");
				return;
			}
			const result = await wallet.signTransaction({
				transaction: Transaction.from(transactionBytes),
				account: { address: senderAddress },
				chain: getSelectedChain()
			});
			set(signatureTypeLabel, "Transaction Signature");
			addOrFillSignature(result.signature);
		} catch (e) {
			set(error, `Error signing transaction: ${e}`);
			console.error("Error signing transaction:", e);
		}
	}
	async function signPersonalMessage() {
		try {
			set(error, "");
			const inputString = get(txBytesInput).trim();
			if (!inputString) {
				set(error, "Please enter a message");
				return;
			}
			const wallet = getActiveWallet();
			const senderAddress = get$1(activeAddress);
			if (!wallet) {
				set(error, "No wallet available");
				return;
			}
			if (!wallet.signPersonalMessage) {
				set(error, "Current wallet does not support message signing");
				return;
			}
			const messageBytes = new TextEncoder().encode(inputString);
			const result = await wallet.signPersonalMessage({
				message: messageBytes,
				account: { address: senderAddress }
			});
			set(signatureTypeLabel, "Message Signature");
			addOrFillSignature(result.signature);
		} catch (e) {
			set(error, `Error signing message: ${e}`);
		}
	}
	let verificationTimeout;
	async function verifyAllSignatures() {
		const entries = get(signatures);
		await Promise.all(entries.map(async (entry) => {
			if (!entry.value.trim()) {
				entry.status = null;
				entry.error = "";
				entry.pubkeyPairs = null;
				entry.moveAuthenticator = null;
				return;
			}
			const result = await verifySignature(get(txBytesInput), entry.value);
			entry.status = result.status;
			entry.error = result.error;
			entry.pubkeyPairs = result.pubkeyPairs;
			entry.moveAuthenticator = result.moveAuthenticator ?? null;
		}));
		set(signatures, [...get(signatures)]);
	}
	function createSignedTxBytes() {
		try {
			const sigs = get(signatures).map((s) => s.value.trim()).filter(Boolean);
			if (!get(txBytesInput).trim() || sigs.length === 0) {
				set(signedTxBytes, "");
				return;
			}
			const txBytes = fromBase64(get(txBytesInput).trim());
			const senderSignedData = [{
				intentMessage: {
					intent: {
						scope: { TransactionData: null },
						version: { V0: null },
						appId: { Iota: null }
					},
					value: iotaBcs.TransactionData.parse(txBytes)
				},
				txSignatures: sigs
			}];
			const senderSignedDataBytes = iotaBcs.SenderSignedData.serialize(senderSignedData).toBytes();
			set(signedTxBytes, toBase64(senderSignedDataBytes));
		} catch (e) {
			console.error("Error creating signed transaction bytes:", e);
			set(signedTxBytes, "");
		}
	}
	function onSignaturesChanged(_key) {
		if (verificationTimeout) clearTimeout(verificationTimeout);
		createSignedTxBytes();
		if (get(signatures).some((s) => s.value.trim())) verificationTimeout = setTimeout(() => {
			verifyAllSignatures();
		}, 300);
	}
	async function submitSignedTx() {
		try {
			set(error, "");
			set(submitResult, null);
			const inputString = get(txBytesInput).trim();
			const signatureStrings = get(signatures).map((s) => s.value.trim()).filter(Boolean);
			if (!inputString) {
				set(error, "Please enter transaction bytes");
				return;
			}
			if (signatureStrings.length === 0) {
				set(error, "Please enter a signature");
				return;
			}
			let txBytes;
			try {
				txBytes = fromBase64(inputString);
			} catch (e) {
				set(error, "Invalid base64 transaction bytes");
				return;
			}
			for (const signatureString of signatureStrings) try {
				fromBase64(signatureString);
			} catch (e) {
				set(error, "Invalid base64 signature");
				return;
			}
			const result = await getClient().executeTransactionBlock({
				transactionBlock: txBytes,
				signature: signatureStrings,
				options: {
					showBalanceChanges: true,
					showObjectChanges: true,
					showEffects: true,
					showInput: true
				}
			});
			console.log(result);
			set(submitResult, result);
		} catch (e) {
			set(error, `Error submitting signed transaction: ${e}`);
		}
	}
	legacy_pre_effect(() => ($queryParamValues(), get(txBytesInput)), () => {
		if ($queryParamValues().tx !== get(txBytesInput)) {
			set(txBytesInput, $queryParamValues().tx);
			processTransactionBytes(get(txBytesInput));
		}
	});
	legacy_pre_effect(() => $queryParamValues(), () => {
		syncSignaturesFromUrl($queryParamValues().signature);
	});
	legacy_pre_effect(() => (get(signatures), get(txBytesInput)), () => {
		set(signaturesKey, get(signatures).map((s) => s.value).join("") + "\0" + get(txBytesInput));
	});
	legacy_pre_effect(() => get(signaturesKey), () => {
		onSignaturesChanged(get(signaturesKey));
	});
	legacy_pre_effect_reset();
	init();
	var main = root_14();
	var div = child(main);
	var div_1 = child(div);
	var button = sibling(child(div_1), 2);
	reset(div_1);
	var div_2 = sibling(div_1, 2);
	var textarea = child(div_2);
	remove_textarea_child(textarea);
	bind_this(textarea, ($$value) => set(txBytesTextarea, $$value), () => get(txBytesTextarea));
	reset(div_2);
	reset(div);
	var div_3 = sibling(div, 2);
	var button_1 = child(div_3);
	var button_2 = sibling(button_1, 2);
	var button_3 = sibling(button_2, 2);
	reset(div_3);
	var node = sibling(div_3, 2);
	var consequent = ($$anchor) => {
		var div_4 = root();
		var button_4 = child(div_4);
		JsonToggleView(sibling(button_4, 4), { get value() {
			return get(dryRunResult);
		} });
		reset(div_4);
		delegated("click", button_4, () => set(dryRunResult, void 0));
		append($$anchor, div_4);
	};
	if_block(node, ($$render) => {
		if (get(dryRunResult)) $$render(consequent);
	});
	var div_5 = sibling(node, 2);
	var div_6 = child(div_5);
	var span = child(div_6);
	var text = child(span, true);
	reset(span);
	var button_5 = sibling(span, 2);
	reset(div_6);
	var node_2 = sibling(div_6, 2);
	each(node_2, 1, () => get(signatures), index, ($$anchor, entry, index$1) => {
		var div_7 = root_10();
		var div_8 = child(div_7);
		var span_1 = child(div_8);
		span_1.textContent = `Signature #${index$1 + 1}`;
		var node_3 = sibling(span_1, 2);
		var consequent_1 = ($$anchor) => {
			var button_6 = root_1();
			delegated("click", button_6, () => removeSignatureField(index$1));
			append($$anchor, button_6);
		};
		if_block(node_3, ($$render) => {
			if (get(signatures), untrack(() => get(signatures).length > 1)) $$render(consequent_1);
		});
		reset(div_8);
		var textarea_1 = sibling(div_8, 2);
		remove_textarea_child(textarea_1);
		var node_4 = sibling(textarea_1, 2);
		var consequent_2 = ($$anchor) => {
			append($$anchor, root_2());
		};
		if_block(node_4, ($$render) => {
			if (get(entry), untrack(() => get(entry).status === "checking")) $$render(consequent_2);
		});
		var node_5 = sibling(node_4, 2);
		var consequent_3 = ($$anchor) => {
			append($$anchor, root_3());
		};
		if_block(node_5, ($$render) => {
			if (get(entry), untrack(() => get(entry).status === "valid")) $$render(consequent_3);
		});
		var node_6 = sibling(node_5, 2);
		var consequent_5 = ($$anchor) => {
			var div_11 = root_5();
			var node_7 = sibling(child(div_11));
			var consequent_4 = ($$anchor) => {
				var div_12 = root_4();
				var text_1 = child(div_12, true);
				reset(div_12);
				template_effect(() => set_text(text_1, (get(entry), untrack(() => get(entry).error))));
				append($$anchor, div_12);
			};
			if_block(node_7, ($$render) => {
				if (get(entry), untrack(() => get(entry).error)) $$render(consequent_4);
			});
			reset(div_11);
			append($$anchor, div_11);
		};
		if_block(node_6, ($$render) => {
			if (get(entry), untrack(() => get(entry).status === "invalid")) $$render(consequent_5);
		});
		var node_8 = sibling(node_6, 2);
		var consequent_6 = ($$anchor) => {
			append($$anchor, root_6());
		};
		if_block(node_8, ($$render) => {
			if (get(entry), untrack(() => get(entry).status === "on_chain_only")) $$render(consequent_6);
		});
		var node_9 = sibling(node_8, 2);
		var consequent_7 = ($$anchor) => {
			var div_14 = root_7();
			var div_15 = child(div_14);
			var div_16 = sibling(child(div_15), 2);
			MoveAuthenticatorDetails(child(div_16), { get data() {
				return get(entry), untrack(() => get(entry).moveAuthenticator);
			} });
			reset(div_16);
			reset(div_15);
			reset(div_14);
			append($$anchor, div_14);
		};
		if_block(node_9, ($$render) => {
			if (get(entry), untrack(() => get(entry).moveAuthenticator)) $$render(consequent_7);
		});
		var node_11 = sibling(node_9, 2);
		var consequent_8 = ($$anchor) => {
			var div_17 = root_9();
			each(div_17, 5, () => (get(entry), untrack(() => get(entry).pubkeyPairs)), index, ($$anchor, pair, pairIndex) => {
				var div_18 = root_8();
				var div_19 = child(div_18);
				var text_2 = child(div_19);
				reset(div_19);
				var div_20 = sibling(div_19, 2);
				var div_21 = child(div_20);
				var span_2 = sibling(child(div_21), 2);
				var text_3 = child(span_2, true);
				reset(span_2);
				var button_7 = sibling(span_2, 2);
				reset(div_21);
				var div_22 = sibling(div_21, 2);
				var span_3 = sibling(child(div_22), 2);
				var text_4 = child(span_3, true);
				reset(span_3);
				var button_8 = sibling(span_3, 2);
				reset(div_22);
				var div_23 = sibling(div_22, 2);
				var span_4 = sibling(child(div_23), 2);
				var text_5 = child(span_4, true);
				reset(span_4);
				var button_9 = sibling(span_4, 2);
				reset(div_23);
				var div_24 = sibling(div_23, 2);
				var span_5 = sibling(child(div_24), 2);
				var text_6 = child(span_5, true);
				reset(span_5);
				var button_10 = sibling(span_5, 2);
				reset(div_24);
				reset(div_20);
				reset(div_18);
				template_effect(($0, $1, $2, $3) => {
					set_text(text_2, `Public key #${pairIndex + 1} (${(get(pair), untrack(() => get(pair).signatureScheme)) ?? ""})`);
					set_text(text_3, $0);
					set_text(text_4, $1);
					set_text(text_5, $2);
					set_text(text_6, $3);
				}, [
					() => (get(pair), untrack(() => get(pair).publicKey.toBase64())),
					() => (get(pair), untrack(() => get(pair).publicKey.toIotaPublicKey())),
					() => (get(pair), untrack(() => get(pair).publicKey.toIotaAddress())),
					() => (get(pair), untrack(() => import_buffer.Buffer.from(get(pair).signature).toString("base64")))
				]);
				delegated("click", button_7, async () => await copyToClipboard(get(pair).publicKey.toBase64()));
				delegated("click", button_8, async () => await copyToClipboard(get(pair).publicKey.toIotaPublicKey()));
				delegated("click", button_9, async () => await copyToClipboard(get(pair).publicKey.toIotaAddress()));
				delegated("click", button_10, async () => await copyToClipboard(import_buffer.Buffer.from(get(pair).signature).toString("base64")));
				append($$anchor, div_18);
			});
			reset(div_17);
			append($$anchor, div_17);
		};
		if_block(node_11, ($$render) => {
			if (get(entry), untrack(() => get(entry).pubkeyPairs)) $$render(consequent_8);
		});
		reset(div_7);
		template_effect(() => set_value(textarea_1, (get(entry), untrack(() => get(entry).value))));
		delegated("input", textarea_1, (e) => updateSignatureValue(index$1, e.target.value));
		append($$anchor, div_7);
	});
	var node_12 = sibling(node_2, 2);
	var consequent_9 = ($$anchor) => {
		var div_25 = root_11();
		var div_26 = child(div_25);
		var button_11 = sibling(child(div_26));
		reset(div_26);
		var textarea_2 = sibling(div_26, 2);
		remove_textarea_child(textarea_2);
		next(2);
		reset(div_25);
		template_effect(() => set_value(textarea_2, get(signedTxBytes)));
		delegated("click", button_11, async () => await copyToClipboard(get(signedTxBytes)));
		append($$anchor, div_25);
	};
	if_block(node_12, ($$render) => {
		if (get(signedTxBytes)) $$render(consequent_9);
	});
	var button_12 = sibling(node_12, 2);
	reset(div_5);
	var node_13 = sibling(div_5, 2);
	var consequent_10 = ($$anchor) => {
		var div_27 = root_12();
		TransactionView(child(div_27), { get value() {
			return get(submitResult);
		} });
		reset(div_27);
		append($$anchor, div_27);
	};
	if_block(node_13, ($$render) => {
		if (get(submitResult)) $$render(consequent_10);
	});
	var node_15 = sibling(node_13, 2);
	var consequent_11 = ($$anchor) => {
		var div_28 = root_13();
		var text_7 = child(div_28, true);
		reset(div_28);
		template_effect(() => set_text(text_7, get(error)));
		append($$anchor, div_28);
	};
	if_block(node_15, ($$render) => {
		if (get(error)) $$render(consequent_11);
	});
	TransactionView(sibling(node_15, 2), { get value() {
		return get(value);
	} });
	reset(main);
	template_effect(() => {
		set_value(textarea, get(txBytesInput));
		set_text(text, get(signatureTypeLabel) || "Signatures");
		button_5.disabled = (get(signatures), untrack(() => get(signatures).length >= MAX_SIGNATURES));
		set_attribute(button_5, "title", (get(signatures), untrack(() => get(signatures).length >= MAX_SIGNATURES ? `Maximum of ${MAX_SIGNATURES} signatures` : "Add another signature (e.g. sponsor signature)")));
	});
	delegated("click", button, insertExampleTx);
	delegated("input", textarea, (e) => updateTxBytes(e.target?.value || ""));
	delegated("click", button_1, signTransaction);
	delegated("click", button_2, signPersonalMessage);
	delegated("click", button_3, dryRunTransaction);
	delegated("click", button_5, addSignatureField);
	delegated("click", button_12, submitSignedTx);
	append($$anchor, main);
	pop();
	$$cleanup();
}
delegate(["click", "input"]);
//#endregion
export { Sign as default };
