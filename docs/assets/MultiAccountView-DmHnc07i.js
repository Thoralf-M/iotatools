import { B as getClient, p as push, c as state, Q as proxy, d as from_html, e as sibling, h as child, i as if_block, g as get, j as each, t as template_effect, ax as formatNumberWithUnderscores, ay as nanoToIota, V as set_attribute, k as set_text, o as delegated, l as append, b as user_derived, z as set_class, x as event, H as bind_value, y as bind_select_value, s as set, q as pop, F as setup_stores, D as store_get, az as TransactionExecution, L as toBase64, aA as getActiveWallet, aB as requireMainnetTransactionConfirmation, aC as getSelectedChain, aa as isValidIotaAddress, Z as text, m as index, N as TransactionView, as as iota_accounts, aD as sharedTransactionExecution, aE as Transaction, r as delegate } from "./index-DVUnVRkg.js";
import { a as action } from "./actions-_JPvuWNn.js";
import { c as calculateGasFee } from "./transaction-execution-B9pCWtIV.js";
import { c as computeStakingRewards } from "./staking-utils-83ZVjWVN.js";
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
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
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
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike) {
      if (it) o = it;
      var i = 0;
      var F = function() {
      };
      return {
        s: F,
        n: function() {
          if (i >= o.length) return {
            done: true
          };
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
function dispatchFinalizeEvent(el, items, info) {
  el.dispatchEvent(new CustomEvent(FINALIZE_EVENT_NAME, {
    detail: {
      items,
      info
    }
  }));
}
function dispatchConsiderEvent(el, items, info) {
  el.dispatchEvent(new CustomEvent(CONSIDER_EVENT_NAME, {
    detail: {
      items,
      info
    }
  }));
}
var DRAGGED_ENTERED_EVENT_NAME = "draggedEntered";
var DRAGGED_LEFT_EVENT_NAME = "draggedLeft";
var DRAGGED_OVER_INDEX_EVENT_NAME = "draggedOverIndex";
var DRAGGED_LEFT_DOCUMENT_EVENT_NAME = "draggedLeftDocument";
var DRAGGED_LEFT_TYPES = {
  LEFT_FOR_ANOTHER: "leftForAnother",
  OUTSIDE_OF_ANY: "outsideOfAny"
};
function dispatchDraggedElementEnteredContainer(containerEl, indexObj, draggedEl2) {
  containerEl.dispatchEvent(new CustomEvent(DRAGGED_ENTERED_EVENT_NAME, {
    detail: {
      indexObj,
      draggedEl: draggedEl2
    }
  }));
}
function dispatchDraggedElementLeftContainerForAnother(containerEl, draggedEl2, theOtherDz) {
  containerEl.dispatchEvent(new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
    detail: {
      draggedEl: draggedEl2,
      type: DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER,
      theOtherDz
    }
  }));
}
function dispatchDraggedElementLeftContainerForNone(containerEl, draggedEl2) {
  containerEl.dispatchEvent(new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
    detail: {
      draggedEl: draggedEl2,
      type: DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY
    }
  }));
}
function dispatchDraggedElementIsOverIndex(containerEl, indexObj, draggedEl2) {
  containerEl.dispatchEvent(new CustomEvent(DRAGGED_OVER_INDEX_EVENT_NAME, {
    detail: {
      indexObj,
      draggedEl: draggedEl2
    }
  }));
}
function dispatchDraggedLeftDocument(draggedEl2) {
  window.dispatchEvent(new CustomEvent(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, {
    detail: {
      draggedEl: draggedEl2
    }
  }));
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
  if (activeDndZoneCount === 0) {
    throw new Error("Bug! trying to decrement when there are no dropzones");
  }
  activeDndZoneCount--;
}
var isOnServer = typeof window === "undefined";
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
    } else {
      return rect;
    }
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
  } else {
    return rect;
  }
}
function getAbsoluteRectNoTransforms(el) {
  var rect = getBoundingRectNoTransforms(el);
  return {
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX
  };
}
function getAbsoluteRect(el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX
  };
}
function findCenter(rect) {
  return {
    x: (rect.left + rect.right) / 2,
    y: (rect.top + rect.bottom) / 2
  };
}
function calcDistance(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}
function isPointInsideRect(point, rect) {
  return point.y <= rect.bottom && point.y >= rect.top && point.x >= rect.left && point.x <= rect.right;
}
function findCenterOfElement(el) {
  return findCenter(getAbsoluteRect(el));
}
function calcDistanceFromPointToCenter(point, el) {
  var centerOfEl = findCenterOfElement(el);
  return calcDistance(point, centerOfEl);
}
function isElementOffDocument(el) {
  var rect = getAbsoluteRect(el);
  return rect.right < 0 || rect.left > document.documentElement.scrollWidth || rect.bottom < 0 || rect.top > document.documentElement.scrollHeight;
}
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
        if (newTop !== visibleRect.top || newBottom !== visibleRect.bottom) {
          wasClippedByScrollY = true;
        }
        visibleRect.top = newTop;
        visibleRect.bottom = newBottom;
      }
      if (isScrollableX) {
        var newLeft = Math.max(visibleRect.left, parentRect.left);
        var newRight = Math.min(visibleRect.right, parentRect.right);
        if (newLeft !== visibleRect.left || newRight !== visibleRect.right) {
          wasClippedByScrollX = true;
        }
        visibleRect.left = newLeft;
        visibleRect.right = newRight;
      }
    }
    parent = parent.parentElement;
  }
  if (wasClippedByScrollY || wasClippedByScrollX) {
    return {
      top: visibleRect.top,
      bottom: visibleRect.bottom,
      left: visibleRect.left,
      right: visibleRect.right,
      width: Math.max(0, visibleRect.right - visibleRect.left),
      height: Math.max(0, visibleRect.bottom - visibleRect.top)
    };
  }
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
function resetIndexesCache() {
  dzToShadowIndexToRect = /* @__PURE__ */ new Map();
}
resetIndexesCache();
function cacheShadowRect(dz) {
  var shadowElIndex = Array.from(dz.children).findIndex(function(child2) {
    return child2.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
  });
  if (shadowElIndex >= 0) {
    if (!dzToShadowIndexToRect.has(dz)) {
      dzToShadowIndexToRect.set(dz, /* @__PURE__ */ new Map());
    }
    dzToShadowIndexToRect.get(dz).set(shadowElIndex, getAbsoluteRectNoTransforms(dz.children[shadowElIndex]));
    return shadowElIndex;
  }
  return void 0;
}
function findWouldBeIndex(referencePoint, collectionBelowEl) {
  var collectionRect = getAbsoluteRectNoTransforms(collectionBelowEl);
  if (!isPointInsideRect(referencePoint, collectionRect)) {
    return null;
  }
  var children = collectionBelowEl.children;
  if (children.length === 0) {
    return {
      index: 0,
      isProximityBased: true
    };
  }
  var shadowElIndex = cacheShadowRect(collectionBelowEl);
  for (var i = 0; i < children.length; i++) {
    var childRect = getAbsoluteRectNoTransforms(children[i]);
    if (isPointInsideRect(referencePoint, childRect)) {
      var cachedShadowRect = dzToShadowIndexToRect.has(collectionBelowEl) && dzToShadowIndexToRect.get(collectionBelowEl).get(i);
      if (cachedShadowRect) {
        if (!isPointInsideRect(referencePoint, cachedShadowRect)) {
          return {
            index: shadowElIndex,
            isProximityBased: false
          };
        }
      }
      return {
        index: i,
        isProximityBased: false
      };
    }
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
    var template = children[originalLen - 1];
    var phantom = template.cloneNode(false);
    phantom.style.visibility = "hidden";
    phantom.style.pointerEvents = "none";
    collectionBelowEl.appendChild(phantom);
    var phantomDistance = calcDistanceFromPointToCenter(referencePoint, phantom);
    if (phantomDistance < minDistanceSoFar) {
      indexOfMin = originalLen;
    }
    collectionBelowEl.removeChild(phantom);
  }
  return {
    index: indexOfMin,
    isProximityBased: true
  };
}
function toString(object) {
  return JSON.stringify(object, null, 2);
}
function getDepth(node) {
  if (!node) {
    throw new Error("cannot get depth of a falsy node");
  }
  return _getDepth(node, 0);
}
function _getDepth(node) {
  var countSoFar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!node.parentElement) {
    return countSoFar - 1;
  }
  return _getDepth(node.parentElement, countSoFar + 1);
}
function areObjectsShallowEqual(objA, objB) {
  if (Object.keys(objA).length !== Object.keys(objB).length) {
    return false;
  }
  for (var keyA in objA) {
    if (!{}.hasOwnProperty.call(objB, keyA) || objB[keyA] !== objA[keyA]) {
      return false;
    }
  }
  return true;
}
function areArraysShallowEqualSameOrder(arrA, arrB) {
  if (arrA.length !== arrB.length) {
    return false;
  }
  for (var i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }
  return true;
}
var INTERVAL_MS = 200;
var TOLERANCE_PX = 10;
var next;
function observe(draggedEl2, dropZones) {
  var intervalMs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : INTERVAL_MS;
  var multiScroller2 = arguments.length > 3 ? arguments[3] : void 0;
  var getReferencePoint = arguments.length > 4 ? arguments[4] : void 0;
  var lastDropZoneFound;
  var lastIndexFound;
  var lastIsDraggedInADropZone = false;
  var lastCentrePositionOfDragged;
  var dropZonesFromDeepToShallow = Array.from(dropZones).sort(function(dz1, dz2) {
    return getDepth(dz2) - getDepth(dz1);
  });
  function andNow() {
    var referencePoint = getReferencePoint();
    var scrolled = multiScroller2.multiScrollIfNeeded();
    if (!scrolled && lastCentrePositionOfDragged && Math.abs(lastCentrePositionOfDragged.x - referencePoint.x) < TOLERANCE_PX && Math.abs(lastCentrePositionOfDragged.y - referencePoint.y) < TOLERANCE_PX) {
      next = window.setTimeout(andNow, intervalMs);
      return;
    }
    if (isElementOffDocument(draggedEl2)) {
      dispatchDraggedLeftDocument(draggedEl2);
      return;
    }
    lastCentrePositionOfDragged = referencePoint;
    var isDraggedInADropZone = false;
    var _iterator = _createForOfIteratorHelper(dropZonesFromDeepToShallow), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var dz = _step.value;
        if (scrolled) resetIndexesCache();
        var indexObj = findWouldBeIndex(referencePoint, dz);
        if (indexObj === null) {
          continue;
        }
        var index2 = indexObj.index;
        isDraggedInADropZone = true;
        if (dz !== lastDropZoneFound) {
          lastDropZoneFound && dispatchDraggedElementLeftContainerForAnother(lastDropZoneFound, draggedEl2, dz);
          dispatchDraggedElementEnteredContainer(dz, indexObj, draggedEl2);
          lastDropZoneFound = dz;
        } else if (index2 !== lastIndexFound) {
          dispatchDraggedElementIsOverIndex(dz, indexObj, draggedEl2);
          lastIndexFound = index2;
        }
        break;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (!isDraggedInADropZone && lastIsDraggedInADropZone && lastDropZoneFound) {
      dispatchDraggedElementLeftContainerForNone(lastDropZoneFound, draggedEl2);
      lastDropZoneFound = void 0;
      lastIndexFound = void 0;
      lastIsDraggedInADropZone = false;
    } else {
      lastIsDraggedInADropZone = true;
    }
    next = window.setTimeout(andNow, intervalMs);
  }
  andNow();
}
function unobserve() {
  clearTimeout(next);
  resetIndexesCache();
}
var SCROLL_ZONE_PX = 30;
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
  function scrollIfNeeded(pointer, elementToScroll) {
    if (!elementToScroll) {
      return false;
    }
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
function calcInnerDistancesBetweenPointAndSidesOfElement(point, el) {
  var rect = el === document.scrollingElement ? {
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth
  } : el.getBoundingClientRect();
  if (!isPointInsideRect(point, rect)) {
    return null;
  }
  return {
    top: point.y - rect.top,
    bottom: rect.bottom - point.y,
    left: point.x - rect.left,
    right: rect.right - point.x
  };
}
function createMultiScroller() {
  var baseElementsForScrolling = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  var getPointerPosition = arguments.length > 1 ? arguments[1] : void 0;
  var scrollingContainersSet = findRelevantScrollContainers(baseElementsForScrolling);
  var scrollingContainersDeepToShallow = Array.from(scrollingContainersSet).sort(function(dz1, dz2) {
    return getDepth(dz2) - getDepth(dz1);
  });
  var _makeScroller = makeScroller(), scrollIfNeeded = _makeScroller.scrollIfNeeded, resetScrolling = _makeScroller.resetScrolling;
  function tick() {
    var mousePosition = getPointerPosition();
    if (!mousePosition || !scrollingContainersDeepToShallow) {
      return false;
    }
    var scrollContainersUnderCursor = scrollingContainersDeepToShallow.filter(function(el) {
      return isPointInsideRect(mousePosition, el.getBoundingClientRect()) || el === document.scrollingElement;
    });
    for (var i = 0; i < scrollContainersUnderCursor.length; i++) {
      var scrolled = scrollIfNeeded(mousePosition, scrollContainersUnderCursor[i]);
      if (scrolled) {
        return true;
      }
    }
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
  if (!element) {
    return [];
  }
  var scrollableContainers = [];
  var parent = element;
  while (parent) {
    var _window$getComputedSt = window.getComputedStyle(parent), overflow = _window$getComputedSt.overflow;
    if (overflow.split(" ").some(function(o) {
      return o.includes("auto") || o.includes("scroll");
    })) {
      scrollableContainers.push(parent);
    }
    parent = parent.parentElement;
  }
  return scrollableContainers;
}
function findRelevantScrollContainers(dropZones) {
  var scrollingContainers = /* @__PURE__ */ new Set();
  var _iterator = _createForOfIteratorHelper(dropZones), _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
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
  if (document.scrollingElement.scrollHeight > document.scrollingElement.clientHeight || document.scrollingElement.scrollWidth > document.scrollingElement.clientHeight) {
    scrollingContainers.add(document.scrollingElement);
  }
  return scrollingContainers;
}
function svelteNodeClone(el) {
  var cloned = el.cloneNode(true);
  var values = [];
  var elIsSelect = el.tagName === "SELECT";
  var selects = elIsSelect ? [el] : _toConsumableArray(el.querySelectorAll("select"));
  var _iterator = _createForOfIteratorHelper(selects), _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
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
      var optionEl = select.querySelector('option[value="'.concat(value, '"'));
      if (optionEl) {
        optionEl.setAttribute("selected", true);
      }
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
      if (canvas.width > 0 && canvas.height > 0) {
        clonedCanvas.getContext("2d").drawImage(canvas, 0, 0);
      }
    }
  }
  return cloned;
}
var FEATURE_FLAG_NAMES = Object.freeze({
  // This flag exists as a workaround for issue 454 (basically a browser bug) - seems like these rect values take time to update when in grid layout. Setting it to true can cause strange behaviour in the REPL for non-grid zones, see issue 470
  USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT"
});
var featureFlagsMap = _defineProperty({}, FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT, false);
function getFeatureFlag(flagName) {
  if (!FEATURE_FLAG_NAMES[flagName]) throw new Error("Can't get non existing feature flag ".concat(flagName, "! Supported flags: ").concat(Object.keys(FEATURE_FLAG_NAMES)));
  return featureFlagsMap[flagName];
}
var TRANSITION_DURATION_SECONDS = 0.2;
function trs(property) {
  return "".concat(property, " ").concat(TRANSITION_DURATION_SECONDS, "s ease");
}
function createDraggedElementFrom(originalElement, positionCenterOnXY) {
  var rect = originalElement.getBoundingClientRect();
  var draggedEl2 = svelteNodeClone(originalElement);
  copyStylesFromTo(originalElement, draggedEl2);
  draggedEl2.id = DRAGGED_ELEMENT_ID;
  draggedEl2.style.position = "fixed";
  var elTopPx = rect.top;
  var elLeftPx = rect.left;
  draggedEl2.style.top = "".concat(elTopPx, "px");
  draggedEl2.style.left = "".concat(elLeftPx, "px");
  if (positionCenterOnXY) {
    var center = findCenter(rect);
    elTopPx -= center.y - positionCenterOnXY.y;
    elLeftPx -= center.x - positionCenterOnXY.x;
    window.setTimeout(function() {
      draggedEl2.style.top = "".concat(elTopPx, "px");
      draggedEl2.style.left = "".concat(elLeftPx, "px");
    }, 0);
  }
  draggedEl2.style.margin = "0";
  draggedEl2.style.boxSizing = "border-box";
  draggedEl2.style.height = "".concat(rect.height, "px");
  draggedEl2.style.width = "".concat(rect.width, "px");
  draggedEl2.style.transition = "".concat(trs("top"), ", ").concat(trs("left"), ", ").concat(trs("background-color"), ", ").concat(trs("opacity"), ", ").concat(trs("color"), " ");
  window.setTimeout(function() {
    return draggedEl2.style.transition += ", ".concat(trs("width"), ", ").concat(trs("height"));
  }, 0);
  draggedEl2.style.zIndex = "9999";
  draggedEl2.style.cursor = "grabbing";
  return draggedEl2;
}
function moveDraggedElementToWasDroppedState(draggedEl2) {
  draggedEl2.style.cursor = "grab";
}
function morphDraggedElementToBeLike(draggedEl2, copyFromEl, currentMouseX, currentMouseY) {
  copyStylesFromTo(copyFromEl, draggedEl2);
  var newRect = copyFromEl.getBoundingClientRect();
  var draggedElRect = draggedEl2.getBoundingClientRect();
  var widthChange = newRect.width - draggedElRect.width;
  var heightChange = newRect.height - draggedElRect.height;
  if (widthChange || heightChange) {
    var relativeDistanceOfMousePointerFromDraggedSides = {
      left: (currentMouseX - draggedElRect.left) / draggedElRect.width,
      top: (currentMouseY - draggedElRect.top) / draggedElRect.height
    };
    if (!getFeatureFlag(FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT)) {
      draggedEl2.style.height = "".concat(newRect.height, "px");
      draggedEl2.style.width = "".concat(newRect.width, "px");
    }
    draggedEl2.style.left = "".concat(parseFloat(draggedEl2.style.left) - relativeDistanceOfMousePointerFromDraggedSides.left * widthChange, "px");
    draggedEl2.style.top = "".concat(parseFloat(draggedEl2.style.top) - relativeDistanceOfMousePointerFromDraggedSides.top * heightChange, "px");
  }
}
function copyStylesFromTo(copyFromEl, copyToEl) {
  var computedStyle = window.getComputedStyle(copyFromEl);
  Array.from(computedStyle).filter(function(s) {
    return s.startsWith("background") || s.startsWith("padding") || s.startsWith("font") || s.startsWith("text") || s.startsWith("align") || s.startsWith("justify") || s.startsWith("display") || s.startsWith("flex") || s.startsWith("border") || s === "opacity" || s === "color" || s === "list-style-type" || // copying with and height to make up for rect update timing issues in some browsers
    getFeatureFlag(FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT) && (s === "width" || s === "height");
  }).forEach(function(s) {
    return copyToEl.style.setProperty(s, computedStyle.getPropertyValue(s), computedStyle.getPropertyPriority(s));
  });
}
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
function hideElement(dragTarget) {
  dragTarget.style.display = "none";
  dragTarget.style.position = "fixed";
  dragTarget.style.zIndex = "-5";
}
function decorateShadowEl(shadowEl) {
  shadowEl.style.visibility = "hidden";
  shadowEl.setAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME, "true");
}
function unDecorateShadowElement(shadowEl) {
  shadowEl.style.visibility = "";
  shadowEl.removeAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
}
function styleActiveDropZones(dropZones) {
  var getStyles = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
  };
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
function styleInactiveDropZones(dropZones) {
  var getStyles = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
  };
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
var DEFAULT_DROP_TARGET_STYLE$1 = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
};
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
var typeToDropZones$1 = /* @__PURE__ */ new Map();
var dzToConfig$1 = /* @__PURE__ */ new Map();
var elToMouseDownListener = /* @__PURE__ */ new WeakMap();
function registerDropZone$1(dropZoneEl, type) {
  if (!typeToDropZones$1.has(type)) {
    typeToDropZones$1.set(type, /* @__PURE__ */ new Set());
  }
  if (!typeToDropZones$1.get(type).has(dropZoneEl)) {
    typeToDropZones$1.get(type).add(dropZoneEl);
    incrementActiveDropZoneCount();
  }
}
function unregisterDropZone$1(dropZoneEl, type) {
  typeToDropZones$1.get(type)["delete"](dropZoneEl);
  decrementActiveDropZoneCount();
  if (typeToDropZones$1.get(type).size === 0) {
    typeToDropZones$1["delete"](type);
  }
}
function watchDraggedElement() {
  var dropZones = typeToDropZones$1.get(draggedElType);
  var _iterator = _createForOfIteratorHelper(dropZones), _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
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
  var setIntervalMs = Math.max.apply(Math, _toConsumableArray(Array.from(dropZones.keys()).map(function(dz2) {
    return dzToConfig$1.get(dz2).dropAnimationDurationMs;
  })));
  var observationIntervalMs = setIntervalMs === 0 ? DISABLED_OBSERVATION_INTERVAL_MS : Math.max(setIntervalMs, MIN_OBSERVATION_INTERVAL_MS);
  multiScroller = createMultiScroller(dropZones, function() {
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
  observe(draggedEl, dropZones, observationIntervalMs * 1.07, multiScroller, getReferencePoint);
}
function unWatchDraggedElement() {
  var dropZones = typeToDropZones$1.get(draggedElType);
  var _iterator2 = _createForOfIteratorHelper(dropZones), _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
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
function createShadowElData(draggedElData2) {
  var _objectSpread2$1;
  return _objectSpread2(_objectSpread2({}, draggedElData2), {}, (_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, SHADOW_ITEM_MARKER_PROPERTY_NAME, true), _defineProperty(_objectSpread2$1, ITEM_ID_KEY, SHADOW_PLACEHOLDER_ITEM_ID), _objectSpread2$1));
}
function handleDraggedEntered(e) {
  var _dzToConfig$get = dzToConfig$1.get(e.currentTarget), items = _dzToConfig$get.items, dropFromOthersDisabled = _dzToConfig$get.dropFromOthersDisabled;
  if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
    return;
  }
  isDraggedOutsideOfAnyDz = false;
  items = items.filter(function(item) {
    return item[ITEM_ID_KEY] !== shadowElData[ITEM_ID_KEY] && item[ITEM_ID_KEY] !== SHADOW_PLACEHOLDER_ITEM_ID;
  });
  if (originDropZone !== e.currentTarget) {
    var originZoneItems = dzToConfig$1.get(originDropZone).items;
    var newOriginZoneItems = originZoneItems.filter(function(item) {
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
  var _dzToConfig$get2 = dzToConfig$1.get(e.currentTarget), originalItems = _dzToConfig$get2.items, dropFromOthersDisabled = _dzToConfig$get2.dropFromOthersDisabled;
  if (dropFromOthersDisabled && e.currentTarget !== originDropZone && e.currentTarget !== shadowElDropZone) {
    return;
  }
  var items = _toConsumableArray(originalItems);
  var shadowElIdx = findShadowElementIdx(items);
  if (shadowElIdx !== -1) {
    items.splice(shadowElIdx, 1);
  }
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
  var _dzToConfig$get3 = dzToConfig$1.get(e.currentTarget), originalItems = _dzToConfig$get3.items, dropFromOthersDisabled = _dzToConfig$get3.dropFromOthersDisabled;
  if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
    return;
  }
  var items = _toConsumableArray(originalItems);
  isDraggedOutsideOfAnyDz = false;
  var index2 = e.detail.indexObj.index;
  var shadowElIdx = findShadowElementIdx(items);
  if (shadowElIdx !== -1) {
    items.splice(shadowElIdx, 1);
  }
  items.splice(index2, 0, shadowElData);
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
  if (!shadowElDropZone) {
    shadowElDropZone = originDropZone;
  }
  var _dzToConfig$get4 = dzToConfig$1.get(shadowElDropZone), items = _dzToConfig$get4.items, type = _dzToConfig$get4.type;
  styleInactiveDropZones(typeToDropZones$1.get(type), function(dz) {
    return dzToConfig$1.get(dz).dropTargetStyle;
  }, function(dz) {
    return dzToConfig$1.get(dz).dropTargetClasses;
  });
  var shadowElIdx = findShadowElementIdx(items);
  if (shadowElIdx === -1) {
    if (shadowElDropZone === originDropZone) {
      shadowElIdx = originIndex;
    }
  }
  items = items.map(function(item) {
    return item[SHADOW_ITEM_MARKER_PROPERTY_NAME] ? draggedElData : item;
  });
  function finalizeWithinZone() {
    unlockOriginDzMinDimensions();
    dispatchFinalizeEvent(shadowElDropZone, items, {
      trigger: isDraggedOutsideOfAnyDz ? TRIGGERS.DROPPED_OUTSIDE_OF_ANY : TRIGGERS.DROPPED_INTO_ZONE,
      id: draggedElData[ITEM_ID_KEY],
      source: SOURCES.POINTER
    });
    if (shadowElDropZone !== originDropZone) {
      dispatchFinalizeEvent(originDropZone, dzToConfig$1.get(originDropZone).items, {
        trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
        id: draggedElData[ITEM_ID_KEY],
        source: SOURCES.POINTER
      });
    }
    var domShadowEl = Array.from(shadowElDropZone.children).find(function(c) {
      return c.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
    });
    if (domShadowEl) unDecorateShadowElement(domShadowEl);
    cleanupPostDrop();
  }
  if (dzToConfig$1.get(shadowElDropZone).dropAnimationDisabled) {
    finalizeWithinZone();
  } else {
    animateDraggedToFinalPosition(shadowElIdx, finalizeWithinZone);
  }
}
function animateDraggedToFinalPosition(shadowElIdx, callback) {
  var shadowElRect = shadowElIdx > -1 ? getBoundingRectNoTransforms(shadowElDropZone.children[shadowElIdx], false) : getBoundingRectNoTransforms(shadowElDropZone, false);
  var newTransform = {
    x: shadowElRect.left - parseFloat(draggedEl.style.left),
    y: shadowElRect.top - parseFloat(draggedEl.style.top)
  };
  var _dzToConfig$get5 = dzToConfig$1.get(shadowElDropZone), dropAnimationDurationMs = _dzToConfig$get5.dropAnimationDurationMs;
  var transition = "transform ".concat(dropAnimationDurationMs, "ms ease");
  draggedEl.style.transition = draggedEl.style.transition ? draggedEl.style.transition + "," + transition : transition;
  draggedEl.style.transform = "translate3d(".concat(newTransform.x, "px, ").concat(newTransform.y, "px, 0)");
  window.setTimeout(callback, dropAnimationDurationMs);
}
function scheduleDZForRemovalAfterDrop(dz, destroy) {
  scheduledForRemovalAfterDrop.push({
    dz,
    destroy
  });
  window.requestAnimationFrame(function() {
    hideElement(dz);
    document.body.appendChild(dz);
  });
}
function cleanupPostDrop() {
  if (draggedEl && draggedEl.remove) {
    draggedEl.remove();
  }
  if (originalDragTarget && originalDragTarget.remove) {
    originalDragTarget.remove();
  }
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
  if (touchDragHoldTimer) {
    clearTimeout(touchDragHoldTimer);
  }
  touchDragHoldTimer = void 0;
  touchHoldElapsed = false;
  useCursorForDetectionActive = false;
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
  var config = {
    items: void 0,
    type: void 0,
    flipDurationMs: 0,
    dragDisabled: false,
    morphDisabled: false,
    dropFromOthersDisabled: false,
    dropTargetStyle: DEFAULT_DROP_TARGET_STYLE$1,
    dropTargetClasses: [],
    transformDraggedElement: function transformDraggedElement() {
    },
    centreDraggedOnCursor: false,
    useCursorForDetection: false,
    dropAnimationDisabled: false,
    delayTouchStartMs: 0
  };
  var elToIdx = /* @__PURE__ */ new Map();
  function addMaybeListeners() {
    window.addEventListener("mousemove", handleMouseMoveMaybeDragStart, {
      passive: false
    });
    window.addEventListener("touchmove", handleMouseMoveMaybeDragStart, {
      passive: false,
      capture: false
    });
    window.addEventListener("mouseup", handleFalseAlarm, {
      passive: false
    });
    window.addEventListener("touchend", handleFalseAlarm, {
      passive: false
    });
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
  function handleFalseAlarm(e) {
    removeMaybeListeners();
    originalDragTarget = void 0;
    dragStartMousePosition = void 0;
    currentMousePosition = void 0;
    if (e.type === "touchend") {
      var clickEvent = new Event("click", {
        bubbles: true,
        cancelable: true
      });
      e.target.dispatchEvent(clickEvent);
    }
  }
  function handleMouseMoveMaybeDragStart(e) {
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
    if (Math.abs(currentMousePosition.x - dragStartMousePosition.x) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX || Math.abs(currentMousePosition.y - dragStartMousePosition.y) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX) {
      removeMaybeListeners();
      handleDragStart();
    }
  }
  function handleMouseDown(e) {
    if (e.target !== e.currentTarget && (e.target.value !== void 0 || e.target.isContentEditable)) {
      return;
    }
    if (e.button) {
      return;
    }
    if (isWorkingOnPreviousDrag) {
      return;
    }
    var isTouchStart = !!e.touches;
    var useDelay = isTouchStart && config.delayTouchStartMs > 0;
    if (!useDelay) {
      e.preventDefault();
    }
    e.stopPropagation();
    var c = isTouchStart ? e.touches[0] : e;
    dragStartMousePosition = {
      x: c.clientX,
      y: c.clientY
    };
    currentMousePosition = _objectSpread2({}, dragStartMousePosition);
    originalDragTarget = e.currentTarget;
    if (useDelay) {
      touchHoldElapsed = false;
      touchDragHoldTimer = window.setTimeout(function() {
        if (!originalDragTarget) return;
        touchHoldElapsed = true;
        removeMaybeListeners();
        handleDragStart();
      }, config.delayTouchStartMs);
    }
    addMaybeListeners();
  }
  function handleDragStart() {
    isWorkingOnPreviousDrag = true;
    var currentIdx = elToIdx.get(originalDragTarget);
    originIndex = currentIdx;
    originDropZone = originalDragTarget.parentElement;
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
      if (!originalDragTarget.parentElement) {
        originalDragTarget.setAttribute(ORIGINAL_DRAGGED_ITEM_MARKER_ATTRIBUTE, true);
        originDropZoneRoot.appendChild(originalDragTarget);
        watchDraggedElement();
        hideElement(originalDragTarget);
        shadowElData[ITEM_ID_KEY] = draggedElData[ITEM_ID_KEY];
        draggedEl.focus();
      } else {
        window.requestAnimationFrame(keepOriginalElementInDom);
      }
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
    window.addEventListener("mousemove", handleMouseMove, {
      passive: false
    });
    window.addEventListener("touchmove", handleMouseMove, {
      passive: false,
      capture: false
    });
    window.addEventListener("mouseup", handleDrop$1, {
      passive: false
    });
    window.addEventListener("touchend", handleDrop$1, {
      passive: false
    });
  }
  function configure(_ref2) {
    var _ref2$items = _ref2.items, items = _ref2$items === void 0 ? void 0 : _ref2$items, _ref2$flipDurationMs = _ref2.flipDurationMs, dropAnimationDurationMs = _ref2$flipDurationMs === void 0 ? 0 : _ref2$flipDurationMs, _ref2$type = _ref2.type, newType = _ref2$type === void 0 ? DEFAULT_DROP_ZONE_TYPE$1 : _ref2$type, _ref2$dragDisabled = _ref2.dragDisabled, dragDisabled = _ref2$dragDisabled === void 0 ? false : _ref2$dragDisabled, _ref2$morphDisabled = _ref2.morphDisabled, morphDisabled = _ref2$morphDisabled === void 0 ? false : _ref2$morphDisabled, _ref2$dropFromOthersD = _ref2.dropFromOthersDisabled, dropFromOthersDisabled = _ref2$dropFromOthersD === void 0 ? false : _ref2$dropFromOthersD, _ref2$dropTargetStyle = _ref2.dropTargetStyle, dropTargetStyle = _ref2$dropTargetStyle === void 0 ? DEFAULT_DROP_TARGET_STYLE$1 : _ref2$dropTargetStyle, _ref2$dropTargetClass = _ref2.dropTargetClasses, dropTargetClasses = _ref2$dropTargetClass === void 0 ? [] : _ref2$dropTargetClass, _ref2$transformDragge = _ref2.transformDraggedElement, transformDraggedElement = _ref2$transformDragge === void 0 ? function() {
    } : _ref2$transformDragge, _ref2$centreDraggedOn = _ref2.centreDraggedOnCursor, centreDraggedOnCursor = _ref2$centreDraggedOn === void 0 ? false : _ref2$centreDraggedOn, _ref2$useCursorForDet = _ref2.useCursorForDetection, useCursorForDetection = _ref2$useCursorForDet === void 0 ? false : _ref2$useCursorForDet, _ref2$dropAnimationDi = _ref2.dropAnimationDisabled, dropAnimationDisabled = _ref2$dropAnimationDi === void 0 ? false : _ref2$dropAnimationDi, _ref2$delayTouchStart = _ref2.delayTouchStart, delayTouchStartOpt = _ref2$delayTouchStart === void 0 ? false : _ref2$delayTouchStart;
    config.dropAnimationDurationMs = dropAnimationDurationMs;
    var effectiveDelayMs = 0;
    if (delayTouchStartOpt === true) {
      effectiveDelayMs = DEFAULT_TOUCH_DELAY_MS;
    } else if (typeof delayTouchStartOpt === "number" && isFinite(delayTouchStartOpt) && delayTouchStartOpt >= 0) {
      effectiveDelayMs = delayTouchStartOpt;
    }
    config.delayTouchStartMs = effectiveDelayMs;
    if (config.type && newType !== config.type) {
      unregisterDropZone$1(node, config.type);
    }
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
    if (initialized && isWorkingOnPreviousDrag && config.dropFromOthersDisabled !== dropFromOthersDisabled) {
      if (dropFromOthersDisabled) {
        styleInactiveDropZones([node], function(dz) {
          return getConfigProp(dz, "dropTargetStyle");
        }, function(dz) {
          return getConfigProp(dz, "dropTargetClasses");
        });
      } else {
        styleActiveDropZones([node], function(dz) {
          return getConfigProp(dz, "dropTargetStyle");
        }, function(dz) {
          return getConfigProp(dz, "dropTargetClasses");
        });
      }
    }
    config.dropFromOthersDisabled = dropFromOthersDisabled;
    dzToConfig$1.set(node, config);
    registerDropZone$1(node, newType);
    var shadowElIdx = isWorkingOnPreviousDrag ? findShadowElementIdx(config.items) : -1;
    for (var idx = 0; idx < node.children.length; idx++) {
      var draggableEl = node.children[idx];
      styleDraggable(draggableEl, dragDisabled);
      if (idx === shadowElIdx) {
        if (!morphDisabled) {
          morphDraggedElementToBeLike(draggedEl, draggableEl, currentMousePosition.x, currentMousePosition.y);
        }
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
      if (!initialized) {
        initialized = true;
      }
    }
  }
  configure(options);
  return {
    update: function update(newOptions) {
      configure(newOptions);
    },
    destroy: function destroy() {
      function destroyDz() {
        unregisterDropZone$1(node, dzToConfig$1.get(node).type);
        dzToConfig$1["delete"](node);
      }
      if (isWorkingOnPreviousDrag && !node.closest("[".concat(ORIGINAL_DRAGGED_ITEM_MARKER_ATTRIBUTE, "]"))) {
        scheduleDZForRemovalAfterDrop(node, destroyDz);
      } else {
        destroyDz();
      }
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
  if (alertsDiv) {
    return;
  }
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
function initAria() {
  if (isOnServer) return null;
  if (document.readyState === "complete") {
    initAriaOnBrowser();
  } else {
    window.addEventListener("DOMContentLoaded", initAriaOnBrowser);
  }
  return _objectSpread2({}, INSTRUCTION_IDs$1);
}
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
function alertToScreenReader(txt) {
  if (isOnServer) return;
  if (!alertsDiv) {
    initAriaOnBrowser();
  }
  alertsDiv.innerHTML = "";
  var alertText = document.createTextNode(txt);
  alertsDiv.appendChild(alertText);
  alertsDiv.style.display = "none";
  alertsDiv.style.display = "inline";
}
var DEFAULT_DROP_ZONE_TYPE = "--any--";
var DEFAULT_DROP_TARGET_STYLE = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
};
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
  if (!typeToDropZones.has(type)) {
    typeToDropZones.set(type, /* @__PURE__ */ new Set());
  }
  if (!typeToDropZones.get(type).has(dropZoneEl)) {
    typeToDropZones.get(type).add(dropZoneEl);
    incrementActiveDropZoneCount();
  }
}
function unregisterDropZone(dropZoneEl, type) {
  if (focusedDz === dropZoneEl) {
    handleDrop();
  }
  typeToDropZones.get(type)["delete"](dropZoneEl);
  decrementActiveDropZoneCount();
  if (typeToDropZones.get(type).size === 0) {
    typeToDropZones["delete"](type);
  }
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
    case "Escape": {
      handleDrop();
      break;
    }
  }
}
function globalClickHandler() {
  if (!isDragging) return;
  if (!allDragTargets.has(document.activeElement)) {
    handleDrop();
  }
}
function handleZoneFocus(e) {
  if (!isDragging) return;
  var newlyFocusedDz = e.currentTarget;
  if (newlyFocusedDz === focusedDz) return;
  focusedDzLabel = newlyFocusedDz.getAttribute("aria-label") || "";
  var _dzToConfig$get = dzToConfig.get(focusedDz), originItems = _dzToConfig$get.items;
  var originItem = originItems.find(function(item) {
    return item[ITEM_ID_KEY] === focusedItemId;
  });
  var originIdx = originItems.indexOf(originItem);
  var itemToMove = originItems.splice(originIdx, 1)[0];
  var _dzToConfig$get2 = dzToConfig.get(newlyFocusedDz), targetItems = _dzToConfig$get2.items, autoAriaDisabled = _dzToConfig$get2.autoAriaDisabled;
  if (newlyFocusedDz.getBoundingClientRect().top < focusedDz.getBoundingClientRect().top || newlyFocusedDz.getBoundingClientRect().left < focusedDz.getBoundingClientRect().left) {
    targetItems.push(itemToMove);
    if (!autoAriaDisabled) {
      alertToScreenReader("Moved item ".concat(focusedItemLabel, " to the end of the list ").concat(focusedDzLabel));
    }
  } else {
    targetItems.unshift(itemToMove);
    if (!autoAriaDisabled) {
      alertToScreenReader("Moved item ".concat(focusedItemLabel, " to the beginning of the list ").concat(focusedDzLabel));
    }
  }
  var dzFrom = focusedDz;
  dispatchFinalizeEvent(dzFrom, originItems, {
    trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
    id: focusedItemId,
    source: SOURCES.KEYBOARD
  });
  dispatchFinalizeEvent(newlyFocusedDz, targetItems, {
    trigger: TRIGGERS.DROPPED_INTO_ZONE,
    id: focusedItemId,
    source: SOURCES.KEYBOARD
  });
  focusedDz = newlyFocusedDz;
}
function triggerAllDzsUpdate() {
  dzToHandles.forEach(function(_ref, dz) {
    var update = _ref.update;
    return update(dzToConfig.get(dz));
  });
}
function handleDrop() {
  var dispatchConsider = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
  if (!dzToConfig.get(focusedDz).autoAriaDisabled) {
    alertToScreenReader("Stopped dragging item ".concat(focusedItemLabel));
  }
  if (allDragTargets.has(document.activeElement)) {
    document.activeElement.blur();
  }
  if (dispatchConsider) {
    dispatchConsiderEvent(focusedDz, dzToConfig.get(focusedDz).items, {
      trigger: TRIGGERS.DRAG_STOPPED,
      id: focusedItemId,
      source: SOURCES.KEYBOARD
    });
  }
  styleInactiveDropZones(typeToDropZones.get(draggedItemType), function(dz) {
    return dzToConfig.get(dz).dropTargetStyle;
  }, function(dz) {
    return dzToConfig.get(dz).dropTargetClasses;
  });
  focusedItem = null;
  focusedItemId = null;
  focusedItemLabel = "";
  draggedItemType = null;
  focusedDz = null;
  focusedDzLabel = "";
  isDragging = false;
  triggerAllDzsUpdate();
}
function dndzone$1(node, options) {
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
      case " ": {
        if ((e.target.disabled !== void 0 || e.target.href || e.target.isContentEditable) && !allDragTargets.has(e.target)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (isDragging) {
          handleDrop();
        } else {
          handleDragStart(e);
        }
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        var _dzToConfig$get3 = dzToConfig.get(node), items = _dzToConfig$get3.items;
        var children = Array.from(node.children);
        var idx = children.indexOf(e.currentTarget);
        if (idx < children.length - 1) {
          if (!config.autoAriaDisabled) {
            alertToScreenReader("Moved item ".concat(focusedItemLabel, " to position ").concat(idx + 2, " in the list ").concat(focusedDzLabel));
          }
          swap(items, idx, idx + 1);
          dispatchFinalizeEvent(node, items, {
            trigger: TRIGGERS.DROPPED_INTO_ZONE,
            id: focusedItemId,
            source: SOURCES.KEYBOARD
          });
        }
        break;
      }
      case "ArrowUp":
      case "ArrowLeft": {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        var _dzToConfig$get4 = dzToConfig.get(node), _items = _dzToConfig$get4.items;
        var _children = Array.from(node.children);
        var _idx = _children.indexOf(e.currentTarget);
        if (_idx > 0) {
          if (!config.autoAriaDisabled) {
            alertToScreenReader("Moved item ".concat(focusedItemLabel, " to position ").concat(_idx, " in the list ").concat(focusedDzLabel));
          }
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
      if (dropTargets.length > 1) {
        msg += ", or tab to another list in order to move the item into it";
      }
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
    var _dzToConfig$get5 = dzToConfig.get(node), items = _dzToConfig$get5.items;
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
    if (config.type && newType !== config.type) {
      unregisterDropZone(node, config.type);
    }
    config.type = newType;
    registerDropZone(node, newType);
    if (!autoAriaDisabled) {
      node.setAttribute("role", "list");
      node.setAttribute("aria-describedby", dragDisabled ? INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED : INSTRUCTION_IDs.DND_ZONE_ACTIVE);
    }
    dzToConfig.set(node, config);
    if (isDragging) {
      node.tabIndex = node === focusedDz || focusedItem.contains(node) || config.dropFromOthersDisabled || focusedDz && config.type !== dzToConfig.get(focusedDz).type ? -1 : 0;
    } else {
      node.tabIndex = config.zoneTabIndex;
    }
    node.addEventListener("focus", handleZoneFocus);
    var _loop = function _loop2(i2) {
      var draggableEl = node.children[i2];
      allDragTargets.add(draggableEl);
      draggableEl.tabIndex = isDragging ? -1 : config.zoneItemTabIndex;
      if (!autoAriaDisabled) {
        draggableEl.setAttribute("role", "listitem");
      }
      draggableEl.removeEventListener("keydown", elToKeyDownListeners.get(draggableEl));
      draggableEl.removeEventListener("click", elToFocusListeners.get(draggableEl));
      if (!dragDisabled) {
        draggableEl.addEventListener("keydown", handleKeyDown);
        elToKeyDownListeners.set(draggableEl, handleKeyDown);
        draggableEl.addEventListener("click", handleClick);
        elToFocusListeners.set(draggableEl, handleClick);
      }
      if (isDragging && config.items[i2][ITEM_ID_KEY] === focusedItemId) {
        focusedItem = draggableEl;
        focusedItem.tabIndex = config.zoneItemTabIndex;
        draggableEl.focus();
      }
    };
    for (var i = 0; i < node.children.length; i++) {
      _loop(i);
    }
  }
  configure(options);
  var handles = {
    update: function update(newOptions) {
      configure(newOptions);
    },
    destroy: function destroy() {
      unregisterDropZone(node, config.type);
      dzToConfig["delete"](node);
      dzToHandles["delete"](node);
    }
  };
  dzToHandles.set(node, handles);
  return handles;
}
var _excluded = ["items", "flipDurationMs", "type", "dragDisabled", "morphDisabled", "dropFromOthersDisabled", "zoneTabIndex", "zoneItemTabIndex", "dropTargetStyle", "dropTargetClasses", "transformDraggedElement", "autoAriaDisabled", "centreDraggedOnCursor", "useCursorForDetection", "delayTouchStart", "dropAnimationDisabled"];
function dndzone(node, options) {
  if (shouldIgnoreZone(node)) {
    return {
      update: function update() {
      },
      destroy: function destroy() {
      }
    };
  }
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
function shouldIgnoreZone(node) {
  return !!node.closest("[".concat(SHADOW_ELEMENT_HINT_ATTRIBUTE_NAME, '="true"]'));
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
  if (Object.keys(rest).length > 0) {
    console.warn("dndzone will ignore unknown options", rest);
  }
  if (!items) {
    throw new Error("no 'items' key provided to dndzone");
  }
  var itemWithMissingId = items.find(function(item) {
    return !{}.hasOwnProperty.call(item, ITEM_ID_KEY);
  });
  if (itemWithMissingId) {
    throw new Error("missing '".concat(ITEM_ID_KEY, "' property for item ").concat(toString(itemWithMissingId)));
  }
  if (dropTargetClasses && !Array.isArray(dropTargetClasses)) {
    throw new Error("dropTargetClasses should be an array but instead it is a ".concat(_typeof(dropTargetClasses), ", ").concat(toString(dropTargetClasses)));
  }
  if (zoneTabIndex && !isInt(zoneTabIndex)) {
    throw new Error("zoneTabIndex should be a number but instead it is a ".concat(_typeof(zoneTabIndex), ", ").concat(toString(zoneTabIndex)));
  }
  if (zoneItemTabIndex && !isInt(zoneItemTabIndex)) {
    throw new Error("zoneItemTabIndex should be a number but instead it is a ".concat(_typeof(zoneItemTabIndex), ", ").concat(toString(zoneItemTabIndex)));
  }
  if (delayTouchStart !== void 0 && delayTouchStart !== false) {
    var validBoolean = delayTouchStart === true;
    var validNumber = typeof delayTouchStart === "number" && isFinite(delayTouchStart) && delayTouchStart >= 0;
    if (!validBoolean && !validNumber) {
      throw new Error("delayTouchStart should be a boolean (true/false) or a non-negative number but instead it is a ".concat(_typeof(delayTouchStart), ", ").concat(toString(delayTouchStart)));
    }
  }
}
function isInt(value) {
  return !isNaN(value) && (function(x) {
    return (x | 0) === x;
  })(parseFloat(value));
}
function createStore(initialValue) {
  var _val = initialValue;
  var subs = /* @__PURE__ */ new Set();
  return {
    get: function get2() {
      return _val;
    },
    set: function set2(newVal) {
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
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      isItemsDragDisabled.set(true);
    }
  }
  function finalize(e) {
    var source = e.detail.info.source;
    if (source === SOURCES.POINTER) {
      isItemsDragDisabled.set(true);
    }
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
      node.removeEventListener("consider", consider);
      node.removeEventListener("finalize", finalize);
      isItemsDragDisabled.unsubscribe(updateZone);
    }
  };
}
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
  var recomputeHandleState = function recomputeHandleState2() {
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
    update: function update() {
    },
    destroy: function destroy() {
      handle.removeEventListener("mousedown", startDrag);
      handle.removeEventListener("touchstart", startDrag);
      handle.removeEventListener("keydown", handleKeyDown);
      userDragDisabled.unsubscribe(recomputeHandleState);
      isItemsDragDisabled.unsubscribe(recomputeHandleState);
    }
  };
}
async function computeAllStakingRewards(accounts) {
  try {
    const client = getClient();
    const updatedAccounts = await Promise.all(
      accounts.map(async (account) => {
        const stakedIotaObjects = account.objects.filter(
          (obj) => obj.label === "StakedIota"
        );
        const timelockedStakedIotaObjects = account.timelockedObjects.filter(
          (obj) => obj.label === "TimelockedStakedIota"
        );
        const allStakedObjects = [...stakedIotaObjects, ...timelockedStakedIotaObjects];
        const rewardsPromises = allStakedObjects.map(async (obj) => {
          try {
            const stakeData = await computeStakingRewards(
              client,
              obj.id,
              account.address
            );
            return BigInt(stakeData.rewards);
          } catch (err) {
            console.warn(`Failed to compute rewards for ${obj.label} ${obj.id}:`, err);
            return BigInt(0);
          }
        });
        const rewards = await Promise.all(rewardsPromises);
        const totalRewards = rewards.reduce((sum, reward) => sum + reward, BigInt(0));
        return { ...account, stakingRewards: totalRewards };
      })
    );
    return updatedAccounts;
  } catch (err) {
    console.error("Error computing staking rewards:", err);
    throw err;
  }
}
async function getObjectsForAccounts(accounts) {
  try {
    const client = getClient();
    const updatedAccounts = await Promise.all(
      accounts.map(async (account) => {
        let allData = [];
        let cursor = null;
        let hasNextPage = true;
        while (hasNextPage) {
          const result = await client.getOwnedObjects({
            owner: account.address,
            options: { showContent: true, showType: true },
            cursor
          });
          allData = allData.concat(result.data);
          hasNextPage = result.hasNextPage;
          cursor = result.nextCursor;
        }
        const objects = allData.map((obj) => {
          let label = obj.data.content?.type;
          if (typeof label === "string") {
            label = label.split("::").slice(2).join("::");
          }
          return {
            // @ts-ignore
            id: obj.data.objectId,
            label,
            data: obj.data,
            currentOwner: account.address
          };
        });
        const timelockedObjects = [];
        const filteredObjects = [];
        for (const obj of objects) {
          if (obj.label === "TimelockedStakedIota" || obj.label.startsWith("TimeLock<")) {
            timelockedObjects.push(obj);
          } else {
            filteredObjects.push(obj);
          }
        }
        return { ...account, objects: filteredObjects, timelockedObjects };
      })
    );
    return updatedAccounts;
  } catch (err) {
    console.error("Error fetching objects:", err);
    throw err;
  }
}
async function fetchCurrentPrice() {
  try {
    const url = "https://api.coingecko.com/api/v3/coins/iota";
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const usd = data?.market_data?.current_price?.usd;
      const eur = data?.market_data?.current_price?.eur;
      if (typeof usd === "number" || typeof eur === "number") {
        return { usd, eur };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error("Failed to fetch current price:", err);
    return null;
  }
}
var root_1 = from_html(`<div style="color: #ef4444; padding: 0 0.5rem;"> </div>`);
var root_2 = from_html(`<div style="color: #ef4444; padding: 0 0.5rem;"> </div>`);
var root_4 = from_html(`<button> <!></button>`);
var root_3 = from_html(`<div class="transactions-container svelte-1dnveep"><div class="transactions-tabs svelte-1dnveep"><span class="transactions-label svelte-1dnveep"> </span> <!></div> <div class="transaction-content svelte-1dnveep"><!></div></div>`);
var root_14 = from_html(`<div style="position: absolute; left: 0; top: 0; height: 1.2rem; display: flex; align-items: center; font-size: 0.7rem; color: #f59e0b; pointer-events: none;"> </div>`);
var root_8 = from_html(`<div><div class="object-header svelte-1dnveep"><span class="object-type svelte-1dnveep"><!></span> <span class="object-amount svelte-1dnveep"><!></span></div> <div style="position: relative;"><!> <details class="object-details svelte-1dnveep"><summary style="text-align: center; list-style-position: inside;" class="svelte-1dnveep">Data</summary> <pre class="svelte-1dnveep"> </pre></details></div></div>`);
var root_15 = from_html(`<div style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.8rem;">No objects</div>`);
var root_17 = from_html(`<div class="object-item svelte-1dnveep" style="border-color: rgba(248, 113, 113, 0.3);"><div class="object-header svelte-1dnveep"><span class="object-type svelte-1dnveep"> </span> <span class="object-amount svelte-1dnveep"><!></span></div> <details class="object-details svelte-1dnveep"><summary class="svelte-1dnveep">Data</summary> <pre class="svelte-1dnveep"> </pre></details></div>`);
var root_16 = from_html(`<div style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;"><div style="font-size: 0.8rem; color: #f87171; margin-bottom: 0.25rem;">Timelocked</div> <!></div>`);
var root_7 = from_html(`<div class="object-list svelte-1dnveep"><!> <!> <!></div>`);
var root_6 = from_html(`<div class="account-card svelte-1dnveep"><div class="account-header svelte-1dnveep"><div style="display: flex; flex-direction: column;"><div style="display: flex; align-items: center; gap: 0.5rem;"><span class="account-title svelte-1dnveep"> </span> <button style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; background: var(--secondary-color); border-radius: 3px;">Copy Address</button></div> <div class="account-buttons svelte-1dnveep" style="display: flex; gap: 0.5rem; margin-top: 0.2rem;"><button style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; border-radius: 3px;"> </button></div></div> <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem;"><button class="danger svelte-1dnveep" style="font-size: 0.7rem; padding: 0.1rem 0.3rem; width: fit-content; border-radius: 3px;">Remove</button> <div class="account-balance svelte-1dnveep"> <span style="font-size: 0.8em; color: var(--text-muted);">IOTA</span></div></div></div> <!></div>`);
var root = from_html(`<main class="container"><div class="toolbar"><div style="display: flex; gap: 0.5rem;"><button style="background: #059669;">Sync/Reset</button></div> <div style="display: flex; align-items: center; gap: 0.5rem; flex-grow: 1; flex-wrap: wrap;"><input type="text" placeholder="Enter external address (0x...)"/> <button>Add Account</button></div> <div style="display: flex; gap: 0.5rem;"><button> </button></div></div> <!> <!> <!> <div class="summary-section"><div class="summary-header svelte-1dnveep"><h3 class="svelte-1dnveep">Balance Breakdown</h3> <div class="price-controls svelte-1dnveep"><select class="svelte-1dnveep"><option>USD</option><option>EUR</option></select> <button class="svelte-1dnveep">Fetch Price</button></div></div> <div class="table-wrapper"><table class="summary-table svelte-1dnveep"><thead><tr><th class="svelte-1dnveep">Category</th><th class="svelte-1dnveep">Amount (IOTA)</th><th class="svelte-1dnveep"> </th></tr></thead><tbody><tr class="total-row" style="background: rgba(16, 185, 129, 0.1);"><td class="svelte-1dnveep"><strong>Total</strong></td><td class="svelte-1dnveep"><strong> </strong></td><td class="svelte-1dnveep"><strong> </strong></td></tr><tr><td class="svelte-1dnveep">IOTA Coins</td><td class="svelte-1dnveep"> </td><td class="svelte-1dnveep"> </td></tr><tr><td class="svelte-1dnveep">Staked</td><td class="svelte-1dnveep"> </td><td class="svelte-1dnveep"> </td></tr><tr><td class="svelte-1dnveep">Staking Rewards</td><td class="svelte-1dnveep"> </td><td class="svelte-1dnveep"> </td></tr></tbody></table></div></div> <div class="accounts-grid svelte-1dnveep"></div></main>`);
function MultiAccountView($$anchor, $$props) {
  push($$props, true);
  const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
  const $sharedTransactionExecution = () => store_get(sharedTransactionExecution, "$sharedTransactionExecution", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let transactionResults = state(proxy([]));
  let currentResultIndex = state(0);
  let syncError = state("");
  let extendedAccounts = state(proxy([]));
  let allAccountsTotalBalance = user_derived(() => {
    let total = BigInt(0);
    for (let account of get(extendedAccounts)) {
      total += account.objects.reduce(
        (acc, obj) => {
          let amountToAdd = BigInt(0);
          if (obj.data.content.fields?.balance) {
            amountToAdd = BigInt(obj.data.content.fields.balance);
          } else if (obj.data.content.fields?.principal) {
            amountToAdd = BigInt(obj.data.content.fields.principal);
          }
          return acc + amountToAdd;
        },
        BigInt(0)
      );
      total += account.timelockedObjects.reduce(
        (acc, obj) => {
          let amountToAdd = BigInt(0);
          if (obj.data.content.fields?.locked) {
            amountToAdd = BigInt(obj.data.content.fields?.locked);
          } else if (obj.data.content.fields?.staked_iota?.fields?.principal) {
            amountToAdd = BigInt(obj.data.content.fields.staked_iota.fields.principal);
          }
          return acc + amountToAdd;
        },
        BigInt(0)
      );
      total += account.stakingRewards;
    }
    return total;
  });
  let allAccountsTotalRewards = user_derived(() => {
    let total = BigInt(0);
    for (let account of get(extendedAccounts)) {
      total += account.stakingRewards;
    }
    return total;
  });
  let allAccountsTotalIotaCoins = user_derived(() => {
    let total = BigInt(0);
    for (let account of get(extendedAccounts)) {
      total += account.objects.reduce(
        (acc, obj) => {
          let amountToAdd = BigInt(0);
          if (obj.data.content.fields?.balance && obj.data.content.type === "0x2::coin::Coin<0x2::iota::IOTA>") {
            amountToAdd = BigInt(obj.data.content.fields.balance);
          }
          return acc + amountToAdd;
        },
        BigInt(0)
      );
      total += account.timelockedObjects.reduce(
        (acc, obj) => {
          let amountToAdd = BigInt(0);
          if (obj.data.content.fields?.locked) {
            amountToAdd = BigInt(obj.data.content.fields.locked);
          }
          return acc + amountToAdd;
        },
        BigInt(0)
      );
    }
    return total;
  });
  let allAccountsTotalStaked = user_derived(() => {
    let total = BigInt(0);
    for (let account of get(extendedAccounts)) {
      total += account.objects.reduce(
        (acc, obj) => {
          let amountToAdd = BigInt(0);
          if (obj.data.content.fields?.principal && obj.label === "StakedIota") {
            amountToAdd = BigInt(obj.data.content.fields.principal);
          }
          return acc + amountToAdd;
        },
        BigInt(0)
      );
      total += account.timelockedObjects.reduce(
        (acc, obj) => {
          let amountToAdd = BigInt(0);
          if (obj.data.content.fields?.staked_iota?.fields?.principal) {
            amountToAdd = BigInt(obj.data.content.fields.staked_iota.fields.principal);
          }
          return acc + amountToAdd;
        },
        BigInt(0)
      );
    }
    return total;
  });
  let selectedCurrency = state("USD");
  let currentPrice = state(null);
  const syncReset = async () => {
    try {
      set(syncError, "");
      const externalAccounts = get(extendedAccounts).filter((acc) => !$iota_accounts().some((iotaAcc) => iotaAcc.address === acc.address));
      const iotaAccounts = $iota_accounts().map((account, i) => {
        return {
          id: account.address,
          address: account.address,
          label: account.label,
          objects: [],
          timelockedObjects: [],
          stakingRewards: BigInt(0),
          isCollapsed: false
        };
      });
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
    } catch (err) {
      set(syncError, err.toString(), true);
      console.error(err);
    }
  };
  function handleDnd(event2, accountId) {
    const idx = get(extendedAccounts).findIndex((acc) => acc.address === accountId);
    if (idx !== -1) {
      const seen = /* @__PURE__ */ new Set();
      const uniqueItems = event2.detail.items.filter((item) => {
        if (seen.has(item.id)) {
          return false;
        }
        seen.add(item.id);
        return true;
      });
      set(
        extendedAccounts,
        [
          ...get(extendedAccounts).slice(0, idx),
          { ...get(extendedAccounts)[idx], objects: uniqueItems },
          ...get(extendedAccounts).slice(idx + 1)
        ],
        true
      );
    }
  }
  function getMovements() {
    let movements = /* @__PURE__ */ new Map();
    for (const account of get(extendedAccounts)) {
      for (const object of account.objects) {
        if (object.currentOwner !== account.address) {
          if (!movements.has(object.currentOwner)) {
            movements.set(object.currentOwner, /* @__PURE__ */ new Map());
          }
          if (!movements.get(object.currentOwner).has(account.address)) {
            movements.get(object.currentOwner).set(account.address, []);
          }
          movements.get(object.currentOwner).get(account.address).push(object);
        }
      }
    }
    return movements;
  }
  async function prepareTxs() {
    let preparedTxs = [];
    let movements = getMovements();
    for (const movement of movements) {
      const senderAddress = movement[0];
      const tx = new Transaction();
      for (let [to, objects] of movement[1]) {
        if (get(extendedAccounts).find((acc) => acc.address == senderAddress)?.objects.filter((obj) => obj.data.content.type === "0x2::coin::Coin<0x2::iota::IOTA>").length == 0) {
          let gasCoin = objects.filter((obj) => obj.data.content.type === "0x2::coin::Coin<0x2::iota::IOTA>").sort((a, b) => {
            const aBal = BigInt(a.data.content.fields.balance);
            const bBal = BigInt(b.data.content.fields.balance);
            if (bBal > aBal) return 1;
            if (bBal < aBal) return -1;
            return 0;
          })[0];
          if (!gasCoin) {
            throw new Error(`No gas coin found for sender ${senderAddress}. Please ensure the account has IOTA coins.`);
          }
          console.log("Using transfer object as gasCoin", gasCoin);
          tx.setGasPayment([
            {
              objectId: gasCoin.id,
              version: gasCoin.data.version,
              digest: gasCoin.data.digest
            }
          ]);
          tx.transferObjects(
            objects.map((obj) => {
              if (obj.id === gasCoin.id) {
                return tx.gas;
              } else {
                return obj.id;
              }
            }),
            to
          );
        } else {
          tx.transferObjects(objects.map((obj) => obj.id), to);
        }
      }
      tx.setSender(senderAddress);
      preparedTxs.push({
        sender: senderAddress,
        recipients: Array.from(movement[1].keys()),
        transaction: tx
      });
    }
    return preparedTxs;
  }
  let numTransfers = user_derived(() => {
    return getMovements().size;
  });
  async function executeTransfers() {
    try {
      set(transactionResults, [], true);
      set(currentResultIndex, 0);
      const client = getClient();
      const executionMode = $sharedTransactionExecution();
      let preparedTxs = await prepareTxs();
      for (const preparedTx of preparedTxs) {
        const { sender, recipients, transaction } = preparedTx;
        console.log(`Executing transfer from ${sender} to:`, recipients.join(", "));
        let result;
        switch (executionMode) {
          case TransactionExecution.DevInspect:
            result = await client.devInspectTransactionBlock({ sender, transactionBlock: transaction });
            break;
          case TransactionExecution.DryRun:
            result = await client.dryRunTransactionBlock({ transactionBlock: await transaction.build({ client }) });
            break;
          case TransactionExecution.Send:
            const wallet = getActiveWallet();
            if (!wallet) {
              throw new Error("No active wallet available");
            }
            await requireMainnetTransactionConfirmation(transaction);
            result = await wallet.signAndExecuteTransaction({
              transaction,
              options: {
                showEffects: true,
                showObjectChanges: true,
                showBalanceChanges: true
              },
              account: { address: sender },
              // @ts-ignore
              chain: getSelectedChain()
            });
            break;
          case TransactionExecution.Prepare:
            let json = JSON.parse(await transaction.toJSON());
            if (transaction.getData().gasData.price == 0) {
              let referenceGasPrice = await client.getReferenceGasPrice();
              transaction.setGasPrice(referenceGasPrice);
            }
            if (transaction.getData().gasData.budget == 0) {
              let gas = await calculateGasFee(transaction);
              transaction.setGasBudget(BigInt(gas));
            }
            let transactionBytes = toBase64(await transaction.build({ client }));
            result = { json, transactionBytes };
            break;
          default:
            throw new Error(`Unknown transaction execution mode: ${executionMode}`);
        }
        result.sender = sender;
        result.recipients = recipients;
        set(transactionResults, [...get(transactionResults), result], true);
      }
    } catch (err) {
      set(transactionResults, [{ error: err.toString() }], true);
      console.error(err);
    }
  }
  let newAccountAddress = state("");
  let newAccountError = state("");
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
    set(
      extendedAccounts,
      [
        ...get(extendedAccounts),
        {
          id: address,
          address,
          label: "External: " + address.slice(0, 6) + "..." + address.slice(-4),
          objects: [],
          timelockedObjects: [],
          stakingRewards: BigInt(0),
          isCollapsed: false
        }
      ],
      true
    );
    set(newAccountAddress, "");
  }
  function removeAccount(address) {
    set(extendedAccounts, get(extendedAccounts).filter((acc) => acc.address !== address), true);
  }
  function getAccountDisplayName(address) {
    const acc = get(extendedAccounts).find((a) => a.address === address);
    return acc ? acc.label || address.slice(0, 6) + "..." + address.slice(-4) : address.slice(0, 6) + "..." + address.slice(-4);
  }
  function toggleCollapse(accountId) {
    const idx = get(extendedAccounts).findIndex((acc) => acc.id === accountId);
    if (idx !== -1) {
      get(extendedAccounts)[idx] = {
        ...get(extendedAccounts)[idx],
        isCollapsed: !get(extendedAccounts)[idx].isCollapsed
      };
    }
  }
  var main = root();
  var div = child(main);
  var div_1 = child(div);
  var button = child(div_1);
  var div_2 = sibling(div_1, 2);
  var input = child(div_2);
  var button_1 = sibling(input, 2);
  var div_3 = sibling(div_2, 2);
  var button_2 = child(div_3);
  var text$1 = child(button_2);
  var node = sibling(div, 2);
  {
    var consequent = ($$anchor2) => {
      var div_4 = root_1();
      var text_1 = child(div_4);
      template_effect(() => set_text(text_1, get(newAccountError)));
      append($$anchor2, div_4);
    };
    if_block(node, ($$render) => {
      if (get(newAccountError)) $$render(consequent);
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_5 = root_2();
      var text_2 = child(div_5);
      template_effect(() => set_text(text_2, get(syncError)));
      append($$anchor2, div_5);
    };
    if_block(node_1, ($$render) => {
      if (get(syncError)) $$render(consequent_1);
    });
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_6 = root_3();
      var div_7 = child(div_6);
      var span = child(div_7);
      var text_3 = child(span);
      var node_3 = sibling(span, 2);
      each(node_3, 17, () => get(transactionResults), index, ($$anchor3, result, i) => {
        const label = user_derived(() => get(result).sender ? getAccountDisplayName(get(result).sender) : "");
        var button_3 = root_4();
        var text_4 = child(button_3);
        text_4.nodeValue = `${i + 1} `;
        var node_4 = sibling(text_4);
        {
          var consequent_2 = ($$anchor4) => {
            var text_5 = text();
            template_effect(() => set_text(text_5, `(from: ${get(label) ?? ""})`));
            append($$anchor4, text_5);
          };
          if_block(node_4, ($$render) => {
            if (get(label)) $$render(consequent_2);
          });
        }
        template_effect(() => {
          set_class(button_3, 1, `transaction-tab ${get(currentResultIndex) === i ? "active" : ""}`, "svelte-1dnveep");
          set_attribute(button_3, "title", get(result).sender ? `From ${get(result).sender}` : "");
        });
        delegated("click", button_3, () => set(currentResultIndex, i, true));
        append($$anchor3, button_3);
      });
      var div_8 = sibling(div_7, 2);
      var node_5 = child(div_8);
      TransactionView(node_5, {
        get value() {
          return get(transactionResults)[get(currentResultIndex)];
        }
      });
      template_effect(() => set_text(text_3, `Transfers(${get(transactionResults).length ?? ""}):`));
      append($$anchor2, div_6);
    };
    if_block(node_2, ($$render) => {
      if (get(transactionResults).length > 0) $$render(consequent_3);
    });
  }
  var div_9 = sibling(node_2, 2);
  var div_10 = child(div_9);
  var div_11 = sibling(child(div_10), 2);
  var select = child(div_11);
  var option = child(select);
  option.value = option.__value = "USD";
  var option_1 = sibling(option);
  option_1.value = option_1.__value = "EUR";
  var button_4 = sibling(select, 2);
  var div_12 = sibling(div_10, 2);
  var table = child(div_12);
  var thead = child(table);
  var tr = child(thead);
  var th = sibling(child(tr), 2);
  var text_6 = child(th);
  var tbody = sibling(thead);
  var tr_1 = child(tbody);
  var td = sibling(child(tr_1));
  var strong = child(td);
  var text_7 = child(strong);
  var td_1 = sibling(td);
  var strong_1 = child(td_1);
  var text_8 = child(strong_1);
  var tr_2 = sibling(tr_1);
  var td_2 = sibling(child(tr_2));
  var text_9 = child(td_2);
  var td_3 = sibling(td_2);
  var text_10 = child(td_3);
  var tr_3 = sibling(tr_2);
  var td_4 = sibling(child(tr_3));
  var text_11 = child(td_4);
  var td_5 = sibling(td_4);
  var text_12 = child(td_5);
  var tr_4 = sibling(tr_3);
  var td_6 = sibling(child(tr_4));
  var text_13 = child(td_6);
  var td_7 = sibling(td_6);
  var text_14 = child(td_7);
  var div_13 = sibling(div_9, 2);
  each(div_13, 21, () => get(extendedAccounts), (account) => account.id, ($$anchor2, account) => {
    var div_14 = root_6();
    var div_15 = child(div_14);
    var div_16 = child(div_15);
    var div_17 = child(div_16);
    var span_1 = child(div_17);
    var text_15 = child(span_1);
    var button_5 = sibling(span_1, 2);
    var div_18 = sibling(div_17, 2);
    var button_6 = child(div_18);
    var text_16 = child(button_6);
    var div_19 = sibling(div_16, 2);
    var button_7 = child(div_19);
    var div_20 = sibling(button_7, 2);
    var text_17 = child(div_20);
    var node_6 = sibling(div_15, 2);
    {
      var consequent_13 = ($$anchor3) => {
        var div_21 = root_7();
        var node_7 = child(div_21);
        each(node_7, 17, () => get(account).objects, (item) => item.id, ($$anchor4, item) => {
          var div_22 = root_8();
          let classes;
          var div_23 = child(div_22);
          var span_2 = child(div_23);
          var node_8 = child(span_2);
          {
            var consequent_4 = ($$anchor5) => {
              var text_18 = text("IOTA Coin");
              append($$anchor5, text_18);
            };
            var d = user_derived(() => get(item).label.startsWith("Coin<0x2::iota::IOTA>"));
            var alternate = ($$anchor5) => {
              var text_19 = text();
              template_effect(() => set_text(text_19, get(item).label));
              append($$anchor5, text_19);
            };
            if_block(node_8, ($$render) => {
              if (get(d)) $$render(consequent_4);
              else $$render(alternate, false);
            });
          }
          var span_3 = sibling(span_2, 2);
          var node_9 = child(span_3);
          {
            var consequent_5 = ($$anchor5) => {
              var text_20 = text();
              template_effect(($0) => set_text(text_20, $0), [
                () => formatNumberWithUnderscores(nanoToIota(get(item).data?.content.fields?.balance))
              ]);
              append($$anchor5, text_20);
            };
            var d_1 = user_derived(() => get(item).label.startsWith("Coin<0x2::iota::IOTA>"));
            var consequent_6 = ($$anchor5) => {
              var text_21 = text();
              template_effect(($0) => set_text(text_21, $0), [
                () => formatNumberWithUnderscores(nanoToIota(get(item).data?.content.fields?.principal))
              ]);
              append($$anchor5, text_21);
            };
            var consequent_7 = ($$anchor5) => {
              var text_22 = text();
              template_effect(($0) => set_text(text_22, $0), [
                () => formatNumberWithUnderscores(nanoToIota(get(item).data.content.fields.staked_iota.fields.principal))
              ]);
              append($$anchor5, text_22);
            };
            if_block(node_9, ($$render) => {
              if (get(d_1)) $$render(consequent_5);
              else if (get(item).label == "StakedIota") $$render(consequent_6, 1);
              else if (get(item).label == "TimelockedStakedIota") $$render(consequent_7, 2);
            });
          }
          action(div_23, ($$node) => dragHandle?.($$node));
          var div_24 = sibling(div_23, 2);
          var node_10 = child(div_24);
          {
            var consequent_8 = ($$anchor5) => {
              var div_25 = root_14();
              var text_23 = child(div_25);
              template_effect(($0) => set_text(text_23, `From: ${$0 ?? ""}`), [() => getAccountDisplayName(get(item).currentOwner)]);
              append($$anchor5, div_25);
            };
            if_block(node_10, ($$render) => {
              if (get(account).address !== get(item).currentOwner) $$render(consequent_8);
            });
          }
          var details = sibling(node_10, 2);
          var pre = sibling(child(details), 2);
          var text_24 = child(pre);
          template_effect(
            ($0) => {
              classes = set_class(div_22, 1, "object-item svelte-1dnveep", null, classes, { foreign: get(account).address !== get(item).currentOwner });
              set_attribute(span_2, "title", get(item).label);
              set_text(text_24, $0);
            },
            [() => JSON.stringify(get(item), null, 2)]
          );
          append($$anchor4, div_22);
        });
        var node_11 = sibling(node_7, 2);
        {
          var consequent_9 = ($$anchor4) => {
            var div_26 = root_15();
            append($$anchor4, div_26);
          };
          if_block(node_11, ($$render) => {
            if (get(account).objects.length === 0 && get(account).timelockedObjects.length === 0) $$render(consequent_9);
          });
        }
        var node_12 = sibling(node_11, 2);
        {
          var consequent_12 = ($$anchor4) => {
            var div_27 = root_16();
            var node_13 = sibling(child(div_27), 2);
            each(node_13, 17, () => get(account).timelockedObjects, (item) => item.id, ($$anchor5, item) => {
              var div_28 = root_17();
              var div_29 = child(div_28);
              var span_4 = child(div_29);
              var text_25 = child(span_4);
              var span_5 = sibling(span_4, 2);
              var node_14 = child(span_5);
              {
                var consequent_10 = ($$anchor6) => {
                  var text_26 = text();
                  template_effect(($0) => set_text(text_26, $0), [
                    () => formatNumberWithUnderscores(nanoToIota(get(item).data.content.fields.staked_iota.fields.principal))
                  ]);
                  append($$anchor6, text_26);
                };
                var consequent_11 = ($$anchor6) => {
                  var text_27 = text();
                  template_effect(($0) => set_text(text_27, $0), [
                    () => formatNumberWithUnderscores(nanoToIota(get(item).data?.content.fields?.balance))
                  ]);
                  append($$anchor6, text_27);
                };
                var d_2 = user_derived(() => get(item).label.startsWith("Coin<0x2::iota::IOTA>"));
                if_block(node_14, ($$render) => {
                  if (get(item).label == "TimelockedStakedIota") $$render(consequent_10);
                  else if (get(d_2)) $$render(consequent_11, 1);
                });
              }
              var details_1 = sibling(div_29, 2);
              var pre_1 = sibling(child(details_1), 2);
              var text_28 = child(pre_1);
              template_effect(
                ($0) => {
                  set_text(text_25, get(item).label);
                  set_text(text_28, $0);
                },
                [() => JSON.stringify(get(item), null, 2)]
              );
              append($$anchor5, div_28);
            });
            append($$anchor4, div_27);
          };
          if_block(node_12, ($$render) => {
            if (get(account).timelockedObjects.length != 0) $$render(consequent_12);
          });
        }
        action(div_21, ($$node, $$action_arg) => dragHandleZone?.($$node, $$action_arg), () => ({ items: get(account).objects, flipDurationMs: 200 }));
        event("consider", div_21, (e) => handleDnd(e, get(account).id));
        event("finalize", div_21, (e) => handleDnd(e, get(account).id));
        append($$anchor3, div_21);
      };
      if_block(node_6, ($$render) => {
        if (!get(account).isCollapsed) $$render(consequent_13);
      });
    }
    template_effect(
      ($0, $1) => {
        set_attribute(span_1, "title", get(account).address);
        set_text(text_15, $0);
        set_text(text_16, `${get(account).isCollapsed ? "▶ Expand" : "▼ Collapse"} (${get(account).objects.length + get(account).timelockedObjects.length})`);
        set_text(text_17, `${$1 ?? ""} `);
      },
      [
        () => get(account).label || get(account).address.slice(0, 6) + "..." + get(account).address.slice(-4),
        () => formatNumberWithUnderscores(nanoToIota((get(account).objects.reduce(
          (acc, obj) => {
            let amountToAdd = BigInt(0);
            if (obj.data.content.fields?.balance) {
              amountToAdd = BigInt(obj.data.content.fields.balance);
            } else if (obj.data.content.fields?.principal) {
              amountToAdd = BigInt(obj.data.content.fields.principal);
            }
            return acc + amountToAdd;
          },
          BigInt(0)
        ) + get(account).timelockedObjects.reduce(
          (acc, obj) => {
            let amountToAdd = BigInt(0);
            if (obj.data.content.fields?.locked) {
              amountToAdd = BigInt(obj.data.content.fields?.locked);
            } else if (obj.data.content.fields?.staked_iota?.fields?.principal) {
              amountToAdd = BigInt(obj.data.content.fields.staked_iota.fields.principal);
            }
            return acc + amountToAdd;
          },
          BigInt(0)
        ) + get(account).stakingRewards).toString()))
      ]
    );
    delegated("click", button_5, () => navigator.clipboard.writeText(get(account).address));
    delegated("click", button_6, () => toggleCollapse(get(account).id));
    delegated("click", button_7, () => removeAccount(get(account).address));
    append($$anchor2, div_14);
  });
  template_effect(
    ($0, $1, $2, $3, $4, $5, $6, $7) => {
      button_2.disabled = get(numTransfers) === 0;
      set_text(text$1, `Execute (${get(numTransfers) ?? ""}) Transfer${get(numTransfers) !== 1 ? "s" : ""}`);
      set_text(text_6, `Value (${get(selectedCurrency) ?? ""})`);
      set_text(text_7, $0);
      set_text(text_8, $1);
      set_text(text_9, $2);
      set_text(text_10, $3);
      set_text(text_11, $4);
      set_text(text_12, $5);
      set_text(text_13, $6);
      set_text(text_14, $7);
    },
    [
      () => formatNumberWithUnderscores(nanoToIota(get(allAccountsTotalBalance).toString())),
      () => get(currentPrice) ? (parseFloat(nanoToIota(get(allAccountsTotalBalance).toString())) * (get(selectedCurrency) === "USD" ? get(currentPrice).usd : get(currentPrice).eur)).toFixed(2) : "-",
      () => formatNumberWithUnderscores(nanoToIota(get(allAccountsTotalIotaCoins).toString())),
      () => get(currentPrice) ? (parseFloat(nanoToIota(get(allAccountsTotalIotaCoins).toString())) * (get(selectedCurrency) === "USD" ? get(currentPrice).usd : get(currentPrice).eur)).toFixed(2) : "-",
      () => formatNumberWithUnderscores(nanoToIota(get(allAccountsTotalStaked).toString())),
      () => get(currentPrice) ? (parseFloat(nanoToIota(get(allAccountsTotalStaked).toString())) * (get(selectedCurrency) === "USD" ? get(currentPrice).usd : get(currentPrice).eur)).toFixed(2) : "-",
      () => formatNumberWithUnderscores(nanoToIota(get(allAccountsTotalRewards).toString())),
      () => get(currentPrice) ? (parseFloat(nanoToIota(get(allAccountsTotalRewards).toString())) * (get(selectedCurrency) === "USD" ? get(currentPrice).usd : get(currentPrice).eur)).toFixed(2) : "-"
    ]
  );
  delegated("click", button, syncReset);
  bind_value(input, () => get(newAccountAddress), ($$value) => set(newAccountAddress, $$value));
  delegated("click", button_1, addExternalAccount);
  delegated("click", button_2, executeTransfers);
  bind_select_value(select, () => get(selectedCurrency), ($$value) => set(selectedCurrency, $$value));
  delegated("click", button_4, () => fetchCurrentPrice().then((price) => set(currentPrice, price, true)));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click"]);
export {
  MultiAccountView as default
};
