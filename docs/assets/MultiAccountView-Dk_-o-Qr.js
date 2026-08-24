import { $ as untrack, B as comment, C as bind_select_value, Ct as get$1, D as set_class, Dt as pop, E as set_style, G as event, H as text, I as if_block, Mt as reset, N as each, Ot as push, P as index, Pt as to_array, R as set_text, U as delegate, V as from_html, W as delegated, Y as get, at as user_effect, ct as sibling, ft as set, gt as user_derived, h as bind_value, i as prop, it as template_effect, jt as next$1, k as action, lt as proxy, m as bind_group, n as onDestroy, ot as child, p as bind_checked, pt as state, r as onMount, st as first_child, u as bind_this, v as remove_input_defaults, vt as setup_stores, y as set_attribute, yt as store_get, z as append } from "./disclose-version-CpEJO7r1.js";
import { l as IOTA_SYSTEM_STATE_OBJECT_ID, o as Transaction, t as getClient, v as sharedMultiAccountCompactAmounts, y as sharedMultiAccountCurrency } from "./client-BTFoHz6u.js";
import { B as isValidIotaAddress } from "./keypair-DsT3ivIR.js";
import { a as iota_accounts } from "./signer-data-D1Egmbld.js";
import { g as nanoToIota, h as iotaToNano, n as addAndRun, p as formatNumberWithUnderscores } from "./index-C1sc3CBL.js";
import { n as updatePageQueryParams, r as usePageQueryParams } from "./page-query-params-BxUe761Y.js";
import { t as auto_default } from "./auto-DlIbMOkz.js";
import { h as getTokenAmount, m as getIotaAmount, o as exchangeRateCache, s as fetchAllExchangeRates, t as exchange_rate_cache_default, u as setInitialExchangeRateCacheFromBinary } from "./exchange-rate-cache-Dlef3fVF.js";
import { t as computeStakingRewards } from "./staking-utils-Bq8uBoCa.js";
import { t as plugin } from "./chartjs-plugin-zoom.esm-DAYqusPu.js";
//#region node_modules/.pnpm/svelte-dnd-action@0.9.74_svelte@5.56.6/node_modules/svelte-dnd-action/dist/index.mjs
function ownKeys(object, enumerableOnly) {
	var keys = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		enumerableOnly && (symbols = symbols.filter(function(sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		})), keys.push.apply(keys, symbols);
	}
	return keys;
}
function _objectSpread2(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = null != arguments[i] ? arguments[i] : {};
		i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
			_defineProperty(target, key, source[key]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
			Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
		});
	}
	return target;
}
function _typeof(obj) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
		return typeof obj;
	} : function(obj) {
		return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	}, _typeof(obj);
}
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
	return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
	var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
	if (_i == null) return;
	var _arr = [];
	var _n = true;
	var _d = false;
	var _s, _e;
	try {
		for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);
			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) throw _e;
		}
	}
	return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _createForOfIteratorHelper(o, allowArrayLike) {
	var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
	if (!it) {
		if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
			if (it) o = it;
			var i = 0;
			var F = function() {};
			return {
				s: F,
				n: function() {
					if (i >= o.length) return { done: true };
					return {
						done: false,
						value: o[i++]
					};
				},
				e: function(e) {
					throw e;
				},
				f: F
			};
		}
		throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	var normalCompletion = true, didErr = false, err;
	return {
		s: function() {
			it = it.call(o);
		},
		n: function() {
			var step = it.next();
			normalCompletion = step.done;
			return step;
		},
		e: function(e) {
			didErr = true;
			err = e;
		},
		f: function() {
			try {
				if (!normalCompletion && it.return != null) it.return();
			} finally {
				if (didErr) throw err;
			}
		}
	};
}
var FINALIZE_EVENT_NAME = "finalize";
var CONSIDER_EVENT_NAME = "consider";
/**
* @typedef {Object} Info
* @property {string} trigger
* @property {string} id
* @property {string} source
* @param {Node} el
* @param {Array} items
* @param {Info} info
*/
function dispatchFinalizeEvent(el, items, info) {
	el.dispatchEvent(new CustomEvent(FINALIZE_EVENT_NAME, { detail: {
		items,
		info
	} }));
}
/**
* Dispatches a consider event
* @param {Node} el
* @param {Array} items
* @param {Info} info
*/
function dispatchConsiderEvent(el, items, info) {
	el.dispatchEvent(new CustomEvent(CONSIDER_EVENT_NAME, { detail: {
		items,
		info
	} }));
}
var DRAGGED_ENTERED_EVENT_NAME = "draggedEntered";
var DRAGGED_LEFT_EVENT_NAME = "draggedLeft";
var DRAGGED_OVER_INDEX_EVENT_NAME = "draggedOverIndex";
var DRAGGED_LEFT_DOCUMENT_EVENT_NAME = "draggedLeftDocument";
var DRAGGED_LEFT_TYPES = {
	LEFT_FOR_ANOTHER: "leftForAnother",
	OUTSIDE_OF_ANY: "outsideOfAny"
};
function dispatchDraggedElementEnteredContainer(containerEl, indexObj, draggedEl) {
	containerEl.dispatchEvent(new CustomEvent(DRAGGED_ENTERED_EVENT_NAME, { detail: {
		indexObj,
		draggedEl
	} }));
}
/**
* @param containerEl - the dropzone the element left
* @param draggedEl - the dragged element
* @param theOtherDz - the new dropzone the element entered
*/
function dispatchDraggedElementLeftContainerForAnother(containerEl, draggedEl, theOtherDz) {
	containerEl.dispatchEvent(new CustomEvent(DRAGGED_LEFT_EVENT_NAME, { detail: {
		draggedEl,
		type: DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER,
		theOtherDz
	} }));
}
function dispatchDraggedElementLeftContainerForNone(containerEl, draggedEl) {
	containerEl.dispatchEvent(new CustomEvent(DRAGGED_LEFT_EVENT_NAME, { detail: {
		draggedEl,
		type: DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY
	} }));
}
function dispatchDraggedElementIsOverIndex(containerEl, indexObj, draggedEl) {
	containerEl.dispatchEvent(new CustomEvent(DRAGGED_OVER_INDEX_EVENT_NAME, { detail: {
		indexObj,
		draggedEl
	} }));
}
function dispatchDraggedLeftDocument(draggedEl) {
	window.dispatchEvent(new CustomEvent(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, { detail: { draggedEl } }));
}
var TRIGGERS = {
	DRAG_STARTED: "dragStarted",
	DRAGGED_ENTERED: DRAGGED_ENTERED_EVENT_NAME,
	DRAGGED_ENTERED_ANOTHER: "dragEnteredAnother",
	DRAGGED_OVER_INDEX: DRAGGED_OVER_INDEX_EVENT_NAME,
	DRAGGED_LEFT: DRAGGED_LEFT_EVENT_NAME,
	DRAGGED_LEFT_ALL: "draggedLeftAll",
	DROPPED_INTO_ZONE: "droppedIntoZone",
	DROPPED_INTO_ANOTHER: "droppedIntoAnother",
	DROPPED_OUTSIDE_OF_ANY: "droppedOutsideOfAny",
	DRAG_STOPPED: "dragStopped"
};
var SOURCES = {
	POINTER: "pointer",
	KEYBOARD: "keyboard"
};
var SHADOW_ITEM_MARKER_PROPERTY_NAME = "isDndShadowItem";
var SHADOW_ELEMENT_ATTRIBUTE_NAME = "data-is-dnd-shadow-item-internal";
var SHADOW_ELEMENT_HINT_ATTRIBUTE_NAME = "data-is-dnd-shadow-item-hint";
var SHADOW_PLACEHOLDER_ITEM_ID = "id:dnd-shadow-placeholder-0000";
var DRAGGED_ELEMENT_ID = "dnd-action-dragged-el";
var ITEM_ID_KEY = "id";
var activeDndZoneCount = 0;
function incrementActiveDropZoneCount() {
	activeDndZoneCount++;
}
function decrementActiveDropZoneCount() {
	if (activeDndZoneCount === 0) throw new Error("Bug! trying to decrement when there are no dropzones");
	activeDndZoneCount--;
}
var isOnServer = typeof window === "undefined";
/**
* Gets the bounding rect but removes transforms (ex: flip animation)
* @param {HTMLElement} el
* @param {boolean} [onlyVisible] - use the visible rect defaults to true
* @return {{top: number, left: number, bottom: number, right: number}}
*/
function getBoundingRectNoTransforms(el) {
	var onlyVisible = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
	var ta;
	var rect = onlyVisible ? getVisibleRectRecursive(el) : el.getBoundingClientRect();
	var style = getComputedStyle(el);
	var tx = style.transform;
	if (tx) {
		var sx, sy, dx, dy;
		if (tx.startsWith("matrix3d(")) {
			ta = tx.slice(9, -1).split(/, /);
			sx = +ta[0];
			sy = +ta[5];
			dx = +ta[12];
			dy = +ta[13];
		} else if (tx.startsWith("matrix(")) {
			ta = tx.slice(7, -1).split(/, /);
			sx = +ta[0];
			sy = +ta[3];
			dx = +ta[4];
			dy = +ta[5];
		} else return rect;
		var to = style.transformOrigin;
		var x = rect.x - dx - (1 - sx) * parseFloat(to);
		var y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
		var w = sx ? rect.width / sx : el.offsetWidth;
		var h = sy ? rect.height / sy : el.offsetHeight;
		return {
			x,
			y,
			width: w,
			height: h,
			top: y,
			right: x + w,
			bottom: y + h,
			left: x
		};
	} else return rect;
}
/**
* Gets the absolute bounding rect (accounts for the window's scroll position and removes transforms)
* @param {HTMLElement} el
* @return {{top: number, left: number, bottom: number, right: number}}
*/
function getAbsoluteRectNoTransforms(el) {
	var rect = getBoundingRectNoTransforms(el);
	return {
		top: rect.top + window.scrollY,
		bottom: rect.bottom + window.scrollY,
		left: rect.left + window.scrollX,
		right: rect.right + window.scrollX
	};
}
/**
* Gets the absolute bounding rect (accounts for the window's scroll position)
* @param {HTMLElement} el
* @return {{top: number, left: number, bottom: number, right: number}}
*/
function getAbsoluteRect(el) {
	var rect = el.getBoundingClientRect();
	return {
		top: rect.top + window.scrollY,
		bottom: rect.bottom + window.scrollY,
		left: rect.left + window.scrollX,
		right: rect.right + window.scrollX
	};
}
/**
* finds the center :)
* @typedef {Object} Rect
* @property {number} top
* @property {number} bottom
* @property {number} left
* @property {number} right
* @param {Rect} rect
* @return {{x: number, y: number}}
*/
function findCenter(rect) {
	return {
		x: (rect.left + rect.right) / 2,
		y: (rect.top + rect.bottom) / 2
	};
}
/**
* @typedef {Object} Point
* @property {number} x
* @property {number} y
* @param {Point} pointA
* @param {Point} pointB
* @return {number}
*/
function calcDistance(pointA, pointB) {
	return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}
/**
* @param {Point} point
* @param {Rect} rect
* @return {boolean|boolean}
*/
function isPointInsideRect(point, rect) {
	return point.y <= rect.bottom && point.y >= rect.top && point.x >= rect.left && point.x <= rect.right;
}
/**
* find the absolute coordinates of the center of a dom element
* @param el {HTMLElement}
* @returns {{x: number, y: number}}
*/
function findCenterOfElement(el) {
	return findCenter(getAbsoluteRect(el));
}
/**
* Calculate distance from a point to the center of an element
* @param {{x: number, y: number}} point
* @param {HTMLElement|ChildNode} el
* @return {number}
*/
function calcDistanceFromPointToCenter(point, el) {
	return calcDistance(point, findCenterOfElement(el));
}
/**
* @param {HTMLElement} el - the element to check
* @returns {boolean} - true if the element in its entirety is off-screen including the scrollable area (the normal dom events look at the mouse rather than the element)
*/
function isElementOffDocument(el) {
	var rect = getAbsoluteRect(el);
	return rect.right < 0 || rect.left > document.documentElement.scrollWidth || rect.bottom < 0 || rect.top > document.documentElement.scrollHeight;
}
/**
* Computes the portion of an element that is actually visible inside its scrollable
* ancestor containers. If the element is clipped by any scrollable ancestor (overflow: auto|scroll),
* the returned rect is the clipped one. If it is not clipped by any scrollable ancestor but is
* partially or fully outside the viewport, the function returns the element's full bounding rect
* (i.e. it does NOT clip to the viewport).
*
* This is useful for distinguishing "hidden because parent scrolls" from
* "hidden because off-screen".
*
* @param {HTMLElement} element - The DOM element to measure.
* @returns {{top: number, bottom: number, left: number, right: number, width: number, height: number}}
* An object describing the visible rectangle in viewport coordinates.
*/
function getVisibleRectRecursive(element) {
	var rect = element.getBoundingClientRect();
	var visibleRect = {
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right
	};
	var wasClippedByScrollY = false;
	var wasClippedByScrollX = false;
	var parent = element.parentElement;
	while (parent && parent !== document.body) {
		var style = window.getComputedStyle(parent);
		var overflowY = style.overflowY;
		var overflowX = style.overflowX;
		var isScrollableY = overflowY === "scroll" || overflowY === "auto";
		var isScrollableX = overflowX === "scroll" || overflowX === "auto";
		if (isScrollableY || isScrollableX) {
			var parentRect = parent.getBoundingClientRect();
			if (isScrollableY) {
				var newTop = Math.max(visibleRect.top, parentRect.top);
				var newBottom = Math.min(visibleRect.bottom, parentRect.bottom);
				if (newTop !== visibleRect.top || newBottom !== visibleRect.bottom) wasClippedByScrollY = true;
				visibleRect.top = newTop;
				visibleRect.bottom = newBottom;
			}
			if (isScrollableX) {
				var newLeft = Math.max(visibleRect.left, parentRect.left);
				var newRight = Math.min(visibleRect.right, parentRect.right);
				if (newLeft !== visibleRect.left || newRight !== visibleRect.right) wasClippedByScrollX = true;
				visibleRect.left = newLeft;
				visibleRect.right = newRight;
			}
		}
		parent = parent.parentElement;
	}
	if (wasClippedByScrollY || wasClippedByScrollX) return {
		top: visibleRect.top,
		bottom: visibleRect.bottom,
		left: visibleRect.left,
		right: visibleRect.right,
		width: Math.max(0, visibleRect.right - visibleRect.left),
		height: Math.max(0, visibleRect.bottom - visibleRect.top)
	};
	return {
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right,
		width: Math.max(0, rect.right - rect.left),
		height: Math.max(0, rect.bottom - rect.top)
	};
}
var dzToShadowIndexToRect;
/**
* Resets the cache that allows for smarter "would be index" resolution. Should be called after every drag operation
*/
function resetIndexesCache() {
	dzToShadowIndexToRect = /* @__PURE__ */ new Map();
}
resetIndexesCache();
/**
* Caches the coordinates of the shadow element when it's in a certain index in a certain dropzone.
* Helpful in order to determine "would be index" more effectively
* @param {HTMLElement} dz
* @return {number} - the shadow element index
*/
function cacheShadowRect(dz) {
	var shadowElIndex = Array.from(dz.children).findIndex(function(child) {
		return child.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
	});
	if (shadowElIndex >= 0) {
		if (!dzToShadowIndexToRect.has(dz)) dzToShadowIndexToRect.set(dz, /* @__PURE__ */ new Map());
		dzToShadowIndexToRect.get(dz).set(shadowElIndex, getAbsoluteRectNoTransforms(dz.children[shadowElIndex]));
		return shadowElIndex;
	}
}
/**
* @typedef {Object} Index
* @property {number} index - the would be index
* @property {boolean} isProximityBased - false if the element is actually over the index, true if it is not over it but this index is the closest
*/
/**
* Find the index for the dragged element in the list it is dragged over
* @param {{x: number, y: number}} referencePoint - The reference point for detection (cursor position or element center)
* @param {HTMLElement} collectionBelowEl
* @returns {Index|null} -  if the element is over the container the Index object otherwise null
*/
function findWouldBeIndex(referencePoint, collectionBelowEl) {
	if (!isPointInsideRect(referencePoint, getAbsoluteRectNoTransforms(collectionBelowEl))) return null;
	var children = collectionBelowEl.children;
	if (children.length === 0) return {
		index: 0,
		isProximityBased: true
	};
	var shadowElIndex = cacheShadowRect(collectionBelowEl);
	for (var i = 0; i < children.length; i++) if (isPointInsideRect(referencePoint, getAbsoluteRectNoTransforms(children[i]))) {
		var cachedShadowRect = dzToShadowIndexToRect.has(collectionBelowEl) && dzToShadowIndexToRect.get(collectionBelowEl).get(i);
		if (cachedShadowRect) {
			if (!isPointInsideRect(referencePoint, cachedShadowRect)) return {
				index: shadowElIndex,
				isProximityBased: false
			};
		}
		return {
			index: i,
			isProximityBased: false
		};
	}
	var minDistanceSoFar = Number.MAX_VALUE;
	var indexOfMin = void 0;
	for (var _i = 0; _i < children.length; _i++) {
		var distance = calcDistanceFromPointToCenter(referencePoint, children[_i]);
		if (distance < minDistanceSoFar) {
			minDistanceSoFar = distance;
			indexOfMin = _i;
		}
	}
	if (children.length > 0) {
		var originalLen = children.length;
		var phantom = children[originalLen - 1].cloneNode(false);
		phantom.style.visibility = "hidden";
		phantom.style.pointerEvents = "none";
		collectionBelowEl.appendChild(phantom);
		if (calcDistanceFromPointToCenter(referencePoint, phantom) < minDistanceSoFar) indexOfMin = originalLen;
		collectionBelowEl.removeChild(phantom);
	}
	return {
		index: indexOfMin,
		isProximityBased: true
	};
}
/**
* @param {Object} object
* @return {string}
*/
function toString(object) {
	return JSON.stringify(object, null, 2);
}
/**
* Finds the depth of the given node in the DOM tree
* @param {HTMLElement} node
* @return {number} - the depth of the node
*/
function getDepth(node) {
	if (!node) throw new Error("cannot get depth of a falsy node");
	return _getDepth(node, 0);
}
function _getDepth(node) {
	var countSoFar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	if (!node.parentElement) return countSoFar - 1;
	return _getDepth(node.parentElement, countSoFar + 1);
}
/**
* A simple util to shallow compare objects quickly, it doesn't validate the arguments so pass objects in
* @param {Object} objA
* @param {Object} objB
* @return {boolean} - true if objA and objB are shallow equal
*/
function areObjectsShallowEqual(objA, objB) {
	if (Object.keys(objA).length !== Object.keys(objB).length) return false;
	for (var keyA in objA) if (!{}.hasOwnProperty.call(objB, keyA) || objB[keyA] !== objA[keyA]) return false;
	return true;
}
/**
* Shallow compares two arrays
* @param arrA
* @param arrB
* @return {boolean} - whether the arrays are shallow equal
*/
function areArraysShallowEqualSameOrder(arrA, arrB) {
	if (arrA.length !== arrB.length) return false;
	for (var i = 0; i < arrA.length; i++) if (arrA[i] !== arrB[i]) return false;
	return true;
}
var INTERVAL_MS = 200;
var TOLERANCE_PX = 10;
var next;
/**
* Tracks the dragged elements and performs the side effects when it is dragged over a drop zone (basically dispatching custom-events scrolling)
* @param {Set<HTMLElement>} dropZones
* @param {HTMLElement} draggedEl
* @param {number} [intervalMs = INTERVAL_MS]
* @param {MultiScroller} multiScroller
* @param {function(): {x: number, y: number}} getReferencePoint - Function that returns the reference point for detection (cursor or element center)
*/
function observe(draggedEl, dropZones) {
	var intervalMs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : INTERVAL_MS;
	var multiScroller = arguments.length > 3 ? arguments[3] : void 0;
	var getReferencePoint = arguments.length > 4 ? arguments[4] : void 0;
	var lastDropZoneFound;
	var lastIndexFound;
	var lastIsDraggedInADropZone = false;
	var lastCentrePositionOfDragged;
	var dropZonesFromDeepToShallow = Array.from(dropZones).sort(function(dz1, dz2) {
		return getDepth(dz2) - getDepth(dz1);
	});
	/**
	* The main function in this module. Tracks where everything is/ should be a take the actions
	*/
	function andNow() {
		var referencePoint = getReferencePoint();
		var scrolled = multiScroller.multiScrollIfNeeded();
		if (!scrolled && lastCentrePositionOfDragged && Math.abs(lastCentrePositionOfDragged.x - referencePoint.x) < TOLERANCE_PX && Math.abs(lastCentrePositionOfDragged.y - referencePoint.y) < TOLERANCE_PX) {
			next = window.setTimeout(andNow, intervalMs);
			return;
		}
		if (isElementOffDocument(draggedEl)) {
			dispatchDraggedLeftDocument(draggedEl);
			return;
		}
		lastCentrePositionOfDragged = referencePoint;
		var isDraggedInADropZone = false;
		var _iterator = _createForOfIteratorHelper(dropZonesFromDeepToShallow), _step;
		try {
			for (_iterator.s(); !(_step = _iterator.n()).done;) {
				var dz = _step.value;
				if (scrolled) resetIndexesCache();
				var indexObj = findWouldBeIndex(referencePoint, dz);
				if (indexObj === null) continue;
				var index = indexObj.index;
				isDraggedInADropZone = true;
				if (dz !== lastDropZoneFound) {
					lastDropZoneFound && dispatchDraggedElementLeftContainerForAnother(lastDropZoneFound, draggedEl, dz);
					dispatchDraggedElementEnteredContainer(dz, indexObj, draggedEl);
					lastDropZoneFound = dz;
				} else if (index !== lastIndexFound) {
					dispatchDraggedElementIsOverIndex(dz, indexObj, draggedEl);
					lastIndexFound = index;
				}
				break;
			}
		} catch (err) {
			_iterator.e(err);
		} finally {
			_iterator.f();
		}
		if (!isDraggedInADropZone && lastIsDraggedInADropZone && lastDropZoneFound) {
			dispatchDraggedElementLeftContainerForNone(lastDropZoneFound, draggedEl);
			lastDropZoneFound = void 0;
			lastIndexFound = void 0;
			lastIsDraggedInADropZone = false;
		} else lastIsDraggedInADropZone = true;
		next = window.setTimeout(andNow, intervalMs);
	}
	andNow();
}
function unobserve() {
	clearTimeout(next);
	resetIndexesCache();
}
var SCROLL_ZONE_PX = 30;
/**
* Will make a scroller that can scroll any element given to it in any direction
* @returns {{scrollIfNeeded: function(Point, HTMLElement): boolean, resetScrolling: function(void):void}}
*/
function makeScroller() {
	var scrollingInfo;
	function resetScrolling() {
		scrollingInfo = {
			directionObj: void 0,
			stepPx: 0
		};
	}
	resetScrolling();
	function scrollContainer(containerEl) {
		var _scrollingInfo = scrollingInfo, directionObj = _scrollingInfo.directionObj, stepPx = _scrollingInfo.stepPx;
		if (directionObj) {
			containerEl.scrollBy(directionObj.x * stepPx, directionObj.y * stepPx);
			window.requestAnimationFrame(function() {
				return scrollContainer(containerEl);
			});
		}
	}
	function calcScrollStepPx(distancePx) {
		return SCROLL_ZONE_PX - distancePx;
	}
	/**
	* @param {Point} pointer - the pointer will be used to decide in which direction to scroll
	* @param {HTMLElement} elementToScroll - the scroll container
	* If the pointer is next to the sides of the element to scroll, will trigger scrolling
	* Can be called repeatedly with updated pointer and elementToScroll values without issues
	* @return {boolean} - true if scrolling was needed
	*/
	function scrollIfNeeded(pointer, elementToScroll) {
		if (!elementToScroll) return false;
		var distances = calcInnerDistancesBetweenPointAndSidesOfElement(pointer, elementToScroll);
		var isAlreadyScrolling = !!scrollingInfo.directionObj;
		if (distances === null) {
			if (isAlreadyScrolling) resetScrolling();
			return false;
		}
		var scrollingVertically = false, scrollingHorizontally = false;
		if (elementToScroll.scrollHeight > elementToScroll.clientHeight) {
			if (distances.bottom < SCROLL_ZONE_PX) {
				scrollingVertically = true;
				scrollingInfo.directionObj = {
					x: 0,
					y: 1
				};
				scrollingInfo.stepPx = calcScrollStepPx(distances.bottom);
			} else if (distances.top < SCROLL_ZONE_PX) {
				scrollingVertically = true;
				scrollingInfo.directionObj = {
					x: 0,
					y: -1
				};
				scrollingInfo.stepPx = calcScrollStepPx(distances.top);
			}
			if (!isAlreadyScrolling && scrollingVertically) {
				scrollContainer(elementToScroll);
				return true;
			}
		}
		if (elementToScroll.scrollWidth > elementToScroll.clientWidth) {
			if (distances.right < SCROLL_ZONE_PX) {
				scrollingHorizontally = true;
				scrollingInfo.directionObj = {
					x: 1,
					y: 0
				};
				scrollingInfo.stepPx = calcScrollStepPx(distances.right);
			} else if (distances.left < SCROLL_ZONE_PX) {
				scrollingHorizontally = true;
				scrollingInfo.directionObj = {
					x: -1,
					y: 0
				};
				scrollingInfo.stepPx = calcScrollStepPx(distances.left);
			}
			if (!isAlreadyScrolling && scrollingHorizontally) {
				scrollContainer(elementToScroll);
				return true;
			}
		}
		resetScrolling();
		return false;
	}
	return {
		scrollIfNeeded,
		resetScrolling
	};
}
/**
* If the point is inside the element returns its distances from the sides, otherwise returns null
* @param {Point} point
* @param {HTMLElement} el
* @return {null|{top: number, left: number, bottom: number, right: number}}
*/
function calcInnerDistancesBetweenPointAndSidesOfElement(point, el) {
	var rect = el === document.scrollingElement ? {
		top: 0,
		bottom: window.innerHeight,
		left: 0,
		right: window.innerWidth
	} : el.getBoundingClientRect();
	if (!isPointInsideRect(point, rect)) return null;
	return {
		top: point.y - rect.top,
		bottom: rect.bottom - point.y,
		left: point.x - rect.left,
		right: rect.right - point.x
	};
}
/**
@typedef {Object} MultiScroller
@property {function():boolean} multiScrollIfNeeded - call this on every "tick" to scroll containers if needed, returns true if anything was scrolled
/**
* Creates a scroller than can scroll any of the provided containers or any of their scrollable parents (including the document's scrolling element)
* @param {HTMLElement[]} baseElementsForScrolling
* @param {function():Point} getPointerPosition
* @return {MultiScroller}
*/
function createMultiScroller() {
	var baseElementsForScrolling = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
	var getPointerPosition = arguments.length > 1 ? arguments[1] : void 0;
	var scrollingContainersSet = findRelevantScrollContainers(baseElementsForScrolling);
	var scrollingContainersDeepToShallow = Array.from(scrollingContainersSet).sort(function(dz1, dz2) {
		return getDepth(dz2) - getDepth(dz1);
	});
	var _makeScroller = makeScroller(), scrollIfNeeded = _makeScroller.scrollIfNeeded, resetScrolling = _makeScroller.resetScrolling;
	/**
	* @return {boolean} - was any container scrolled
	*/
	function tick() {
		var mousePosition = getPointerPosition();
		if (!mousePosition || !scrollingContainersDeepToShallow) return false;
		var scrollContainersUnderCursor = scrollingContainersDeepToShallow.filter(function(el) {
			return isPointInsideRect(mousePosition, el.getBoundingClientRect()) || el === document.scrollingElement;
		});
		for (var i = 0; i < scrollContainersUnderCursor.length; i++) if (scrollIfNeeded(mousePosition, scrollContainersUnderCursor[i])) return true;
		return false;
	}
	return {
		multiScrollIfNeeded: scrollingContainersSet.size > 0 ? tick : function() {
			return false;
		},
		destroy: function destroy() {
			return resetScrolling();
		}
	};
}
function findScrollableParents(element) {
	if (!element) return [];
	var scrollableContainers = [];
	var parent = element;
	while (parent) {
		if (window.getComputedStyle(parent).overflow.split(" ").some(function(o) {
			return o.includes("auto") || o.includes("scroll");
		})) scrollableContainers.push(parent);
		parent = parent.parentElement;
	}
	return scrollableContainers;
}
function findRelevantScrollContainers(dropZones) {
	var scrollingContainers = /* @__PURE__ */ new Set();
	var _iterator = _createForOfIteratorHelper(dropZones), _step;
	try {
		for (_iterator.s(); !(_step = _iterator.n()).done;) {
			var dz = _step.value;
			findScrollableParents(dz).forEach(function(container) {
				return scrollingContainers.add(container);
			});
		}
	} catch (err) {
		_iterator.e(err);
	} finally {
		_iterator.f();
	}
	if (document.scrollingElement.scrollHeight > document.scrollingElement.clientHeight || document.scrollingElement.scrollWidth > document.scrollingElement.clientHeight) scrollingContainers.add(document.scrollingElement);
	return scrollingContainers;
}
/**
* Fixes svelte issue when cloning node containing (or being) <select> which will loose it's value.
* Since svelte manages select value internally.
* @see https://github.com/sveltejs/svelte/issues/6717
* @see https://github.com/isaacHagoel/svelte-dnd-action/issues/306
*
* @param {HTMLElement} el
* @returns
*/
function svelteNodeClone(el) {
	var cloned = el.cloneNode(true);
	var values = [];
	var elIsSelect = el.tagName === "SELECT";
	var selects = elIsSelect ? [el] : _toConsumableArray(el.querySelectorAll("select"));
	var _iterator = _createForOfIteratorHelper(selects), _step;
	try {
		for (_iterator.s(); !(_step = _iterator.n()).done;) {
			var _select = _step.value;
			values.push(_select.value);
		}
	} catch (err) {
		_iterator.e(err);
	} finally {
		_iterator.f();
	}
	if (selects.length > 0) {
		var clonedSelects = elIsSelect ? [cloned] : _toConsumableArray(cloned.querySelectorAll("select"));
		for (var i = 0; i < clonedSelects.length; i++) {
			var select = clonedSelects[i];
			var value = values[i];
			var optionEl = select.querySelector("option[value=\"".concat(value, "\""));
			if (optionEl) optionEl.setAttribute("selected", true);
		}
	}
	var elIsCanvas = el.tagName === "CANVAS";
	var canvases = elIsCanvas ? [el] : _toConsumableArray(el.querySelectorAll("canvas"));
	if (canvases.length > 0) {
		var clonedCanvases = elIsCanvas ? [cloned] : _toConsumableArray(cloned.querySelectorAll("canvas"));
		for (var _i = 0; _i < clonedCanvases.length; _i++) {
			var canvas = canvases[_i];
			var clonedCanvas = clonedCanvases[_i];
			clonedCanvas.width = canvas.width;
			clonedCanvas.height = canvas.height;
			if (canvas.width > 0 && canvas.height > 0) clonedCanvas.getContext("2d").drawImage(canvas, 0, 0);
		}
	}
	return cloned;
}
/**
* @type {{USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: string}}
*/
var FEATURE_FLAG_NAMES = Object.freeze({ USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT" });
var featureFlagsMap = _defineProperty({}, FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT, false);
/**
*
* @param {FEATURE_FLAG_NAMES} flagName
* @return {boolean}
*/
function getFeatureFlag(flagName) {
	if (!FEATURE_FLAG_NAMES[flagName]) throw new Error("Can't get non existing feature flag ".concat(flagName, "! Supported flags: ").concat(Object.keys(FEATURE_FLAG_NAMES)));
	return featureFlagsMap[flagName];
}
var TRANSITION_DURATION_SECONDS = .2;
/**
* private helper function - creates a transition string for a property
* @param {string} property
* @return {string} - the transition string
*/
function trs(property) {
	return "".concat(property, " ").concat(TRANSITION_DURATION_SECONDS, "s ease");
}
/**
* Adds the size transitions after the dragged element's initial styles have been applied.
* This normally happens in a timeout to avoid a browser rendering bug, but a synchronous
* first morph can happen before that timeout and needs the transitions immediately.
* @param {HTMLElement} draggedEl
*/
function ensureMorphSizeTransitions(draggedEl) {
	var transitionProperties = draggedEl.style.transitionProperty.split(",").map(function(property) {
		return property.trim();
	});
	if (transitionProperties.includes("all")) return;
	if (!transitionProperties.includes("width")) draggedEl.style.transition += ", ".concat(trs("width"));
	if (!transitionProperties.includes("height")) draggedEl.style.transition += ", ".concat(trs("height"));
}
/**
* clones the given element and applies proper styles and transitions to the dragged element
* @param {HTMLElement} originalElement
* @param {Point} [positionCenterOnXY]
* @return {Node} - the cloned, styled element
*/
function createDraggedElementFrom(originalElement, positionCenterOnXY) {
	var rect = originalElement.getBoundingClientRect();
	var draggedEl = svelteNodeClone(originalElement);
	copyStylesFromTo(originalElement, draggedEl);
	draggedEl.id = DRAGGED_ELEMENT_ID;
	draggedEl.style.position = "fixed";
	var elTopPx = rect.top;
	var elLeftPx = rect.left;
	draggedEl.style.top = "".concat(elTopPx, "px");
	draggedEl.style.left = "".concat(elLeftPx, "px");
	if (positionCenterOnXY) {
		var center = findCenter(rect);
		elTopPx -= center.y - positionCenterOnXY.y;
		elLeftPx -= center.x - positionCenterOnXY.x;
		window.setTimeout(function() {
			draggedEl.style.top = "".concat(elTopPx, "px");
			draggedEl.style.left = "".concat(elLeftPx, "px");
		}, 0);
	}
	draggedEl.style.margin = "0";
	draggedEl.style.boxSizing = "border-box";
	draggedEl.style.height = "".concat(rect.height, "px");
	draggedEl.style.width = "".concat(rect.width, "px");
	draggedEl.style.transition = "".concat(trs("top"), ", ").concat(trs("left"), ", ").concat(trs("background-color"), ", ").concat(trs("opacity"), ", ").concat(trs("color"), " ");
	window.setTimeout(function() {
		return ensureMorphSizeTransitions(draggedEl);
	}, 0);
	draggedEl.style.zIndex = "9999";
	draggedEl.style.cursor = "grabbing";
	return draggedEl;
}
/**
* styles the dragged element to a 'dropped' state
* @param {HTMLElement} draggedEl
*/
function moveDraggedElementToWasDroppedState(draggedEl) {
	draggedEl.style.cursor = "grab";
}
/**
* Morphs the dragged element style, maintains the mouse pointer within the element
* @param {HTMLElement} draggedEl
* @param {HTMLElement} copyFromEl - the element the dragged element should look like, typically the shadow element
* @param {number} currentMouseX
* @param {number} currentMouseY
*/
function morphDraggedElementToBeLike(draggedEl, copyFromEl, currentMouseX, currentMouseY) {
	ensureMorphSizeTransitions(draggedEl);
	copyStylesFromTo(copyFromEl, draggedEl);
	var newRect = copyFromEl.getBoundingClientRect();
	var draggedElRect = draggedEl.getBoundingClientRect();
	var draggedElComputedStyle = window.getComputedStyle(draggedEl);
	var currentLeft = parseFloat(draggedElComputedStyle.left);
	var currentTop = parseFloat(draggedElComputedStyle.top);
	var widthChange = newRect.width - draggedElRect.width;
	var heightChange = newRect.height - draggedElRect.height;
	if (widthChange || heightChange) {
		var relativeDistanceOfMousePointerFromDraggedSides = {
			left: draggedElRect.width ? (currentMouseX - draggedElRect.left) / draggedElRect.width : 0,
			top: draggedElRect.height ? (currentMouseY - draggedElRect.top) / draggedElRect.height : 0
		};
		if (!getFeatureFlag(FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT)) {
			draggedEl.style.height = "".concat(newRect.height, "px");
			draggedEl.style.width = "".concat(newRect.width, "px");
		}
		draggedEl.style.left = "".concat(currentLeft - relativeDistanceOfMousePointerFromDraggedSides.left * widthChange, "px");
		draggedEl.style.top = "".concat(currentTop - relativeDistanceOfMousePointerFromDraggedSides.top * heightChange, "px");
	}
}
/**
* @param {HTMLElement} copyFromEl
* @param {HTMLElement} copyToEl
*/
function copyStylesFromTo(copyFromEl, copyToEl) {
	var computedStyle = window.getComputedStyle(copyFromEl);
	Array.from(computedStyle).filter(function(s) {
		return s.startsWith("background") || s.startsWith("padding") || s.startsWith("font") || s.startsWith("text") || s.startsWith("align") || s.startsWith("justify") || s.startsWith("display") || s.startsWith("flex") || s.startsWith("border") || s === "opacity" || s === "color" || s === "list-style-type" || getFeatureFlag(FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT) && (s === "width" || s === "height");
	}).forEach(function(s) {
		return copyToEl.style.setProperty(s, computedStyle.getPropertyValue(s), computedStyle.getPropertyPriority(s));
	});
}
/**
* makes the element compatible with being draggable
* @param {HTMLElement} draggableEl
* @param {boolean} dragDisabled
*/
function styleDraggable(draggableEl, dragDisabled) {
	draggableEl.draggable = false;
	draggableEl.ondragstart = function() {
		return false;
	};
	if (!dragDisabled) {
		draggableEl.style.userSelect = "none";
		draggableEl.style.WebkitUserSelect = "none";
		draggableEl.style.cursor = "grab";
	} else {
		draggableEl.style.userSelect = "";
		draggableEl.style.WebkitUserSelect = "";
		draggableEl.style.cursor = "";
	}
}
/**
* Hides the provided element so that it can stay in the dom without interrupting
* @param {HTMLElement} dragTarget
*/
function hideElement(dragTarget) {
	dragTarget.style.display = "none";
	dragTarget.style.position = "fixed";
	dragTarget.style.zIndex = "-5";
}
/**
* styles the shadow element
* @param {HTMLElement} shadowEl
*/
function decorateShadowEl(shadowEl) {
	shadowEl.style.visibility = "hidden";
	shadowEl.setAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME, "true");
}
/**
* undo the styles the shadow element
* @param {HTMLElement} shadowEl
*/
function unDecorateShadowElement(shadowEl) {
	shadowEl.style.visibility = "";
	shadowEl.removeAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
}
/**
* will mark the given dropzones as visually active
* @param {Array<HTMLElement>} dropZones
* @param {Function} getStyles - maps a dropzone to a styles object (so the styles can be removed)
* @param {Function} getClasses - maps a dropzone to a classList
*/
function styleActiveDropZones(dropZones) {
	var getStyles = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {};
	var getClasses = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function() {
		return [];
	};
	dropZones.forEach(function(dz) {
		var styles = getStyles(dz);
		Object.keys(styles).forEach(function(style) {
			dz.style[style] = styles[style];
		});
		getClasses(dz).forEach(function(c) {
			return dz.classList.add(c);
		});
	});
}
/**
* will remove the 'active' styling from given dropzones
* @param {Array<HTMLElement>} dropZones
* @param {Function} getStyles - maps a dropzone to a styles object
* @param {Function} getClasses - maps a dropzone to a classList
*/
function styleInactiveDropZones(dropZones) {
	var getStyles = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {};
	var getClasses = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function() {
		return [];
	};
	dropZones.forEach(function(dz) {
		var styles = getStyles(dz);
		Object.keys(styles).forEach(function(style) {
			dz.style[style] = "";
		});
		getClasses(dz).forEach(function(c) {
			return dz.classList.contains(c) && dz.classList.remove(c);
		});
	});
}
/**
* will prevent the provided element from shrinking by setting its minWidth and minHeight to the current width and height values
* @param {HTMLElement} el
* @return {function(): void} - run this function to undo the operation and restore the original values
*/
function preventShrinking(el) {
	var originalMinHeight = el.style.minHeight;
	el.style.minHeight = window.getComputedStyle(el).getPropertyValue("height");
	var originalMinWidth = el.style.minWidth;
	el.style.minWidth = window.getComputedStyle(el).getPropertyValue("width");
	return function undo() {
		el.style.minHeight = originalMinHeight;
		el.style.minWidth = originalMinWidth;
	};
}
var DEFAULT_DROP_ZONE_TYPE$1 = "--any--";
var MIN_OBSERVATION_INTERVAL_MS = 100;
var DISABLED_OBSERVATION_INTERVAL_MS = 20;
var MIN_MOVEMENT_BEFORE_DRAG_START_PX = 3;
var DEFAULT_TOUCH_DELAY_MS = 80;
var DEFAULT_DROP_TARGET_STYLE$1 = { outline: "rgba(255, 255, 102, 0.7) solid 2px" };
var ORIGINAL_DRAGGED_ITEM_MARKER_ATTRIBUTE = "data-is-dnd-original-dragged-item";
var originalDragTarget;
var draggedEl;
var draggedElData;
var draggedElType;
var originDropZone;
var originIndex;
var shadowElData;
var shadowElDropZone;
var dragStartMousePosition;
var currentMousePosition;
var isWorkingOnPreviousDrag = false;
var finalizingPreviousDrag = false;
var unlockOriginDzMinDimensions;
var isDraggedOutsideOfAnyDz = false;
var scheduledForRemovalAfterDrop = [];
var multiScroller;
var touchDragHoldTimer;
var touchHoldElapsed = false;
var useCursorForDetectionActive = false;
var pendingDragOwner;
var watchedDropZones = /* @__PURE__ */ new Set();
var typeToDropZones$1 = /* @__PURE__ */ new Map();
var dzToConfig$1 = /* @__PURE__ */ new Map();
var elToMouseDownListener = /* @__PURE__ */ new WeakMap();
function registerDropZone$1(dropZoneEl, type) {
	if (!typeToDropZones$1.has(type)) typeToDropZones$1.set(type, /* @__PURE__ */ new Set());
	if (!typeToDropZones$1.get(type).has(dropZoneEl)) {
		typeToDropZones$1.get(type).add(dropZoneEl);
		incrementActiveDropZoneCount();
	}
}
function unregisterDropZone$1(dropZoneEl, type) {
	var dropZones = typeToDropZones$1.get(type);
	if (!dropZones || !dropZones["delete"](dropZoneEl)) return;
	decrementActiveDropZoneCount();
	if (dropZones.size === 0) typeToDropZones$1["delete"](type);
}
function watchDraggedElement() {
	var dropZones = typeToDropZones$1.get(draggedElType);
	if (!dropZones || dropZones.size === 0) return;
	if (watchedDropZones.size > 0) unWatchDraggedElement();
	watchedDropZones = new Set(dropZones);
	var _iterator = _createForOfIteratorHelper(watchedDropZones), _step;
	try {
		for (_iterator.s(); !(_step = _iterator.n()).done;) {
			var dz = _step.value;
			dz.addEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
			dz.addEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
			dz.addEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
		}
	} catch (err) {
		_iterator.e(err);
	} finally {
		_iterator.f();
	}
	window.addEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop$1);
	var setIntervalMs = Math.max.apply(Math, _toConsumableArray(Array.from(watchedDropZones).map(function(dz) {
		return dzToConfig$1.get(dz).dropAnimationDurationMs;
	})));
	var observationIntervalMs = setIntervalMs === 0 ? DISABLED_OBSERVATION_INTERVAL_MS : Math.max(setIntervalMs, MIN_OBSERVATION_INTERVAL_MS);
	multiScroller = createMultiScroller(watchedDropZones, function() {
		return currentMousePosition;
	});
	var getReferencePoint = useCursorForDetectionActive ? function() {
		return {
			x: currentMousePosition.x + window.scrollX,
			y: currentMousePosition.y + window.scrollY
		};
	} : function() {
		return findCenterOfElement(draggedEl);
	};
	observe(draggedEl, watchedDropZones, observationIntervalMs * 1.07, multiScroller, getReferencePoint);
}
function unWatchDraggedElement() {
	var _iterator2 = _createForOfIteratorHelper(watchedDropZones), _step2;
	try {
		for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
			var dz = _step2.value;
			dz.removeEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
			dz.removeEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
			dz.removeEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
		}
	} catch (err) {
		_iterator2.e(err);
	} finally {
		_iterator2.f();
	}
	watchedDropZones = /* @__PURE__ */ new Set();
	window.removeEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop$1);
	if (multiScroller) {
		multiScroller.destroy();
		multiScroller = void 0;
	}
	unobserve();
}
function findShadowElementIdx(items) {
	return items.findIndex(function(item) {
		return !!item[SHADOW_ITEM_MARKER_PROPERTY_NAME];
	});
}
function createShadowElData(draggedElData) {
	var _objectSpread2$1;
	return _objectSpread2(_objectSpread2({}, draggedElData), {}, (_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, SHADOW_ITEM_MARKER_PROPERTY_NAME, true), _defineProperty(_objectSpread2$1, ITEM_ID_KEY, SHADOW_PLACEHOLDER_ITEM_ID), _objectSpread2$1));
}
function handleDraggedEntered(e) {
	var _dzToConfig$get = dzToConfig$1.get(e.currentTarget), items = _dzToConfig$get.items;
	if (_dzToConfig$get.dropFromOthersDisabled && e.currentTarget !== originDropZone) return;
	isDraggedOutsideOfAnyDz = false;
	items = items.filter(function(item) {
		return item[ITEM_ID_KEY] !== shadowElData[ITEM_ID_KEY] && item[ITEM_ID_KEY] !== "id:dnd-shadow-placeholder-0000";
	});
	if (originDropZone !== e.currentTarget) {
		var newOriginZoneItems = dzToConfig$1.get(originDropZone).items.filter(function(item) {
			return !item[SHADOW_ITEM_MARKER_PROPERTY_NAME];
		});
		dispatchConsiderEvent(originDropZone, newOriginZoneItems, {
			trigger: TRIGGERS.DRAGGED_ENTERED_ANOTHER,
			id: draggedElData[ITEM_ID_KEY],
			source: SOURCES.POINTER
		});
	}
	var shadowElIdx = e.detail.indexObj.index;
	shadowElDropZone = e.currentTarget;
	items.splice(shadowElIdx, 0, shadowElData);
	dispatchConsiderEvent(e.currentTarget, items, {
		trigger: TRIGGERS.DRAGGED_ENTERED,
		id: draggedElData[ITEM_ID_KEY],
		source: SOURCES.POINTER
	});
}
function handleDraggedLeft(e) {
	if (!isWorkingOnPreviousDrag) return;
	var _dzToConfig$get2 = dzToConfig$1.get(e.currentTarget), originalItems = _dzToConfig$get2.items;
	if (_dzToConfig$get2.dropFromOthersDisabled && e.currentTarget !== originDropZone && e.currentTarget !== shadowElDropZone) return;
	var items = _toConsumableArray(originalItems);
	var shadowElIdx = findShadowElementIdx(items);
	if (shadowElIdx !== -1) items.splice(shadowElIdx, 1);
	var origShadowDz = shadowElDropZone;
	shadowElDropZone = void 0;
	var _e$detail = e.detail, type = _e$detail.type, theOtherDz = _e$detail.theOtherDz;
	if (type === DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY || type === DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER && theOtherDz !== originDropZone && dzToConfig$1.get(theOtherDz).dropFromOthersDisabled) {
		isDraggedOutsideOfAnyDz = true;
		shadowElDropZone = originDropZone;
		var originZoneItems = origShadowDz === originDropZone ? items : _toConsumableArray(dzToConfig$1.get(originDropZone).items);
		originZoneItems.splice(originIndex, 0, shadowElData);
		dispatchConsiderEvent(originDropZone, originZoneItems, {
			trigger: TRIGGERS.DRAGGED_LEFT_ALL,
			id: draggedElData[ITEM_ID_KEY],
			source: SOURCES.POINTER
		});
	}
	dispatchConsiderEvent(e.currentTarget, items, {
		trigger: TRIGGERS.DRAGGED_LEFT,
		id: draggedElData[ITEM_ID_KEY],
		source: SOURCES.POINTER
	});
}
function handleDraggedIsOverIndex(e) {
	var _dzToConfig$get3 = dzToConfig$1.get(e.currentTarget), originalItems = _dzToConfig$get3.items;
	if (_dzToConfig$get3.dropFromOthersDisabled && e.currentTarget !== originDropZone) return;
	var items = _toConsumableArray(originalItems);
	isDraggedOutsideOfAnyDz = false;
	var index = e.detail.indexObj.index;
	var shadowElIdx = findShadowElementIdx(items);
	if (shadowElIdx !== -1) items.splice(shadowElIdx, 1);
	items.splice(index, 0, shadowElData);
	dispatchConsiderEvent(e.currentTarget, items, {
		trigger: TRIGGERS.DRAGGED_OVER_INDEX,
		id: draggedElData[ITEM_ID_KEY],
		source: SOURCES.POINTER
	});
}
function handleMouseMove(e) {
	e.preventDefault();
	var c = e.touches ? e.touches[0] : e;
	currentMousePosition = {
		x: c.clientX,
		y: c.clientY
	};
	draggedEl.style.transform = "translate3d(".concat(currentMousePosition.x - dragStartMousePosition.x, "px, ").concat(currentMousePosition.y - dragStartMousePosition.y, "px, 0)");
}
function handleDrop$1() {
	finalizingPreviousDrag = true;
	window.removeEventListener("mousemove", handleMouseMove);
	window.removeEventListener("touchmove", handleMouseMove);
	window.removeEventListener("mouseup", handleDrop$1);
	window.removeEventListener("touchend", handleDrop$1);
	unWatchDraggedElement();
	moveDraggedElementToWasDroppedState(draggedEl);
	if (!shadowElDropZone) shadowElDropZone = originDropZone;
	var _dzToConfig$get4 = dzToConfig$1.get(shadowElDropZone), items = _dzToConfig$get4.items, type = _dzToConfig$get4.type;
	styleInactiveDropZones(typeToDropZones$1.get(type), function(dz) {
		return dzToConfig$1.get(dz).dropTargetStyle;
	}, function(dz) {
		return dzToConfig$1.get(dz).dropTargetClasses;
	});
	var shadowElIdx = findShadowElementIdx(items);
	if (shadowElIdx === -1) {
		if (shadowElDropZone === originDropZone) shadowElIdx = originIndex;
	}
	items = items.map(function(item) {
		return item["isDndShadowItem"] ? draggedElData : item;
	});
	function finalizeWithinZone() {
		unWatchDraggedElement();
		unlockOriginDzMinDimensions();
		dispatchFinalizeEvent(shadowElDropZone, items, {
			trigger: isDraggedOutsideOfAnyDz ? TRIGGERS.DROPPED_OUTSIDE_OF_ANY : TRIGGERS.DROPPED_INTO_ZONE,
			id: draggedElData[ITEM_ID_KEY],
			source: SOURCES.POINTER
		});
		if (shadowElDropZone !== originDropZone) dispatchFinalizeEvent(originDropZone, dzToConfig$1.get(originDropZone).items, {
			trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
			id: draggedElData[ITEM_ID_KEY],
			source: SOURCES.POINTER
		});
		var domShadowEl = Array.from(shadowElDropZone.children).find(function(c) {
			return c.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
		});
		if (domShadowEl) unDecorateShadowElement(domShadowEl);
		cleanupPostDrop();
	}
	if (dzToConfig$1.get(shadowElDropZone).dropAnimationDisabled) finalizeWithinZone();
	else animateDraggedToFinalPosition(shadowElIdx, finalizeWithinZone);
}
function animateDraggedToFinalPosition(shadowElIdx, callback) {
	var shadowElRect = shadowElIdx > -1 ? getBoundingRectNoTransforms(shadowElDropZone.children[shadowElIdx], false) : getBoundingRectNoTransforms(shadowElDropZone, false);
	var newTransform = {
		x: shadowElRect.left - parseFloat(draggedEl.style.left),
		y: shadowElRect.top - parseFloat(draggedEl.style.top)
	};
	var dropAnimationDurationMs = dzToConfig$1.get(shadowElDropZone).dropAnimationDurationMs;
	var transition = "transform ".concat(dropAnimationDurationMs, "ms ease");
	draggedEl.style.transition = draggedEl.style.transition ? draggedEl.style.transition + "," + transition : transition;
	draggedEl.style.transform = "translate3d(".concat(newTransform.x, "px, ").concat(newTransform.y, "px, 0)");
	window.setTimeout(callback, dropAnimationDurationMs);
}
function scheduleDZForRemovalAfterDrop(dz, destroy) {
	var scheduledRemoval = {
		dz,
		destroy
	};
	scheduledForRemovalAfterDrop.push(scheduledRemoval);
	window.requestAnimationFrame(function() {
		if (!scheduledForRemovalAfterDrop.includes(scheduledRemoval)) return;
		hideElement(dz);
		document.body.appendChild(dz);
	});
}
function cleanupPostDrop() {
	if (draggedEl && draggedEl.remove) draggedEl.remove();
	if (originalDragTarget && originalDragTarget.remove) originalDragTarget.remove();
	draggedEl = void 0;
	originalDragTarget = void 0;
	draggedElData = void 0;
	draggedElType = void 0;
	originDropZone = void 0;
	originIndex = void 0;
	shadowElData = void 0;
	shadowElDropZone = void 0;
	dragStartMousePosition = void 0;
	currentMousePosition = void 0;
	isWorkingOnPreviousDrag = false;
	finalizingPreviousDrag = false;
	unlockOriginDzMinDimensions = void 0;
	isDraggedOutsideOfAnyDz = false;
	if (touchDragHoldTimer) clearTimeout(touchDragHoldTimer);
	touchDragHoldTimer = void 0;
	touchHoldElapsed = false;
	useCursorForDetectionActive = false;
	pendingDragOwner = void 0;
	if (scheduledForRemovalAfterDrop.length) {
		scheduledForRemovalAfterDrop.forEach(function(_ref) {
			var dz = _ref.dz, destroy = _ref.destroy;
			destroy();
			dz.remove();
		});
		scheduledForRemovalAfterDrop = [];
	}
}
function dndzone$2(node, options) {
	var initialized = false;
	var destroyed = false;
	var config = {
		items: void 0,
		type: void 0,
		flipDurationMs: 0,
		dragDisabled: false,
		morphDisabled: false,
		dropFromOthersDisabled: false,
		dropTargetStyle: DEFAULT_DROP_TARGET_STYLE$1,
		dropTargetClasses: [],
		transformDraggedElement: function transformDraggedElement() {},
		centreDraggedOnCursor: false,
		useCursorForDetection: false,
		dropAnimationDisabled: false,
		delayTouchStartMs: 0
	};
	var elToIdx = /* @__PURE__ */ new Map();
	function addMaybeListeners() {
		window.addEventListener("mousemove", handleMouseMoveMaybeDragStart, { passive: false });
		window.addEventListener("touchmove", handleMouseMoveMaybeDragStart, {
			passive: false,
			capture: false
		});
		window.addEventListener("mouseup", handleFalseAlarm, { passive: false });
		window.addEventListener("touchend", handleFalseAlarm, { passive: false });
	}
	function removeMaybeListeners() {
		window.removeEventListener("mousemove", handleMouseMoveMaybeDragStart);
		window.removeEventListener("touchmove", handleMouseMoveMaybeDragStart);
		window.removeEventListener("mouseup", handleFalseAlarm);
		window.removeEventListener("touchend", handleFalseAlarm);
		if (touchDragHoldTimer) {
			clearTimeout(touchDragHoldTimer);
			touchDragHoldTimer = void 0;
			touchHoldElapsed = false;
		}
	}
	function cancelPendingDrag() {
		if (pendingDragOwner !== node) return;
		removeMaybeListeners();
		pendingDragOwner = void 0;
		originalDragTarget = void 0;
		dragStartMousePosition = void 0;
		currentMousePosition = void 0;
	}
	function handleFalseAlarm(e) {
		if (pendingDragOwner !== node) return;
		cancelPendingDrag();
		if (e.type === "touchend") {
			var clickEvent = new Event("click", {
				bubbles: true,
				cancelable: true
			});
			e.target.dispatchEvent(clickEvent);
		}
	}
	function handleMouseMoveMaybeDragStart(e) {
		if (destroyed || pendingDragOwner !== node) return;
		var isTouch = !!e.touches;
		var c = isTouch ? e.touches[0] : e;
		if (isTouch && config.delayTouchStartMs > 0 && !touchHoldElapsed) {
			currentMousePosition = {
				x: c.clientX,
				y: c.clientY
			};
			if (Math.abs(currentMousePosition.x - dragStartMousePosition.x) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX || Math.abs(currentMousePosition.y - dragStartMousePosition.y) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX) {
				if (touchDragHoldTimer) {
					clearTimeout(touchDragHoldTimer);
					touchDragHoldTimer = void 0;
				}
				handleFalseAlarm(e);
			}
			return;
		}
		e.preventDefault();
		currentMousePosition = {
			x: c.clientX,
			y: c.clientY
		};
		if (Math.abs(currentMousePosition.x - dragStartMousePosition.x) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX || Math.abs(currentMousePosition.y - dragStartMousePosition.y) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX) handleDragStart();
	}
	function handleMouseDown(e) {
		if (e.target !== e.currentTarget && (e.target.value !== void 0 || e.target.isContentEditable)) return;
		if (e.button) return;
		if (destroyed || isWorkingOnPreviousDrag || pendingDragOwner) return;
		var isTouchStart = !!e.touches;
		var useDelay = isTouchStart && config.delayTouchStartMs > 0;
		if (!useDelay) e.preventDefault();
		e.stopPropagation();
		pendingDragOwner = node;
		var c = isTouchStart ? e.touches[0] : e;
		dragStartMousePosition = {
			x: c.clientX,
			y: c.clientY
		};
		currentMousePosition = _objectSpread2({}, dragStartMousePosition);
		originalDragTarget = e.currentTarget;
		if (useDelay) {
			var pendingTarget = originalDragTarget;
			touchHoldElapsed = false;
			touchDragHoldTimer = window.setTimeout(function() {
				if (destroyed || pendingDragOwner !== node || originalDragTarget !== pendingTarget) return;
				touchHoldElapsed = true;
				handleDragStart();
			}, config.delayTouchStartMs);
		}
		addMaybeListeners();
	}
	function handleDragStart() {
		var _originalDragTarget;
		if (destroyed || pendingDragOwner !== node || isWorkingOnPreviousDrag || !((_originalDragTarget = originalDragTarget) !== null && _originalDragTarget !== void 0 && _originalDragTarget.parentElement)) {
			cancelPendingDrag();
			return;
		}
		removeMaybeListeners();
		pendingDragOwner = void 0;
		isWorkingOnPreviousDrag = true;
		var currentIdx = elToIdx.get(originalDragTarget);
		originIndex = currentIdx;
		originDropZone = originalDragTarget.parentElement;
		/** @type {ShadowRoot | HTMLDocument | Element } */
		var rootNode = originDropZone.closest("dialog") || originDropZone.closest("[popover]") || originDropZone.getRootNode();
		var originDropZoneRoot = rootNode.body || rootNode;
		var originalItems = config.items, type = config.type, centreDraggedOnCursor = config.centreDraggedOnCursor, useCursorForDetection = config.useCursorForDetection;
		var items = _toConsumableArray(originalItems);
		draggedElData = items[currentIdx];
		draggedElType = type;
		shadowElData = createShadowElData(draggedElData);
		useCursorForDetectionActive = useCursorForDetection;
		draggedEl = createDraggedElementFrom(originalDragTarget, centreDraggedOnCursor && currentMousePosition);
		originDropZoneRoot.appendChild(draggedEl);
		function keepOriginalElementInDom() {
			if (!draggedEl || finalizingPreviousDrag) return;
			if (!originalDragTarget.parentElement) {
				originalDragTarget.setAttribute(ORIGINAL_DRAGGED_ITEM_MARKER_ATTRIBUTE, true);
				originDropZoneRoot.appendChild(originalDragTarget);
				watchDraggedElement();
				hideElement(originalDragTarget);
				shadowElData[ITEM_ID_KEY] = draggedElData[ITEM_ID_KEY];
				draggedEl.focus();
			} else window.requestAnimationFrame(keepOriginalElementInDom);
		}
		window.requestAnimationFrame(keepOriginalElementInDom);
		styleActiveDropZones(Array.from(typeToDropZones$1.get(config.type)).filter(function(dz) {
			return dz === originDropZone || !dzToConfig$1.get(dz).dropFromOthersDisabled;
		}), function(dz) {
			return dzToConfig$1.get(dz).dropTargetStyle;
		}, function(dz) {
			return dzToConfig$1.get(dz).dropTargetClasses;
		});
		items.splice(currentIdx, 1, shadowElData);
		unlockOriginDzMinDimensions = preventShrinking(originDropZone);
		dispatchConsiderEvent(originDropZone, items, {
			trigger: TRIGGERS.DRAG_STARTED,
			id: draggedElData[ITEM_ID_KEY],
			source: SOURCES.POINTER
		});
		window.addEventListener("mousemove", handleMouseMove, { passive: false });
		window.addEventListener("touchmove", handleMouseMove, {
			passive: false,
			capture: false
		});
		window.addEventListener("mouseup", handleDrop$1, { passive: false });
		window.addEventListener("touchend", handleDrop$1, { passive: false });
	}
	function configure(_ref2) {
		var _ref2$items = _ref2.items, items = _ref2$items === void 0 ? void 0 : _ref2$items, _ref2$flipDurationMs = _ref2.flipDurationMs, dropAnimationDurationMs = _ref2$flipDurationMs === void 0 ? 0 : _ref2$flipDurationMs, _ref2$type = _ref2.type, newType = _ref2$type === void 0 ? DEFAULT_DROP_ZONE_TYPE$1 : _ref2$type, _ref2$dragDisabled = _ref2.dragDisabled, dragDisabled = _ref2$dragDisabled === void 0 ? false : _ref2$dragDisabled, _ref2$morphDisabled = _ref2.morphDisabled, morphDisabled = _ref2$morphDisabled === void 0 ? false : _ref2$morphDisabled, _ref2$dropFromOthersD = _ref2.dropFromOthersDisabled, dropFromOthersDisabled = _ref2$dropFromOthersD === void 0 ? false : _ref2$dropFromOthersD, _ref2$dropTargetStyle = _ref2.dropTargetStyle, dropTargetStyle = _ref2$dropTargetStyle === void 0 ? DEFAULT_DROP_TARGET_STYLE$1 : _ref2$dropTargetStyle, _ref2$dropTargetClass = _ref2.dropTargetClasses, dropTargetClasses = _ref2$dropTargetClass === void 0 ? [] : _ref2$dropTargetClass, _ref2$transformDragge = _ref2.transformDraggedElement, transformDraggedElement = _ref2$transformDragge === void 0 ? function() {} : _ref2$transformDragge, _ref2$centreDraggedOn = _ref2.centreDraggedOnCursor, centreDraggedOnCursor = _ref2$centreDraggedOn === void 0 ? false : _ref2$centreDraggedOn, _ref2$useCursorForDet = _ref2.useCursorForDetection, useCursorForDetection = _ref2$useCursorForDet === void 0 ? false : _ref2$useCursorForDet, _ref2$dropAnimationDi = _ref2.dropAnimationDisabled, dropAnimationDisabled = _ref2$dropAnimationDi === void 0 ? false : _ref2$dropAnimationDi, _ref2$delayTouchStart = _ref2.delayTouchStart, delayTouchStartOpt = _ref2$delayTouchStart === void 0 ? false : _ref2$delayTouchStart;
		config.dropAnimationDurationMs = dropAnimationDurationMs;
		var effectiveDelayMs = 0;
		if (delayTouchStartOpt === true) effectiveDelayMs = DEFAULT_TOUCH_DELAY_MS;
		else if (typeof delayTouchStartOpt === "number" && isFinite(delayTouchStartOpt) && delayTouchStartOpt >= 0) effectiveDelayMs = delayTouchStartOpt;
		config.delayTouchStartMs = effectiveDelayMs;
		if (config.type && newType !== config.type) unregisterDropZone$1(node, config.type);
		config.type = newType;
		config.items = _toConsumableArray(items);
		config.dragDisabled = dragDisabled;
		config.morphDisabled = morphDisabled;
		config.transformDraggedElement = transformDraggedElement;
		config.centreDraggedOnCursor = centreDraggedOnCursor;
		config.useCursorForDetection = useCursorForDetection;
		config.dropAnimationDisabled = dropAnimationDisabled;
		if (initialized && isWorkingOnPreviousDrag && !finalizingPreviousDrag && (!areObjectsShallowEqual(dropTargetStyle, config.dropTargetStyle) || !areArraysShallowEqualSameOrder(dropTargetClasses, config.dropTargetClasses))) {
			styleInactiveDropZones([node], function() {
				return config.dropTargetStyle;
			}, function() {
				return dropTargetClasses;
			});
			styleActiveDropZones([node], function() {
				return dropTargetStyle;
			}, function() {
				return dropTargetClasses;
			});
		}
		config.dropTargetStyle = dropTargetStyle;
		config.dropTargetClasses = _toConsumableArray(dropTargetClasses);
		function getConfigProp(dz, propName) {
			return dzToConfig$1.get(dz) ? dzToConfig$1.get(dz)[propName] : config[propName];
		}
		if (initialized && isWorkingOnPreviousDrag && config.dropFromOthersDisabled !== dropFromOthersDisabled) if (dropFromOthersDisabled) styleInactiveDropZones([node], function(dz) {
			return getConfigProp(dz, "dropTargetStyle");
		}, function(dz) {
			return getConfigProp(dz, "dropTargetClasses");
		});
		else styleActiveDropZones([node], function(dz) {
			return getConfigProp(dz, "dropTargetStyle");
		}, function(dz) {
			return getConfigProp(dz, "dropTargetClasses");
		});
		config.dropFromOthersDisabled = dropFromOthersDisabled;
		dzToConfig$1.set(node, config);
		registerDropZone$1(node, newType);
		var shadowElIdx = isWorkingOnPreviousDrag ? findShadowElementIdx(config.items) : -1;
		for (var idx = 0; idx < node.children.length; idx++) {
			var draggableEl = node.children[idx];
			styleDraggable(draggableEl, dragDisabled);
			if (idx === shadowElIdx) {
				if (!morphDisabled) morphDraggedElementToBeLike(draggedEl, draggableEl, currentMousePosition.x, currentMousePosition.y);
				config.transformDraggedElement(draggedEl, draggedElData, idx);
				decorateShadowEl(draggableEl);
				continue;
			}
			draggableEl.removeEventListener("mousedown", elToMouseDownListener.get(draggableEl));
			draggableEl.removeEventListener("touchstart", elToMouseDownListener.get(draggableEl));
			if (!dragDisabled) {
				draggableEl.addEventListener("mousedown", handleMouseDown);
				draggableEl.addEventListener("touchstart", handleMouseDown);
				elToMouseDownListener.set(draggableEl, handleMouseDown);
			}
			elToIdx.set(draggableEl, idx);
			if (!initialized) initialized = true;
		}
	}
	configure(options);
	return {
		update: function update(newOptions) {
			configure(newOptions);
		},
		destroy: function destroy() {
			if (destroyed) return;
			destroyed = true;
			cancelPendingDrag();
			var _iterator3 = _createForOfIteratorHelper(node.children), _step3;
			try {
				for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
					var draggableEl = _step3.value;
					draggableEl.removeEventListener("mousedown", elToMouseDownListener.get(draggableEl));
					draggableEl.removeEventListener("touchstart", elToMouseDownListener.get(draggableEl));
				}
			} catch (err) {
				_iterator3.e(err);
			} finally {
				_iterator3.f();
			}
			function destroyDz() {
				var registeredConfig = dzToConfig$1.get(node);
				if (!registeredConfig) return;
				unregisterDropZone$1(node, registeredConfig.type);
				dzToConfig$1["delete"](node);
			}
			if (isWorkingOnPreviousDrag && !node.closest("[".concat(ORIGINAL_DRAGGED_ITEM_MARKER_ATTRIBUTE, "]"))) scheduleDZForRemovalAfterDrop(node, destroyDz);
			else destroyDz();
		}
	};
}
var _ID_TO_INSTRUCTION;
var INSTRUCTION_IDs$1 = {
	DND_ZONE_ACTIVE: "dnd-zone-active",
	DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
var ID_TO_INSTRUCTION = (_ID_TO_INSTRUCTION = {}, _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs$1.DND_ZONE_ACTIVE, "Tab to one the items and press space-bar or enter to start dragging it"), _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs$1.DND_ZONE_DRAG_DISABLED, "This is a disabled drag and drop list"), _ID_TO_INSTRUCTION);
var ALERT_DIV_ID = "dnd-action-aria-alert";
var alertsDiv;
function initAriaOnBrowser() {
	if (alertsDiv) return;
	alertsDiv = document.createElement("div");
	(function initAlertsDiv() {
		alertsDiv.id = ALERT_DIV_ID;
		alertsDiv.style.position = "fixed";
		alertsDiv.style.bottom = "0";
		alertsDiv.style.left = "0";
		alertsDiv.style.zIndex = "-5";
		alertsDiv.style.opacity = "0";
		alertsDiv.style.height = "0";
		alertsDiv.style.width = "0";
		alertsDiv.setAttribute("role", "alert");
	})();
	document.body.prepend(alertsDiv);
	Object.entries(ID_TO_INSTRUCTION).forEach(function(_ref) {
		var _ref2 = _slicedToArray(_ref, 2), id = _ref2[0], txt = _ref2[1];
		return document.body.prepend(instructionToHiddenDiv(id, txt));
	});
}
/**
* Initializes the static aria instructions so they can be attached to zones
* @return {{DND_ZONE_ACTIVE: string, DND_ZONE_DRAG_DISABLED: string} | null} - the IDs for static aria instruction (to be used via aria-describedby) or null on the server
*/
function initAria() {
	if (isOnServer) return null;
	if (document.readyState === "complete") initAriaOnBrowser();
	else window.addEventListener("DOMContentLoaded", initAriaOnBrowser);
	return _objectSpread2({}, INSTRUCTION_IDs$1);
}
/**
* Removes all the artifacts (dom elements) added by this module
*/
function destroyAria() {
	if (isOnServer || !alertsDiv) return;
	Object.keys(ID_TO_INSTRUCTION).forEach(function(id) {
		var _document$getElementB;
		return (_document$getElementB = document.getElementById(id)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.remove();
	});
	alertsDiv.remove();
	alertsDiv = void 0;
}
function instructionToHiddenDiv(id, txt) {
	var div = document.createElement("div");
	div.id = id;
	div.innerHTML = "<p>".concat(txt, "</p>");
	div.style.display = "none";
	div.style.position = "fixed";
	div.style.zIndex = "-5";
	return div;
}
/**
* Will make the screen reader alert the provided text to the user
* @param {string} txt
*/
function alertToScreenReader(txt) {
	if (isOnServer) return;
	if (!alertsDiv) initAriaOnBrowser();
	alertsDiv.innerHTML = "";
	var alertText = document.createTextNode(txt);
	alertsDiv.appendChild(alertText);
	alertsDiv.style.display = "none";
	alertsDiv.style.display = "inline";
}
var DEFAULT_DROP_ZONE_TYPE = "--any--";
var DEFAULT_DROP_TARGET_STYLE = { outline: "rgba(255, 255, 102, 0.7) solid 2px" };
var isDragging = false;
var draggedItemType;
var focusedDz;
var focusedDzLabel = "";
var focusedItem;
var focusedItemId;
var focusedItemLabel = "";
var allDragTargets = /* @__PURE__ */ new WeakSet();
var elToKeyDownListeners = /* @__PURE__ */ new WeakMap();
var elToFocusListeners = /* @__PURE__ */ new WeakMap();
var dzToHandles = /* @__PURE__ */ new Map();
var dzToConfig = /* @__PURE__ */ new Map();
var typeToDropZones = /* @__PURE__ */ new Map();
var INSTRUCTION_IDs;
function registerDropZone(dropZoneEl, type) {
	if (typeToDropZones.size === 0) {
		INSTRUCTION_IDs = initAria();
		window.addEventListener("keydown", globalKeyDownHandler);
		window.addEventListener("click", globalClickHandler);
	}
	if (!typeToDropZones.has(type)) typeToDropZones.set(type, /* @__PURE__ */ new Set());
	if (!typeToDropZones.get(type).has(dropZoneEl)) {
		typeToDropZones.get(type).add(dropZoneEl);
		incrementActiveDropZoneCount();
	}
}
function unregisterDropZone(dropZoneEl, type) {
	if (isDragging && focusedDz === dropZoneEl) handleDrop();
	var dropZones = typeToDropZones.get(type);
	if (!dropZones || !dropZones["delete"](dropZoneEl)) return;
	decrementActiveDropZoneCount();
	if (dropZones.size === 0) typeToDropZones["delete"](type);
	if (typeToDropZones.size === 0) {
		window.removeEventListener("keydown", globalKeyDownHandler);
		window.removeEventListener("click", globalClickHandler);
		INSTRUCTION_IDs = void 0;
		destroyAria();
	}
}
function globalKeyDownHandler(e) {
	if (!isDragging) return;
	switch (e.key) {
		case "Escape":
			handleDrop();
			break;
	}
}
function globalClickHandler() {
	if (!isDragging) return;
	if (!allDragTargets.has(document.activeElement)) handleDrop();
}
function handleZoneFocus(e) {
	if (!isDragging) return;
	var newlyFocusedDz = e.currentTarget;
	if (newlyFocusedDz === focusedDz) return;
	focusedDzLabel = newlyFocusedDz.getAttribute("aria-label") || "";
	var originItems = dzToConfig.get(focusedDz).items;
	var originItem = originItems.find(function(item) {
		return item[ITEM_ID_KEY] === focusedItemId;
	});
	var originIdx = originItems.indexOf(originItem);
	var itemToMove = originItems.splice(originIdx, 1)[0];
	var _dzToConfig$get2 = dzToConfig.get(newlyFocusedDz), targetItems = _dzToConfig$get2.items, autoAriaDisabled = _dzToConfig$get2.autoAriaDisabled;
	if (newlyFocusedDz.getBoundingClientRect().top < focusedDz.getBoundingClientRect().top || newlyFocusedDz.getBoundingClientRect().left < focusedDz.getBoundingClientRect().left) {
		targetItems.push(itemToMove);
		if (!autoAriaDisabled) alertToScreenReader("Moved item ".concat(focusedItemLabel, " to the end of the list ").concat(focusedDzLabel));
	} else {
		targetItems.unshift(itemToMove);
		if (!autoAriaDisabled) alertToScreenReader("Moved item ".concat(focusedItemLabel, " to the beginning of the list ").concat(focusedDzLabel));
	}
	var dzFrom = focusedDz;
	var movedItemId = focusedItemId;
	focusedDz = newlyFocusedDz;
	dispatchFinalizeEvent(dzFrom, originItems, {
		trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
		id: movedItemId,
		source: SOURCES.KEYBOARD
	});
	if (dzToConfig.has(newlyFocusedDz)) dispatchFinalizeEvent(newlyFocusedDz, targetItems, {
		trigger: TRIGGERS.DROPPED_INTO_ZONE,
		id: movedItemId,
		source: SOURCES.KEYBOARD
	});
}
function triggerAllDzsUpdate() {
	dzToHandles.forEach(function(_ref, dz) {
		var update = _ref.update;
		return update(dzToConfig.get(dz));
	});
}
function handleDrop() {
	var dispatchConsider = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
	if (!isDragging || !focusedDz) return;
	var droppedDz = focusedDz;
	var droppedConfig = dzToConfig.get(droppedDz);
	var droppedItemId = focusedItemId;
	var droppedItemType = draggedItemType;
	if (!droppedConfig) return;
	if (!droppedConfig.autoAriaDisabled) alertToScreenReader("Stopped dragging item ".concat(focusedItemLabel));
	if (allDragTargets.has(document.activeElement)) document.activeElement.blur();
	focusedItem = null;
	focusedItemId = null;
	focusedItemLabel = "";
	draggedItemType = null;
	focusedDz = null;
	focusedDzLabel = "";
	isDragging = false;
	if (dispatchConsider) dispatchConsiderEvent(droppedDz, droppedConfig.items, {
		trigger: TRIGGERS.DRAG_STOPPED,
		id: droppedItemId,
		source: SOURCES.KEYBOARD
	});
	var dropZones = typeToDropZones.get(droppedItemType);
	if (dropZones) styleInactiveDropZones(dropZones, function(dz) {
		return dzToConfig.get(dz).dropTargetStyle;
	}, function(dz) {
		return dzToConfig.get(dz).dropTargetClasses;
	});
	triggerAllDzsUpdate();
}
function dndzone$1(node, options) {
	var destroyed = false;
	var config = {
		items: void 0,
		type: void 0,
		dragDisabled: false,
		zoneTabIndex: 0,
		zoneItemTabIndex: 0,
		dropFromOthersDisabled: false,
		dropTargetStyle: DEFAULT_DROP_TARGET_STYLE,
		dropTargetClasses: [],
		autoAriaDisabled: false
	};
	function swap(arr, i, j) {
		if (arr.length <= 1) return;
		arr.splice(j, 1, arr.splice(i, 1, arr[j])[0]);
	}
	function handleKeyDown(e) {
		switch (e.key) {
			case "Enter":
			case " ":
				if ((e.target.disabled !== void 0 || e.target.href || e.target.isContentEditable) && !allDragTargets.has(e.target)) return;
				e.preventDefault();
				e.stopPropagation();
				if (isDragging) handleDrop();
				else handleDragStart(e);
				break;
			case "ArrowDown":
			case "ArrowRight":
				if (!isDragging) return;
				e.preventDefault();
				e.stopPropagation();
				var items = dzToConfig.get(node).items;
				var children = Array.from(node.children);
				var idx = children.indexOf(e.currentTarget);
				if (idx < children.length - 1) {
					if (!config.autoAriaDisabled) alertToScreenReader("Moved item ".concat(focusedItemLabel, " to position ").concat(idx + 2, " in the list ").concat(focusedDzLabel));
					swap(items, idx, idx + 1);
					dispatchFinalizeEvent(node, items, {
						trigger: TRIGGERS.DROPPED_INTO_ZONE,
						id: focusedItemId,
						source: SOURCES.KEYBOARD
					});
				}
				break;
			case "ArrowUp":
			case "ArrowLeft":
				if (!isDragging) return;
				e.preventDefault();
				e.stopPropagation();
				var _items = dzToConfig.get(node).items;
				var _idx = Array.from(node.children).indexOf(e.currentTarget);
				if (_idx > 0) {
					if (!config.autoAriaDisabled) alertToScreenReader("Moved item ".concat(focusedItemLabel, " to position ").concat(_idx, " in the list ").concat(focusedDzLabel));
					swap(_items, _idx, _idx - 1);
					dispatchFinalizeEvent(node, _items, {
						trigger: TRIGGERS.DROPPED_INTO_ZONE,
						id: focusedItemId,
						source: SOURCES.KEYBOARD
					});
				}
				break;
		}
	}
	function handleDragStart(e) {
		setCurrentFocusedItem(e.currentTarget);
		focusedDz = node;
		draggedItemType = config.type;
		isDragging = true;
		var dropTargets = Array.from(typeToDropZones.get(config.type)).filter(function(dz) {
			return dz === focusedDz || !dzToConfig.get(dz).dropFromOthersDisabled;
		});
		styleActiveDropZones(dropTargets, function(dz) {
			return dzToConfig.get(dz).dropTargetStyle;
		}, function(dz) {
			return dzToConfig.get(dz).dropTargetClasses;
		});
		if (!config.autoAriaDisabled) {
			var msg = "Started dragging item ".concat(focusedItemLabel, ". Use the arrow keys to move it within its list ").concat(focusedDzLabel);
			if (dropTargets.length > 1) msg += ", or tab to another list in order to move the item into it";
			alertToScreenReader(msg);
		}
		dispatchConsiderEvent(node, dzToConfig.get(node).items, {
			trigger: TRIGGERS.DRAG_STARTED,
			id: focusedItemId,
			source: SOURCES.KEYBOARD
		});
		triggerAllDzsUpdate();
	}
	function handleClick(e) {
		if (!isDragging) return;
		if (e.currentTarget === focusedItem) return;
		e.stopPropagation();
		handleDrop(false);
		handleDragStart(e);
	}
	function setCurrentFocusedItem(draggableEl) {
		var items = dzToConfig.get(node).items;
		var children = Array.from(node.children);
		var focusedItemIdx = children.indexOf(draggableEl);
		focusedItem = draggableEl;
		focusedItem.tabIndex = config.zoneItemTabIndex;
		focusedItemId = items[focusedItemIdx][ITEM_ID_KEY];
		focusedItemLabel = children[focusedItemIdx].getAttribute("aria-label") || "";
	}
	function configure(_ref2) {
		var _ref2$items = _ref2.items, items = _ref2$items === void 0 ? [] : _ref2$items, _ref2$type = _ref2.type, newType = _ref2$type === void 0 ? DEFAULT_DROP_ZONE_TYPE : _ref2$type, _ref2$dragDisabled = _ref2.dragDisabled, dragDisabled = _ref2$dragDisabled === void 0 ? false : _ref2$dragDisabled, _ref2$zoneTabIndex = _ref2.zoneTabIndex, zoneTabIndex = _ref2$zoneTabIndex === void 0 ? 0 : _ref2$zoneTabIndex, _ref2$zoneItemTabInde = _ref2.zoneItemTabIndex, zoneItemTabIndex = _ref2$zoneItemTabInde === void 0 ? 0 : _ref2$zoneItemTabInde, _ref2$dropFromOthersD = _ref2.dropFromOthersDisabled, dropFromOthersDisabled = _ref2$dropFromOthersD === void 0 ? false : _ref2$dropFromOthersD, _ref2$dropTargetStyle = _ref2.dropTargetStyle, dropTargetStyle = _ref2$dropTargetStyle === void 0 ? DEFAULT_DROP_TARGET_STYLE : _ref2$dropTargetStyle, _ref2$dropTargetClass = _ref2.dropTargetClasses, dropTargetClasses = _ref2$dropTargetClass === void 0 ? [] : _ref2$dropTargetClass, _ref2$autoAriaDisable = _ref2.autoAriaDisabled, autoAriaDisabled = _ref2$autoAriaDisable === void 0 ? false : _ref2$autoAriaDisable;
		config.items = _toConsumableArray(items);
		config.dragDisabled = dragDisabled;
		config.dropFromOthersDisabled = dropFromOthersDisabled;
		config.zoneTabIndex = zoneTabIndex;
		config.zoneItemTabIndex = zoneItemTabIndex;
		config.dropTargetStyle = dropTargetStyle;
		config.dropTargetClasses = dropTargetClasses;
		config.autoAriaDisabled = autoAriaDisabled;
		if (config.type && newType !== config.type) unregisterDropZone(node, config.type);
		config.type = newType;
		registerDropZone(node, newType);
		if (!autoAriaDisabled) {
			node.setAttribute("role", "list");
			node.setAttribute("aria-describedby", dragDisabled ? INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED : INSTRUCTION_IDs.DND_ZONE_ACTIVE);
		}
		dzToConfig.set(node, config);
		if (isDragging) node.tabIndex = node === focusedDz || focusedItem.contains(node) || config.dropFromOthersDisabled || focusedDz && config.type !== dzToConfig.get(focusedDz).type ? -1 : 0;
		else node.tabIndex = config.zoneTabIndex;
		node.addEventListener("focus", handleZoneFocus);
		var _loop = function _loop(i) {
			var draggableEl = node.children[i];
			allDragTargets.add(draggableEl);
			draggableEl.tabIndex = isDragging ? -1 : config.zoneItemTabIndex;
			if (!autoAriaDisabled) draggableEl.setAttribute("role", "listitem");
			draggableEl.removeEventListener("keydown", elToKeyDownListeners.get(draggableEl));
			draggableEl.removeEventListener("click", elToFocusListeners.get(draggableEl));
			if (!dragDisabled) {
				draggableEl.addEventListener("keydown", handleKeyDown);
				elToKeyDownListeners.set(draggableEl, handleKeyDown);
				draggableEl.addEventListener("click", handleClick);
				elToFocusListeners.set(draggableEl, handleClick);
			}
			if (isDragging && config.items[i][ITEM_ID_KEY] === focusedItemId) {
				focusedItem = draggableEl;
				focusedItem.tabIndex = config.zoneItemTabIndex;
				draggableEl.focus();
			}
		};
		for (var i = 0; i < node.children.length; i++) _loop(i);
	}
	configure(options);
	var handles = {
		update: function update(newOptions) {
			configure(newOptions);
		},
		destroy: function destroy() {
			if (destroyed) return;
			destroyed = true;
			node.removeEventListener("focus", handleZoneFocus);
			var _iterator = _createForOfIteratorHelper(node.children), _step;
			try {
				for (_iterator.s(); !(_step = _iterator.n()).done;) {
					var draggableEl = _step.value;
					draggableEl.removeEventListener("keydown", elToKeyDownListeners.get(draggableEl));
					draggableEl.removeEventListener("click", elToFocusListeners.get(draggableEl));
				}
			} catch (err) {
				_iterator.e(err);
			} finally {
				_iterator.f();
			}
			unregisterDropZone(node, config.type);
			dzToConfig["delete"](node);
			dzToHandles["delete"](node);
		}
	};
	dzToHandles.set(node, handles);
	return handles;
}
var _excluded = [
	"items",
	"flipDurationMs",
	"type",
	"dragDisabled",
	"morphDisabled",
	"dropFromOthersDisabled",
	"zoneTabIndex",
	"zoneItemTabIndex",
	"dropTargetStyle",
	"dropTargetClasses",
	"transformDraggedElement",
	"autoAriaDisabled",
	"centreDraggedOnCursor",
	"useCursorForDetection",
	"delayTouchStart",
	"dropAnimationDisabled"
];
/**
* A custom action to turn any container to a dnd zone and all of its direct children to draggables
* Supports mouse, touch and keyboard interactions.
* Dispatches two events that the container is expected to react to by modifying its list of items,
* which will then feed back in to this action via the update function
*
* @typedef {object} Options
* @property {array} items - the list of items that was used to generate the children of the given node (the list used in the #each block
* @property {string} [type] - the type of the dnd zone. children dragged from here can only be dropped in other zones of the same type, default to a base type
* @property {number} [flipDurationMs] - if the list animated using flip (recommended), specifies the flip duration such that everything syncs with it without conflict, defaults to zero
* @property {boolean} [dragDisabled]
* @property {boolean} [morphDisabled] - whether dragged element should morph to zone dimensions
* @property {boolean} [dropFromOthersDisabled]
* @property {number} [zoneTabIndex] - set the tabindex of the list container when not dragging
* @property {number} [zoneItemTabIndex] - set the tabindex of the list container items when not dragging
* @property {object} [dropTargetStyle]
* @property {string[]} [dropTargetClasses]
* @property {boolean|number} [delayTouchStart] - On touch devices, wait this long before converting the gesture to a drag.
* `true` uses the built-in default (80 ms).
* @property {boolean} [dropAnimationDisabled] - cancels the drop animation to place
* @property {function} [transformDraggedElement]
* @param {HTMLElement} node - the element to enhance
* @param {Options} options
* @return {{update: function, destroy: function}}
*/
function dndzone(node, options) {
	if (shouldIgnoreZone(node)) return {
		update: function update() {},
		destroy: function destroy() {}
	};
	validateOptions(options);
	var pointerZone = dndzone$2(node, options);
	var keyboardZone = dndzone$1(node, options);
	return {
		update: function update(newOptions) {
			validateOptions(newOptions);
			pointerZone.update(newOptions);
			keyboardZone.update(newOptions);
		},
		destroy: function destroy() {
			pointerZone.destroy();
			keyboardZone.destroy();
		}
	};
}
/**
* If the user marked something in the ancestry of our node as shadow element, we can ignore it
* We need the user to mark it for us because svelte updates the action from deep to shallow (but renders top down)
* @param {HTMLElement} node
* @return {boolean}
*/
function shouldIgnoreZone(node) {
	return !!node.closest("[".concat(SHADOW_ELEMENT_HINT_ATTRIBUTE_NAME, "=\"true\"]"));
}
function validateOptions(options) {
	var items = options.items;
	options.flipDurationMs;
	options.type;
	options.dragDisabled;
	options.morphDisabled;
	options.dropFromOthersDisabled;
	var zoneTabIndex = options.zoneTabIndex, zoneItemTabIndex = options.zoneItemTabIndex;
	options.dropTargetStyle;
	var dropTargetClasses = options.dropTargetClasses;
	options.transformDraggedElement;
	options.autoAriaDisabled;
	options.centreDraggedOnCursor;
	options.useCursorForDetection;
	var delayTouchStart = options.delayTouchStart;
	options.dropAnimationDisabled;
	var rest = _objectWithoutProperties(options, _excluded);
	if (Object.keys(rest).length > 0) console.warn("dndzone will ignore unknown options", rest);
	if (!items) throw new Error("no 'items' key provided to dndzone");
	var itemWithMissingId = items.find(function(item) {
		return !{}.hasOwnProperty.call(item, ITEM_ID_KEY);
	});
	if (itemWithMissingId) throw new Error("missing '".concat(ITEM_ID_KEY, "' property for item ").concat(toString(itemWithMissingId)));
	if (dropTargetClasses && !Array.isArray(dropTargetClasses)) throw new Error("dropTargetClasses should be an array but instead it is a ".concat(_typeof(dropTargetClasses), ", ").concat(toString(dropTargetClasses)));
	if (zoneTabIndex && !isInt(zoneTabIndex)) throw new Error("zoneTabIndex should be a number but instead it is a ".concat(_typeof(zoneTabIndex), ", ").concat(toString(zoneTabIndex)));
	if (zoneItemTabIndex && !isInt(zoneItemTabIndex)) throw new Error("zoneItemTabIndex should be a number but instead it is a ".concat(_typeof(zoneItemTabIndex), ", ").concat(toString(zoneItemTabIndex)));
	if (delayTouchStart !== void 0 && delayTouchStart !== false) {
		if (!(delayTouchStart === true) && !(typeof delayTouchStart === "number" && isFinite(delayTouchStart) && delayTouchStart >= 0)) throw new Error("delayTouchStart should be a boolean (true/false) or a non-negative number but instead it is a ".concat(_typeof(delayTouchStart), ", ").concat(toString(delayTouchStart)));
	}
}
function isInt(value) {
	return !isNaN(value) && function(x) {
		return (x | 0) === x;
	}(parseFloat(value));
}
function createStore(initialValue) {
	var _val = initialValue;
	var subs = /* @__PURE__ */ new Set();
	return {
		get: function get() {
			return _val;
		},
		set: function set(newVal) {
			_val = newVal;
			Array.from(subs).forEach(function(cb) {
				return cb(_val);
			});
		},
		subscribe: function subscribe(cb) {
			subs.add(cb);
			cb(_val);
		},
		unsubscribe: function unsubscribe(cb) {
			subs["delete"](cb);
		}
	};
}
var isItemsDragDisabled = createStore(true);
var userDragDisabled = createStore(false);
function getAddedOptions() {
	return {
		dragDisabled: userDragDisabled.get() || isItemsDragDisabled.get(),
		zoneItemTabIndex: -1
	};
}
/**
* This is an action that wraps around the dndzone action to make it easy to work with drag handles
* When using this you must also use the 'dragHandle' action (see below) on an element inside each item within the zone
* Credit for the idea and initial implementation goes to @gleuch (Greg Leuch) and @geovie (Georg Vienna)
*
* @param {HTMLElement} node
* @param options - will be passed down to the dndzone
* @return {{update: (newOptions: Object) => {}, destroy: () => {}}}
*/
function dragHandleZone(node, options) {
	var _options$dragDisabled;
	userDragDisabled.set((_options$dragDisabled = options === null || options === void 0 ? void 0 : options.dragDisabled) !== null && _options$dragDisabled !== void 0 ? _options$dragDisabled : false);
	var currentOptions = options;
	var zone = dndzone(node, _objectSpread2(_objectSpread2({}, currentOptions), getAddedOptions()));
	function updateZone() {
		zone.update(_objectSpread2(_objectSpread2({}, currentOptions), getAddedOptions()));
	}
	isItemsDragDisabled.subscribe(updateZone);
	function consider(e) {
		var _e$detail$info = e.detail.info, source = _e$detail$info.source, trigger = _e$detail$info.trigger;
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) isItemsDragDisabled.set(true);
	}
	function finalize(e) {
		if (e.detail.info.source === SOURCES.POINTER) isItemsDragDisabled.set(true);
	}
	node.addEventListener("consider", consider);
	node.addEventListener("finalize", finalize);
	return {
		update: function update(newOptions) {
			var _currentOptions$dragD, _currentOptions;
			currentOptions = newOptions;
			userDragDisabled.set((_currentOptions$dragD = (_currentOptions = currentOptions) === null || _currentOptions === void 0 ? void 0 : _currentOptions.dragDisabled) !== null && _currentOptions$dragD !== void 0 ? _currentOptions$dragD : false);
			updateZone();
		},
		destroy: function destroy() {
			zone.destroy();
			node.removeEventListener("consider", consider);
			node.removeEventListener("finalize", finalize);
			isItemsDragDisabled.unsubscribe(updateZone);
		}
	};
}
/**
* This should be used to mark drag handles inside items that belong to a 'dragHandleZone' (see above)
* @param {HTMLElement} handle
* @return {{update: *, destroy: *}}
*/
function dragHandle(handle) {
	handle.setAttribute("role", "button");
	function startDrag(e) {
		e.preventDefault();
		isItemsDragDisabled.set(false);
		window.addEventListener("mouseup", resetStartDrag);
		window.addEventListener("touchend", resetStartDrag);
	}
	function handleKeyDown(e) {
		if (e.key === "Enter" || e.key === " ") isItemsDragDisabled.set(false);
	}
	function resetStartDrag() {
		isItemsDragDisabled.set(true);
		window.removeEventListener("mouseup", resetStartDrag);
		window.removeEventListener("touchend", resetStartDrag);
	}
	var recomputeHandleState = function recomputeHandleState() {
		var userDisabled = userDragDisabled.get();
		var internalDisabled = isItemsDragDisabled.get();
		if (userDisabled) {
			handle.tabIndex = -1;
			handle.style.cursor = "";
		} else {
			handle.tabIndex = internalDisabled ? 0 : -1;
			handle.style.cursor = internalDisabled ? "grab" : "grabbing";
		}
	};
	userDragDisabled.subscribe(recomputeHandleState);
	isItemsDragDisabled.subscribe(recomputeHandleState);
	handle.addEventListener("mousedown", startDrag);
	handle.addEventListener("touchstart", startDrag);
	handle.addEventListener("keydown", handleKeyDown);
	return {
		update: function update() {},
		destroy: function destroy() {
			handle.removeEventListener("mousedown", startDrag);
			handle.removeEventListener("touchstart", startDrag);
			handle.removeEventListener("keydown", handleKeyDown);
			userDragDisabled.unsubscribe(recomputeHandleState);
			isItemsDragDisabled.unsubscribe(recomputeHandleState);
		}
	};
}
//#endregion
//#region src/lib/pages/multi-account-view/balance-utils.ts
var IOTA_COIN_TYPE$1 = "0x2::coin::Coin<0x2::iota::IOTA>";
var STAKE_LABELS = /* @__PURE__ */ new Set(["StakedIota", "TimelockedStakedIota"]);
/** True if the object is a stake (regular or timelocked). Used by the
*  "staking mode" filter in MultiAccountView to hide everything else. */
function isStakeObject(item) {
	return STAKE_LABELS.has(item.label);
}
/** Liquid IOTA balance carried by a normal-owned IOTA coin object. */
function objectIotaCoinAmount(obj) {
	if (obj.data?.content?.type === IOTA_COIN_TYPE$1 && obj.data?.content?.fields?.balance) return BigInt(obj.data.content.fields.balance);
	return 0n;
}
/** Staked principal carried by a normal-owned object (StakedIota only). */
function objectStakedPrincipal(obj) {
	if (obj.label === "StakedIota" && obj.data?.content?.fields?.principal) return BigInt(obj.data.content.fields.principal);
	return 0n;
}
/** Liquid IOTA balance carried by a timelocked object (TimeLock<Balance<IOTA>>). */
function timelockedIotaCoinAmount(obj) {
	if (obj.data?.content?.fields?.locked) return BigInt(obj.data.content.fields.locked);
	return 0n;
}
/** Staked principal carried by a timelocked object (TimelockedStakedIota). */
function timelockedStakedPrincipal(obj) {
	const p = obj.data?.content?.fields?.staked_iota?.fields?.principal;
	return p ? BigInt(p) : 0n;
}
/** Total amount sitting in a normal-owned object regardless of liquid vs staked. */
function objectPrincipalOrBalance(obj) {
	if (obj.data?.content?.fields?.balance) return BigInt(obj.data.content.fields.balance);
	if (obj.data?.content?.fields?.principal) return BigInt(obj.data.content.fields.principal);
	return 0n;
}
/** Total amount sitting in a timelocked object regardless of liquid vs staked. */
function timelockedAmount(obj) {
	if (obj.data?.content?.fields?.locked) return BigInt(obj.data.content.fields.locked);
	if (obj.data?.content?.fields?.staked_iota?.fields?.principal) return BigInt(obj.data.content.fields.staked_iota.fields.principal);
	return 0n;
}
function accountIotaCoins(account) {
	let total = 0n;
	for (const obj of account.objects) total += objectIotaCoinAmount(obj);
	for (const obj of account.timelockedObjects) total += timelockedIotaCoinAmount(obj);
	return total;
}
function accountStaked(account) {
	let total = 0n;
	for (const obj of account.objects) total += objectStakedPrincipal(obj);
	for (const obj of account.timelockedObjects) total += timelockedStakedPrincipal(obj);
	return total;
}
function accountTotalBalance(account) {
	let total = 0n;
	for (const obj of account.objects) total += objectPrincipalOrBalance(obj);
	for (const obj of account.timelockedObjects) total += timelockedAmount(obj);
	total += account.stakingRewards;
	return total;
}
function sumAccounts(accounts, pick) {
	let total = 0n;
	for (const a of accounts) total += pick(a);
	return total;
}
/** Compact IOTA: integer part with `_` thousands separators, two decimal
*  digits. Sufficient resolution for staking dashboards without dragging the
*  full 9-digit nano tail along. */
function formatIotaCompact(nano) {
	const [intPart, decPart = ""] = nanoToIota(nano.toString()).split(".");
	return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "_")}.${decPart.slice(0, 2).padEnd(2, "0")}`;
}
/** Render a nano-IOTA amount in the chosen fiat currency. Returns an empty
*  string when no price is available so callers can decide whether to render
*  the parenthesized "(≈ $…)" suffix or skip it entirely. */
function fiatValue(nano, price, currency) {
	if (!price) return "";
	const rate = currency === "USD" ? price.usd : price.eur;
	const v = Number(nano) / 1e9 * rate;
	return `${currency === "USD" ? "$" : "€"}${v.toFixed(2)}`;
}
/** "1_234.56 IOTA (≈ $123.45)" — drops the fiat parens entirely when no
*  price has been fetched yet. */
function formatIotaWithFiat(nano, price, currency) {
	const iota = `${formatIotaCompact(nano)} IOTA`;
	const f = fiatValue(nano, price, currency);
	return f ? `${iota} (≈ ${f})` : iota;
}
/** Display amount for an object: liquid balance, staked principal, or
*  timelocked-staked principal — formatted in IOTA with thousands separators.
*  When `compact` is true the value is rounded to 2 decimals (see
*  `formatIotaCompact`) instead of showing the full 9-digit nano tail. */
function objectDisplayAmount(item, compact = false) {
	let nano;
	if (item.label.startsWith("Coin<0x2::iota::IOTA>")) nano = item.data?.content?.fields?.balance;
	else if (item.label === "StakedIota") nano = item.data?.content?.fields?.principal;
	else if (item.label === "TimelockedStakedIota") nano = item.data.content.fields.staked_iota.fields.principal;
	if (nano === void 0) return "";
	if (compact) return formatIotaCompact(BigInt(nano));
	return formatNumberWithUnderscores(nanoToIota(nano));
}
/** Format a nano-IOTA amount for display in either full precision (9 decimals,
*  thousands-separated) or compact (2 decimals) mode. Mirrors the rendering
*  conventions of the per-object amounts. */
function formatIotaAmount(nano, compact) {
	if (compact) return formatIotaCompact(nano);
	return formatNumberWithUnderscores(nanoToIota(nano.toString()));
}
//#endregion
//#region src/lib/pages/multi-account-view/ObjectItem.svelte
var root$7 = from_html(`<div class="object-item svelte-1nc09ne" style="border-color: rgba(248, 113, 113, 0.3);"><div class="object-header svelte-1nc09ne"><span class="object-type svelte-1nc09ne"><!></span> <span class="object-amount svelte-1nc09ne"> </span></div> <details class="object-details svelte-1nc09ne"><summary class="svelte-1nc09ne">Data</summary> <pre class="svelte-1nc09ne"> </pre></details></div>`);
var root_1$6 = from_html(`<button class="optimize svelte-1nc09ne" title="Show better alternatives">Optimize</button>`);
var root_2$6 = from_html(`<button class="optimize quiet svelte-1nc09ne" title="Compare alternatives">Compare</button>`);
var root_3$6 = from_html(`<div><span class="validator svelte-1nc09ne"> </span> <span class="metric svelte-1nc09ne"> </span> <!></div>`);
var root_4$5 = from_html(`<div style="position: absolute; left: 0; top: 0; height: 1.2rem; display: flex; align-items: center; font-size: 0.7rem; color: #f59e0b; pointer-events: none;"> </div>`);
var root_5$4 = from_html(`<div><div class="object-header svelte-1nc09ne"><span class="object-type svelte-1nc09ne"><!></span> <span class="object-amount svelte-1nc09ne"> </span></div> <!> <div style="position: relative;"><!> <details class="object-details svelte-1nc09ne"><summary style="text-align: center; list-style-position: inside;" class="svelte-1nc09ne">Data</summary> <pre class="svelte-1nc09ne"> </pre></details></div></div>`);
function ObjectItem($$anchor, $$props) {
	push($$props, true);
	/** Per-stake metric block surfaced when the parent is in staking mode and
	*  the object is a StakedIota for a known validator. Timelocked stakes
	*  intentionally do not get one — they should be unlocked first before
	*  any optimization is meaningful. */
	/** Validator commission in percent (e.g. 5 = 5%). */
	/** Realized return over the chosen window as a fraction of principal. */
	/** Actual nano-IOTA earned in the window for this specific stake. */
	/** Stake principal in nano-IOTA — used for fiat conversions. */
	/** Whether a clearly-better alternative exists (used to highlight). */
	/** Optional CoinGecko price block for IOTA→fiat conversion. */
	/** When true, render IOTA amounts rounded to 2 decimals instead of the
	*  full 9-digit nano tail. Toggled in BalanceSummary, persisted. */
	let variant = prop($$props, "variant", 3, "standard"), currentPrice = prop($$props, "currentPrice", 3, null), selectedCurrency = prop($$props, "selectedCurrency", 3, "USD"), compactAmounts = prop($$props, "compactAmounts", 3, false);
	let isForeign = user_derived(() => variant() === "standard" && $$props.accountAddress !== $$props.item.currentOwner);
	let amountDisplay = user_derived(() => objectDisplayAmount($$props.item, compactAmounts()));
	function fmtPct(n, digits = 2) {
		return `${n.toFixed(digits)}%`;
	}
	/** "Window rewards 0.123% — 12.34 IOTA (≈ $1.23)" or
	*  "Commission 5.00%" (commission has no per-stake IOTA equivalent). */
	function metricLabel(m) {
		if (m.metricType === "commission") return `Commission ${fmtPct(m.commissionPct)}`;
		const pct = fmtPct(m.rewardsFractionInWindow * 100, 3);
		const iota = `${formatIotaCompact(m.rewardsInWindowNano)} IOTA`;
		const fiat = fiatValue(m.rewardsInWindowNano, currentPrice(), selectedCurrency());
		return fiat ? `Window rewards ${pct} — ${iota} (≈ ${fiat})` : `Window rewards ${pct} — ${iota}`;
	}
	var fragment = comment();
	var node = first_child(fragment);
	var consequent_1 = ($$anchor) => {
		var div = root$7();
		var div_1 = child(div);
		var span = child(div_1);
		var node_1 = child(span);
		var consequent = ($$anchor) => {
			append($$anchor, text("IOTA Coin"));
		};
		var d = user_derived(() => $$props.item.label.startsWith("Coin<0x2::iota::IOTA>"));
		var alternate = ($$anchor) => {
			var text_1 = text();
			template_effect(() => set_text(text_1, $$props.item.label));
			append($$anchor, text_1);
		};
		if_block(node_1, ($$render) => {
			if (get(d)) $$render(consequent);
			else $$render(alternate, -1);
		});
		reset(span);
		var span_1 = sibling(span, 2);
		var text_2 = child(span_1, true);
		reset(span_1);
		reset(div_1);
		var details = sibling(div_1, 2);
		var pre = sibling(child(details), 2);
		var text_3 = child(pre, true);
		reset(pre);
		reset(details);
		reset(div);
		template_effect(($0) => {
			set_attribute(span, "title", $$props.item.label);
			set_text(text_2, get(amountDisplay));
			set_text(text_3, $0);
		}, [() => JSON.stringify($$props.item, null, 2)]);
		append($$anchor, div);
	};
	var alternate_2 = ($$anchor) => {
		var div_2 = root_5$4();
		let classes;
		var div_3 = child(div_2);
		var span_2 = child(div_3);
		var node_2 = child(span_2);
		var consequent_2 = ($$anchor) => {
			append($$anchor, text("IOTA Coin"));
		};
		var d_1 = user_derived(() => $$props.item.label.startsWith("Coin<0x2::iota::IOTA>"));
		var alternate_1 = ($$anchor) => {
			var text_5 = text();
			template_effect(() => set_text(text_5, $$props.item.label));
			append($$anchor, text_5);
		};
		if_block(node_2, ($$render) => {
			if (get(d_1)) $$render(consequent_2);
			else $$render(alternate_1, -1);
		});
		reset(span_2);
		var span_3 = sibling(span_2, 2);
		var text_6 = child(span_3, true);
		reset(span_3);
		reset(div_3);
		action(div_3, ($$node) => dragHandle?.($$node));
		var node_3 = sibling(div_3, 2);
		var consequent_5 = ($$anchor) => {
			var div_4 = root_3$6();
			let classes_1;
			var span_4 = child(div_4);
			var text_7 = child(span_4);
			reset(span_4);
			var span_5 = sibling(span_4, 2);
			var text_8 = child(span_5, true);
			reset(span_5);
			var node_4 = sibling(span_5, 2);
			var consequent_3 = ($$anchor) => {
				var button = root_1$6();
				delegated("click", button, function(...$$args) {
					$$props.onOptimize?.apply(this, $$args);
				});
				append($$anchor, button);
			};
			var consequent_4 = ($$anchor) => {
				var button_1 = root_2$6();
				delegated("click", button_1, function(...$$args) {
					$$props.onOptimize?.apply(this, $$args);
				});
				append($$anchor, button_1);
			};
			if_block(node_4, ($$render) => {
				if ($$props.onOptimize && $$props.stakingMetric.hasBetterAlternative) $$render(consequent_3);
				else if ($$props.onOptimize) $$render(consequent_4, 1);
			});
			reset(div_4);
			template_effect(($0) => {
				classes_1 = set_class(div_4, 1, "staking-row svelte-1nc09ne", null, classes_1, { warn: $$props.stakingMetric.hasBetterAlternative });
				set_attribute(span_4, "title", $$props.stakingMetric.validatorName);
				set_text(text_7, `→ ${$$props.stakingMetric.validatorName ?? ""}`);
				set_text(text_8, $0);
			}, [() => metricLabel($$props.stakingMetric)]);
			append($$anchor, div_4);
		};
		if_block(node_3, ($$render) => {
			if ($$props.stakingMetric) $$render(consequent_5);
		});
		var div_5 = sibling(node_3, 2);
		var node_5 = child(div_5);
		var consequent_6 = ($$anchor) => {
			var div_6 = root_4$5();
			var text_9 = child(div_6);
			reset(div_6);
			template_effect(($0) => set_text(text_9, `From: ${$0 ?? ""}`), [() => $$props.getAccountDisplayName($$props.item.currentOwner)]);
			append($$anchor, div_6);
		};
		if_block(node_5, ($$render) => {
			if (get(isForeign)) $$render(consequent_6);
		});
		var details_1 = sibling(node_5, 2);
		var pre_1 = sibling(child(details_1), 2);
		var text_10 = child(pre_1, true);
		reset(pre_1);
		reset(details_1);
		reset(div_5);
		reset(div_2);
		template_effect(($0) => {
			classes = set_class(div_2, 1, "object-item svelte-1nc09ne", null, classes, { foreign: get(isForeign) });
			set_attribute(span_2, "title", $$props.item.label);
			set_text(text_6, get(amountDisplay));
			set_text(text_10, $0);
		}, [() => JSON.stringify($$props.item, null, 2)]);
		append($$anchor, div_2);
	};
	if_block(node, ($$render) => {
		if (variant() === "timelocked") $$render(consequent_1);
		else $$render(alternate_2, -1);
	});
	append($$anchor, fragment);
	pop();
}
delegate(["click"]);
//#endregion
//#region src/lib/pages/multi-account-view/AccountCard.svelte
var root$6 = from_html(`<div class="stake-row svelte-csbsq3"><span class="stake-label svelte-csbsq3" title="Liquid IOTA available to stake"> </span> <input class="stake-input svelte-csbsq3" type="text" inputmode="decimal" aria-label="Stake amount in IOTA"/> <button class="stake-btn svelte-csbsq3"> </button></div>`);
var root_1$5 = from_html(`<div style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.8rem;">No stakes</div>`);
var root_2$5 = from_html(`<div style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;"><div style="font-size: 0.8rem; color: #f87171; margin-bottom: 0.25rem;" title="Timelocked stakes are intentionally excluded from optimization. Unlock them first to switch validator.">Timelocked (no optimization)</div> <!></div>`);
var root_3$5 = from_html(`<div class="object-list svelte-csbsq3"><!> <!> <!></div>`);
var root_4$4 = from_html(`<div style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.8rem;">No objects match filter</div>`);
var root_5$3 = from_html(`<div style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;"><div style="font-size: 0.8rem; color: #f87171; margin-bottom: 0.25rem;">Timelocked</div> <!></div>`);
var root_6$2 = from_html(`<div style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.8rem;">No objects</div>`);
var root_7$1 = from_html(`<div class="account-card svelte-csbsq3"><div class="account-header svelte-csbsq3"><div style="display: flex; flex-direction: column;"><div style="display: flex; align-items: center; gap: 0.5rem;"><span class="account-title svelte-csbsq3"> </span> <button style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; background: var(--secondary-color); border-radius: 3px;">Copy Address</button></div> <div class="account-buttons svelte-csbsq3" style="display: flex; gap: 0.5rem; margin-top: 0.2rem;"><button style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; border-radius: 3px;"> </button></div></div> <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem;"><div style="display: flex; gap: 0.3rem; flex-wrap: wrap; justify-content: flex-end;"><button class="header-btn svelte-csbsq3" title="Show only this account; hide every other card.">Solo</button> <button class="header-btn svelte-csbsq3" title="Hide this card. Use 'Show hidden' in the toolbar to bring it back.">Hide</button> <button class="header-btn danger svelte-csbsq3">Remove</button></div> <div class="account-balance svelte-csbsq3"> <span style="font-size: 0.8em; color: var(--text-muted);">IOTA</span></div></div></div> <!> <!></div>`);
function AccountCard($$anchor, $$props) {
	push($$props, true);
	/** Global, partial, case-insensitive substring filter on the Move type
	*  string of each object. Empty string disables filtering. When set,
	*  DnD is disabled because the rendered list is a subset and a drag
	*  reorder would silently drop the hidden objects. */
	/** Per-stake-object metric block, keyed by stake object id. Only set in
	*  staking mode and only for objects whose pool is known. */
	/** Callback when the user clicks Optimize/Compare on a stake. */
	/** Triggered by the "Stake X IOTA" button. Does NOT execute a
	*  transaction — the host instead jumps to the trend chart with this
	*  pending new-stake selected, where the user reviews and confirms.
	*  The chart owns validator selection and the actual Stake action. */
	/** Forwarded to per-stake badges for IOTA→fiat conversion. */
	/** When true, IOTA amounts on per-object rows and the per-account
	*  total are rounded to 2 decimals. Toggled in BalanceSummary. */
	let typeFilter = prop($$props, "typeFilter", 3, ""), currentPrice = prop($$props, "currentPrice", 3, null), selectedCurrency = prop($$props, "selectedCurrency", 3, "USD"), compactAmounts = prop($$props, "compactAmounts", 3, false);
	let displayLabel = user_derived(() => $$props.account.label || $$props.account.address.slice(0, 6) + "..." + $$props.account.address.slice(-4));
	let totalBalance = user_derived(() => accountTotalBalance($$props.account));
	let objectCount = user_derived(() => $$props.account.objects.length + $$props.account.timelockedObjects.length);
	let normalizedTypeFilter = user_derived(() => typeFilter().trim().toLowerCase());
	let isFiltered = user_derived(() => get(normalizedTypeFilter).length > 0);
	function matchesTypeFilter(obj) {
		if (!get(isFiltered)) return true;
		const t = obj?.data?.content?.type;
		return typeof t === "string" && t.toLowerCase().includes(get(normalizedTypeFilter));
	}
	let visibleObjects = user_derived(() => get(isFiltered) ? $$props.account.objects.filter(matchesTypeFilter) : $$props.account.objects);
	let visibleTimelocked = user_derived(() => get(isFiltered) ? $$props.account.timelockedObjects.filter(matchesTypeFilter) : $$props.account.timelockedObjects);
	let visibleCount = user_derived(() => get(visibleObjects).length + get(visibleTimelocked).length);
	let stakeOnlyObjects = user_derived(() => get(visibleObjects).filter(isStakeObject));
	let stakeOnlyTimelocked = user_derived(() => get(visibleTimelocked).filter(isStakeObject));
	/** Liquid (non-timelocked) IOTA available to stake on this account. */
	let liquidIotaNano = user_derived(() => {
		let total = 0n;
		for (const obj of $$props.account.objects) total += objectIotaCoinAmount(obj);
		return total;
	});
	/** Reserve a small amount for unstake gas. 0.1 IOTA chosen to match the
	*  user's stated rule of thumb — enough headroom for a follow-up
	*  unstake transaction without locking the entire balance. */
	const STAKE_GAS_RESERVE_NANO = 100000000n;
	/** Threshold below which the stake control is hidden — staking dust is
	*  rarely worth the gas. Matches the "more than one IOTA" UX rule. */
	const STAKE_MIN_LIQUID_NANO = 1000000000n;
	let canStake = user_derived(() => $$props.stakingMode && !!$$props.onRequestStake && get(liquidIotaNano) > STAKE_MIN_LIQUID_NANO);
	let defaultStakeAmount = user_derived(() => get(liquidIotaNano) > STAKE_GAS_RESERVE_NANO ? get(liquidIotaNano) - STAKE_GAS_RESERVE_NANO : 0n);
	/** User-editable stake amount, kept in IOTA units (not nano) so the input
	*  shows decimals naturally. Re-syncs to the default whenever the liquid
	*  balance changes (e.g. after a Sync). */
	let stakeAmountIota = state("");
	let lastSyncedDefault = 0n;
	user_effect(() => {
		if (get(defaultStakeAmount) !== lastSyncedDefault) {
			lastSyncedDefault = get(defaultStakeAmount);
			set(stakeAmountIota, nanoToIota(get(defaultStakeAmount).toString()), true);
		}
	});
	let stakeAmountNano = user_derived(() => {
		const trimmed = get(stakeAmountIota).trim();
		if (!trimmed) return null;
		try {
			return BigInt(iotaToNano(trimmed));
		} catch {
			return null;
		}
	});
	let stakeAmountValid = user_derived(() => get(stakeAmountNano) !== null && get(stakeAmountNano) > 0n && get(stakeAmountNano) <= get(liquidIotaNano));
	function handleStakeClick() {
		if (!$$props.onRequestStake || !get(stakeAmountValid) || get(stakeAmountNano) === null) return;
		$$props.onRequestStake($$props.account.address, get(stakeAmountNano));
	}
	var div = root_7$1();
	var div_1 = child(div);
	var div_2 = child(div_1);
	var div_3 = child(div_2);
	var span = child(div_3);
	var text = child(span, true);
	reset(span);
	var button = sibling(span, 2);
	reset(div_3);
	var div_4 = sibling(div_3, 2);
	var button_1 = child(div_4);
	var text_1 = child(button_1);
	reset(button_1);
	reset(div_4);
	reset(div_2);
	var div_5 = sibling(div_2, 2);
	var div_6 = child(div_5);
	var button_2 = child(div_6);
	var button_3 = sibling(button_2, 2);
	var button_4 = sibling(button_3, 2);
	reset(div_6);
	var div_7 = sibling(div_6, 2);
	var text_2 = child(div_7);
	next$1();
	reset(div_7);
	reset(div_5);
	reset(div_1);
	var node = sibling(div_1, 2);
	var consequent = ($$anchor) => {
		var div_8 = root$6();
		var span_1 = child(div_8);
		var text_3 = child(span_1);
		reset(span_1);
		var input = sibling(span_1, 2);
		remove_input_defaults(input);
		var button_5 = sibling(input, 2);
		var text_4 = child(button_5);
		reset(button_5);
		reset(div_8);
		template_effect(($0, $1) => {
			set_text(text_3, `Liquid: ${$0 ?? ""} IOTA`);
			button_5.disabled = !get(stakeAmountValid);
			set_attribute(button_5, "title", !get(stakeAmountValid) ? "Enter an amount > 0 and ≤ liquid balance." : "Open net-return chart to pick a validator and confirm.");
			set_text(text_4, `Stake${$1 ?? ""}`);
		}, [() => formatIotaAmount(get(liquidIotaNano), compactAmounts()), () => get(stakeAmountValid) && get(stakeAmountNano) !== null ? ` ${formatIotaAmount(get(stakeAmountNano), compactAmounts())} IOTA` : ""]);
		bind_value(input, () => get(stakeAmountIota), ($$value) => set(stakeAmountIota, $$value));
		delegated("click", button_5, handleStakeClick);
		append($$anchor, div_8);
	};
	if_block(node, ($$render) => {
		if (get(canStake)) $$render(consequent);
	});
	var node_1 = sibling(node, 2);
	var consequent_9 = ($$anchor) => {
		var fragment = comment();
		var node_2 = first_child(fragment);
		var consequent_3 = ($$anchor) => {
			var div_9 = root_3$5();
			var node_3 = child(div_9);
			each(node_3, 17, () => get(stakeOnlyObjects), (item) => item.id, ($$anchor, item) => {
				{
					let $0 = user_derived(() => $$props.stakingMetrics?.get(get(item).id));
					let $1 = user_derived(() => $$props.onOptimizeStake && $$props.stakingMetrics?.get(get(item).id) ? () => $$props.onOptimizeStake(get(item).id) : void 0);
					ObjectItem($$anchor, {
						get item() {
							return get(item);
						},
						get accountAddress() {
							return $$props.account.address;
						},
						get getAccountDisplayName() {
							return $$props.getAccountDisplayName;
						},
						variant: "standard",
						get stakingMetric() {
							return get($0);
						},
						get onOptimize() {
							return get($1);
						},
						get currentPrice() {
							return currentPrice();
						},
						get selectedCurrency() {
							return selectedCurrency();
						},
						get compactAmounts() {
							return compactAmounts();
						}
					});
				}
			});
			var node_4 = sibling(node_3, 2);
			var consequent_1 = ($$anchor) => {
				append($$anchor, root_1$5());
			};
			if_block(node_4, ($$render) => {
				if (get(stakeOnlyObjects).length === 0 && get(stakeOnlyTimelocked).length === 0) $$render(consequent_1);
			});
			var node_5 = sibling(node_4, 2);
			var consequent_2 = ($$anchor) => {
				var div_11 = root_2$5();
				each(sibling(child(div_11), 2), 17, () => get(stakeOnlyTimelocked), (item) => item.id, ($$anchor, item) => {
					ObjectItem($$anchor, {
						get item() {
							return get(item);
						},
						get accountAddress() {
							return $$props.account.address;
						},
						get getAccountDisplayName() {
							return $$props.getAccountDisplayName;
						},
						variant: "timelocked",
						get compactAmounts() {
							return compactAmounts();
						}
					});
				});
				reset(div_11);
				append($$anchor, div_11);
			};
			if_block(node_5, ($$render) => {
				if (get(stakeOnlyTimelocked).length !== 0) $$render(consequent_2);
			});
			reset(div_9);
			append($$anchor, div_9);
		};
		var consequent_6 = ($$anchor) => {
			var div_12 = root_3$5();
			var node_7 = child(div_12);
			each(node_7, 17, () => get(visibleObjects), (item) => item.id, ($$anchor, item) => {
				ObjectItem($$anchor, {
					get item() {
						return get(item);
					},
					get accountAddress() {
						return $$props.account.address;
					},
					get getAccountDisplayName() {
						return $$props.getAccountDisplayName;
					},
					variant: "standard",
					get compactAmounts() {
						return compactAmounts();
					}
				});
			});
			var node_8 = sibling(node_7, 2);
			var consequent_4 = ($$anchor) => {
				append($$anchor, root_4$4());
			};
			if_block(node_8, ($$render) => {
				if (get(visibleObjects).length === 0 && get(visibleTimelocked).length === 0) $$render(consequent_4);
			});
			var node_9 = sibling(node_8, 2);
			var consequent_5 = ($$anchor) => {
				var div_14 = root_5$3();
				each(sibling(child(div_14), 2), 17, () => get(visibleTimelocked), (item) => item.id, ($$anchor, item) => {
					ObjectItem($$anchor, {
						get item() {
							return get(item);
						},
						get accountAddress() {
							return $$props.account.address;
						},
						get getAccountDisplayName() {
							return $$props.getAccountDisplayName;
						},
						variant: "timelocked",
						get compactAmounts() {
							return compactAmounts();
						}
					});
				});
				reset(div_14);
				append($$anchor, div_14);
			};
			if_block(node_9, ($$render) => {
				if (get(visibleTimelocked).length !== 0) $$render(consequent_5);
			});
			reset(div_12);
			append($$anchor, div_12);
		};
		var alternate = ($$anchor) => {
			var div_15 = root_3$5();
			var node_11 = child(div_15);
			each(node_11, 17, () => $$props.account.objects, (item) => item.id, ($$anchor, item) => {
				ObjectItem($$anchor, {
					get item() {
						return get(item);
					},
					get accountAddress() {
						return $$props.account.address;
					},
					get getAccountDisplayName() {
						return $$props.getAccountDisplayName;
					},
					variant: "standard",
					get compactAmounts() {
						return compactAmounts();
					}
				});
			});
			var node_12 = sibling(node_11, 2);
			var consequent_7 = ($$anchor) => {
				append($$anchor, root_6$2());
			};
			if_block(node_12, ($$render) => {
				if ($$props.account.objects.length === 0 && $$props.account.timelockedObjects.length === 0) $$render(consequent_7);
			});
			var node_13 = sibling(node_12, 2);
			var consequent_8 = ($$anchor) => {
				var div_17 = root_5$3();
				each(sibling(child(div_17), 2), 17, () => $$props.account.timelockedObjects, (item) => item.id, ($$anchor, item) => {
					ObjectItem($$anchor, {
						get item() {
							return get(item);
						},
						get accountAddress() {
							return $$props.account.address;
						},
						get getAccountDisplayName() {
							return $$props.getAccountDisplayName;
						},
						variant: "timelocked",
						get compactAmounts() {
							return compactAmounts();
						}
					});
				});
				reset(div_17);
				append($$anchor, div_17);
			};
			if_block(node_13, ($$render) => {
				if ($$props.account.timelockedObjects.length !== 0) $$render(consequent_8);
			});
			reset(div_15);
			action(div_15, ($$node, $$action_arg) => dragHandleZone?.($$node, $$action_arg), () => ({
				items: $$props.account.objects,
				flipDurationMs: 200
			}));
			event("consider", div_15, function(...$$args) {
				$$props.onDnd?.apply(this, $$args);
			});
			event("finalize", div_15, function(...$$args) {
				$$props.onDnd?.apply(this, $$args);
			});
			append($$anchor, div_15);
		};
		if_block(node_2, ($$render) => {
			if ($$props.stakingMode) $$render(consequent_3);
			else if (get(isFiltered)) $$render(consequent_6, 1);
			else $$render(alternate, -1);
		});
		append($$anchor, fragment);
	};
	if_block(node_1, ($$render) => {
		if (!$$props.account.isCollapsed) $$render(consequent_9);
	});
	reset(div);
	template_effect(($0) => {
		set_attribute(span, "title", $$props.account.address);
		set_text(text, get(displayLabel));
		set_text(text_1, `${$$props.account.isCollapsed ? "▶ Expand" : "▼ Collapse"} (${(get(isFiltered) ? `${get(visibleCount)}/${get(objectCount)}` : get(objectCount)) ?? ""})`);
		set_text(text_2, `${$0 ?? ""} `);
	}, [() => formatIotaAmount(get(totalBalance), compactAmounts())]);
	delegated("click", button, () => navigator.clipboard.writeText($$props.account.address));
	delegated("click", button_1, function(...$$args) {
		$$props.onToggleCollapse?.apply(this, $$args);
	});
	delegated("click", button_2, function(...$$args) {
		$$props.onSolo?.apply(this, $$args);
	});
	delegated("click", button_3, function(...$$args) {
		$$props.onHide?.apply(this, $$args);
	});
	delegated("click", button_4, function(...$$args) {
		$$props.onRemove?.apply(this, $$args);
	});
	append($$anchor, div);
	pop();
}
delegate(["click"]);
//#endregion
//#region src/lib/pages/multi-account-view/multi-account-service.ts
/**
* Compute staking rewards for all accounts
*/
async function computeAllStakingRewards(accounts) {
	try {
		const client = getClient();
		return await Promise.all(accounts.map(async (account) => {
			const stakedIotaObjects = account.objects.filter((obj) => obj.label === "StakedIota");
			const timelockedStakedIotaObjects = account.timelockedObjects.filter((obj) => obj.label === "TimelockedStakedIota");
			const rewardsPromises = [...stakedIotaObjects, ...timelockedStakedIotaObjects].map(async (obj) => {
				try {
					const stakeData = await computeStakingRewards(client, obj.id, account.address);
					return BigInt(stakeData.rewards);
				} catch (err) {
					console.warn(`Failed to compute rewards for ${obj.label} ${obj.id}:`, err);
					return BigInt(0);
				}
			});
			const totalRewards = (await Promise.all(rewardsPromises)).reduce((sum, reward) => sum + reward, BigInt(0));
			return {
				...account,
				stakingRewards: totalRewards
			};
		}));
	} catch (err) {
		console.error("Error computing staking rewards:", err);
		throw err;
	}
}
/**
* Fetch objects for all accounts
*/
async function getObjectsForAccounts(accounts) {
	try {
		const client = getClient();
		return await Promise.all(accounts.map(async (account) => {
			let allData = [];
			let cursor = null;
			let hasNextPage = true;
			while (hasNextPage) {
				const result = await client.getOwnedObjects({
					owner: account.address,
					options: {
						showContent: true,
						showType: true
					},
					cursor
				});
				allData = allData.concat(result.data);
				hasNextPage = result.hasNextPage;
				cursor = result.nextCursor;
			}
			const objects = allData.map((obj) => {
				let label = obj.data.content?.type;
				if (typeof label === "string") label = label.split("::").slice(2).join("::");
				return {
					id: obj.data.objectId,
					label,
					data: obj.data,
					currentOwner: account.address
				};
			});
			const timelockedObjects = [];
			const filteredObjects = [];
			for (const obj of objects) if (obj.label === "TimelockedStakedIota" || obj.label.startsWith("TimeLock<")) timelockedObjects.push(obj);
			else filteredObjects.push(obj);
			return {
				...account,
				objects: filteredObjects,
				timelockedObjects
			};
		}));
	} catch (err) {
		console.error("Error fetching objects:", err);
		throw err;
	}
}
var PRICE_CACHE_KEY = "iota-price-cache-v1";
function readPriceCache() {
	try {
		const raw = typeof localStorage !== "undefined" && localStorage.getItem(PRICE_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed.fetchedAt === "number" && (typeof parsed.usd === "number" || typeof parsed.eur === "number")) return parsed;
		return null;
	} catch {
		return null;
	}
}
function writePriceCache(price) {
	try {
		if (typeof localStorage === "undefined") return;
		const data = {
			...price,
			fetchedAt: Date.now()
		};
		localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(data));
	} catch (err) {
		console.warn("Failed to write price cache:", err);
	}
}
/**
* Fetch the current IOTA price from CoinGecko, optionally serving from a
* localStorage cache when fresh enough.
*
* Pass `maxAgeMs > 0` from auto-fetch paths (component mount, page nav)
* so reloads within the freshness window reuse the cached value. Omit the
* option (or pass 0) for the manual "Fetch Price" button so the user can
* force a refresh.
*
* A successful fetch always updates the cache, regardless of whether the
* call hit the network or not.
*/
async function fetchCurrentPrice(opts = {}) {
	const maxAgeMs = opts.maxAgeMs ?? 0;
	if (maxAgeMs > 0) {
		const cached = readPriceCache();
		if (cached && Date.now() - cached.fetchedAt < maxAgeMs) return {
			usd: cached.usd,
			eur: cached.eur
		};
	}
	try {
		const res = await fetch("https://api.coingecko.com/api/v3/coins/iota");
		if (res.ok) {
			const data = await res.json();
			const usd = data?.market_data?.current_price?.usd;
			const eur = data?.market_data?.current_price?.eur;
			if (typeof usd === "number" || typeof eur === "number") {
				const price = {
					usd,
					eur
				};
				writePriceCache(price);
				return price;
			}
		}
		return null;
	} catch (err) {
		console.error("Failed to fetch current price:", err);
		return null;
	}
}
//#endregion
//#region src/lib/pages/multi-account-view/BalanceSummary.svelte
var root$5 = from_html(`<details class="summary-section svelte-70k3q2" open=""><summary class="svelte-70k3q2"><span class="chevron svelte-70k3q2" aria-hidden="true">▶</span> <span class="title svelte-70k3q2">Balance Breakdown</span> <span class="subtitle svelte-70k3q2"> </span></summary> <div class="price-controls svelte-70k3q2"><label class="compact-toggle svelte-70k3q2" title="Round IOTA amounts to 2 decimals instead of showing the full nano tail."><input type="checkbox" class="svelte-70k3q2"/> <span>Compact amounts</span></label> <select class="svelte-70k3q2"><option>USD</option><option>EUR</option></select> <button class="svelte-70k3q2">Fetch Price</button></div> <div class="table-wrapper"><table class="summary-table svelte-70k3q2"><thead><tr><th class="svelte-70k3q2">Category</th><th class="svelte-70k3q2">Amount (IOTA)</th><th class="svelte-70k3q2"> </th></tr></thead><tbody><tr class="total-row" style="background: rgba(16, 185, 129, 0.1);"><td class="svelte-70k3q2"><strong>Total</strong></td><td class="svelte-70k3q2"><strong> </strong></td><td class="svelte-70k3q2"><strong> </strong></td></tr><tr><td class="svelte-70k3q2">IOTA Coins</td><td class="svelte-70k3q2"> </td><td class="svelte-70k3q2"> </td></tr><tr><td class="svelte-70k3q2">Staked</td><td class="svelte-70k3q2"> </td><td class="svelte-70k3q2"> </td></tr><tr><td class="svelte-70k3q2">Staking Rewards</td><td class="svelte-70k3q2"> </td><td class="svelte-70k3q2"> </td></tr></tbody></table></div></details>`);
function BalanceSummary($$anchor, $$props) {
	push($$props, true);
	let selectedCurrency = prop($$props, "selectedCurrency", 15), currentPrice = prop($$props, "currentPrice", 15), compactAmounts = prop($$props, "compactAmounts", 15);
	let totalBalance = user_derived(() => sumAccounts($$props.accounts, accountTotalBalance));
	let totalIotaCoins = user_derived(() => sumAccounts($$props.accounts, accountIotaCoins));
	let totalStaked = user_derived(() => sumAccounts($$props.accounts, accountStaked));
	let totalRewards = user_derived(() => sumAccounts($$props.accounts, (a) => a.stakingRewards));
	function fiat(amountNano) {
		if (!currentPrice()) return "-";
		return (parseFloat(nanoToIota(amountNano.toString())) * (selectedCurrency() === "USD" ? currentPrice().usd : currentPrice().eur)).toFixed(2);
	}
	var details = root$5();
	var summary = child(details);
	var span = sibling(child(summary), 4);
	var text = child(span);
	reset(span);
	reset(summary);
	var div = sibling(summary, 2);
	var label = child(div);
	var input = child(label);
	remove_input_defaults(input);
	next$1(2);
	reset(label);
	var select = sibling(label, 2);
	var option = child(select);
	option.value = option.__value = "USD";
	var option_1 = sibling(option);
	option_1.value = option_1.__value = "EUR";
	reset(select);
	var button = sibling(select, 2);
	reset(div);
	var div_1 = sibling(div, 2);
	var table = child(div_1);
	var thead = child(table);
	var tr = child(thead);
	var th = sibling(child(tr), 2);
	var text_1 = child(th);
	reset(th);
	reset(tr);
	reset(thead);
	var tbody = sibling(thead);
	var tr_1 = child(tbody);
	var td = sibling(child(tr_1));
	var strong = child(td);
	var text_2 = child(strong, true);
	reset(strong);
	reset(td);
	var td_1 = sibling(td);
	var strong_1 = child(td_1);
	var text_3 = child(strong_1, true);
	reset(strong_1);
	reset(td_1);
	reset(tr_1);
	var tr_2 = sibling(tr_1);
	var td_2 = sibling(child(tr_2));
	var text_4 = child(td_2, true);
	reset(td_2);
	var td_3 = sibling(td_2);
	var text_5 = child(td_3, true);
	reset(td_3);
	reset(tr_2);
	var tr_3 = sibling(tr_2);
	var td_4 = sibling(child(tr_3));
	var text_6 = child(td_4, true);
	reset(td_4);
	var td_5 = sibling(td_4);
	var text_7 = child(td_5, true);
	reset(td_5);
	reset(tr_3);
	var tr_4 = sibling(tr_3);
	var td_6 = sibling(child(tr_4));
	var text_8 = child(td_6, true);
	reset(td_6);
	var td_7 = sibling(td_6);
	var text_9 = child(td_7, true);
	reset(td_7);
	reset(tr_4);
	reset(tbody);
	reset(table);
	reset(div_1);
	reset(details);
	template_effect(($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) => {
		set_text(text, `Total:
            ${$0 ?? ""} IOTA${$1 ?? ""}`);
		set_text(text_1, `Value (${selectedCurrency() ?? ""})`);
		set_text(text_2, $2);
		set_text(text_3, $3);
		set_text(text_4, $4);
		set_text(text_5, $5);
		set_text(text_6, $6);
		set_text(text_7, $7);
		set_text(text_8, $8);
		set_text(text_9, $9);
	}, [
		() => formatIotaCompact(get(totalBalance)),
		() => currentPrice() ? ` ≈ ${fiat(get(totalBalance))} ${selectedCurrency()}` : "",
		() => formatIotaAmount(get(totalBalance), compactAmounts()),
		() => fiat(get(totalBalance)),
		() => formatIotaAmount(get(totalIotaCoins), compactAmounts()),
		() => fiat(get(totalIotaCoins)),
		() => formatIotaAmount(get(totalStaked), compactAmounts()),
		() => fiat(get(totalStaked)),
		() => formatIotaAmount(get(totalRewards), compactAmounts()),
		() => fiat(get(totalRewards))
	]);
	bind_checked(input, compactAmounts);
	bind_select_value(select, selectedCurrency);
	delegated("click", button, () => fetchCurrentPrice().then((price) => currentPrice(price)));
	append($$anchor, details);
	pop();
}
delegate(["click"]);
/** Reference principal used for synthetic APR computations — large enough to
*  avoid bigint truncation when multiplied by exchange-rate ratios. */
var REFERENCE_PRINCIPAL_NANO = 1000000000000000n;
var STAKING_TIME_FRAME_LABELS = {
	"last-1-day": "Last 1 day",
	"last-7-days": "Last 7 days",
	"last-15-days": "Last 15 days",
	"last-30-days": "Last 30 days",
	"last-50-days": "Last 50 days",
	"last-90-days": "Last 90 days",
	all: "All time"
};
var STAKING_TIME_FRAME_DAYS = {
	"last-1-day": 1,
	"last-7-days": 7,
	"last-15-days": 15,
	"last-30-days": 30,
	"last-50-days": 50,
	"last-90-days": 90,
	all: null
};
/** The cache stores rates with a +1 epoch offset (the rate effective at logical
*  epoch E is keyed at E+1, because rates are computed at the *end* of an epoch
*  and inserted under the next epoch's index — see the comment on
*  fetchPoolExchangeRates in staking-rewards/graphql-requests.ts).
*
*  This helper hides that offset and returns the rate active at the requested
*  logical epoch, or null if not cached. */
function getCachedRate(poolId, logicalEpoch) {
	const entry = exchangeRateCache.get(poolId);
	if (!entry) return null;
	return entry.epochData[logicalEpoch + 1] ?? null;
}
/** Find the closest cached rate at-or-before the requested epoch. Used as a
*  fallback when the exact requested epoch hasn't been fetched (e.g. the
*  window starts at an epoch we don't have). */
function findClosestCachedRate(poolId, targetEpoch) {
	const entry = exchangeRateCache.get(poolId);
	if (!entry) return null;
	let bestLogical = -1;
	for (const k of Object.keys(entry.epochData)) {
		const logical = parseInt(k) - 1;
		if (logical <= targetEpoch && logical > bestLogical) bestLogical = logical;
	}
	if (bestLogical === -1) return null;
	return {
		rate: entry.epochData[bestLogical + 1],
		epoch: bestLogical
	};
}
/** Earliest cached rate for a pool. Used as a forward fallback when the
*  caller wants a rate at an epoch that *precedes* the pool's first cached
*  data — e.g. an "all time" window with `fromEpoch = 1` against a pool
*  whose first entry is at epoch 100. Without this, the closest-before
*  lookup returns null and the APR comes out as 0. */
function findEarliestCachedRate(poolId) {
	const entry = exchangeRateCache.get(poolId);
	if (!entry) return null;
	let earliest = Infinity;
	for (const k of Object.keys(entry.epochData)) {
		const logical = parseInt(k) - 1;
		if (logical < earliest) earliest = logical;
	}
	if (earliest === Infinity) return null;
	return {
		rate: entry.epochData[earliest + 1],
		epoch: earliest
	};
}
/** Resolve a rate at logical epoch E, falling back in this priority order:
*  1) exact match, 2) closest at-or-before E, 3) earliest cached entry.
*  Step 3 is what makes "all time" computations work for pools whose
*  history doesn't reach back to epoch 1. Returns null only if the pool
*  has no rates at all. */
function resolveRate(poolId, logicalEpoch) {
	return getCachedRate(poolId, logicalEpoch) ?? findClosestCachedRate(poolId, logicalEpoch)?.rate ?? findEarliestCachedRate(poolId)?.rate ?? null;
}
/** Like `resolveRate` but also reports the *actual* epoch the returned rate
*  came from — important for window-length calculations: an all-time window
*  asking for `fromEpoch=1` against a pool starting at epoch 100 must
*  annualize over (toEpoch − 100), not (toEpoch − 1). */
function resolveRateWithEpoch(poolId, logicalEpoch) {
	const exact = getCachedRate(poolId, logicalEpoch);
	if (exact) return {
		rate: exact,
		epoch: logicalEpoch
	};
	return findClosestCachedRate(poolId, logicalEpoch) ?? findEarliestCachedRate(poolId) ?? null;
}
/** Cumulative net return per epoch for a pool, baselined at `fromEpoch`.
*  Each point is `{ epoch, returnFraction }` where returnFraction is the
*  growth of one IOTA staked at fromEpoch (e.g. 0.0123 = +1.23%).
*
*  Only epochs that have an *exact* cached rate produce a point — missing
*  epochs are skipped rather than papered over with the closest-rate
*  fallback, otherwise the line would show artificial flat segments.
*
*  For very long windows the series is strided to keep the chart point
*  count manageable (cap ≈200 points). */
function poolReturnSeries(poolId, fromEpoch, toEpoch) {
	if (toEpoch <= fromEpoch) return [];
	const baseline = resolveRate(poolId, fromEpoch);
	if (!baseline) return [];
	const baselineTokens = getTokenAmount(baseline, REFERENCE_PRINCIPAL_NANO);
	const stride = Math.max(1, Math.ceil((toEpoch - fromEpoch) / 200));
	const points = [];
	for (let e = fromEpoch; e <= toEpoch; e += stride) {
		const rate = getCachedRate(poolId, e);
		if (!rate) continue;
		const value = getIotaAmount(rate, baselineTokens);
		const ret = value > REFERENCE_PRINCIPAL_NANO ? Number(value - REFERENCE_PRINCIPAL_NANO) / Number(REFERENCE_PRINCIPAL_NANO) : 0;
		points.push({
			epoch: e,
			returnFraction: ret
		});
	}
	return points;
}
/** Per-epoch net return for a pool. Each point is the return earned in that
*  single epoch (R(E) / R(E−1) − 1), not a cumulative figure — useful for
*  comparing validators' raw daily yield and for spotting epochs where a
*  validator earned nothing (downtime).
*
*  Only epochs that have an exact cached rate AND a cached predecessor
*  produce a point; missing epochs are skipped (the line will have gaps
*  rather than artificial zero-return spikes). Strided to ≈200 points max. */
function poolPerEpochReturnSeries(poolId, fromEpoch, toEpoch) {
	if (toEpoch <= fromEpoch) return [];
	const stride = Math.max(1, Math.ceil((toEpoch - fromEpoch) / 200));
	const points = [];
	for (let e = fromEpoch; e <= toEpoch; e += stride) {
		const rPrev = getCachedRate(poolId, e - 1);
		const rNow = getCachedRate(poolId, e);
		if (!rPrev || !rNow) continue;
		const value = getIotaAmount(rNow, getTokenAmount(rPrev, REFERENCE_PRINCIPAL_NANO));
		const ret = value > REFERENCE_PRINCIPAL_NANO ? Number(value - REFERENCE_PRINCIPAL_NANO) / Number(REFERENCE_PRINCIPAL_NANO) : 0;
		points.push({
			epoch: e,
			returnFraction: ret
		});
	}
	return points;
}
/** Adjust a requested [fromEpoch, toEpoch] so it lands on epochs we actually
*  have cached rates for, then return the resolved start/end pair. Two
*  things this handles:
*
*    1. **Current epoch is in progress** → its rate hasn't been computed yet,
*       so resolving toEpoch falls back to the most recent completed epoch.
*       To preserve the user's requested window length, we shift `fromEpoch`
*       back by the same gap. Without this the 1-day window would compare
*       `rate(N-1)` to `rate(N-1)` (both fall back to the same point) and
*       always return 0% APR; longer windows would compute the correct
*       growth but annualize over too many days, slightly underestimating.
*    2. **Pool didn't exist at fromEpoch** → start falls forward to the
*       earliest cached rate. The "all time" case relies on this.
*
*  Returns null when either end can't be resolved or the resolved span has
*  zero length (no measurable growth available). */
function resolveWindow(poolId, fromEpoch, toEpoch) {
	if (toEpoch <= fromEpoch) return null;
	const end = resolveRateWithEpoch(poolId, toEpoch);
	if (!end) return null;
	const gap = Math.max(0, toEpoch - end.epoch);
	const start = resolveRateWithEpoch(poolId, Math.max(1, fromEpoch - gap));
	if (!start) return null;
	if (end.epoch <= start.epoch) return null;
	return {
		start,
		end
	};
}
/** Net APR (annualized) over the given window for a pool. The exchange rate
*  already encodes commission, so this is what a *delegator* would have
*  realized. Returns 0 when data is missing or the window can't be made
*  positive. Annualization uses the *actual* completed-epoch span (see
*  `resolveWindow`). */
function poolNetAprOverWindow(poolId, fromEpoch, toEpoch) {
	const w = resolveWindow(poolId, fromEpoch, toEpoch);
	if (!w) return 0;
	const tokens = getTokenAmount(w.start.rate, REFERENCE_PRINCIPAL_NANO);
	const value = getIotaAmount(w.end.rate, tokens);
	if (value <= REFERENCE_PRINCIPAL_NANO) return 0;
	const periodReturn = Number(value - REFERENCE_PRINCIPAL_NANO) / Number(REFERENCE_PRINCIPAL_NANO);
	const epochsInWindow = w.end.epoch - w.start.epoch;
	return periodReturn * 365 / epochsInWindow;
}
/** Window-only return (not annualized) as a fraction. Same window-resolution
*  rules as `poolNetAprOverWindow`. */
function poolReturnOverWindow(poolId, fromEpoch, toEpoch) {
	const w = resolveWindow(poolId, fromEpoch, toEpoch);
	if (!w) return 0;
	const tokens = getTokenAmount(w.start.rate, REFERENCE_PRINCIPAL_NANO);
	const value = getIotaAmount(w.end.rate, tokens);
	if (value <= REFERENCE_PRINCIPAL_NANO) return 0;
	return Number(value - REFERENCE_PRINCIPAL_NANO) / Number(REFERENCE_PRINCIPAL_NANO);
}
/** Compute realized rewards (in nano-IOTA) for a single stake over a window.
*  - principal: nano-IOTA at activation
*  - activationEpoch: logical epoch when the stake activated
*  - fromEpoch / toEpoch: window endpoints (logical epochs)
*
*  When activationEpoch > fromEpoch the window is clipped to start at activation
*  (a stake can't earn before it exists). */
function stakeRewardsInWindow(poolId, principal, activationEpoch, fromEpoch, toEpoch) {
	const startEpoch = Math.max(fromEpoch, activationEpoch);
	if (toEpoch <= startEpoch) return 0n;
	const rBaseline = resolveRate(poolId, activationEpoch - 1);
	const rStart = resolveRate(poolId, startEpoch);
	const rEnd = resolveRate(poolId, toEpoch);
	if (!rBaseline || !rStart || !rEnd) return 0n;
	const tokens = getTokenAmount(rBaseline, principal);
	const valueAtStart = getIotaAmount(rStart, tokens);
	const valueAtEnd = getIotaAmount(rEnd, tokens);
	return valueAtEnd > valueAtStart ? valueAtEnd - valueAtStart : 0n;
}
/** Convert an annualized linear rate (APR) to its compounded equivalent
*  (APY). On IOTA mainnet the natural compounding period is one epoch
*  (≈1 day), so we use 365 compounding periods per year by default —
*  matching the staking pool's auto-compounding behavior (pool tokens stay
*  the same; their IOTA value grows each epoch).
*
*  For typical staking returns (~5% APR) the difference is ~0.13pp; for
*  very-low or zero APR it's negligible, but exposing both lets users see
*  the more accurate compounded yield. */
function aprToApy(apr, compoundsPerYear = 365) {
	if (apr <= 0) return apr;
	return Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1;
}
/** Days until cumulative new-validator earnings catch up with cumulative old.
*  Assumes one epoch (~1 day) of activation delay where the new stake earns
*  nothing. Returns null when newApr <= oldApr (switching is never profitable). */
function computeBreakevenDays(oldApr, newApr, delayDays = 1) {
	if (newApr <= oldApr) return null;
	return newApr * delayDays / (newApr - oldApr);
}
/** Resolve a [fromEpoch, toEpoch] range for a staking time-frame. We map days
*  → epochs 1:1 since mainnet epochs are ≈24h. For "all" we return [1, current]. */
function timeFrameToEpochRange(timeFrame, currentEpoch) {
	const days = STAKING_TIME_FRAME_DAYS[timeFrame];
	if (days === null) return {
		fromEpoch: 1,
		toEpoch: currentEpoch
	};
	return {
		fromEpoch: Math.max(1, currentEpoch - days),
		toEpoch: currentEpoch
	};
}
//#endregion
//#region src/lib/pages/multi-account-view/staking-transactions.ts
/** Build a stake transaction: split `amount` from gas, then add_stake. Mirrors
*  ../stake/staking-operations.ts but kept here so the multi-account view's
*  staking flows have a self-contained transaction module. */
function buildStakeTransaction(validatorAddress, amount) {
	const tx = new Transaction();
	const stakeCoin = tx.splitCoins(tx.gas, [amount]);
	tx.moveCall({
		target: "0x3::iota_system::request_add_stake",
		arguments: [
			tx.sharedObjectRef({
				objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
				initialSharedVersion: 1,
				mutable: true
			}),
			stakeCoin,
			tx.pure.address(validatorAddress)
		]
	});
	return tx;
}
/** Multi-stake variant: withdraws every stake, **merges** the resulting
*  balances into a single coin, and stakes that one coin to
*  `newValidatorAddress` — so N input stakes become a **single** new
*  StakedIota object (principal + accumulated rewards combined), not N.
*
*  All stakes must belong to the same sender (set externally with
*  `tx.setSender(...)`). Since the view only ever targets one validator and a
*  PTB has a single sender, this produces the minimum possible number of
*  output objects: one. This is correct whether the action is a switch
*  (different validator) or a restake (same validator to realize/compound
*  rewards) — both consolidate into one stake.
*
*  A single-element input is a no-op for the merge (one withdraw → one
*  add_stake), behaving exactly as before. */
function buildSwitchValidatorTransactionMulti(stakedIotaObjectIds, newValidatorAddress) {
	const tx = new Transaction();
	const systemRef = tx.sharedObjectRef({
		objectId: IOTA_SYSTEM_STATE_OBJECT_ID,
		initialSharedVersion: 1,
		mutable: true
	});
	const [primaryCoin, ...restCoins] = stakedIotaObjectIds.map((stakeId) => {
		const [balance] = tx.moveCall({
			target: "0x3::iota_system::request_withdraw_stake_non_entry",
			arguments: [systemRef, tx.object(stakeId)]
		});
		const [coin] = tx.moveCall({
			target: "0x2::coin::from_balance",
			arguments: [balance],
			typeArguments: ["0x2::iota::IOTA"]
		});
		return coin;
	});
	if (restCoins.length > 0) tx.mergeCoins(primaryCoin, restCoins);
	tx.moveCall({
		target: "0x3::iota_system::request_add_stake",
		arguments: [
			systemRef,
			primaryCoin,
			tx.pure.address(newValidatorAddress)
		]
	});
	return tx;
}
//#endregion
//#region src/lib/pages/multi-account-view/StakingControls.svelte
var root$4 = from_html(`<option> </option>`);
var root_1$4 = from_html(`<span class="status svelte-e9ngkt">Loading staking data…</span>`);
var root_2$4 = from_html(`<span class="status svelte-e9ngkt"> </span>`);
var root_3$4 = from_html(`<span class="status error svelte-e9ngkt"> </span>`);
var root_4$3 = from_html(`<div class="staking-controls svelte-e9ngkt"><label class="control-row svelte-e9ngkt">Timeframe (can make a big difference!): <button type="button" class="nav-btn svelte-e9ngkt" title="Shorter timeframe" aria-label="Previous timeframe">◀</button> <select class="svelte-e9ngkt"></select> <button type="button" class="nav-btn svelte-e9ngkt" title="Longer timeframe" aria-label="Next timeframe">▶</button></label> <fieldset class="metric-fieldset svelte-e9ngkt" title="Controls the small badge shown next to each StakedIota in the account cards below — the validator-comparison table is unaffected."><legend class="svelte-e9ngkt">Per-stake badge</legend> <label class="svelte-e9ngkt"><input type="radio"/> Rewards %</label> <label class="svelte-e9ngkt"><input type="radio"/> Commission</label></fieldset> <!> <!></div>`);
function StakingControls($$anchor, $$props) {
	push($$props, true);
	const binding_group = [];
	/** Which value to surface per-stake-object in the account cards: the
	*  validator's commission rate, or the realized rewards % of principal
	*  over the chosen timeframe. (This selector only affects the small badge
	*  on each StakedIota row — the comparison table below shows both
	*  separately and is unaffected.) */
	let timeFrame = prop($$props, "timeFrame", 15), metricType = prop($$props, "metricType", 15), loading = prop($$props, "loading", 3, false), loadError = prop($$props, "loadError", 3, "");
	/** Stable order of the timeframe presets — must match the keys defined
	*  in STAKING_TIME_FRAME_LABELS so prev/next steps walk through them in
	*  the same order as the dropdown. */
	const TIME_FRAME_ORDER = Object.keys(STAKING_TIME_FRAME_LABELS);
	let timeFrameIndex = user_derived(() => TIME_FRAME_ORDER.indexOf(timeFrame()));
	function prevTimeFrame() {
		if (loading()) return;
		const len = TIME_FRAME_ORDER.length;
		const i = ((get(timeFrameIndex) < 0 ? 0 : get(timeFrameIndex) - 1) + len) % len;
		timeFrame(TIME_FRAME_ORDER[i]);
	}
	function nextTimeFrame() {
		if (loading()) return;
		const len = TIME_FRAME_ORDER.length;
		const i = ((get(timeFrameIndex) < 0 ? 0 : get(timeFrameIndex) + 1) + len) % len;
		timeFrame(TIME_FRAME_ORDER[i]);
	}
	var div = root_4$3();
	var label_1 = child(div);
	var button = sibling(child(label_1));
	var select = sibling(button, 2);
	each(select, 21, () => Object.entries(STAKING_TIME_FRAME_LABELS), index, ($$anchor, $$item) => {
		var $$array = user_derived(() => to_array(get($$item), 2));
		let value = () => get($$array)[0];
		let label = () => get($$array)[1];
		var option = root$4();
		var text = child(option, true);
		reset(option);
		var option_value = {};
		template_effect(() => {
			set_text(text, label());
			if (option_value !== (option_value = value())) option.value = (option.__value = value()) ?? "";
		});
		append($$anchor, option);
	});
	reset(select);
	var button_1 = sibling(select, 2);
	reset(label_1);
	var fieldset = sibling(label_1, 2);
	var label_2 = sibling(child(fieldset), 2);
	var input = child(label_2);
	remove_input_defaults(input);
	input.value = input.__value = "rewards";
	next$1();
	reset(label_2);
	var label_3 = sibling(label_2, 2);
	var input_1 = child(label_3);
	remove_input_defaults(input_1);
	input_1.value = input_1.__value = "commission";
	next$1();
	reset(label_3);
	reset(fieldset);
	var node = sibling(fieldset, 2);
	var consequent = ($$anchor) => {
		append($$anchor, root_1$4());
	};
	var consequent_1 = ($$anchor) => {
		var span_1 = root_2$4();
		var text_1 = child(span_1);
		reset(span_1);
		template_effect(() => set_text(text_1, `${$$props.validatorsLoaded ?? ""} validators loaded`));
		append($$anchor, span_1);
	};
	if_block(node, ($$render) => {
		if (loading()) $$render(consequent);
		else if ($$props.validatorsLoaded !== void 0 && !loadError()) $$render(consequent_1, 1);
	});
	var node_1 = sibling(node, 2);
	var consequent_2 = ($$anchor) => {
		var span_2 = root_3$4();
		var text_2 = child(span_2, true);
		reset(span_2);
		template_effect(() => set_text(text_2, loadError()));
		append($$anchor, span_2);
	};
	if_block(node_1, ($$render) => {
		if (loadError()) $$render(consequent_2);
	});
	reset(div);
	template_effect(() => {
		button.disabled = loading();
		select.disabled = loading();
		button_1.disabled = loading();
		fieldset.disabled = loading();
	});
	delegated("click", button, prevTimeFrame);
	bind_select_value(select, timeFrame);
	delegated("click", button_1, nextTimeFrame);
	bind_group(binding_group, [], input, metricType, metricType);
	bind_group(binding_group, [], input_1, metricType, metricType);
	append($$anchor, div);
	pop();
}
delegate(["click"]);
//#endregion
//#region src/lib/pages/multi-account-view/validator-info.ts
/** Effective commission per IIP-8: `max(declared commission, voting-power
*  share)`. Validators with disproportionately large stake are forced to
*  keep at least their voting-power percentage as commission, even if
*  their declared rate is lower. Returned in basis points. */
function effectiveCommissionBps(v) {
	return Math.max(v.commissionBps, v.votingPowerBps);
}
/** Fetch every active validator with the fields needed for staking metrics
*  (pool ID for exchange-rate lookups, commission rate, committee flag).
*  Candidates are intentionally skipped — they have no exchange-rate history
*  and earn no rewards yet, so they can't be compared. */
async function fetchValidatorsForStaking() {
	const systemState = await getClient().getLatestIotaSystemState();
	const committeeAddrs = new Set((systemState.committeeMembers || []).map((m) => m.iotaAddress));
	return {
		validators: systemState.activeValidators.map((v) => ({
			address: v.iotaAddress,
			name: v.name || "Unknown",
			poolId: v.stakingPoolId,
			exchangeRatesId: v.exchangeRatesId,
			commissionBps: parseInt(v.commissionRate),
			votingPowerBps: parseInt(v.votingPower),
			stakingPoolIotaBalance: BigInt(v.stakingPoolIotaBalance),
			isCommittee: committeeAddrs.size === 0 || committeeAddrs.has(v.iotaAddress)
		})),
		currentEpoch: parseInt(systemState.epoch)
	};
}
//#endregion
//#region src/lib/pages/multi-account-view/StakingTrendChart.svelte
var root$3 = from_html(`<option> </option>`);
var root_1$3 = from_html(`<label class="select-row svelte-w4m6sy">Show: <select class="svelte-w4m6sy"></select> <span class="row-hint svelte-w4m6sy">+ your stakes (always)</span></label>`);
var root_2$3 = from_html(`<button type="button"><span class="account-dot svelte-w4m6sy" aria-hidden="true"></span> </button>`);
var root_3$3 = from_html(`<div class="accounts-row svelte-w4m6sy"><span class="chip-label svelte-w4m6sy">Accounts:</span> <!></div>`);
var root_4$2 = from_html(`<button type="button"> </button>`);
var root_5$2 = from_html(`<span class="stake-group stake-row-item svelte-w4m6sy"><button type="button"> </button> <!></span>`);
var root_6$1 = from_html(`<span class="row-hint svelte-w4m6sy"> </span>`);
var root_7 = from_html(`<div class="stakes-controls svelte-w4m6sy"><!> <div class="stakes-header svelte-w4m6sy"><div class="stakes-actions svelte-w4m6sy"><button type="button" class="chip-action svelte-w4m6sy">All</button> <button type="button" class="chip-action svelte-w4m6sy">None</button></div> <span class="chip-label svelte-w4m6sy">Stakes:</span> <span class="stakes-hint svelte-w4m6sy">sorted by total IOTA, largest first</span></div> <div class="stakes-list svelte-w4m6sy"></div></div> <div class="target-row svelte-w4m6sy"><span class="chip-label svelte-w4m6sy">Switch target:</span> <button type="button" class="nav-btn svelte-w4m6sy" title="Previous candidate (higher APR)" aria-label="Previous candidate">◀</button> <select class="target-select svelte-w4m6sy"><option>(none — only show stay)</option><!></select> <button type="button" class="nav-btn svelte-w4m6sy" title="Next candidate (lower APR)" aria-label="Next candidate">▶</button> <!></div> <label class="select-row svelte-w4m6sy"><span class="chip-label svelte-w4m6sy">Project:</span> <select class="target-select svelte-w4m6sy"></select></label>`, 1);
var root_8 = from_html(`<span class="breakeven-pill svelte-w4m6sy"> </span>`);
var root_9 = from_html(`<div class="legend-hint svelte-w4m6sy"> <strong>two projection lines</strong>: the dashed, lighter
            one is the linear <strong>APR</strong> extrapolation; the solid, deeper one is the
            compounded <strong>APY</strong> (what actually happens — the staking pool auto-compounds
            at every epoch). Red = stay; green = switch (flat for ≈1 epoch during activation, then
            climbs). Amber filled area = APY-based <em>switch − stay</em> on the right axis: negative during the activation gap, positive
            once the higher APY catches up. <!></div>`);
var root_10 = from_html(`→ <strong> </strong> <span class="banner-meta svelte-w4m6sy"> </span>`, 1);
var root_11 = from_html(`<span class="banner-meta-warn svelte-w4m6sy">Pick a target validator below.</span>`);
var root_12 = from_html(`<div class="new-stake-banner svelte-w4m6sy"><div class="new-stake-summary svelte-w4m6sy"><span class="banner-tag svelte-w4m6sy">New stake</span> <strong> </strong> from <strong> </strong> <!></div> <div class="new-stake-actions svelte-w4m6sy"><button type="button" class="banner-cancel svelte-w4m6sy">Cancel</button> <button type="button" class="banner-confirm svelte-w4m6sy"> </button></div></div>`);
var root_13 = from_html(`<span class="commission-line svelte-w4m6sy"> </span>`);
var root_14 = from_html(`<div class="optimize-section svelte-w4m6sy"><div class="metrics-context svelte-w4m6sy"> </div> <div class="metrics svelte-w4m6sy"><div class="metric svelte-w4m6sy"><div class="label svelte-w4m6sy">Current net APR / APY</div> <div class="value svelte-w4m6sy"> </div> <div class="sub-value svelte-w4m6sy"> </div></div> <div class="metric svelte-w4m6sy"><div class="label svelte-w4m6sy">Target net APR / APY <!></div> <div class="value highlight svelte-w4m6sy"> </div> <div class="sub-value svelte-w4m6sy"> </div></div> <div class="metric svelte-w4m6sy"><div class="label svelte-w4m6sy">Yearly difference</div> <div> </div> <div class="sub-value svelte-w4m6sy">on selected basket</div></div> <div class="metric svelte-w4m6sy"><div class="label svelte-w4m6sy">Breakeven</div> <div class="value svelte-w4m6sy"><!></div> <div class="sub-value svelte-w4m6sy"> </div></div></div> <div class="optimize-actions svelte-w4m6sy"><button type="button" class="primary svelte-w4m6sy"> </button></div> <div class="optimize-note svelte-w4m6sy"> </div></div>`);
var root_15 = from_html(`<details class="trend-section svelte-w4m6sy" open=""><summary class="svelte-w4m6sy"><span class="chevron svelte-w4m6sy" aria-hidden="true">▶</span> <span class="title svelte-w4m6sy">Net return over time</span> <span class="subtitle svelte-w4m6sy"><!></span></summary> <div class="mode-toggle-row svelte-w4m6sy"><div class="mode-toggle svelte-w4m6sy"><button>My stake projection</button> <button>All validators</button></div></div> <div class="chart-controls svelte-w4m6sy"><!></div> <!> <div class="zoom-row svelte-w4m6sy"><span class="zoom-hint svelte-w4m6sy">Wheel/pinch to zoom · drag to pan</span> <button class="reset-button svelte-w4m6sy" title="Reset zoom and pan">Reset zoom</button></div> <!> <div class="chart-wrapper svelte-w4m6sy"><canvas></canvas></div> <!></details>`);
function StakingTrendChart($$anchor, $$props) {
	push($$props, true);
	auto_default.register(plugin);
	/** A handle to one of the user's staked objects, with its current
	*  validator pre-resolved so the chart doesn't have to look it up. */
	/** Human-readable owner label (account label or shortened address).
	*  Used by the account list + per-account coloring so users can see
	*  which stake belongs to which account. */
	/** When set, the chart switches to "my-stake" mode, replaces the
	*  selection with this single stake, and clears the request back to
	*  null. Used to focus the chart from outside (e.g. clicking the
	*  per-stake "Optimize" button in an account card). */
	/** Selected switch-target validator address. Bindable so the host can
	*  share it with per-account stake controls (the AccountCard's
	*  "Stake X IOTA" button stakes to this same validator). Empty string
	*  means "no target picked". */
	/** Pending "stake new liquid IOTA from account X" intent originated by
	*  an AccountCard click. When set, the chart focuses itself, clears
	*  any existing-stake selection, auto-picks a target if needed, and
	*  shows a banner above the chart with a confirm button. The chart
	*  clears it back to `null` after a successful confirm or explicit
	*  cancel. */
	/** Build + execute the switch transaction(s). Receives the currently-
	*  selected stakes and the chosen target validator. The host owns
	*  building the actual PTB(s) so it can group by sending account. */
	/** Build + execute a new-stake transaction for a pending stake intent.
	*  Called only when `pendingNewStake` is set and the user clicks the
	*  banner's confirm button. */
	let currentPrice = prop($$props, "currentPrice", 3, null), selectedCurrency = prop($$props, "selectedCurrency", 3, "USD"), focusStakeRequest = prop($$props, "focusStakeRequest", 15, null), switchTargetAddress = prop($$props, "switchTargetAddress", 15, ""), pendingNewStake = prop($$props, "pendingNewStake", 15, null);
	let mode = state("my-stake");
	/** Which of the user's stakes to combine into the projection. Stored as a
	*  `Set` wrapped in `$state` — toggle helpers reassign the whole set so
	*  Svelte tracks the change. Default is "all selected" so users see the
	*  full picture immediately. */
	let selectedStakeIds = state(proxy(/* @__PURE__ */ new Set()));
	/** How many top-APR committee validators to show alongside the user's
	*  stakes. `'all'` shows every committee validator (can be a lot of
	*  lines). `0` shows only the user's stakes. */
	let topN = state(10);
	const TOP_N_OPTIONS = [
		{
			value: 0,
			label: "0 (only my stakes)"
		},
		{
			value: 5,
			label: "Top 5"
		},
		{
			value: 10,
			label: "Top 10"
		},
		{
			value: 20,
			label: "Top 20"
		},
		{
			value: "all",
			label: "All committee"
		}
	];
	/** How many days into the future the stay/switch projection extends.
	*  `'auto'` adapts to the breakeven distance (1.5× breakeven + 14 days,
	*  floor 90 days) so the crossover is always visible; numeric values
	*  pin the horizon for direct comparison across different selections. */
	let projectionHorizon = state("auto");
	const PROJECTION_HORIZON_OPTIONS = [
		{
			value: "auto",
			label: "Auto (adapt to breakeven)"
		},
		{
			value: 30,
			label: "30 days"
		},
		{
			value: 60,
			label: "60 days"
		},
		{
			value: 90,
			label: "90 days"
		},
		{
			value: 180,
			label: "180 days"
		},
		{
			value: 365,
			label: "365 days"
		},
		{
			value: 730,
			label: "2 years"
		}
	];
	/** Crossover point published from buildMyStakeDatasets so the legend hint
	*  below the chart can mention the day count without recomputing it. */
	let breakevenInfo = state(null);
	/** Tracks whether the default "select all stakes" has already run.
	*  Without this we can't distinguish "fresh visit, initialize" from
	*  "user explicitly cleared with the None button" — both look like
	*  `selectedStakeIds.size === 0` to the effect. Non-reactive on
	*  purpose so we don't loop. */
	let stakesInitialized = false;
	/** Default-select the user's stakes at the highest-commission validator
	*  on first visit — that's typically the most expensive exposure and
	*  therefore the best switch candidate to investigate first. After
	*  initialization just prune IDs that disappear from the synced stake
	*  list. The user's explicit clear (None button) is respected — we
	*  never re-fill an empty set once they've interacted. */
	user_effect(() => {
		if (get(mode) !== "my-stake") return;
		const validIds = $$props.userStakes.map((s) => s.stakeId);
		if (!stakesInitialized && validIds.length > 0) {
			let pickedAddr = null;
			let pickedComm = -1;
			let pickedPrincipal = 0n;
			const totalsByAddr = /* @__PURE__ */ new Map();
			for (const s of $$props.userStakes) totalsByAddr.set(s.validator.address, (totalsByAddr.get(s.validator.address) ?? 0n) + s.principal);
			for (const s of $$props.userStakes) {
				const eff = effectiveCommissionBps(s.validator);
				const total = totalsByAddr.get(s.validator.address) ?? s.principal;
				if (eff > pickedComm || eff === pickedComm && total > pickedPrincipal) {
					pickedComm = eff;
					pickedPrincipal = total;
					pickedAddr = s.validator.address;
				}
			}
			const ids = pickedAddr ? $$props.userStakes.filter((s) => s.validator.address === pickedAddr).map((s) => s.stakeId) : validIds;
			set(selectedStakeIds, new Set(ids), true);
			stakesInitialized = true;
			return;
		}
		const valid = new Set(validIds);
		const pruned = new Set([...get(selectedStakeIds)].filter((id) => valid.has(id)));
		if (pruned.size !== get(selectedStakeIds).size) set(selectedStakeIds, pruned, true);
	});
	/** Tracks whether the user has chosen a switch target (including the
	*  `(none — only show stay)` option, which sets `switchTargetAddress`
	*  to the empty string). Without this flag the auto-pick effect below
	*  would treat `''` as "needs picking" and immediately overwrite the
	*  user's explicit None choice — same class of bug as the stake-list
	*  None button before its `stakesInitialized` fix. Non-reactive on
	*  purpose so flipping it doesn't itself retrigger the effect. */
	let switchTargetTouched = false;
	/** Auto-pick the highest-APR alternative committee validator as default
	*  switch target. Excludes pools the currently-selected stakes are in,
	*  and respects an explicit user choice (touched flag). Also clears
	*  the target if the user adds a stake at its pool — the target then
	*  becomes "switch to yourself", which has no meaning. */
	user_effect(() => {
		if (get(mode) !== "my-stake" || get(selectedStakeIds).size === 0) return;
		if (switchTargetTouched) return;
		if (switchTargetAddress()) return;
		const selectedStakes = $$props.userStakes.filter((s) => get(selectedStakeIds).has(s.stakeId));
		const myPools = new Set(selectedStakes.map((s) => s.validator.poolId));
		const baseline = weightedOldApr(selectedStakes);
		const better = $$props.validators.filter((v) => v.isCommittee && !myPools.has(v.poolId)).map((v) => ({
			v,
			apr: $$props.aprByPool.get(v.poolId) ?? 0
		})).filter((x) => x.apr > baseline).sort((a, b) => b.apr - a.apr)[0];
		if (better) switchTargetAddress(better.v.address);
	});
	function toggleStake(id) {
		const next = new Set(get(selectedStakeIds));
		if (next.has(id)) next.delete(id);
		else next.add(id);
		set(selectedStakeIds, next, true);
	}
	function selectAllStakes() {
		set(selectedStakeIds, new Set($$props.userStakes.map((s) => s.stakeId)), true);
	}
	function selectNoneStakes() {
		set(selectedStakeIds, /* @__PURE__ */ new Set(), true);
	}
	/** Stakes grouped by validator. Groups sorted by total principal
	*  descending (biggest exposures first); stakes within a group sorted
	*  by principal descending. */
	let stakeGroups = user_derived(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of $$props.userStakes) {
			const key = s.validator.address;
			const existing = map.get(key);
			if (existing) {
				existing.stakes.push(s);
				existing.totalPrincipal += s.principal;
			} else map.set(key, {
				validator: s.validator,
				stakes: [s],
				totalPrincipal: s.principal
			});
		}
		for (const g of map.values()) g.stakes.sort((a, b) => a.principal < b.principal ? 1 : a.principal > b.principal ? -1 : 0);
		return [...map.values()].sort((a, b) => a.totalPrincipal < b.totalPrincipal ? 1 : a.totalPrincipal > b.totalPrincipal ? -1 : 0);
	});
	function groupSelectionState(g) {
		let any = false;
		let all = true;
		for (const s of g.stakes) if (get(selectedStakeIds).has(s.stakeId)) any = true;
		else all = false;
		return all ? "all" : any ? "partial" : "none";
	}
	function toggleGroup(g) {
		const state = groupSelectionState(g);
		const next = new Set(get(selectedStakeIds));
		if (state === "all") for (const s of g.stakes) next.delete(s.stakeId);
		else for (const s of g.stakes) next.add(s.stakeId);
		set(selectedStakeIds, next, true);
	}
	/** Distinct accounts present among the user's stakes, in first-appearance
	*  order. Drives the account list above the stakes and the per-account
	*  coloring. Order is stable so each account keeps its color across
	*  rebuilds. Only meaningful with ≥2 accounts — coloring + the list are
	*  gated on that below. */
	let accounts = user_derived(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of $$props.userStakes) {
			const existing = map.get(s.accountAddress);
			if (existing) existing.stakeIds.push(s.stakeId);
			else map.set(s.accountAddress, {
				address: s.accountAddress,
				label: s.accountLabel,
				stakeIds: [s.stakeId]
			});
		}
		return [...map.values()];
	});
	/** address → stable color index (position in `accounts`). */
	let accountColorIndex = user_derived(() => new Map(get(accounts).map((a, i) => [a.address, i])));
	/** Coloring + the account list only add value with more than one account. */
	let showAccountColors = user_derived(() => get(accounts).length >= 2);
	/** Account address currently hovered (via an account button or a stake
	*  chip). Both directions set this so the account row and its stake chips
	*  highlight together. */
	let hoveredAccount = state(null);
	/** Account → translucent background color, or '' when coloring is off
	*  (single account). Used for stake amount buttons and the account list. */
	function stakeBg(accountAddress) {
		if (!get(showAccountColors)) return "";
		const i = get(accountColorIndex).get(accountAddress);
		return i === void 0 ? "" : accountColor(i).bg;
	}
	/** Account → opaque accent color (left border on single-stake chips, ring
	*  on account buttons), or '' when coloring is off. */
	function stakeAccent(accountAddress) {
		if (!get(showAccountColors)) return "";
		const i = get(accountColorIndex).get(accountAddress);
		return i === void 0 ? "" : accountColor(i).solid;
	}
	function accountSelectionState(a) {
		let any = false;
		let all = true;
		for (const id of a.stakeIds) if (get(selectedStakeIds).has(id)) any = true;
		else all = false;
		return all ? "all" : any ? "partial" : "none";
	}
	function toggleAccount(a) {
		const state = accountSelectionState(a);
		const next = new Set(get(selectedStakeIds));
		if (state === "all") for (const id of a.stakeIds) next.delete(id);
		else for (const id of a.stakeIds) next.add(id);
		set(selectedStakeIds, next, true);
	}
	/** Pool IDs the currently-selected stakes are delegated to. A target in
	*  one of these pools means "restake to the same validator" rather than a
	*  switch — still valid (it realizes/compounds rewards), so such targets
	*  are kept in the candidate list and marked "(current)". */
	let selectedPoolIds = user_derived(() => new Set($$props.userStakes.filter((s) => get(selectedStakeIds).has(s.stakeId)).map((s) => s.validator.poolId)));
	/** Sorted-by-APR-descending list of valid switch targets: committee
	*  validators, plus the user's own current validators (even if no longer
	*  in committee) so restaking to them is always possible. Drives the
	*  prev/next navigation buttons. */
	let targetCandidates = user_derived(() => {
		const byAddress = /* @__PURE__ */ new Map();
		for (const v of $$props.validators) if (v.isCommittee) byAddress.set(v.address, v);
		for (const s of $$props.userStakes) if (get(selectedStakeIds).has(s.stakeId)) byAddress.set(s.validator.address, s.validator);
		return [...byAddress.values()].sort((a, b) => ($$props.aprByPool.get(b.poolId) ?? 0) - ($$props.aprByPool.get(a.poolId) ?? 0));
	});
	let targetIndex = user_derived(() => get(targetCandidates).findIndex((v) => v.address === switchTargetAddress()));
	function prevTarget() {
		if (get(targetCandidates).length === 0) return;
		const wrapped = ((get(targetIndex) < 0 ? 0 : get(targetIndex) - 1) + get(targetCandidates).length) % get(targetCandidates).length;
		switchTargetAddress(get(targetCandidates)[wrapped].address);
		switchTargetTouched = true;
	}
	function nextTarget() {
		if (get(targetCandidates).length === 0) return;
		const wrapped = (get(targetIndex) < 0 ? 0 : get(targetIndex) + 1) % get(targetCandidates).length;
		switchTargetAddress(get(targetCandidates)[wrapped].address);
		switchTargetTouched = true;
	}
	function onTargetSelectChange() {
		switchTargetTouched = true;
	}
	/** Principal-weighted average APR across the given stakes. */
	function weightedOldApr(stakes) {
		let totalP = 0;
		let weighted = 0;
		for (const s of stakes) {
			const p = Number(s.principal);
			const apr = $$props.aprByPool.get(s.validator.poolId) ?? 0;
			totalP += p;
			weighted += p * apr;
		}
		return totalP > 0 ? weighted / totalP : 0;
	}
	/** Derived "current basket" state surfaced by the metrics row + Switch
	*  button below the chart. Computing once here means the markup and the
	*  chart-builder agree on numbers; previously the projection chart and
	*  the (now-deleted) OptimizePanel could drift if their inputs differed. */
	let selectedStakeRefs = user_derived(() => $$props.userStakes.filter((s) => get(selectedStakeIds).has(s.stakeId)));
	let combinedPrincipal = user_derived(() => get(selectedStakeRefs).reduce((sum, s) => sum + s.principal, 0n));
	let combinedOldApr = user_derived(() => weightedOldApr(get(selectedStakeRefs)));
	let switchTarget = user_derived(() => switchTargetAddress() ? $$props.validators.find((v) => v.address === switchTargetAddress()) ?? null : null);
	let switchTargetApr = user_derived(() => get(switchTarget) ? $$props.aprByPool.get(get(switchTarget).poolId) ?? 0 : 0);
	let projectionBreakeven = user_derived(() => get(switchTarget) ? computeBreakevenDays(get(combinedOldApr), get(switchTargetApr)) : null);
	/** True when the chosen target is a validator some selected stake is
	*  already at — i.e. the action realizes/compounds rewards rather than
	*  moving to a better pool. Used to allow the action even though such a
	*  restake has no (meaningful) breakeven. */
	let targetIsCurrent = user_derived(() => !!get(switchTarget) && get(selectedStakeRefs).some((s) => s.validator.poolId === get(switchTarget).poolId));
	/** True when *every* selected stake is already at the target — a pure
	*  restake. Drives the "Restake" vs "Switch" button wording. */
	let allSelectedAtTarget = user_derived(() => !!get(switchTarget) && get(selectedStakeRefs).length > 0 && get(selectedStakeRefs).every((s) => s.validator.poolId === get(switchTarget).poolId));
	/** "X IOTA / year (≈ $Y) / year" — yield on the current basket at a given
	*  APR. Used by the metrics row. */
	function aprToYearlyText(apr) {
		return formatIotaWithFiat(BigInt(Math.floor(Number(get(combinedPrincipal)) * apr)), currentPrice(), selectedCurrency()) + " / year";
	}
	function aprDiffYearlyText() {
		const diff = get(switchTargetApr) - get(combinedOldApr);
		return `${diff >= 0 ? "+" : "−"}${formatIotaWithFiat(BigInt(Math.floor(Math.abs(Number(get(combinedPrincipal)) * diff))), currentPrice(), selectedCurrency())} / year`;
	}
	function fmtPctValue(x, digits = 2) {
		return `${(x * 100).toFixed(digits)}%`;
	}
	function handleSwitch() {
		if (!get(switchTarget) || get(selectedStakeRefs).length === 0) return;
		$$props.onSwitch?.(get(selectedStakeRefs), get(switchTarget));
	}
	/** Pending-new-stake confirm: hand the intent off to the host, which
	*  builds + executes the transaction and clears `pendingNewStake` on
	*  success (so the banner disappears). */
	function handleConfirmNewStake() {
		if (!pendingNewStake() || !get(switchTarget)) return;
		$$props.onStakeNew?.(pendingNewStake().accountAddress, pendingNewStake().amountNano, get(switchTarget));
	}
	function handleCancelNewStake() {
		pendingNewStake(null);
	}
	/** Net APR of the auto/explicitly-picked target — used for the banner's
	*  "≈ X IOTA / year" preview. */
	let pendingTargetApr = user_derived(() => get(switchTarget) ? $$props.aprByPool.get(get(switchTarget).poolId) ?? 0 : 0);
	let pendingYearlyText = user_derived(() => {
		if (!pendingNewStake() || get(pendingTargetApr) <= 0) return "";
		return formatIotaWithFiat(BigInt(Math.floor(Number(pendingNewStake().amountNano) * get(pendingTargetApr))), currentPrice(), selectedCurrency()) + " / year";
	});
	/** Switching is performed one PTB per sending account (a transaction can
	*  only have one sender). Surfacing the count makes the button label
	*  honest — "1 transaction" when all selected stakes share an account,
	*  "N transactions" when they span N accounts. */
	let switchTxCount = user_derived(() => {
		const accounts = /* @__PURE__ */ new Set();
		for (const s of get(selectedStakeRefs)) accounts.add(s.accountAddress);
		return accounts.size;
	});
	/** Width of the active window in epochs (mainnet ≈ 1 day each). Drives
	*  the "based on N-day window" annotation on the metrics card so users
	*  can see why the breakeven number changes with the timeframe. */
	let windowDays = user_derived(() => Math.max(1, $$props.toEpoch - $$props.fromEpoch));
	/** External focus request (e.g. user clicked "Optimize" on a stake card).
	*  Open the section, jump into my-stake mode, replace the selection with
	*  just that stake, scroll into view, and clear the request so the same
	*  signal can fire again later for the same stake. */
	let detailsEl = state(void 0);
	user_effect(() => {
		if (focusStakeRequest() === null) return;
		untrack(() => {
			set(mode, "my-stake");
			stakesInitialized = true;
			set(selectedStakeIds, /* @__PURE__ */ new Set([focusStakeRequest()]), true);
			switchTargetAddress("");
			switchTargetTouched = false;
			if (get(detailsEl)) get(detailsEl).open = true;
			requestAnimationFrame(() => {
				get(detailsEl)?.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			});
			focusStakeRequest(null);
		});
	});
	/** Pending new-stake request from an AccountCard. Same focus mechanic as
	*  `focusStakeRequest`, but here we *clear* the existing-stake selection
	*  rather than replacing it — the user is staking fresh liquid IOTA, so
	*  there's no "stay" baseline to compare against. We do not clear
	*  `pendingNewStake` itself: the banner needs it to render, and the
	*  confirm/cancel handlers below own clearing. */
	user_effect(() => {
		if (pendingNewStake() === null) return;
		untrack(() => {
			set(mode, "my-stake");
			stakesInitialized = true;
			set(selectedStakeIds, /* @__PURE__ */ new Set(), true);
			if (get(detailsEl)) get(detailsEl).open = true;
			requestAnimationFrame(() => {
				get(detailsEl)?.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			});
		});
	});
	/** Auto-pick a target validator when a new-stake intent arrives without
	*  one already chosen. Picks the highest-APR committee validator — same
	*  rationale as the existing-stake auto-pick (best alternative). The
	*  user can override via the Switch target dropdown. */
	user_effect(() => {
		if (pendingNewStake() === null) return;
		if (switchTargetAddress()) return;
		if ($$props.validators.length === 0) return;
		untrack(() => {
			const best = $$props.validators.filter((v) => v.isCommittee).map((v) => ({
				v,
				apr: $$props.aprByPool.get(v.poolId) ?? 0
			})).sort((a, b) => b.apr - a.apr)[0];
			if (best) {
				switchTargetAddress(best.v.address);
				switchTargetTouched = true;
			}
		});
	});
	let canvas;
	let chart = null;
	/** Tracks the previous legend click so a quick second click on the same
	*  item counts as a double-click. Chart.js has no native dblclick on
	*  legend items, so we detect it from timestamp + dataset index. */
	let lastLegendClick = null;
	const LEGEND_DBLCLICK_MS = 300;
	/** Double-clicking a legend item isolates it: hide every other dataset so
	*  only the clicked validator remains. Double-clicking again (when it's
	*  already the only visible one) restores all datasets. */
	function isolateDataset(ci, index) {
		const onlyThisVisible = ci.data.datasets.every((_, i) => ci.isDatasetVisible(i) === (i === index));
		ci.data.datasets.forEach((_, i) => {
			if (onlyThisVisible || i === index) ci.show(i);
			else ci.hide(i);
		});
		ci.update();
	}
	onMount(buildChart);
	onDestroy(() => chart?.destroy());
	/** Rebuild on any input change. The dataset is small so a full rebuild
	*  is cheaper than computing a diff. Price/currency are captured in the
	*  tooltip closure, so they need to be in the dependency set too —
	*  otherwise the tooltip would keep rendering with stale fiat. */
	user_effect(() => {
		get(mode);
		get(selectedStakeIds);
		switchTargetAddress();
		$$props.validators;
		$$props.fromEpoch;
		$$props.toEpoch;
		$$props.userPoolIds;
		$$props.userStakes;
		get(topN);
		get(projectionHorizon);
		$$props.aprByPool;
		currentPrice();
		selectedCurrency();
		pendingNewStake();
		if (canvas) buildChart();
	});
	/** Stable color palette. Returns the same color for the same index across
	*  rebuilds — important so toggling lines via the legend doesn't reshuffle
	*  colors. */
	const PALETTE = [
		"#34d399",
		"#f87171",
		"#60a5fa",
		"#fbbf24",
		"#a78bfa",
		"#22d3ee",
		"#f472b6",
		"#fb923c",
		"#4ade80",
		"#e879f9"
	];
	function colorFor(i) {
		return PALETTE[i % PALETTE.length];
	}
	/** Per-account color so users can see which stake belongs to which
	*  account. Golden-angle hue stepping gives any number of accounts
	*  distinct, visually-spread colors that stay stable across rebuilds
	*  (the account's index in `accounts` is fixed). Returns a translucent
	*  `bg` for chip/list backgrounds and an opaque `solid` for accents/rings. */
	function accountColor(i) {
		const hue = Math.round(i * 137.508 % 360);
		return {
			solid: `hsl(${hue}, 60%, 58%)`,
			bg: `hsla(${hue}, 60%, 50%, 0.28)`
		};
	}
	function buildChart() {
		if (!canvas) return;
		if (chart) {
			chart.destroy();
			chart = null;
		}
		const datasets = get(mode) === "validators" ? buildValidatorsDatasets() : buildMyStakeDatasets();
		chart = new auto_default(canvas, {
			type: "line",
			data: { datasets },
			options: chartOptions()
		});
	}
	function buildValidatorsDatasets() {
		const committee = $$props.validators.filter((v) => v.isCommittee);
		const sorted = [...committee].sort((a, b) => ($$props.aprByPool.get(b.poolId) ?? 0) - ($$props.aprByPool.get(a.poolId) ?? 0));
		let pool;
		if (get(topN) === "all") pool = sorted;
		else {
			const top = sorted.slice(0, get(topN));
			const userOnes = committee.filter((v) => $$props.userPoolIds.has(v.poolId));
			const seen = /* @__PURE__ */ new Set();
			pool = [...userOnes, ...top].filter((v) => {
				if (seen.has(v.address)) return false;
				seen.add(v.address);
				return true;
			});
		}
		return pool.map((v, i) => {
			const series = poolPerEpochReturnSeries(v.poolId, $$props.fromEpoch, $$props.toEpoch);
			const isUser = $$props.userPoolIds.has(v.poolId);
			return {
				label: v.name + (isUser ? " (your stake)" : ""),
				data: series.map((p) => ({
					x: p.epoch,
					y: p.returnFraction * 100
				})),
				borderColor: colorFor(i),
				backgroundColor: "transparent",
				tension: .05,
				pointRadius: 0,
				borderWidth: isUser ? 3 : 1.5,
				fill: false
			};
		});
	}
	function buildMyStakeDatasets() {
		set(breakevenInfo, null);
		const selected = $$props.userStakes.filter((s) => get(selectedStakeIds).has(s.stakeId));
		if (selected.length === 0 && pendingNewStake() && switchTargetAddress()) return buildNewStakeProjection();
		if (selected.length === 0) return [];
		const target = switchTargetAddress() ? $$props.validators.find((v) => v.address === switchTargetAddress()) : null;
		const oldApr = weightedOldApr(selected);
		const newApr = target ? $$props.aprByPool.get(target.poolId) ?? 0 : 0;
		const totalPrincipalNum = selected.reduce((s, x) => s + Number(x.principal), 0);
		const seriesPerStake = selected.map((s) => ({
			weight: Number(s.principal) / totalPrincipalNum,
			series: poolReturnSeries(s.validator.poolId, $$props.fromEpoch, $$props.toEpoch)
		}));
		const epochAccum = /* @__PURE__ */ new Map();
		for (const { weight, series } of seriesPerStake) for (const p of series) {
			const acc = epochAccum.get(p.epoch) ?? {
				sum: 0,
				count: 0
			};
			acc.sum += weight * p.returnFraction;
			acc.count += 1;
			epochAccum.set(p.epoch, acc);
		}
		const pastSeries = [...epochAccum.entries()].filter(([, v]) => v.count === selected.length).map(([epoch, v]) => ({
			epoch,
			returnFraction: v.sum
		})).sort((a, b) => a.epoch - b.epoch);
		const lastEpoch = pastSeries[pastSeries.length - 1]?.epoch ?? $$props.toEpoch;
		const lastReturn = pastSeries[pastSeries.length - 1]?.returnFraction ?? 0;
		const breakevenDays = target ? computeBreakevenDays(oldApr, newApr) : null;
		const horizonDays = get(projectionHorizon) === "auto" ? Math.max(90, breakevenDays !== null ? Math.ceil(breakevenDays * 1.5) + 14 : 0) : get(projectionHorizon);
		const stayAprPoints = [];
		const stayApyPoints = [];
		const switchAprPoints = [];
		const switchApyPoints = [];
		const diffPoints = [];
		const oneBase = 1 + lastReturn;
		for (let d = 0; d <= horizonDays; d++) {
			const eff = Math.max(0, d - 1);
			const stayApr = lastReturn + oldApr * d / 365;
			const stayApy = oneBase * Math.pow(1 + oldApr / 365, d) - 1;
			const switchApr = lastReturn + newApr * eff / 365;
			const switchApy = oneBase * Math.pow(1 + newApr / 365, eff) - 1;
			const x = lastEpoch + d;
			stayAprPoints.push({
				x,
				y: stayApr * 100
			});
			stayApyPoints.push({
				x,
				y: stayApy * 100
			});
			switchAprPoints.push({
				x,
				y: switchApr * 100
			});
			switchApyPoints.push({
				x,
				y: switchApy * 100
			});
			diffPoints.push({
				x,
				y: (switchApy - stayApy) * 100
			});
		}
		if (breakevenDays !== null) set(breakevenInfo, {
			days: Math.ceil(breakevenDays),
			epoch: lastEpoch + Math.ceil(breakevenDays)
		}, true);
		const basketLabel = selected.length === 1 ? selected[0].validator.name : `your basket (${selected.length} stakes)`;
		const fmtRate = (r) => `${(r * 100).toFixed(2)}%`;
		const datasets = [
			{
				label: `Realized — ${basketLabel} (APR ${fmtRate(oldApr)} / APY ${fmtRate(aprToApy(oldApr))})`,
				data: pastSeries.map((p) => ({
					x: p.epoch,
					y: p.returnFraction * 100
				})),
				borderColor: "#3b82f6",
				backgroundColor: "transparent",
				tension: .05,
				pointRadius: 0,
				borderWidth: 2.5,
				fill: false,
				yAxisID: "y"
			},
			{
				label: `Stay — ${basketLabel} · APR ${fmtRate(oldApr)} (linear)`,
				data: stayAprPoints,
				borderColor: "#f87171",
				backgroundColor: "transparent",
				tension: .1,
				pointRadius: 0,
				borderWidth: 1.5,
				borderDash: [5, 5],
				fill: false,
				yAxisID: "y"
			},
			{
				label: `Stay — ${basketLabel} · APY ${fmtRate(aprToApy(oldApr))} (compounded)`,
				data: stayApyPoints,
				borderColor: "#dc2626",
				backgroundColor: "transparent",
				tension: .1,
				pointRadius: 0,
				borderWidth: 2,
				fill: false,
				yAxisID: "y"
			}
		];
		if (target) {
			datasets.push({
				label: `Switch to ${target.name} · APR ${fmtRate(newApr)} (linear)`,
				data: switchAprPoints,
				borderColor: "#34d399",
				backgroundColor: "transparent",
				tension: .1,
				pointRadius: 0,
				borderWidth: 1.5,
				borderDash: [5, 5],
				fill: false,
				yAxisID: "y"
			}, {
				label: `Switch to ${target.name} · APY ${fmtRate(aprToApy(newApr))} (compounded)`,
				data: switchApyPoints,
				borderColor: "#059669",
				backgroundColor: "transparent",
				tension: .1,
				pointRadius: 0,
				borderWidth: 2,
				fill: false,
				yAxisID: "y"
			});
			datasets.push({
				label: `Switch − Stay (APY, right axis)`,
				data: diffPoints,
				borderColor: "#fbbf24",
				backgroundColor: "#fbbf2422",
				tension: .1,
				pointRadius: 0,
				borderWidth: 1.5,
				fill: "origin",
				yAxisID: "yDiff"
			});
			if (breakevenDays !== null) {
				const bx = lastEpoch + breakevenDays;
				const yMin = Math.min(...stayApyPoints.map((p) => p.y), 0);
				const yMax = Math.max(...switchApyPoints.map((p) => p.y));
				datasets.push({
					label: `Breakeven (day +${Math.ceil(breakevenDays)})`,
					data: [{
						x: bx,
						y: yMin
					}, {
						x: bx,
						y: yMax
					}],
					borderColor: "#fbbf24",
					backgroundColor: "transparent",
					pointRadius: 0,
					borderWidth: 1.5,
					borderDash: [3, 4],
					fill: false,
					yAxisID: "y",
					isBreakeven: true
				});
			}
		}
		return datasets;
	}
	/** Project the cumulative return of a *new* stake at the chosen target
	*  validator. Differs from the switch projection in two ways:
	*    1. The starting value is 0 — there is no realized history to bridge
	*       from, so day 0 is the bottom of the chart.
	*    2. There is no "stay" comparison line and no breakeven — staking
	*       nothing yields nothing, so the comparison is degenerate.
	*  We still draw the dashed APR (linear) line alongside the solid APY
	*  (compounded) line so the user can see how compounding pulls ahead
	*  of the headline rate over the chosen horizon, mirroring how the
	*  switch projection presents both. */
	function buildNewStakeProjection() {
		if (!pendingNewStake()) return [];
		const target = $$props.validators.find((v) => v.address === switchTargetAddress());
		if (!target) return [];
		const newApr = $$props.aprByPool.get(target.poolId) ?? 0;
		const horizonDays = get(projectionHorizon) === "auto" ? 365 : get(projectionHorizon);
		const aprPoints = [];
		const apyPoints = [];
		for (let d = 0; d <= horizonDays; d++) {
			const eff = Math.max(0, d - 1);
			const aprY = newApr * eff / 365;
			const apyY = Math.pow(1 + newApr / 365, eff) - 1;
			const x = $$props.toEpoch + d;
			aprPoints.push({
				x,
				y: aprY * 100
			});
			apyPoints.push({
				x,
				y: apyY * 100
			});
		}
		const fmtRate = (r) => `${(r * 100).toFixed(2)}%`;
		return [{
			label: `New stake → ${target.name} · APR ${fmtRate(newApr)} (linear)`,
			data: aprPoints,
			borderColor: "#34d399",
			backgroundColor: "transparent",
			tension: .1,
			pointRadius: 0,
			borderWidth: 1.5,
			borderDash: [5, 5],
			fill: false,
			yAxisID: "y"
		}, {
			label: `New stake → ${target.name} · APY ${fmtRate(aprToApy(newApr))} (compounded)`,
			data: apyPoints,
			borderColor: "#059669",
			backgroundColor: "transparent",
			tension: .1,
			pointRadius: 0,
			borderWidth: 2,
			fill: false,
			yAxisID: "y"
		}];
	}
	function chartOptions() {
		const isStakeMode = get(mode) === "my-stake";
		const selectedPrincipalIota = $$props.userStakes.filter((s) => get(selectedStakeIds).has(s.stakeId)).reduce((sum, s) => sum + Number(s.principal) / 1e9, 0);
		const pendingPrincipalIota = isStakeMode && pendingNewStake() ? Number(pendingNewStake().amountNano) / 1e9 : 0;
		const principalIota = isStakeMode ? selectedPrincipalIota + pendingPrincipalIota : 0;
		const priceRate = currentPrice() ? selectedCurrency() === "USD" ? currentPrice().usd : currentPrice().eur : null;
		const fiatSym = selectedCurrency() === "USD" ? "$" : "€";
		return {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: "x",
				intersect: false
			},
			scales: {
				x: {
					type: "linear",
					title: {
						display: true,
						text: "Epoch"
					}
				},
				y: {
					title: {
						display: true,
						text: isStakeMode ? "Cumulative net return (%)" : "Net return per epoch (%)"
					},
					position: "left"
				},
				...isStakeMode ? { yDiff: {
					title: {
						display: true,
						text: "Switch − Stay (pp)"
					},
					position: "right",
					grid: { drawOnChartArea: false }
				} } : {}
			},
			plugins: {
				legend: {
					display: true,
					position: get(mode) === "validators" ? "right" : "top",
					labels: { font: { size: 11 } },
					onClick: (_e, legendItem, legend) => {
						const index = legendItem.datasetIndex;
						const ci = legend.chart;
						const now = Date.now();
						const isDouble = lastLegendClick?.index === index && now - lastLegendClick.time < LEGEND_DBLCLICK_MS;
						lastLegendClick = {
							index,
							time: now
						};
						if (isDouble) {
							isolateDataset(ci, index);
							return;
						}
						if (ci.isDatasetVisible(index)) ci.hide(index);
						else ci.show(index);
					}
				},
				tooltip: {
					mode: "x",
					intersect: false,
					filter: (item) => !item.dataset?.isBreakeven,
					callbacks: {
						title: (items) => {
							const x = items[0]?.parsed?.x;
							if (x === void 0) return "";
							const offset = x - $$props.toEpoch;
							let suffix;
							if (offset === 0) suffix = "today";
							else if (offset > 0) suffix = `+${offset} day${offset === 1 ? "" : "s"}`;
							else suffix = `${-offset} day${-offset === 1 ? "" : "s"} ago`;
							return `Epoch ${x} · ${suffix}`;
						},
						label: (ctx) => {
							const v = ctx.parsed.y;
							const pctSuffix = ctx.dataset.yAxisID === "yDiff" ? " pp" : "%";
							if (isStakeMode && principalIota > 0) {
								const iotaAmount = principalIota * (v / 100);
								const iotaStr = iotaAmount.toFixed(2);
								const fiat = priceRate !== null ? ` (≈ ${fiatSym}${(iotaAmount * priceRate).toFixed(2)})` : "";
								return `${ctx.dataset.label}: ${v.toFixed(3)}${pctSuffix} — ${iotaStr} IOTA${fiat}`;
							}
							return `${ctx.dataset.label}: ${v.toFixed(3)}${pctSuffix}`;
						}
					}
				},
				zoom: {
					zoom: {
						wheel: { enabled: true },
						pinch: { enabled: true },
						mode: "xy"
					},
					pan: {
						enabled: true,
						mode: "xy"
					}
				}
			}
		};
	}
	function resetZoom() {
		chart?.resetZoom();
	}
	function fmtIota(nano) {
		const [intPart, decPart = ""] = nanoToIota(nano.toString()).split(".");
		return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "_")}.${decPart.slice(0, 2).padEnd(2, "0")}`;
	}
	/** "1_234.56 IOTA · ≈ $123.45" — drops the fiat tail when there's no
	*  price. Used in the stake chips so users can see USD/EUR exposure
	*  alongside the IOTA amount when picking which to switch. */
	function fmtIotaFiat(nano) {
		const iota = `${fmtIota(nano)} IOTA`;
		const f = fiatValueLocal(nano);
		return f ? `${iota} · ≈ ${f}` : iota;
	}
	function fiatValueLocal(nano) {
		if (!currentPrice()) return "";
		const rate = selectedCurrency() === "USD" ? currentPrice().usd : currentPrice().eur;
		const v = Number(nano) / 1e9 * rate;
		return `${selectedCurrency() === "USD" ? "$" : "€"}${v.toFixed(2)}`;
	}
	function fmtCommission(v) {
		return `${(effectiveCommissionBps(v) / 100).toFixed(2)}% comm`;
	}
	/** Min/max effective commission across the loaded validator set. Used
	*  to map each chip's commission onto a green→red gradient so users can
	*  spot at a glance which stakes are at low- vs high-commission
	*  validators. */
	let commissionRange = user_derived(() => {
		if ($$props.validators.length === 0) return {
			min: 0,
			max: 0
		};
		let min = Infinity;
		let max = -Infinity;
		for (const v of $$props.validators) {
			const eff = effectiveCommissionBps(v);
			if (eff < min) min = eff;
			if (eff > max) max = eff;
		}
		return {
			min: min === Infinity ? 0 : min,
			max: max === -Infinity ? 0 : max
		};
	});
	/** CSS color string for a chip's commission tint. Linearly interpolates
	*  hue from 142 (green-ish) at the lowest observed commission to 0 (red)
	*  at the highest. Saturation/lightness/alpha are tuned to be visible on
	*  the dark background without overpowering the chip text. Returns an
	*  empty string when there's no spread, so the chip falls back to the
	*  default neutral background. */
	function commissionTint(v) {
		const { min, max } = get(commissionRange);
		if (max === min) return "";
		const eff = effectiveCommissionBps(v);
		return `hsl(${142 * (1 - Math.max(0, Math.min(1, (eff - min) / (max - min))))}, 60%, 40%, 0.35)`;
	}
	var details = root_15();
	var summary = child(details);
	var span = sibling(child(summary), 4);
	var node = child(span);
	var consequent = ($$anchor) => {
		var text$3 = text();
		template_effect(() => set_text(text$3, get(topN) === "all" ? "all committee" : get(topN) === 0 ? "only your stakes" : `top ${get(topN)} + your stakes`));
		append($$anchor, text$3);
	};
	var consequent_1 = ($$anchor) => {
		append($$anchor, text("no stakes selected"));
	};
	var consequent_2 = ($$anchor) => {
		append($$anchor, text("projection for 1 stake"));
	};
	var alternate = ($$anchor) => {
		var text_3 = text();
		template_effect(() => set_text(text_3, `projection for ${get(selectedStakeIds).size ?? ""} stakes (combined)`));
		append($$anchor, text_3);
	};
	if_block(node, ($$render) => {
		if (get(mode) === "validators") $$render(consequent);
		else if (get(selectedStakeIds).size === 0) $$render(consequent_1, 1);
		else if (get(selectedStakeIds).size === 1) $$render(consequent_2, 2);
		else $$render(alternate, -1);
	});
	reset(span);
	reset(summary);
	var div = sibling(summary, 2);
	var div_1 = child(div);
	var button = child(div_1);
	let classes;
	var button_1 = sibling(button, 2);
	let classes_1;
	reset(div_1);
	reset(div);
	var div_2 = sibling(div, 2);
	var node_1 = child(div_2);
	var consequent_3 = ($$anchor) => {
		var label = root_1$3();
		var select = sibling(child(label));
		each(select, 21, () => TOP_N_OPTIONS, (opt) => opt.value, ($$anchor, opt) => {
			var option = root$3();
			var text_4 = child(option, true);
			reset(option);
			var option_value = {};
			template_effect(() => {
				set_text(text_4, get(opt).label);
				if (option_value !== (option_value = get(opt).value)) option.value = (option.__value = get(opt).value) ?? "";
			});
			append($$anchor, option);
		});
		reset(select);
		next$1(2);
		reset(label);
		bind_select_value(select, () => get(topN), ($$value) => set(topN, $$value));
		append($$anchor, label);
	};
	var consequent_7 = ($$anchor) => {
		var fragment_2 = root_7();
		var div_3 = first_child(fragment_2);
		var node_2 = child(div_3);
		var consequent_4 = ($$anchor) => {
			var div_4 = root_3$3();
			each(sibling(child(div_4), 2), 17, () => get(accounts), (a) => a.address, ($$anchor, a) => {
				const aState = user_derived(() => accountSelectionState(get(a)));
				var button_2 = root_2$3();
				let classes_2;
				var text_5 = sibling(child(button_2));
				reset(button_2);
				template_effect(($0, $1) => {
					classes_2 = set_class(button_2, 1, "chip account-chip svelte-w4m6sy", null, classes_2, {
						all: get(aState) === "all",
						partial: get(aState) === "partial",
						highlight: get(hoveredAccount) === get(a).address
					});
					set_style(button_2, `--account-bg: ${$0 ?? ""}; --account-accent: ${$1 ?? ""}`);
					set_attribute(button_2, "title", `Toggle all ${get(a).stakeIds.length ?? ""} stake${get(a).stakeIds.length === 1 ? "" : "s"} from ${get(a).label ?? ""}`);
					set_text(text_5, ` ${get(a).label ?? ""} · ${get(a).stakeIds.length ?? ""}`);
				}, [() => stakeBg(get(a).address), () => stakeAccent(get(a).address)]);
				delegated("click", button_2, () => toggleAccount(get(a)));
				event("mouseenter", button_2, () => set(hoveredAccount, get(a).address, true));
				event("mouseleave", button_2, () => set(hoveredAccount, null));
				append($$anchor, button_2);
			});
			reset(div_4);
			append($$anchor, div_4);
		};
		if_block(node_2, ($$render) => {
			if (get(showAccountColors)) $$render(consequent_4);
		});
		var div_5 = sibling(node_2, 2);
		var div_6 = child(div_5);
		var button_3 = child(div_6);
		var button_4 = sibling(button_3, 2);
		reset(div_6);
		next$1(4);
		reset(div_5);
		var div_7 = sibling(div_5, 2);
		each(div_7, 21, () => get(stakeGroups), (g) => g.validator.address, ($$anchor, g) => {
			const state = user_derived(() => groupSelectionState(get(g)));
			var fragment_3 = comment();
			var node_4 = first_child(fragment_3);
			var consequent_5 = ($$anchor) => {
				const s = user_derived(() => get(g).stakes[0]);
				var button_5 = root_4$2();
				let classes_3;
				var text_6 = child(button_5);
				reset(button_5);
				template_effect(($0, $1, $2, $3, $4, $5, $6) => {
					classes_3 = set_class(button_5, 1, "chip stake-row-item svelte-w4m6sy", null, classes_3, $0);
					set_style(button_5, `--commission-tint: ${$1 ?? ""}; --account-accent: ${$2 ?? ""}`);
					set_attribute(button_5, "title", `${get(g).validator.name ?? ""} — ${$3 ?? ""} · effective commission ${$4 ?? ""}${get(showAccountColors) ? ` · ${get(s).accountLabel}` : ""} · click to toggle`);
					set_text(text_6, `${get(g).validator.name ?? ""} · ${$5 ?? ""} · ${$6 ?? ""}`);
				}, [
					() => ({
						selected: get(selectedStakeIds).has(get(s).stakeId),
						"account-accented": get(showAccountColors),
						highlight: get(hoveredAccount) === get(s).accountAddress
					}),
					() => commissionTint(get(g).validator),
					() => stakeAccent(get(s).accountAddress),
					() => fmtIotaFiat(get(s).principal),
					() => fmtCommission(get(g).validator),
					() => fmtIotaFiat(get(s).principal),
					() => fmtCommission(get(g).validator)
				]);
				delegated("click", button_5, () => toggleStake(get(s).stakeId));
				event("mouseenter", button_5, () => set(hoveredAccount, get(s).accountAddress, true));
				event("mouseleave", button_5, () => set(hoveredAccount, null));
				append($$anchor, button_5);
			};
			var alternate_1 = ($$anchor) => {
				var span_1 = root_5$2();
				var button_6 = child(span_1);
				let classes_4;
				var text_7 = child(button_6);
				reset(button_6);
				each(sibling(button_6, 2), 17, () => get(g).stakes, (s) => s.stakeId, ($$anchor, s) => {
					var button_7 = root_4$2();
					let classes_5;
					var text_8 = child(button_7, true);
					reset(button_7);
					template_effect(($0, $1, $2, $3) => {
						classes_5 = set_class(button_7, 1, "chip stake-sub-chip svelte-w4m6sy", null, classes_5, $0);
						set_style(button_7, `--account-bg: ${$1 ?? ""}`);
						set_attribute(button_7, "title", `Click to toggle this single stake (${$2 ?? ""} IOTA)${get(showAccountColors) ? ` · ${get(s).accountLabel}` : ""}`);
						set_text(text_8, $3);
					}, [
						() => ({
							selected: get(selectedStakeIds).has(get(s).stakeId),
							"account-colored": get(showAccountColors),
							highlight: get(hoveredAccount) === get(s).accountAddress
						}),
						() => stakeBg(get(s).accountAddress),
						() => fmtIota(get(s).principal),
						() => fmtIota(get(s).principal)
					]);
					delegated("click", button_7, () => toggleStake(get(s).stakeId));
					event("mouseenter", button_7, () => set(hoveredAccount, get(s).accountAddress, true));
					event("mouseleave", button_7, () => set(hoveredAccount, null));
					append($$anchor, button_7);
				});
				reset(span_1);
				template_effect(($0, $1, $2, $3, $4) => {
					classes_4 = set_class(button_6, 1, "chip group-toggle svelte-w4m6sy", null, classes_4, {
						all: get(state) === "all",
						partial: get(state) === "partial"
					});
					set_style(button_6, `--commission-tint: ${$0 ?? ""}`);
					set_attribute(button_6, "title", `Toggle all ${get(g).stakes.length ?? ""} stakes at ${get(g).validator.name ?? ""} (${$1 ?? ""} total · effective commission ${$2 ?? ""})`);
					set_text(text_7, `${get(g).validator.name ?? ""} · ${get(g).stakes.length ?? ""} stakes · ${$3 ?? ""} · ${$4 ?? ""}`);
				}, [
					() => commissionTint(get(g).validator),
					() => fmtIotaFiat(get(g).totalPrincipal),
					() => fmtCommission(get(g).validator),
					() => fmtIotaFiat(get(g).totalPrincipal),
					() => fmtCommission(get(g).validator)
				]);
				delegated("click", button_6, () => toggleGroup(get(g)));
				append($$anchor, span_1);
			};
			if_block(node_4, ($$render) => {
				if (get(g).stakes.length === 1) $$render(consequent_5);
				else $$render(alternate_1, -1);
			});
			append($$anchor, fragment_3);
		});
		reset(div_7);
		reset(div_3);
		var div_8 = sibling(div_3, 2);
		var button_8 = sibling(child(div_8), 2);
		var select_1 = sibling(button_8, 2);
		var option_1 = child(select_1);
		option_1.value = option_1.__value = "";
		each(sibling(option_1), 17, () => get(targetCandidates), (v) => v.address, ($$anchor, v) => {
			const candidateApr = user_derived(() => $$props.aprByPool.get(get(v).poolId) ?? 0);
			const candidateApy = user_derived(() => aprToApy(get(candidateApr)));
			const candidateBe = user_derived(() => computeBreakevenDays(get(combinedOldApr), get(candidateApr)));
			const isCurrent = user_derived(() => get(selectedPoolIds).has(get(v).poolId));
			var option_2 = root$3();
			var text_9 = child(option_2);
			reset(option_2);
			var option_2_value = {};
			template_effect(($0, $1, $2) => {
				set_text(text_9, `${get(v).name ?? ""} — ${$0 ?? ""}% APR / ${$1 ?? ""}% APY · ${$2 ?? ""}`);
				if (option_2_value !== (option_2_value = get(v).address)) option_2.value = (option_2.__value = get(v).address) ?? "";
			}, [
				() => (get(candidateApr) * 100).toFixed(2),
				() => (get(candidateApy) * 100).toFixed(2),
				() => get(isCurrent) ? "restake (current)" : get(candidateBe) === null ? "no breakeven" : `≈ ${Math.ceil(get(candidateBe))} days breakeven`
			]);
			append($$anchor, option_2);
		});
		reset(select_1);
		var button_9 = sibling(select_1, 2);
		var node_7 = sibling(button_9, 2);
		var consequent_6 = ($$anchor) => {
			var span_2 = root_6$1();
			var text_10 = child(span_2);
			reset(span_2);
			template_effect(() => set_text(text_10, `${get(targetIndex) + 1} / ${get(targetCandidates).length ?? ""}`));
			append($$anchor, span_2);
		};
		if_block(node_7, ($$render) => {
			if (get(targetIndex) >= 0) $$render(consequent_6);
		});
		reset(div_8);
		var label_1 = sibling(div_8, 2);
		var select_2 = sibling(child(label_1), 2);
		each(select_2, 21, () => PROJECTION_HORIZON_OPTIONS, (opt) => opt.value, ($$anchor, opt) => {
			var option_3 = root$3();
			var text_11 = child(option_3, true);
			reset(option_3);
			var option_3_value = {};
			template_effect(() => {
				set_text(text_11, get(opt).label);
				if (option_3_value !== (option_3_value = get(opt).value)) option_3.value = (option_3.__value = get(opt).value) ?? "";
			});
			append($$anchor, option_3);
		});
		reset(select_2);
		reset(label_1);
		template_effect(() => {
			button_3.disabled = get(selectedStakeIds).size === $$props.userStakes.length;
			button_4.disabled = get(selectedStakeIds).size === 0;
			button_8.disabled = get(targetCandidates).length === 0;
			button_9.disabled = get(targetCandidates).length === 0;
		});
		delegated("click", button_3, selectAllStakes);
		delegated("click", button_4, selectNoneStakes);
		delegated("click", button_8, prevTarget);
		delegated("change", select_1, onTargetSelectChange);
		bind_select_value(select_1, switchTargetAddress);
		delegated("click", button_9, nextTarget);
		bind_select_value(select_2, () => get(projectionHorizon), ($$value) => set(projectionHorizon, $$value));
		append($$anchor, fragment_2);
	};
	if_block(node_1, ($$render) => {
		if (get(mode) === "validators") $$render(consequent_3);
		else if ($$props.userStakes.length > 0) $$render(consequent_7, 1);
	});
	reset(div_2);
	var node_8 = sibling(div_2, 2);
	var consequent_9 = ($$anchor) => {
		var div_9 = root_9();
		var text_12 = child(div_9);
		var node_9 = sibling(text_12, 9);
		var consequent_8 = ($$anchor) => {
			var span_3 = root_8();
			var text_13 = child(span_3);
			reset(span_3);
			template_effect(() => set_text(text_13, `Breakeven at day +${get(breakevenInfo).days ?? ""} (epoch ${get(breakevenInfo).epoch ?? ""})`));
			append($$anchor, span_3);
		};
		if_block(node_9, ($$render) => {
			if (get(breakevenInfo)) $$render(consequent_8);
		});
		reset(div_9);
		template_effect(() => set_text(text_12, `Solid blue = realized return on your selected stake${get(selectedStakeIds).size > 1 ? "s (principal-weighted)" : ""}. Each scenario gets `));
		append($$anchor, div_9);
	};
	if_block(node_8, ($$render) => {
		if (get(mode) === "my-stake") $$render(consequent_9);
	});
	var div_10 = sibling(node_8, 2);
	var button_10 = sibling(child(div_10), 2);
	reset(div_10);
	var node_10 = sibling(div_10, 2);
	var consequent_11 = ($$anchor) => {
		var div_11 = root_12();
		var div_12 = child(div_11);
		var strong = sibling(child(div_12), 2);
		var text_14 = child(strong);
		reset(strong);
		var strong_1 = sibling(strong, 2);
		var text_15 = child(strong_1, true);
		reset(strong_1);
		var node_11 = sibling(strong_1, 2);
		var consequent_10 = ($$anchor) => {
			var fragment_4 = root_10();
			var strong_2 = sibling(first_child(fragment_4));
			var text_16 = child(strong_2, true);
			reset(strong_2);
			var span_4 = sibling(strong_2, 2);
			var text_17 = child(span_4);
			reset(span_4);
			template_effect(($0, $1) => {
				set_text(text_16, get(switchTarget).name);
				set_text(text_17, `APR ${$0 ?? ""} · APY ${$1 ?? ""}${get(pendingYearlyText) ? ` · ≈ ${get(pendingYearlyText)}` : ""}`);
			}, [() => fmtPctValue(get(pendingTargetApr)), () => fmtPctValue(aprToApy(get(pendingTargetApr)))]);
			append($$anchor, fragment_4);
		};
		var alternate_2 = ($$anchor) => {
			append($$anchor, root_11());
		};
		if_block(node_11, ($$render) => {
			if (get(switchTarget)) $$render(consequent_10);
			else $$render(alternate_2, -1);
		});
		reset(div_12);
		var div_13 = sibling(div_12, 2);
		var button_11 = child(div_13);
		var button_12 = sibling(button_11, 2);
		var text_18 = child(button_12);
		reset(button_12);
		reset(div_13);
		reset(div_11);
		template_effect(($0) => {
			set_text(text_14, `${$0 ?? ""} IOTA`);
			set_text(text_15, pendingNewStake().accountLabel);
			button_12.disabled = !get(switchTarget) || !$$props.onStakeNew;
			set_attribute(button_12, "title", get(switchTarget) ? `Stake to ${get(switchTarget).name}` : "Pick a target validator first");
			set_text(text_18, `Stake${get(switchTarget) ? ` → ${get(switchTarget).name}` : ""}`);
		}, [() => nanoToIota(pendingNewStake().amountNano.toString())]);
		delegated("click", button_11, handleCancelNewStake);
		delegated("click", button_12, handleConfirmNewStake);
		append($$anchor, div_11);
	};
	if_block(node_10, ($$render) => {
		if (pendingNewStake()) $$render(consequent_11);
	});
	var div_14 = sibling(node_10, 2);
	bind_this(child(div_14), ($$value) => canvas = $$value, () => canvas);
	reset(div_14);
	var node_12 = sibling(div_14, 2);
	var consequent_14 = ($$anchor) => {
		var div_15 = root_14();
		var div_16 = child(div_15);
		var text_19 = child(div_16);
		reset(div_16);
		var div_17 = sibling(div_16, 2);
		var div_18 = child(div_17);
		var div_19 = sibling(child(div_18), 2);
		var text_20 = child(div_19, true);
		reset(div_19);
		var div_20 = sibling(div_19, 2);
		var text_21 = child(div_20);
		reset(div_20);
		reset(div_18);
		var div_21 = sibling(div_18, 2);
		var div_22 = child(div_21);
		var node_13 = sibling(child(div_22));
		var consequent_12 = ($$anchor) => {
			var span_6 = root_13();
			var text_22 = child(span_6);
			reset(span_6);
			template_effect(($0) => set_text(text_22, `${get(switchTarget).name ?? ""} · effective commission
                                ${$0 ?? ""}`), [() => fmtPctValue(effectiveCommissionBps(get(switchTarget)) / 1e4)]);
			append($$anchor, span_6);
		};
		if_block(node_13, ($$render) => {
			if (get(switchTarget)) $$render(consequent_12);
		});
		reset(div_22);
		var div_23 = sibling(div_22, 2);
		var text_23 = child(div_23, true);
		reset(div_23);
		var div_24 = sibling(div_23, 2);
		var text_24 = child(div_24, true);
		reset(div_24);
		reset(div_21);
		var div_25 = sibling(div_21, 2);
		var div_26 = sibling(child(div_25), 2);
		let classes_6;
		var text_25 = child(div_26, true);
		reset(div_26);
		next$1(2);
		reset(div_25);
		var div_27 = sibling(div_25, 2);
		var div_28 = sibling(child(div_27), 2);
		var node_14 = child(div_28);
		var consequent_13 = ($$anchor) => {
			append($$anchor, text("—"));
		};
		var alternate_3 = ($$anchor) => {
			var text_27 = text();
			template_effect(($0) => set_text(text_27, `≈ ${$0 ?? ""} days`), [() => Math.ceil(get(projectionBreakeven))]);
			append($$anchor, text_27);
		};
		if_block(node_14, ($$render) => {
			if (get(projectionBreakeven) === null) $$render(consequent_13);
			else $$render(alternate_3, -1);
		});
		reset(div_28);
		var div_29 = sibling(div_28, 2);
		var text_28 = child(div_29);
		reset(div_29);
		reset(div_27);
		reset(div_17);
		var div_30 = sibling(div_17, 2);
		var button_13 = child(div_30);
		var text_29 = child(button_13);
		reset(button_13);
		reset(div_30);
		var div_31 = sibling(div_30, 2);
		var text_30 = child(div_31);
		reset(div_31);
		reset(div_15);
		template_effect(($0, $1, $2, $3, $4, $5) => {
			set_text(text_19, `Numbers below are derived from the selected timeframe (${get(windowDays) ?? ""} epochs ≈
                ${get(windowDays) ?? ""} days). Shorter windows give noisier APR estimates and therefore noisier breakeven
                numbers — pick a longer window for a more stable read.`);
			set_text(text_20, $0);
			set_text(text_21, `APY ${$1 ?? ""} · ${$2 ?? ""}`);
			set_text(text_23, $3);
			set_text(text_24, $4);
			classes_6 = set_class(div_26, 1, "value svelte-w4m6sy", null, classes_6, { highlight: get(switchTargetApr) > get(combinedOldApr) });
			set_text(text_25, $5);
			set_text(text_28, `1 epoch activation delay · based on
                        ${get(windowDays) ?? ""}-day window`);
			button_13.disabled = !get(switchTarget) || get(selectedStakeRefs).length === 0 || !$$props.onSwitch || get(projectionBreakeven) === null && !get(targetIsCurrent);
			set_attribute(button_13, "title", !get(switchTarget) ? "Pick a switch target first." : get(allSelectedAtTarget) ? `Withdraw and re-stake ${get(selectedStakeRefs).length} stake(s) to the same validator (${get(switchTarget).name}) to realize/compound accumulated rewards, merged into one new stake per account. Costs ≈1 epoch of activation delay.` : get(projectionBreakeven) === null ? "Switching to this validator would not be profitable in the chosen window." : `Build one PTB per sending account: ${get(switchTxCount)} transaction(s) covering ${get(selectedStakeRefs).length} stake(s), all re-staked to ${get(switchTarget).name} and merged into one new stake per account.`);
			set_text(text_29, `${get(allSelectedAtTarget) ? "Restake" : "Switch"}
                    ${get(selectedStakeRefs).length === 1 ? "1 stake" : `${get(selectedStakeRefs).length} stakes`} in ${get(switchTxCount) === 1 ? "1 transaction" : `${get(switchTxCount)} transactions`}`);
			set_text(text_30, `The protocol activates new stakes at the next epoch boundary, so switched principal
                earns nothing for ≈1 epoch — that loss is what the breakeven calculation accounts
                for. A transaction can only have one sender, so stakes from different accounts are
                bundled into one PTB per account (${get(switchTxCount) ?? ""}
                ${get(switchTxCount) === 1 ? "transaction" : "transactions"} for the current selection). Within
                each account the withdrawn stakes are merged, producing a single new stake (principal
                + rewards combined) rather than one per input.`);
		}, [
			() => fmtPctValue(get(combinedOldApr)),
			() => fmtPctValue(aprToApy(get(combinedOldApr))),
			() => aprToYearlyText(get(combinedOldApr)),
			() => get(switchTarget) ? fmtPctValue(get(switchTargetApr)) : "—",
			() => get(switchTarget) ? `APY ${fmtPctValue(aprToApy(get(switchTargetApr)))} · ${aprToYearlyText(get(switchTargetApr))}` : "",
			() => get(switchTarget) ? aprDiffYearlyText() : "—"
		]);
		delegated("click", button_13, handleSwitch);
		append($$anchor, div_15);
	};
	if_block(node_12, ($$render) => {
		if (get(mode) === "my-stake" && get(selectedStakeRefs).length > 0) $$render(consequent_14);
	});
	reset(details);
	bind_this(details, ($$value) => set(detailsEl, $$value), () => get(detailsEl));
	template_effect(() => {
		set_attribute(button, "title", $$props.userStakes.length === 0 ? "No stakes synced yet — Sync to load them, or compare validators in the other tab." : "Pick one of your stakes and project stay vs switch.");
		classes = set_class(button, 1, "svelte-w4m6sy", null, classes, { active: get(mode) === "my-stake" });
		classes_1 = set_class(button_1, 1, "svelte-w4m6sy", null, classes_1, { active: get(mode) === "validators" });
	});
	delegated("click", button, () => set(mode, "my-stake"));
	delegated("click", button_1, () => set(mode, "validators"));
	delegated("click", button_10, resetZoom);
	append($$anchor, details);
	pop();
}
delegate(["click", "change"]);
//#endregion
//#region src/lib/pages/multi-account-view/Toolbar.svelte
var root$2 = from_html(`<span class="spinner svelte-itq27l" aria-hidden="true"></span> Syncing…`, 1);
var root_1$2 = from_html(`<button class="visibility-btn svelte-itq27l" title="Show all accounts again."> </button>`);
var root_2$2 = from_html(`<button class="visibility-btn svelte-itq27l" title="Unhide accounts that were hidden via the per-card Hide button."> </button>`);
var root_3$2 = from_html(`<div class="toolbar svelte-itq27l"><div style="display: flex; gap: 0.5rem;" class="svelte-itq27l"><button><!></button></div> <div style="display: flex; align-items: center; gap: 0.5rem; flex-grow: 1; flex-wrap: wrap;" class="svelte-itq27l"><input type="text" placeholder="Enter external address (0x...)" class="svelte-itq27l"/> <button class="svelte-itq27l">Add Account</button> <input type="text" placeholder="Filter by object type (e.g. 0x2 or StakedIota)" title="Partial, case-insensitive match against the full Move type. Empty = no filter." style="min-width: 16rem;" class="svelte-itq27l"/></div> <label class="toggle-row svelte-itq27l" title="Hide non-staking objects and focus the view on stakes."><div class="toggle-switch svelte-itq27l"><input type="checkbox" class="svelte-itq27l"/> <span class="slider svelte-itq27l"></span></div> <span class="svelte-itq27l">Staking mode</span></label> <!> <!> <div style="display: flex; gap: 0.5rem;" class="svelte-itq27l"><button class="svelte-itq27l"> </button></div></div>`);
function Toolbar($$anchor, $$props) {
	push($$props, true);
	let newAccountAddress = prop($$props, "newAccountAddress", 15), stakingMode = prop($$props, "stakingMode", 15), typeFilter = prop($$props, "typeFilter", 15);
	var div = root_3$2();
	var div_1 = child(div);
	var button = child(div_1);
	let classes;
	var node = child(button);
	var consequent = ($$anchor) => {
		var fragment = root$2();
		next$1();
		append($$anchor, fragment);
	};
	var alternate = ($$anchor) => {
		append($$anchor, text("Sync/Reset"));
	};
	if_block(node, ($$render) => {
		if ($$props.syncing) $$render(consequent);
		else $$render(alternate, -1);
	});
	reset(button);
	reset(div_1);
	var div_2 = sibling(div_1, 2);
	var input = child(div_2);
	remove_input_defaults(input);
	var button_1 = sibling(input, 2);
	var input_1 = sibling(button_1, 2);
	remove_input_defaults(input_1);
	reset(div_2);
	var label = sibling(div_2, 2);
	var div_3 = child(label);
	var input_2 = child(div_3);
	remove_input_defaults(input_2);
	next$1(2);
	reset(div_3);
	next$1(2);
	reset(label);
	var node_1 = sibling(label, 2);
	var consequent_1 = ($$anchor) => {
		var button_2 = root_1$2();
		var text_1 = child(button_2);
		reset(button_2);
		template_effect(() => set_text(text_1, `Exit solo: ${$$props.soloLabel ?? ""}`));
		delegated("click", button_2, function(...$$args) {
			$$props.onClearSolo?.apply(this, $$args);
		});
		append($$anchor, button_2);
	};
	if_block(node_1, ($$render) => {
		if ($$props.soloLabel) $$render(consequent_1);
	});
	var node_2 = sibling(node_1, 2);
	var consequent_2 = ($$anchor) => {
		var button_3 = root_2$2();
		var text_2 = child(button_3);
		reset(button_3);
		template_effect(() => set_text(text_2, `Show hidden (${$$props.hiddenCount ?? ""})`));
		delegated("click", button_3, function(...$$args) {
			$$props.onClearHidden?.apply(this, $$args);
		});
		append($$anchor, button_3);
	};
	if_block(node_2, ($$render) => {
		if ($$props.hiddenCount > 0) $$render(consequent_2);
	});
	var div_4 = sibling(node_2, 2);
	var button_4 = child(div_4);
	var text_3 = child(button_4);
	reset(button_4);
	reset(div_4);
	reset(div);
	template_effect(() => {
		classes = set_class(button, 1, "sync-button svelte-itq27l", null, classes, { syncing: $$props.syncing });
		button.disabled = $$props.syncing;
		set_attribute(button, "title", $$props.syncing ? "Syncing accounts and stakes — please wait." : "Reload owned objects and recompute staking rewards.");
		button_4.disabled = $$props.numTransfers === 0;
		set_text(text_3, `Execute (${$$props.numTransfers ?? ""}) Transfer${$$props.numTransfers !== 1 ? "s" : ""}`);
	});
	delegated("click", button, function(...$$args) {
		$$props.onSync?.apply(this, $$args);
	});
	bind_value(input, newAccountAddress);
	delegated("click", button_1, function(...$$args) {
		$$props.onAddExternalAccount?.apply(this, $$args);
	});
	bind_value(input_1, typeFilter);
	bind_checked(input_2, stakingMode);
	delegated("click", button_4, function(...$$args) {
		$$props.onExecuteTransfers?.apply(this, $$args);
	});
	append($$anchor, div);
	pop();
}
delegate(["click"]);
//#endregion
//#region src/lib/pages/multi-account-view/transfer-transactions.ts
var IOTA_COIN_TYPE = "0x2::coin::Coin<0x2::iota::IOTA>";
/** Walk all accounts and collect every object whose `currentOwner` no longer
*  matches its current account — each such object represents a planned move. */
function getMovements(extendedAccounts) {
	const movements = /* @__PURE__ */ new Map();
	for (const account of extendedAccounts) for (const object of account.objects) {
		if (object.currentOwner === account.address) continue;
		if (!movements.has(object.currentOwner)) movements.set(object.currentOwner, /* @__PURE__ */ new Map());
		const senderMap = movements.get(object.currentOwner);
		if (!senderMap.has(account.address)) senderMap.set(account.address, []);
		senderMap.get(account.address).push(object);
	}
	return movements;
}
/** Build one transfer transaction per sender. When the sender has no remaining
*  IOTA coin to pay gas with, the largest IOTA coin among the moving objects
*  is used as gas (and substituted with `tx.gas` in the transferObjects call). */
function prepareTransferTransactions(extendedAccounts) {
	const movements = getMovements(extendedAccounts);
	const prepared = [];
	for (const [senderAddress, perRecipient] of movements) {
		const tx = new Transaction();
		const senderAccount = extendedAccounts.find((a) => a.address === senderAddress);
		for (const [to, objects] of perRecipient) if (!(senderAccount?.objects.some((obj) => obj.currentOwner === senderAddress && obj.data?.content?.type === IOTA_COIN_TYPE) ?? false)) {
			const gasCoin = objects.filter((obj) => obj.data?.content?.type === IOTA_COIN_TYPE).sort((a, b) => {
				const aBal = BigInt(a.data.content.fields.balance);
				const bBal = BigInt(b.data.content.fields.balance);
				if (bBal > aBal) return 1;
				if (bBal < aBal) return -1;
				return 0;
			})[0];
			if (!gasCoin) throw new Error(`No gas coin found for sender ${senderAddress}. Please ensure the account has IOTA coins.`);
			console.log("Using transfer object as gasCoin", gasCoin);
			tx.setGasPayment([{
				objectId: gasCoin.id,
				version: gasCoin.data.version,
				digest: gasCoin.data.digest
			}]);
			tx.transferObjects(objects.map((obj) => obj.id === gasCoin.id ? tx.gas : obj.id), to);
		} else tx.transferObjects(objects.map((obj) => obj.id), to);
		tx.setSender(senderAddress);
		prepared.push({
			sender: senderAddress,
			recipients: Array.from(perRecipient.keys()),
			transaction: tx
		});
	}
	return prepared;
}
//#endregion
//#region src/lib/pages/multi-account-view/ValidatorComparisonTable.svelte
var root$1 = from_html(`<span class="user-share svelte-1hxv9w5"> </span>`);
var root_1$1 = from_html(`<span class="badge user svelte-1hxv9w5" title="Your stake with this validator. Switching higher-share stakes has the largest impact on your overall APR.">your stake: <span class="user-amount svelte-1hxv9w5"> </span> <!></span>`);
var root_2$1 = from_html(`<span class="badge best svelte-1hxv9w5">best APR</span>`);
var root_3$1 = from_html(`<span class="declared-hint svelte-1hxv9w5"> </span>`);
var root_4$1 = from_html(`<span class="muted svelte-1hxv9w5">—</span>`);
var root_5$1 = from_html(`<tr><td class="svelte-1hxv9w5"><span class="name svelte-1hxv9w5"> </span> <!> <!></td><td class="svelte-1hxv9w5"> </td><td class="right svelte-1hxv9w5"> <!></td><td class="right svelte-1hxv9w5"><!></td><td class="right svelte-1hxv9w5"> <span class="apy-hint svelte-1hxv9w5"> </span></td><td class="right svelte-1hxv9w5"> </td></tr>`);
var root_6 = from_html(`<details class="comparison-section svelte-1hxv9w5" open=""><summary class="svelte-1hxv9w5"><span class="chevron svelte-1hxv9w5" aria-hidden="true">▶</span> <span class="title svelte-1hxv9w5"> </span> <span class="subtitle svelte-1hxv9w5"> </span></summary> <div class="table-wrapper svelte-1hxv9w5"><table class="svelte-1hxv9w5"><thead class="svelte-1hxv9w5"><tr><th class="sortable svelte-1hxv9w5"> </th><th class="svelte-1hxv9w5">Status <span class="tooltip-container svelte-1hxv9w5"><span class="info-icon svelte-1hxv9w5">ⓘ</span> <span class="tooltip svelte-1hxv9w5"><strong>Committee</strong> validators earn rewards each epoch. <strong>Active</strong> validators are registered but not currently in
                                the committee, so they earn nothing — switching to one would drop your
                                yield to zero.</span></span></th><th class="sortable right svelte-1hxv9w5"> <span class="tooltip-container svelte-1hxv9w5"><span class="info-icon svelte-1hxv9w5">ⓘ</span> <span class="tooltip svelte-1hxv9w5">The cut the validator takes from rewards before distributing the
                                remainder to delegators. Shown here is the <strong>effective commission per IIP-8</strong>: <em>max(declared commission, voting-power share)</em>. Validators
                                with disproportionately large stake are forced to keep at least
                                their voting-power percentage as commission, so the effective rate
                                can be higher than what the validator declared. When that's the
                                case, the declared rate is shown in parentheses.</span></span></th><th class="sortable right svelte-1hxv9w5"> <span class="tooltip-container svelte-1hxv9w5"><span class="info-icon svelte-1hxv9w5">ⓘ</span> <span class="tooltip svelte-1hxv9w5">If you moved your <em>worst-yielding</em> stake to this validator
                                today, how many days until cumulative earnings overtake what you'd
                                have made by leaving it where it is. Compared against the lowest net
                                APR among your current stakes (not the average — using the minimum
                                surfaces any validator that beats at least one of your stakes).
                                Accounts for the ≈1 epoch of activation delay where the new stake
                                earns nothing.<br/><br/> <strong>—</strong> means this validator's APR is at or below even your
                                weakest stake (so switching anything to here would lose money), or that
                                you have no stakes to compare against.</span></span></th><th class="sortable right svelte-1hxv9w5"> <span class="tooltip-container svelte-1hxv9w5"><span class="info-icon svelte-1hxv9w5">ⓘ</span> <span class="tooltip svelte-1hxv9w5"><strong>APR</strong> = Annual Percentage Rate (linear): the window
                                return projected to a full year (365 epochs ≈ 1 year on mainnet).<br/><br/> <strong>APY</strong> = Annual Percentage Yield (compounded): what
                                the same return becomes when each epoch's growth compounds into the
                                next — which is what actually happens, since the pool token amount
                                stays constant and only the IOTA value per token grows. APY ≥ APR.<br/><br/> <strong>Net</strong> = after commission. The exchange rate already reflects
                                only what delegators receive, so these numbers are what you actually earn
                                — no further commission deduction is applied on top.</span></span></th><th class="sortable right svelte-1hxv9w5"> <span class="tooltip-container svelte-1hxv9w5"><span class="info-icon svelte-1hxv9w5">ⓘ</span> <span class="tooltip svelte-1hxv9w5">Total IOTA delegated to this validator's staking pool right now.
                                Larger pools are usually closer to the protocol's voting-power cap,
                                which can effectively raise their commission.</span></span></th></tr></thead><tbody></tbody></table></div></details>`);
function ValidatorComparisonTable($$anchor, $$props) {
	push($$props, true);
	/** Per-pool sum of the user's staked principal (nano-IOTA). Pools the
	*  user has any stake in are highlighted; the amount + share-of-total
	*  is shown inline so the user can see at a glance which switches
	*  would have the biggest impact. */
	/** Lowest net APR among the user's current stakes. Used as the
	*  "old APR" baseline when computing per-row break-even days — the
	*  minimum is more actionable than an average because it surfaces any
	*  validator that beats at least one of the user's stakes. */
	/** CoinGecko price block for IOTA→fiat conversion. */
	let currentPrice = prop($$props, "currentPrice", 3, null), selectedCurrency = prop($$props, "selectedCurrency", 3, "USD");
	let userStakeTotal = user_derived(() => {
		let sum = 0n;
		for (const v of $$props.userStakeByPool.values()) sum += v;
		return sum;
	});
	let sortKey = state("apr");
	let sortDir = state("desc");
	function toggleSort(key, event) {
		if (event && event.target?.closest(".tooltip-container")) return;
		if (get(sortKey) === key) set(sortDir, get(sortDir) === "asc" ? "desc" : "asc", true);
		else {
			set(sortKey, key, true);
			set(sortDir, key === "name" ? "asc" : "desc", true);
		}
	}
	function indicator(key) {
		if (get(sortKey) !== key) return "";
		return get(sortDir) === "asc" ? " ▲" : " ▼";
	}
	/** IIP-8 effective commission, in pct units (0–100). */
	/** Raw declared commission, in pct units. Shown alongside the
	*  effective rate when the floor has bumped it up. */
	/** null = switching to this validator never breaks even (APR ≤ user's). */
	let rows = user_derived(() => {
		const totalNum = Number(get(userStakeTotal));
		return $$props.validators.map((v) => {
			const userStake = $$props.userStakeByPool.get(v.poolId);
			const apr = poolNetAprOverWindow(v.poolId, $$props.fromEpoch, $$props.toEpoch);
			const breakevenDays = $$props.userMinNetApr > 0 && userStake === void 0 ? computeBreakevenDays($$props.userMinNetApr, apr) : null;
			return {
				v,
				commissionPct: effectiveCommissionBps(v) / 100,
				declaredCommissionPct: v.commissionBps / 100,
				apr,
				breakevenDays,
				stakeIota: v.stakingPoolIotaBalance,
				userStake,
				userShareOfTotal: userStake && totalNum > 0 ? Number(userStake) / totalNum : 0
			};
		});
	});
	let sortedRows = user_derived(() => {
		const dir = get(sortDir) === "asc" ? 1 : -1;
		return [...get(rows)].sort((a, b) => {
			switch (get(sortKey)) {
				case "name": return dir * a.v.name.localeCompare(b.v.name);
				case "commission": return dir * (a.commissionPct - b.commissionPct);
				case "apr": return dir * (a.apr - b.apr);
				case "breakeven": {
					const aBe = a.breakevenDays;
					const bBe = b.breakevenDays;
					if (aBe === null && bBe === null) return 0;
					if (aBe === null) return 1;
					if (bBe === null) return -1;
					return dir * (aBe - bBe);
				}
				case "stake":
					if (a.stakeIota > b.stakeIota) return dir;
					if (a.stakeIota < b.stakeIota) return -dir;
					return 0;
			}
		});
	});
	let bestApr = user_derived(() => get(rows).reduce((m, r) => r.apr > m ? r.apr : m, 0));
	function formatPct(n, digits = 2) {
		return `${(n * 100).toFixed(digits)}%`;
	}
	/** Inline IOTA + optional fiat (e.g. "1_234.56 IOTA · ≈ $123.45"). The
	*  fiat suffix is dropped when no price has been fetched yet. */
	function fmtIotaFiat(nano, sep = " · ") {
		const iota = `${formatIotaCompact(nano)} IOTA`;
		const f = fiatValue(nano, currentPrice(), selectedCurrency());
		return f ? `${iota}${sep}≈ ${f}` : iota;
	}
	var details = root_6();
	var summary = child(details);
	var span = sibling(child(summary), 2);
	var text$1 = child(span);
	reset(span);
	var span_1 = sibling(span, 2);
	var text_1 = child(span_1);
	reset(span_1);
	reset(summary);
	var div = sibling(summary, 2);
	var table = child(div);
	var thead = child(table);
	var tr = child(thead);
	var th = child(tr);
	var text_2 = child(th);
	reset(th);
	var th_1 = sibling(th, 2);
	var text_3 = child(th_1);
	next$1();
	reset(th_1);
	var th_2 = sibling(th_1);
	var text_4 = child(th_2);
	next$1();
	reset(th_2);
	var th_3 = sibling(th_2);
	var text_5 = child(th_3);
	next$1();
	reset(th_3);
	var th_4 = sibling(th_3);
	var text_6 = child(th_4);
	next$1();
	reset(th_4);
	reset(tr);
	reset(thead);
	var tbody = sibling(thead);
	each(tbody, 21, () => get(sortedRows), (row) => row.v.address, ($$anchor, row) => {
		var tr_1 = root_5$1();
		let classes;
		var td = child(tr_1);
		var span_2 = child(td);
		var text_7 = child(span_2, true);
		reset(span_2);
		var node = sibling(span_2, 2);
		var consequent_1 = ($$anchor) => {
			var span_3 = root_1$1();
			var span_4 = sibling(child(span_3));
			var text_8 = child(span_4, true);
			reset(span_4);
			var node_1 = sibling(span_4, 2);
			var consequent = ($$anchor) => {
				var span_5 = root$1();
				var text_9 = child(span_5);
				reset(span_5);
				template_effect(($0) => set_text(text_9, `· ${$0 ?? ""} of total`), [() => formatPct(get(row).userShareOfTotal, 1)]);
				append($$anchor, span_5);
			};
			if_block(node_1, ($$render) => {
				if (get(row).userShareOfTotal > 0) $$render(consequent);
			});
			reset(span_3);
			template_effect(($0) => set_text(text_8, $0), [() => fmtIotaFiat(get(row).userStake)]);
			append($$anchor, span_3);
		};
		if_block(node, ($$render) => {
			if (get(row).userStake !== void 0) $$render(consequent_1);
		});
		var node_2 = sibling(node, 2);
		var consequent_2 = ($$anchor) => {
			append($$anchor, root_2$1());
		};
		if_block(node_2, ($$render) => {
			if (get(row).apr === get(bestApr) && get(bestApr) > 0) $$render(consequent_2);
		});
		reset(td);
		var td_1 = sibling(td);
		var text_10 = child(td_1, true);
		reset(td_1);
		var td_2 = sibling(td_1);
		var text_11 = child(td_2);
		var node_3 = sibling(text_11);
		var consequent_3 = ($$anchor) => {
			var span_7 = root_3$1();
			var text_12 = child(span_7);
			reset(span_7);
			template_effect(($0, $1, $2) => {
				set_attribute(span_7, "title", `Declared ${$0 ?? ""} — bumped to ${$1 ?? ""} by the IIP-8 voting-power floor.`);
				set_text(text_12, `(decl. ${$2 ?? ""})`);
			}, [
				() => formatPct(get(row).declaredCommissionPct / 100),
				() => formatPct(get(row).commissionPct / 100),
				() => formatPct(get(row).declaredCommissionPct / 100)
			]);
			append($$anchor, span_7);
		};
		if_block(node_3, ($$render) => {
			if (get(row).commissionPct - get(row).declaredCommissionPct > .01) $$render(consequent_3);
		});
		reset(td_2);
		var td_3 = sibling(td_2);
		var node_4 = child(td_3);
		var consequent_4 = ($$anchor) => {
			append($$anchor, root_4$1());
		};
		var alternate = ($$anchor) => {
			var text_13 = text();
			template_effect(($0) => set_text(text_13, `${$0 ?? ""} days`), [() => Math.ceil(get(row).breakevenDays)]);
			append($$anchor, text_13);
		};
		if_block(node_4, ($$render) => {
			if (get(row).breakevenDays === null) $$render(consequent_4);
			else $$render(alternate, -1);
		});
		reset(td_3);
		var td_4 = sibling(td_3);
		var text_14 = child(td_4);
		var span_9 = sibling(text_14);
		var text_15 = child(span_9);
		reset(span_9);
		reset(td_4);
		var td_5 = sibling(td_4);
		var text_16 = child(td_5, true);
		reset(td_5);
		reset(tr_1);
		template_effect(($0, $1, $2, $3) => {
			classes = set_class(tr_1, 1, "svelte-1hxv9w5", null, classes, {
				"user-row": get(row).userStake !== void 0,
				"best-row": get(row).apr === get(bestApr) && get(bestApr) > 0
			});
			set_attribute(td, "title", get(row).v.address);
			set_text(text_7, get(row).v.name);
			set_text(text_10, get(row).v.isCommittee ? "Committee" : "Active");
			set_text(text_11, `${$0 ?? ""} `);
			set_text(text_14, `${$1 ?? ""} `);
			set_text(text_15, `/ ${$2 ?? ""} APY`);
			set_text(text_16, $3);
		}, [
			() => formatPct(get(row).commissionPct / 100),
			() => formatPct(get(row).apr),
			() => formatPct(aprToApy(get(row).apr)),
			() => fmtIotaFiat(get(row).stakeIota)
		]);
		append($$anchor, tr_1);
	});
	reset(tbody);
	reset(table);
	reset(div);
	reset(details);
	template_effect(($0, $1, $2, $3, $4, $5) => {
		set_text(text$1, `Validator comparison (${STAKING_TIME_FRAME_LABELS[$$props.timeFrame] ?? ""})`);
		set_text(text_1, `${$$props.validators.length ?? ""} validators · best net APR: ${$0 ?? ""}`);
		set_text(text_2, `Validator${$1 ?? ""}`);
		set_text(text_3, `Effective commission${$2 ?? ""} `);
		set_text(text_4, `Days to break even${$3 ?? ""} `);
		set_text(text_5, `Net APR / APY${$4 ?? ""} `);
		set_text(text_6, `Pool stake (IOTA)${$5 ?? ""} `);
	}, [
		() => formatPct(get(bestApr)),
		() => indicator("name"),
		() => indicator("commission"),
		() => indicator("breakeven"),
		() => indicator("apr"),
		() => indicator("stake")
	]);
	delegated("click", th, (e) => toggleSort("name", e));
	delegated("click", th_1, (e) => toggleSort("commission", e));
	delegated("click", th_2, (e) => toggleSort("breakeven", e));
	delegated("click", th_3, (e) => toggleSort("apr", e));
	delegated("click", th_4, (e) => toggleSort("stake", e));
	append($$anchor, details);
	pop();
}
delegate(["click"]);
//#endregion
//#region src/lib/pages/multi-account-view/MultiAccountView.svelte
var root = from_html(`<div style="color: #ef4444; padding: 0 0.5rem;"> </div>`);
var root_1 = from_html(`<button type="button"> </button>`);
var root_2 = from_html(`<div class="account-strip svelte-1dnveep" title="All accounts. Greyed-out chips are hidden from the grid below — click to toggle. In solo mode, click another chip to switch solo, or click the active chip to exit solo."><label class="strip-toggle svelte-1dnveep" title="Hide accounts with no objects."><input type="checkbox" class="svelte-1dnveep"/> <span>Hide empty</span></label> <span class="strip-divider svelte-1dnveep" aria-hidden="true"></span> <!></div>`);
var root_3 = from_html(`<div class="empty-hint svelte-1dnveep">No accounts to show. <!>.</div>`);
var root_4 = from_html(`<div class="disclaimer svelte-1dnveep"><strong class="svelte-1dnveep">Not financial advice.</strong> The numbers shown here are computed from a bundled
            snapshot of on-chain exchange rates and may be incomplete, stale, or wrong. Past validator
            performance does not guarantee future returns — commission rates and uptime can change at
            any time. Verify before acting.</div> <!> <!>`, 1);
var root_5 = from_html(`<main class="container"><!> <!> <!> <!> <!> <div class="accounts-grid svelte-1dnveep"><!> <!></div> <!> <!></main>`);
function MultiAccountView($$anchor, $$props) {
	push($$props, true);
	const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
	const [$$stores, $$cleanup] = setup_stores();
	let extendedAccounts = state(proxy([]));
	let syncError = state("");
	let newAccountAddress = state("");
	let newAccountError = state("");
	let stakingMode = state(false);
	let syncing = state(false);
	let numTransfers = user_derived(() => getMovements(get(extendedAccounts)).size);
	/** Per-card "Hide" — soft hide, restored via the toolbar's "Show hidden". */
	let hiddenAddresses = state(proxy(/* @__PURE__ */ new Set()));
	/** Per-chip override that *forces* an account visible even when the global
	*  rules (hideEmpty, typeFilter) would have hidden it. Set by clicking a
	*  dimmed chip in the strip; cleared by clicking it again. */
	let forceVisibleAddresses = state(proxy(/* @__PURE__ */ new Set()));
	/** Per-card "Solo" — when set, only this address renders. */
	let soloAddress = state(null);
	/** Toolbar toggle. "Empty" = no objects and no timelocked objects. */
	let hideEmpty = state(true);
	/** Global, partial, case-insensitive substring filter on Move object type. */
	let typeFilter = state("");
	let normalizedTypeFilter = user_derived(() => get(typeFilter).trim().toLowerCase());
	user_effect(() => {
		get(hideEmpty);
		untrack(() => {
			if (get(forceVisibleAddresses).size > 0) set(forceVisibleAddresses, /* @__PURE__ */ new Set(), true);
		});
	});
	const pageParams = usePageQueryParams({
		stakingMode: false,
		hideEmpty: true,
		typeFilter: ""
	});
	let urlInitialized = false;
	onMount(() => {
		const initial = get$1(pageParams);
		set(stakingMode, initial.stakingMode, true);
		set(hideEmpty, initial.hideEmpty, true);
		set(typeFilter, initial.typeFilter, true);
		urlInitialized = true;
	});
	user_effect(() => {
		if (!urlInitialized) return;
		updatePageQueryParams({
			stakingMode: get(stakingMode) ? "true" : null,
			hideEmpty: get(hideEmpty) ? null : "false",
			typeFilter: get(typeFilter) || null
		});
	});
	function accountIsEmpty(a) {
		return a.objects.length === 0 && a.timelockedObjects.length === 0;
	}
	function accountHasMatchingObject(a, filter) {
		if (!filter) return true;
		const match = (obj) => {
			const t = obj?.data?.content?.type;
			return typeof t === "string" && t.toLowerCase().includes(filter);
		};
		return a.objects.some(match) || a.timelockedObjects.some(match);
	}
	/** Cards to actually render. Solo overrides everything else; otherwise we
	*  apply hide/empty/filter in turn. The filter also drops accounts with no
	*  matching objects so the user isn't left with empty cards while
	*  searching. */
	let visibleAccounts = user_derived(() => {
		if (get(soloAddress)) return get(extendedAccounts).filter((a) => a.address === get(soloAddress));
		return get(extendedAccounts).filter((a) => {
			if (get(hiddenAddresses).has(a.address)) return false;
			if (get(forceVisibleAddresses).has(a.address)) return true;
			if (get(hideEmpty) && accountIsEmpty(a)) return false;
			if (get(normalizedTypeFilter) && !accountHasMatchingObject(a, get(normalizedTypeFilter))) return false;
			return true;
		});
	});
	let soloLabel = user_derived(() => {
		if (!get(soloAddress)) return null;
		return get(extendedAccounts).find((a) => a.address === get(soloAddress))?.label || get(soloAddress).slice(0, 6) + "..." + get(soloAddress).slice(-4);
	});
	/** Set of addresses that pass all filters and would render. The chip strip
	*  uses this to gray out anything not currently in the grid (regardless of
	*  *why* it's hidden — solo, manual hide, hide-empty, or type filter). */
	let visibleAddressSet = user_derived(() => new Set(get(visibleAccounts).map((a) => a.address)));
	/** Toggle visibility for a chip click. A click always flips the chip
	*  between visible and dimmed, regardless of *why* it was dimmed:
	*   - in solo mode, click on the soloed chip exits solo; click on any
	*     other chip switches solo to that one;
	*   - if currently visible, hide it (`hiddenAddresses`);
	*   - if dimmed by manual hide, unhide;
	*   - if dimmed by `hideEmpty` or the type filter, force-show
	*     (`forceVisibleAddresses`) so the user sees it even though the
	*     global rule would have hidden it;
	*   - if already force-shown, click again clears the override. */
	function toggleAccountChip(address) {
		if (get(soloAddress)) {
			if (get(soloAddress) === address) set(soloAddress, null);
			else set(soloAddress, address, true);
			return;
		}
		if (get(hiddenAddresses).has(address)) {
			const next = new Set(get(hiddenAddresses));
			next.delete(address);
			set(hiddenAddresses, next, true);
			return;
		}
		if (get(forceVisibleAddresses).has(address)) {
			const next = new Set(get(forceVisibleAddresses));
			next.delete(address);
			set(forceVisibleAddresses, next, true);
			return;
		}
		if (get(visibleAddressSet).has(address)) hideAccount(address);
		else {
			const next = new Set(get(forceVisibleAddresses));
			next.add(address);
			set(forceVisibleAddresses, next, true);
		}
	}
	function hideAccount(address) {
		const next = new Set(get(hiddenAddresses));
		next.add(address);
		set(hiddenAddresses, next, true);
		if (get(soloAddress) === address) set(soloAddress, null);
	}
	function soloAccountAction(address) {
		set(soloAddress, address, true);
	}
	function clearHidden() {
		set(hiddenAddresses, /* @__PURE__ */ new Set(), true);
	}
	function clearSolo() {
		set(soloAddress, null);
	}
	/** Lifted out of BalanceSummary so the staking views (validator table,
	*  optimize panel, charts) can render fiat values consistently. The
	*  price is fetched once on mount; the currency selector lives in
	*  BalanceSummary and is two-way bound. */
	let selectedCurrency = state(proxy(get$1(sharedMultiAccountCurrency)));
	let currentPrice = state(null);
	let priceFetched = false;
	/** When on, IOTA amounts in the account cards, per-object rows, and the
	*  breakdown table are rounded to 2 decimals instead of the full nano
	*  tail. Persisted via `sharedMultiAccountCompactAmounts`. */
	let compactAmounts = state(proxy(get$1(sharedMultiAccountCompactAmounts)));
	user_effect(() => {
		sharedMultiAccountCurrency.set(get(selectedCurrency));
	});
	user_effect(() => {
		sharedMultiAccountCompactAmounts.set(get(compactAmounts));
	});
	let selectedTimeFrame = state("last-30-days");
	let metricType = state("rewards");
	let validators = state(proxy([]));
	let currentEpoch = state(0);
	let stakingLoading = state(false);
	let stakingError = state("");
	/** External focus signal sent to the trend chart when the user clicks
	*  Optimize on a stake card. The chart consumes the value (replaces its
	*  selection with this stake, opens itself, scrolls into view) and
	*  resets it back to null via $bindable. */
	let chartFocusStake = state(null);
	/** Switch-target validator address shared between the trend chart's switch
	*  picker and the new-stake flow. Lifting it here means the chart's
	*  validator pick is reused as the destination for staking new liquid
	*  IOTA from any account. */
	let switchTargetAddress = state("");
	/** A pending "stake new liquid IOTA from account X" intent. Set when the
	*  user clicks Stake on an AccountCard. The trend chart consumes this
	*  via $bindable: opens itself, clears any existing-stake selection,
	*  shows a banner with the amount + source account, and exposes a
	*  "Stake" action that calls back into `executeStake`. After a
	*  successful execute (or explicit cancel) the chart clears it. */
	let pendingNewStake = state(null);
	let cacheInitialized = false;
	let validatorsByPool = user_derived(() => new Map(get(validators).map((v) => [v.poolId, v])));
	let userStakeByPool = user_derived(() => {
		const map = /* @__PURE__ */ new Map();
		for (const acc of get(extendedAccounts)) for (const obj of acc.objects) {
			if (obj.label !== "StakedIota") continue;
			const poolId = obj.data?.content?.fields?.pool_id;
			const principal = obj.data?.content?.fields?.principal;
			if (!poolId || !principal) continue;
			map.set(poolId, (map.get(poolId) ?? 0n) + BigInt(principal));
		}
		return map;
	});
	let userPoolIds = user_derived(() => new Set(get(userStakeByPool).keys()));
	let epochRange = user_derived(() => timeFrameToEpochRange(get(selectedTimeFrame), get(currentEpoch) || 1));
	let aprByPool = user_derived(() => {
		const map = /* @__PURE__ */ new Map();
		for (const v of get(validators)) map.set(v.poolId, poolNetAprOverWindow(v.poolId, get(epochRange).fromEpoch, get(epochRange).toEpoch));
		return map;
	});
	let bestCommitteeApr = user_derived(() => {
		let best = 0;
		for (const v of get(validators)) {
			if (!v.isCommittee) continue;
			const apr = get(aprByPool).get(v.poolId) ?? 0;
			if (apr > best) best = apr;
		}
		return best;
	});
	/** Flat list of the user's StakedIota objects with each one's resolved
	*  validator attached. Drives the per-stake selector inside
	*  StakingTrendChart. Excludes timelocked stakes (handled separately). */
	let userStakeRefs = user_derived(() => {
		const refs = [];
		for (const acc of get(extendedAccounts)) for (const obj of acc.objects) {
			if (obj.label !== "StakedIota") continue;
			const poolId = obj.data?.content?.fields?.pool_id;
			const principal = obj.data?.content?.fields?.principal;
			if (!poolId || !principal) continue;
			const validator = get(validatorsByPool).get(poolId);
			if (!validator) continue;
			refs.push({
				stakeId: obj.id,
				accountAddress: acc.address,
				accountLabel: acc.label || acc.address.slice(0, 6) + "…" + acc.address.slice(-4),
				principal: BigInt(principal),
				validator
			});
		}
		return refs;
	});
	/** The lowest known net APR among the user's current stakes. Used by the
	*  validator-comparison table as the "old APR" baseline when computing
	*  per-row break-even days. The minimum (rather than weighted average) is
	*  the more actionable number: "if I moved my weakest-yielding stake to
	*  this validator, when does it pay off?". An average comparison would
	*  hide every validator that beats some of your stakes but not others.
	*
	*  Pools whose APR isn't yet computed (returns 0 — usually missing
	*  exchange-rate data) are skipped so they don't pin the minimum to 0
	*  and make every other row look profitable.
	*
	*  Returns 0 when the user has no stakes (or no stakes with known APR),
	*  which the table renders as "—". */
	let userMinNetApr = user_derived(() => {
		let min = Infinity;
		for (const poolId of get(userStakeByPool).keys()) {
			const apr = get(aprByPool).get(poolId) ?? 0;
			if (apr <= 0) continue;
			if (apr < min) min = apr;
		}
		return min === Infinity ? 0 : min;
	});
	/** Per-stake metric block, keyed by stake object id. Only populated for
	*  StakedIota objects whose pool is known to us. Timelocked stakes are
	*  intentionally omitted — see Toolbar staking-mode comment. */
	let stakingMetrics = user_derived(() => {
		if (!get(stakingMode) || get(validators).length === 0) return /* @__PURE__ */ new Map();
		const map = /* @__PURE__ */ new Map();
		for (const acc of get(extendedAccounts)) for (const obj of acc.objects) {
			if (obj.label !== "StakedIota") continue;
			const poolId = obj.data?.content?.fields?.pool_id;
			const principalRaw = obj.data?.content?.fields?.principal;
			const activationEpochRaw = obj.data?.content?.fields?.stake_activation_epoch;
			if (!poolId || !principalRaw) continue;
			const validator = get(validatorsByPool).get(poolId);
			if (!validator) continue;
			const principal = BigInt(principalRaw);
			const activationEpoch = activationEpochRaw ? parseInt(activationEpochRaw) : 0;
			const ourApr = get(aprByPool).get(poolId) ?? 0;
			const rewardsFraction = poolReturnOverWindow(poolId, get(epochRange).fromEpoch, get(epochRange).toEpoch);
			const rewardsInWindow = stakeRewardsInWindow(poolId, principal, activationEpoch, get(epochRange).fromEpoch, get(epochRange).toEpoch);
			const hasBetterAlternative = get(bestCommitteeApr) - ourApr > .001;
			map.set(obj.id, {
				metricType: get(metricType),
				commissionPct: effectiveCommissionBps(validator) / 100,
				rewardsFractionInWindow: rewardsFraction,
				rewardsInWindowNano: rewardsInWindow,
				principalNano: principal,
				validatorName: validator.name,
				hasBetterAlternative
			});
		}
		return map;
	});
	/** Non-reactive in-flight flag so the load can early-return without
	*  re-triggering the $effect below. The $state-backed `stakingLoading`
	*  is only used for UI display. */
	let stakingDataInFlight = false;
	user_effect(() => {
		if (!get(stakingMode)) return;
		get(userPoolIds).size;
		untrack(() => {
			if (!stakingDataInFlight) loadStakingData();
		});
	});
	async function loadStakingData() {
		if (stakingDataInFlight) return;
		stakingDataInFlight = true;
		try {
			set(stakingLoading, true);
			set(stakingError, "");
			if (!cacheInitialized) {
				setInitialExchangeRateCacheFromBinary(exchange_rate_cache_default);
				cacheInitialized = true;
			}
			const { validators: list, currentEpoch: ep } = await fetchValidatorsForStaking();
			set(validators, list, true);
			set(currentEpoch, ep, true);
			if (get(userPoolIds).size > 0) try {
				await fetchAllExchangeRates(ep, get(userPoolIds));
			} catch (err) {
				console.warn("Warming exchange-rate cache failed (non-fatal):", err);
			}
		} catch (err) {
			set(stakingError, err?.toString() ?? "Failed to load staking data", true);
			console.error(err);
		} finally {
			set(stakingLoading, false);
			stakingDataInFlight = false;
		}
	}
	/** Re-entrancy guard so a click while a sync is in flight is a no-op. The
	*  $state-backed `syncing` is what the toolbar reads to disable the
	*  button + show the spinner; this duplicate non-reactive flag survives
	*  reactivity edge-cases (e.g. an effect firing before `syncing` flushes). */
	let syncInFlight = false;
	const syncReset = async () => {
		if (syncInFlight) return;
		syncInFlight = true;
		set(syncing, true);
		try {
			set(syncError, "");
			const externalAccounts = get(extendedAccounts).filter((acc) => !$iota_accounts().some((iotaAcc) => iotaAcc.address === acc.address));
			const iotaAccounts = $iota_accounts().map((account) => ({
				id: account.address,
				address: account.address,
				label: account.label,
				objects: [],
				timelockedObjects: [],
				stakingRewards: BigInt(0),
				isCollapsed: false
			}));
			set(extendedAccounts, [...iotaAccounts, ...externalAccounts], true);
			try {
				set(extendedAccounts, await getObjectsForAccounts(get(extendedAccounts)), true);
			} catch (err) {
				set(syncError, err.toString(), true);
				console.error(err);
			}
			try {
				set(extendedAccounts, await computeAllStakingRewards(get(extendedAccounts)), true);
			} catch (err) {
				set(syncError, err.toString(), true);
				console.error(err);
			}
			if (get(stakingMode)) try {
				await loadStakingData();
			} catch (err) {
				console.error("Refreshing staking data during sync failed:", err);
			}
		} catch (err) {
			set(syncError, err.toString(), true);
			console.error(err);
		} finally {
			set(syncing, false);
			syncInFlight = false;
		}
	};
	/** Auto-trigger sync so the user lands on a populated view without
	*  needing to click. Tracks `$iota_accounts.length` so that the WebWallet
	*  signer — which populates accounts asynchronously after `wallet.connect()`
	*  resolves — also gets auto-synced once they hydrate. The Localstorage
	*  signer populates synchronously, so for it this still effectively runs
	*  once on mount. The rest is wrapped in `untrack` to avoid the kind of
	*  reactivity loop that bit `loadStakingData` previously. */
	user_effect(() => {
		const iotaCount = $iota_accounts().length;
		untrack(() => {
			if (get(extendedAccounts).length === 0 && iotaCount > 0 && !syncInFlight) syncReset();
		});
	});
	/** Auto-fetch the IOTA price once per visit so fiat values appear
	*  alongside IOTA amounts everywhere (badges, optimize panel, chart
	*  tooltips). The Fetch Price button in BalanceSummary lets the user
	*  refresh manually. */
	user_effect(() => {
		untrack(() => {
			if (priceFetched) return;
			priceFetched = true;
			fetchCurrentPrice({ maxAgeMs: 3600 * 1e3 }).then((p) => {
				set(currentPrice, p, true);
			}).catch((err) => console.warn("Initial price fetch failed:", err));
		});
	});
	function handleDnd(event, accountId) {
		const idx = get(extendedAccounts).findIndex((acc) => acc.address === accountId);
		if (idx === -1) return;
		const seen = /* @__PURE__ */ new Set();
		const uniqueItems = event.detail.items.filter((item) => {
			if (seen.has(item.id)) return false;
			seen.add(item.id);
			return true;
		});
		set(extendedAccounts, [
			...get(extendedAccounts).slice(0, idx),
			{
				...get(extendedAccounts)[idx],
				objects: uniqueItems
			},
			...get(extendedAccounts).slice(idx + 1)
		], true);
	}
	function shortAddrLabel(a) {
		const acc = get(extendedAccounts).find((x) => x.address === a);
		if (acc?.label) return acc.label;
		return a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
	}
	async function executeTransfers() {
		try {
			const prepared = prepareTransferTransactions(get(extendedAccounts));
			for (const { sender, recipients, transaction } of prepared) {
				const recipientLabels = recipients.map(shortAddrLabel).join(", ");
				addAndRun({
					label: `Transfer from ${shortAddrLabel(sender)} → ${recipientLabels}`,
					transaction,
					sender,
					recipients
				});
			}
		} catch (err) {
			console.error(err);
			alert(err.toString());
		}
	}
	function addExternalAccount() {
		const address = get(newAccountAddress).trim();
		set(newAccountError, "");
		if (!address) {
			set(newAccountError, "Address is required.");
			return;
		}
		if (!isValidIotaAddress(address)) {
			set(newAccountError, "Invalid IOTA address.");
			return;
		}
		if (get(extendedAccounts).some((acc) => acc.address === address) || $iota_accounts().some((acc) => acc.address === address)) {
			set(newAccountError, "Account already exists.");
			return;
		}
		set(extendedAccounts, [...get(extendedAccounts), {
			id: address,
			address,
			label: "External: " + address.slice(0, 6) + "..." + address.slice(-4),
			objects: [],
			timelockedObjects: [],
			stakingRewards: BigInt(0),
			isCollapsed: false
		}], true);
		set(newAccountAddress, "");
	}
	function removeAccount(address) {
		set(extendedAccounts, get(extendedAccounts).filter((acc) => acc.address !== address), true);
		if (get(hiddenAddresses).has(address)) {
			const next = new Set(get(hiddenAddresses));
			next.delete(address);
			set(hiddenAddresses, next, true);
		}
		if (get(forceVisibleAddresses).has(address)) {
			const next = new Set(get(forceVisibleAddresses));
			next.delete(address);
			set(forceVisibleAddresses, next, true);
		}
		if (get(soloAddress) === address) set(soloAddress, null);
	}
	function getAccountDisplayName(address) {
		const acc = get(extendedAccounts).find((a) => a.address === address);
		const fallback = address.slice(0, 6) + "..." + address.slice(-4);
		return acc?.label || fallback;
	}
	function toggleCollapse(accountId) {
		const idx = get(extendedAccounts).findIndex((acc) => acc.id === accountId);
		if (idx === -1) return;
		get(extendedAccounts)[idx] = {
			...get(extendedAccounts)[idx],
			isCollapsed: !get(extendedAccounts)[idx].isCollapsed
		};
	}
	/** Per-stake "Optimize" click in an account card → focus the trend chart
	*  on this stake. The chart owns the actual layout (mode switch, scroll,
	*  selection replacement). */
	function openOptimize(stakeId) {
		set(chartFocusStake, stakeId, true);
	}
	/** Per-card "Stake X IOTA" click → record the intent and let the chart
	*  pick it up. The chart focuses itself, clears its existing-stake
	*  selection, auto-picks a target validator (or honors the existing one),
	*  and shows a confirm banner — no transaction is built here. */
	function requestStake(accountAddress, amountNano) {
		const acc = get(extendedAccounts).find((a) => a.address === accountAddress);
		const fallback = accountAddress.slice(0, 6) + "..." + accountAddress.slice(-4);
		set(pendingNewStake, {
			accountAddress,
			accountLabel: acc?.label || fallback,
			amountNano
		}, true);
	}
	/** Build + execute a stake transaction for a pending new-stake intent.
	*  Called by the chart's confirm button — the chart owns validator
	*  selection so passes it explicitly here, decoupling the action from
	*  the shared `switchTargetAddress` state. */
	async function executeStake(accountAddress, amountNano, target) {
		if (amountNano <= 0n) {
			alert("Stake amount must be > 0.");
			return;
		}
		try {
			const tx = buildStakeTransaction(target.address, amountNano);
			tx.setSender(accountAddress);
			await addAndRun({
				label: `Stake from ${shortAddrLabel(accountAddress)} → ${target.name || shortAddrLabel(target.address)}`,
				transaction: tx,
				sender: accountAddress,
				recipients: [target.address]
			});
			set(pendingNewStake, null);
		} catch (err) {
			console.error(err);
			alert(err.toString());
		}
	}
	/** Build and execute switch transactions for the selected stakes,
	*  grouped by sending account so each PTB has a single sender. The
	*  trend chart calls this with whichever stakes the user picked. */
	async function executeSwitch(stakes, newValidator) {
		if (stakes.length === 0) return;
		try {
			const byAccount = /* @__PURE__ */ new Map();
			for (const s of stakes) {
				const list = byAccount.get(s.accountAddress) ?? [];
				list.push(s);
				byAccount.set(s.accountAddress, list);
			}
			for (const [account, accountStakes] of byAccount) try {
				const tx = buildSwitchValidatorTransactionMulti(accountStakes.map((s) => s.stakeId), newValidator.address);
				tx.setSender(account);
				addAndRun({
					label: `Switch ${accountStakes.length} stake${accountStakes.length === 1 ? "" : "s"} (${shortAddrLabel(account)}) → ${newValidator.name || shortAddrLabel(newValidator.address)}`,
					transaction: tx,
					sender: account,
					recipients: [newValidator.address]
				});
			} catch (err) {
				console.error(err);
				alert(`Failed to build switch tx for ${shortAddrLabel(account)}: ${err.toString()}`);
			}
		} catch (err) {
			console.error(err);
			alert(err.toString());
		}
	}
	var main = root_5();
	var node = child(main);
	BalanceSummary(node, {
		get accounts() {
			return get(visibleAccounts);
		},
		get selectedCurrency() {
			return get(selectedCurrency);
		},
		set selectedCurrency($$value) {
			set(selectedCurrency, $$value, true);
		},
		get currentPrice() {
			return get(currentPrice);
		},
		set currentPrice($$value) {
			set(currentPrice, $$value, true);
		},
		get compactAmounts() {
			return get(compactAmounts);
		},
		set compactAmounts($$value) {
			set(compactAmounts, $$value, true);
		}
	});
	var node_1 = sibling(node, 2);
	Toolbar(node_1, {
		get numTransfers() {
			return get(numTransfers);
		},
		get syncing() {
			return get(syncing);
		},
		get hiddenCount() {
			return get(hiddenAddresses).size;
		},
		get soloLabel() {
			return get(soloLabel);
		},
		onSync: syncReset,
		onAddExternalAccount: addExternalAccount,
		onExecuteTransfers: executeTransfers,
		onClearHidden: clearHidden,
		onClearSolo: clearSolo,
		get newAccountAddress() {
			return get(newAccountAddress);
		},
		set newAccountAddress($$value) {
			set(newAccountAddress, $$value, true);
		},
		get stakingMode() {
			return get(stakingMode);
		},
		set stakingMode($$value) {
			set(stakingMode, $$value, true);
		},
		get typeFilter() {
			return get(typeFilter);
		},
		set typeFilter($$value) {
			set(typeFilter, $$value, true);
		}
	});
	var node_2 = sibling(node_1, 2);
	var consequent = ($$anchor) => {
		var div = root();
		var text = child(div, true);
		reset(div);
		template_effect(() => set_text(text, get(newAccountError)));
		append($$anchor, div);
	};
	if_block(node_2, ($$render) => {
		if (get(newAccountError)) $$render(consequent);
	});
	var node_3 = sibling(node_2, 2);
	var consequent_1 = ($$anchor) => {
		var div_1 = root();
		var text_1 = child(div_1, true);
		reset(div_1);
		template_effect(() => set_text(text_1, get(syncError)));
		append($$anchor, div_1);
	};
	if_block(node_3, ($$render) => {
		if (get(syncError)) $$render(consequent_1);
	});
	var node_4 = sibling(node_3, 2);
	var consequent_2 = ($$anchor) => {
		var div_2 = root_2();
		var label = child(div_2);
		var input = child(label);
		remove_input_defaults(input);
		next$1(2);
		reset(label);
		each(sibling(label, 4), 17, () => get(extendedAccounts), (a) => a.id, ($$anchor, a) => {
			const visible = user_derived(() => get(visibleAddressSet).has(get(a).address));
			const isSolo = user_derived(() => get(soloAddress) === get(a).address);
			var button = root_1();
			let classes;
			var text_2 = child(button, true);
			reset(button);
			template_effect(($0) => {
				classes = set_class(button, 1, "account-chip svelte-1dnveep", null, classes, {
					dim: !get(visible),
					solo: get(isSolo)
				});
				set_text(text_2, $0);
			}, [() => get(a).label || get(a).address.slice(0, 6) + "..." + get(a).address.slice(-4)]);
			delegated("click", button, () => toggleAccountChip(get(a).address));
			append($$anchor, button);
		});
		reset(div_2);
		bind_checked(input, () => get(hideEmpty), ($$value) => set(hideEmpty, $$value));
		append($$anchor, div_2);
	};
	if_block(node_4, ($$render) => {
		if (get(extendedAccounts).length > 0) $$render(consequent_2);
	});
	var div_3 = sibling(node_4, 2);
	var node_6 = child(div_3);
	each(node_6, 17, () => get(visibleAccounts), (account) => account.id, ($$anchor, account) => {
		{
			let $0 = user_derived(() => get(stakingMode) ? get(stakingMetrics) : void 0);
			let $1 = user_derived(() => get(stakingMode) ? openOptimize : void 0);
			let $2 = user_derived(() => get(stakingMode) ? requestStake : void 0);
			AccountCard($$anchor, {
				get account() {
					return get(account);
				},
				get stakingMode() {
					return get(stakingMode);
				},
				getAccountDisplayName,
				get typeFilter() {
					return get(normalizedTypeFilter);
				},
				onDnd: (event) => handleDnd(event, get(account).id),
				onRemove: () => removeAccount(get(account).address),
				onHide: () => hideAccount(get(account).address),
				onSolo: () => soloAccountAction(get(account).address),
				onToggleCollapse: () => toggleCollapse(get(account).id),
				get stakingMetrics() {
					return get($0);
				},
				get onOptimizeStake() {
					return get($1);
				},
				get onRequestStake() {
					return get($2);
				},
				get currentPrice() {
					return get(currentPrice);
				},
				get selectedCurrency() {
					return get(selectedCurrency);
				},
				get compactAmounts() {
					return get(compactAmounts);
				}
			});
		}
	});
	var node_7 = sibling(node_6, 2);
	var consequent_5 = ($$anchor) => {
		var div_4 = root_3();
		var node_8 = sibling(child(div_4));
		var consequent_3 = ($$anchor) => {
			append($$anchor, text("Exit solo view"));
		};
		var consequent_4 = ($$anchor) => {
			append($$anchor, text("adjust\n                    the filters above"));
		};
		var alternate = ($$anchor) => {
			append($$anchor, text("sync to load"));
		};
		if_block(node_8, ($$render) => {
			if (get(soloAddress)) $$render(consequent_3);
			else if (get(hiddenAddresses).size > 0 || get(hideEmpty) || get(normalizedTypeFilter)) $$render(consequent_4, 1);
			else $$render(alternate, -1);
		});
		next$1();
		reset(div_4);
		append($$anchor, div_4);
	};
	if_block(node_7, ($$render) => {
		if (get(visibleAccounts).length === 0 && get(extendedAccounts).length > 0) $$render(consequent_5);
	});
	reset(div_3);
	var node_9 = sibling(div_3, 2);
	var consequent_7 = ($$anchor) => {
		var fragment_1 = root_4();
		var node_10 = sibling(first_child(fragment_1), 2);
		{
			let $0 = user_derived(() => get(validators).length || void 0);
			StakingControls(node_10, {
				get loading() {
					return get(stakingLoading);
				},
				get loadError() {
					return get(stakingError);
				},
				get validatorsLoaded() {
					return get($0);
				},
				get timeFrame() {
					return get(selectedTimeFrame);
				},
				set timeFrame($$value) {
					set(selectedTimeFrame, $$value, true);
				},
				get metricType() {
					return get(metricType);
				},
				set metricType($$value) {
					set(metricType, $$value, true);
				}
			});
		}
		var node_11 = sibling(node_10, 2);
		var consequent_6 = ($$anchor) => {
			StakingTrendChart($$anchor, {
				get validators() {
					return get(validators);
				},
				get fromEpoch() {
					return get(epochRange).fromEpoch;
				},
				get toEpoch() {
					return get(epochRange).toEpoch;
				},
				get userPoolIds() {
					return get(userPoolIds);
				},
				get userStakes() {
					return get(userStakeRefs);
				},
				get aprByPool() {
					return get(aprByPool);
				},
				get currentPrice() {
					return get(currentPrice);
				},
				get selectedCurrency() {
					return get(selectedCurrency);
				},
				onSwitch: executeSwitch,
				onStakeNew: executeStake,
				get focusStakeRequest() {
					return get(chartFocusStake);
				},
				set focusStakeRequest($$value) {
					set(chartFocusStake, $$value, true);
				},
				get switchTargetAddress() {
					return get(switchTargetAddress);
				},
				set switchTargetAddress($$value) {
					set(switchTargetAddress, $$value, true);
				},
				get pendingNewStake() {
					return get(pendingNewStake);
				},
				set pendingNewStake($$value) {
					set(pendingNewStake, $$value, true);
				}
			});
		};
		if_block(node_11, ($$render) => {
			if (get(validators).length > 0) $$render(consequent_6);
		});
		append($$anchor, fragment_1);
	};
	if_block(node_9, ($$render) => {
		if (get(stakingMode)) $$render(consequent_7);
	});
	var node_12 = sibling(node_9, 2);
	var consequent_8 = ($$anchor) => {
		ValidatorComparisonTable($$anchor, {
			get validators() {
				return get(validators);
			},
			get timeFrame() {
				return get(selectedTimeFrame);
			},
			get fromEpoch() {
				return get(epochRange).fromEpoch;
			},
			get toEpoch() {
				return get(epochRange).toEpoch;
			},
			get userStakeByPool() {
				return get(userStakeByPool);
			},
			get userMinNetApr() {
				return get(userMinNetApr);
			},
			get currentPrice() {
				return get(currentPrice);
			},
			get selectedCurrency() {
				return get(selectedCurrency);
			}
		});
	};
	if_block(node_12, ($$render) => {
		if (get(stakingMode) && get(validators).length > 0) $$render(consequent_8);
	});
	reset(main);
	append($$anchor, main);
	pop();
	$$cleanup();
}
delegate(["click"]);
//#endregion
export { MultiAccountView as default };
