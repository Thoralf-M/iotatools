import { p as push, O as state, P as proxy, f as from_html, s as sibling, c as child, N as store_get, b as if_block, g as get, z as each, t as template_effect, d as set_text, E as bind_value, k as append, l as pop, Q as setup_stores, ad as iota_accounts, ae as iota_wallets, n as getClient, j as set, af as Transaction, R as isValidIotaAddress, W as delegate, J as set_style, L as set_class, ag as clsx, e as event, G as first_child, H as text, I as comment } from "/iota-utils/assets/index-Z8lfZefp.js";
import { a as action } from "/iota-utils/assets/actions-Da9IsCeZ.js";
import { T as TransactionView } from "/iota-utils/assets/TransactionView-xzc_PpPE.js";
import { n as nanoToIota } from "/iota-utils/assets/iota-nano-conversion-DMVo66-0.js";
import "/iota-utils/assets/transaction-view-B62tez3A.js";
import "/iota-utils/assets/attributes-DqUnFIEa.js";
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
function isCenterOfAInsideB(elA, elB) {
  var centerOfA = findCenterOfElement(elA);
  var rectOfB = getAbsoluteRectNoTransforms(elB);
  return isPointInsideRect(centerOfA, rectOfB);
}
function calcDistanceBetweenCenters(elA, elB) {
  var centerOfA = findCenterOfElement(elA);
  var centerOfB = findCenterOfElement(elB);
  return calcDistance(centerOfA, centerOfB);
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
  var parent = element.parentElement;
  while (parent && parent !== document.body) {
    var parentRect = parent.getBoundingClientRect();
    var overflowY = window.getComputedStyle(parent).overflowY;
    var overflowX = window.getComputedStyle(parent).overflowX;
    var isScrollableY = overflowY === "scroll" || overflowY === "auto";
    var isScrollableX = overflowX === "scroll" || overflowX === "auto";
    if (isScrollableY) {
      visibleRect.top = Math.max(visibleRect.top, parentRect.top);
      visibleRect.bottom = Math.min(visibleRect.bottom, parentRect.bottom);
    }
    if (isScrollableX) {
      visibleRect.left = Math.max(visibleRect.left, parentRect.left);
      visibleRect.right = Math.min(visibleRect.right, parentRect.right);
    }
    parent = parent.parentElement;
  }
  visibleRect.top = Math.max(visibleRect.top, 0);
  visibleRect.bottom = Math.min(visibleRect.bottom, window.innerHeight);
  visibleRect.left = Math.max(visibleRect.left, 0);
  visibleRect.right = Math.min(visibleRect.right, window.innerWidth);
  return {
    top: visibleRect.top,
    bottom: visibleRect.bottom,
    left: visibleRect.left,
    right: visibleRect.right,
    width: Math.max(0, visibleRect.right - visibleRect.left),
    height: Math.max(0, visibleRect.bottom - visibleRect.top)
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
function findWouldBeIndex(floatingAboveEl, collectionBelowEl) {
  if (!isCenterOfAInsideB(floatingAboveEl, collectionBelowEl)) {
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
    if (isCenterOfAInsideB(floatingAboveEl, children[i])) {
      var cachedShadowRect = dzToShadowIndexToRect.has(collectionBelowEl) && dzToShadowIndexToRect.get(collectionBelowEl).get(i);
      if (cachedShadowRect) {
        if (!isPointInsideRect(findCenterOfElement(floatingAboveEl), cachedShadowRect)) {
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
    var distance = calcDistanceBetweenCenters(floatingAboveEl, children[_i]);
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
    var phantomDistance = calcDistanceBetweenCenters(floatingAboveEl, phantom);
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
  var lastDropZoneFound;
  var lastIndexFound;
  var lastIsDraggedInADropZone = false;
  var lastCentrePositionOfDragged;
  var dropZonesFromDeepToShallow = Array.from(dropZones).sort(function(dz1, dz2) {
    return getDepth(dz2) - getDepth(dz1);
  });
  function andNow() {
    var currentCenterOfDragged = findCenterOfElement(draggedEl2);
    var scrolled = multiScroller2.multiScrollIfNeeded();
    if (!scrolled && lastCentrePositionOfDragged && Math.abs(lastCentrePositionOfDragged.x - currentCenterOfDragged.x) < TOLERANCE_PX && Math.abs(lastCentrePositionOfDragged.y - currentCenterOfDragged.y) < TOLERANCE_PX) {
      next = window.setTimeout(andNow, intervalMs);
      return;
    }
    if (isElementOffDocument(draggedEl2)) {
      dispatchDraggedLeftDocument(draggedEl2);
      return;
    }
    lastCentrePositionOfDragged = currentCenterOfDragged;
    var isDraggedInADropZone = false;
    var _iterator = _createForOfIteratorHelper(dropZonesFromDeepToShallow), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var dz = _step.value;
        if (scrolled) resetIndexesCache();
        var indexObj = findWouldBeIndex(draggedEl2, dz);
        if (indexObj === null) {
          continue;
        }
        var index = indexObj.index;
        isDraggedInADropZone = true;
        if (dz !== lastDropZoneFound) {
          lastDropZoneFound && dispatchDraggedElementLeftContainerForAnother(lastDropZoneFound, draggedEl2, dz);
          dispatchDraggedElementEnteredContainer(dz, indexObj, draggedEl2);
          lastDropZoneFound = dz;
        } else if (index !== lastIndexFound) {
          dispatchDraggedElementIsOverIndex(dz, indexObj, draggedEl2);
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
  observe(draggedEl, dropZones, observationIntervalMs * 1.07, multiScroller);
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
    return item[ITEM_ID_KEY] !== shadowElData[ITEM_ID_KEY];
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
  var index = e.detail.indexObj.index;
  var shadowElIdx = findShadowElementIdx(items);
  if (shadowElIdx !== -1) {
    items.splice(shadowElIdx, 1);
  }
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
    var originalItems = config.items, type = config.type, centreDraggedOnCursor = config.centreDraggedOnCursor;
    var items = _toConsumableArray(originalItems);
    draggedElData = items[currentIdx];
    draggedElType = type;
    shadowElData = createShadowElData(draggedElData);
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
    } : _ref2$transformDragge, _ref2$centreDraggedOn = _ref2.centreDraggedOnCursor, centreDraggedOnCursor = _ref2$centreDraggedOn === void 0 ? false : _ref2$centreDraggedOn, _ref2$dropAnimationDi = _ref2.dropAnimationDisabled, dropAnimationDisabled = _ref2$dropAnimationDi === void 0 ? false : _ref2$dropAnimationDi, _ref2$delayTouchStart = _ref2.delayTouchStart, delayTouchStartOpt = _ref2$delayTouchStart === void 0 ? false : _ref2$delayTouchStart;
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
      node.setAttribute("aria-disabled", dragDisabled);
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
var _excluded = ["items", "flipDurationMs", "type", "dragDisabled", "morphDisabled", "dropFromOthersDisabled", "zoneTabIndex", "zoneItemTabIndex", "dropTargetStyle", "dropTargetClasses", "transformDraggedElement", "autoAriaDisabled", "centreDraggedOnCursor", "delayTouchStart", "dropAnimationDisabled"];
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
const syncReset = async (_, extendedAccounts, $iota_accounts, getObjects, allAccountsTotalBalance, value) => {
  try {
    const externalAccounts = get(extendedAccounts).filter((acc) => !$iota_accounts().some((iotaAcc) => iotaAcc.address === acc.address));
    const iotaAccounts = $iota_accounts().map((account, i) => {
      return {
        id: account.address,
        address: account.address,
        label: account.label,
        objects: [],
        timelockedObjects: []
      };
    });
    set(extendedAccounts, [...iotaAccounts, ...externalAccounts], true);
    await getObjects();
    set(allAccountsTotalBalance, 0);
    for (let account of get(extendedAccounts)) {
      set(allAccountsTotalBalance, get(allAccountsTotalBalance) + account.objects.reduce(
        (acc, obj) => {
          let amountToAdd = 0;
          if (obj.data.content.fields?.balance) {
            amountToAdd = Number(nanoToIota(obj.data.content.fields.balance));
          } else if (obj.data.content.fields?.principal) {
            amountToAdd = Number(nanoToIota(obj.data.content.fields.principal));
          }
          return acc + amountToAdd;
        },
        0
      ));
      set(allAccountsTotalBalance, get(allAccountsTotalBalance) + account.timelockedObjects.reduce(
        (acc, obj) => {
          let amountToAdd = 0;
          if (obj.data.content.fields?.locked) {
            amountToAdd = Number(nanoToIota(obj.data.content.fields?.locked));
          } else if (obj.data.content.fields?.staked_iota?.fields?.principal) {
            amountToAdd = Number(nanoToIota(obj.data.content.fields.staked_iota.fields.principal));
          }
          return acc + amountToAdd;
        },
        0
      ));
    }
  } catch (err) {
    set(value, err.toString(), true);
    console.error(err);
  }
};
async function dryRun(__1, prepareTxs, value) {
  try {
    const client = getClient();
    let preparedTxs = await prepareTxs();
    let txResults = [];
    for (const preparedTx of preparedTxs) {
      const { sender, recipients, transaction } = preparedTx;
      console.log(`Dry run moving objects from ${sender} to:`, recipients.join(", "));
      let dryRunResult = await client.dryRunTransactionBlock({ transactionBlock: await transaction.build({ client }) });
      dryRunResult.sender = sender;
      dryRunResult.recipients = recipients;
      txResults.push(dryRunResult);
    }
    set(value, { txs: txResults.length, txResults }, true);
  } catch (err) {
    set(value, err.toString(), true);
    console.error(err);
  }
}
async function send(__2, prepareTxs, $iota_wallets, value) {
  try {
    let preparedTxs = await prepareTxs();
    let txResults = [];
    for (const preparedTx of preparedTxs) {
      const { sender, recipients, transaction } = preparedTx;
      console.log(`Moving objects from ${sender} to:`, recipients.join(", "));
      let txResult = await $iota_wallets()[0].signAndExecuteTransaction({
        transaction,
        options: {
          showEffects: true,
          showObjectChanges: true,
          showBalanceChanges: true
        },
        account: { address: sender }
      });
      txResult.sender = sender;
      txResult.recipients = recipients;
      txResults.push(txResult);
    }
    set(value, { txs: txResults.length, txResults }, true);
  } catch (err) {
    set(value, err.toString(), true);
    console.error(err);
  }
}
function addExternalAccount(__3, newAccountAddress, newAccountError, extendedAccounts, $iota_accounts) {
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
        timelockedObjects: []
      }
    ],
    true
  );
  set(newAccountAddress, "");
}
var root_1 = from_html(`<div style="color: #d63031; margin: 0.5rem;"> </div>`);
var on_click = (__4, removeExternalAccount, account) => removeExternalAccount(get(account).address);
var root_3 = from_html(`<button style="margin:0.2rem; background-color: #d63031; " class="svelte-197n9ug">Remove External Account</button> <br/>`, 1);
var root_11 = from_html(`<div> </div>`);
var root_4 = from_html(`<div style="border-top: 1px solid #525252;"><div class="handle svelte-197n9ug"><span><!></span> <!></div> <div class="item"><details><summary>Show object data</summary> <pre style="font-size:0.7rem;  text-align: left;" class="svelte-197n9ug"> </pre></details></div></div>`);
var root_12 = from_html(`<br/> <br/> <br/> <br/>`, 1);
var root_21 = from_html(`<div> </div>`);
var root_14 = from_html(`<div style="border-top: 1px solid #525252;"><span style="word-break: break-all;"><!></span> <!></div> <div class="item"><details><summary>Show object data</summary> <pre style="font-size:0.7rem;  text-align: left;" class="svelte-197n9ug"> </pre></details></div>`, 1);
var root_13 = from_html(`<details><summary style="color: #ff9991;">Timelocked objects</summary> <!></details>`);
var root_2 = from_html(`<div class="account svelte-197n9ug"><div class="accountHeader svelte-197n9ug"> </div> <!> <div style="text-align: left;"> </div> <div style="max-height: 300px; overflow-y: auto;"><!> <!> <!></div></div>`);
var root = from_html(`<main><span style="float:left">Drag and drop objects between accounts.</span> <br/> <input type="text" placeholder="Enter external address" style="margin:0.5rem;" size="67"/> <button class="svelte-197n9ug">Add External Account</button> <!> <br/> <button class="svelte-197n9ug">sync/reset</button> <button class="svelte-197n9ug">dry run</button> <button class="svelte-197n9ug">send</button> <!> <br/> <div style="text-align:left"> </div> <div class="grid svelte-197n9ug"></div></main>`);
function MultiAccountView($$anchor, $$props) {
  push($$props, true);
  const [$$stores, $$cleanup] = setup_stores();
  const $iota_accounts = () => store_get(iota_accounts, "$iota_accounts", $$stores);
  const $iota_wallets = () => store_get(iota_wallets, "$iota_wallets", $$stores);
  let value = state(proxy({}));
  let extendedAccounts = state(proxy([]));
  let allAccountsTotalBalance = state(0);
  function handleDnd(event2) {
    const idx = get(extendedAccounts).findIndex(
      // @ts-ignore
      (acc) => acc.address === event2.srcElement.classList[0]
    );
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
  async function getObjects() {
    try {
      const client = getClient();
      const updatedAccounts = await Promise.all(get(extendedAccounts).map(async (account) => {
        const result = await client.getOwnedObjects({
          owner: account.address,
          options: { showContent: true, showType: true }
        });
        const objects = result.data.map((obj, idx) => {
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
      }));
      set(extendedAccounts, updatedAccounts, true);
    } catch (err) {
      set(value, err.toString(), true);
      console.error(err);
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
          let gasCoin = objects.filter((obj) => obj.data.content.type === "0x2::coin::Coin<0x2::iota::IOTA>").sort((a, b) => Number(BigInt(b.data.content.fields.balance) - BigInt(a.data.content.fields.balance)))[0];
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
  let newAccountAddress = state("");
  let newAccountError = state("");
  function removeExternalAccount(address) {
    if ($iota_accounts().some((acc) => acc.address === address)) return;
    set(extendedAccounts, get(extendedAccounts).filter((acc) => acc.address !== address), true);
  }
  var main = root();
  var input = sibling(child(main), 4);
  var button = sibling(input, 2);
  button.__click = [
    addExternalAccount,
    newAccountAddress,
    newAccountError,
    extendedAccounts,
    $iota_accounts
  ];
  var node = sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var div = root_1();
      var text2 = child(div);
      template_effect(() => set_text(text2, get(newAccountError)));
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if (get(newAccountError)) $$render(consequent);
    });
  }
  var button_1 = sibling(node, 4);
  button_1.__click = [
    syncReset,
    extendedAccounts,
    $iota_accounts,
    getObjects,
    allAccountsTotalBalance,
    value
  ];
  var button_2 = sibling(button_1, 2);
  button_2.__click = [dryRun, prepareTxs, value];
  var button_3 = sibling(button_2, 2);
  button_3.__click = [send, prepareTxs, $iota_wallets, value];
  var node_1 = sibling(button_3, 2);
  TransactionView(node_1, {
    get value() {
      return get(value);
    }
  });
  var div_1 = sibling(node_1, 4);
  var text_1 = child(div_1);
  var div_2 = sibling(div_1, 2);
  each(div_2, 21, () => get(extendedAccounts), (account) => account.id, ($$anchor2, account) => {
    var div_3 = root_2();
    var div_4 = child(div_3);
    var text_2 = child(div_4);
    var node_2 = sibling(div_4, 2);
    {
      var consequent_1 = ($$anchor3) => {
        var fragment = root_3();
        var button_4 = first_child(fragment);
        button_4.__click = [on_click, removeExternalAccount, account];
        append($$anchor3, fragment);
      };
      if_block(node_2, ($$render) => {
        if (!$iota_accounts().some((acc) => acc.address === get(account).address)) $$render(consequent_1);
      });
    }
    var div_5 = sibling(node_2, 2);
    var text_3 = child(div_5);
    var div_6 = sibling(div_5, 2);
    var node_3 = child(div_6);
    each(node_3, 17, () => get(account).objects, (item) => item.id, ($$anchor3, item) => {
      var div_7 = root_4();
      var div_8 = child(div_7);
      var span = child(div_8);
      var node_4 = child(span);
      {
        var consequent_2 = ($$anchor4) => {
          var text_4 = text();
          template_effect(($0) => set_text(text_4, `${get(item).label ?? ""}: ${$0 ?? ""} IOTA`), [() => nanoToIota(get(item).data?.content.fields?.balance)]);
          append($$anchor4, text_4);
        };
        var alternate_2 = ($$anchor4) => {
          var fragment_2 = comment();
          var node_5 = first_child(fragment_2);
          {
            var consequent_3 = ($$anchor5) => {
              var text_5 = text();
              template_effect(
                ($0) => set_text(text_5, `${get(item).label ?? ""}: ${$0 ?? ""}
                                        IOTA`),
                [
                  () => nanoToIota(get(item).data?.content.fields?.principal)
                ]
              );
              append($$anchor5, text_5);
            };
            var alternate_1 = ($$anchor5) => {
              var fragment_4 = comment();
              var node_6 = first_child(fragment_4);
              {
                var consequent_4 = ($$anchor6) => {
                  var text_6 = text();
                  template_effect(($0) => set_text(text_6, `${get(item).label ?? ""}: ${$0 ?? ""} IOTA`), [
                    () => nanoToIota(get(item).data.content.fields.staked_iota.fields.principal)
                  ]);
                  append($$anchor6, text_6);
                };
                var alternate = ($$anchor6) => {
                  var text_7 = text();
                  template_effect(() => set_text(text_7, get(item).label));
                  append($$anchor6, text_7);
                };
                if_block(
                  node_6,
                  ($$render) => {
                    if (get(item).label == "TimelockedStakedIota") $$render(consequent_4);
                    else $$render(alternate, false);
                  },
                  true
                );
              }
              append($$anchor5, fragment_4);
            };
            if_block(
              node_5,
              ($$render) => {
                if (get(item).label == "StakedIota") $$render(consequent_3);
                else $$render(alternate_1, false);
              },
              true
            );
          }
          append($$anchor4, fragment_2);
        };
        if_block(node_4, ($$render) => {
          if (get(item).label.startsWith("Coin<0x2::iota::IOTA>")) $$render(consequent_2);
          else $$render(alternate_2, false);
        });
      }
      var node_7 = sibling(span, 2);
      {
        var consequent_5 = ($$anchor4) => {
          var div_9 = root_11();
          var text_8 = child(div_9);
          template_effect(($0) => set_text(text_8, `from: ${$0 ?? ""}`), [
            () => get(item).currentOwner.slice(0, 6) + "..." + get(item).currentOwner.slice(-4)
          ]);
          append($$anchor4, div_9);
        };
        if_block(node_7, ($$render) => {
          if (get(account).address !== get(item).currentOwner) $$render(consequent_5);
        });
      }
      action(div_8, ($$node) => dragHandle?.($$node));
      var div_10 = sibling(div_8, 2);
      var details = child(div_10);
      var pre = sibling(child(details), 2);
      var text_9 = child(pre);
      template_effect(
        ($0) => {
          set_style(div_8, get(account).address !== get(item).currentOwner ? "background-color: #19400e;" : "");
          set_text(text_9, `
                                        ${$0 ?? ""}
                                    `);
        },
        [() => "\n" + JSON.stringify(get(item), null, 2)]
      );
      append($$anchor3, div_7);
    });
    var node_8 = sibling(node_3, 2);
    {
      var consequent_6 = ($$anchor3) => {
        var fragment_7 = root_12();
        append($$anchor3, fragment_7);
      };
      if_block(node_8, ($$render) => {
        if (get(account).objects.length == 0) $$render(consequent_6);
      });
    }
    var node_9 = sibling(node_8, 2);
    {
      var consequent_11 = ($$anchor3) => {
        var details_1 = root_13();
        var node_10 = sibling(child(details_1), 2);
        each(node_10, 17, () => get(account).timelockedObjects, (item) => item.id, ($$anchor4, item) => {
          var fragment_8 = root_14();
          var div_11 = first_child(fragment_8);
          var span_1 = child(div_11);
          var node_11 = child(span_1);
          {
            var consequent_7 = ($$anchor5) => {
              var text_10 = text();
              template_effect(($0) => set_text(text_10, `${get(item).label ?? ""}: ${$0 ?? ""} IOTA`), [() => nanoToIota(get(item).data?.content.fields?.balance)]);
              append($$anchor5, text_10);
            };
            var alternate_5 = ($$anchor5) => {
              var fragment_10 = comment();
              var node_12 = first_child(fragment_10);
              {
                var consequent_8 = ($$anchor6) => {
                  var text_11 = text();
                  template_effect(
                    ($0) => set_text(text_11, `${get(item).label ?? ""}: ${$0 ?? ""}
                                            IOTA`),
                    [
                      () => nanoToIota(get(item).data?.content.fields?.principal)
                    ]
                  );
                  append($$anchor6, text_11);
                };
                var alternate_4 = ($$anchor6) => {
                  var fragment_12 = comment();
                  var node_13 = first_child(fragment_12);
                  {
                    var consequent_9 = ($$anchor7) => {
                      var text_12 = text();
                      template_effect(($0) => set_text(text_12, `${get(item).label ?? ""}: ${$0 ?? ""} IOTA`), [
                        () => nanoToIota(get(item).data.content.fields.staked_iota.fields.principal)
                      ]);
                      append($$anchor7, text_12);
                    };
                    var alternate_3 = ($$anchor7) => {
                      var text_13 = text();
                      template_effect(() => set_text(text_13, get(item).label));
                      append($$anchor7, text_13);
                    };
                    if_block(
                      node_13,
                      ($$render) => {
                        if (get(item).label == "TimelockedStakedIota") $$render(consequent_9);
                        else $$render(alternate_3, false);
                      },
                      true
                    );
                  }
                  append($$anchor6, fragment_12);
                };
                if_block(
                  node_12,
                  ($$render) => {
                    if (get(item).label == "StakedIota") $$render(consequent_8);
                    else $$render(alternate_4, false);
                  },
                  true
                );
              }
              append($$anchor5, fragment_10);
            };
            if_block(node_11, ($$render) => {
              if (get(item).label.startsWith("Coin<0x2::iota::IOTA>")) $$render(consequent_7);
              else $$render(alternate_5, false);
            });
          }
          var node_14 = sibling(span_1, 2);
          {
            var consequent_10 = ($$anchor5) => {
              var div_12 = root_21();
              var text_14 = child(div_12);
              template_effect(($0) => set_text(text_14, `from: ${$0 ?? ""}`), [
                () => get(item).currentOwner.slice(0, 6) + "..." + get(item).currentOwner.slice(-4)
              ]);
              append($$anchor5, div_12);
            };
            if_block(node_14, ($$render) => {
              if (get(account).address !== get(item).currentOwner) $$render(consequent_10);
            });
          }
          var div_13 = sibling(div_11, 2);
          var details_2 = child(div_13);
          var pre_1 = sibling(child(details_2), 2);
          var text_15 = child(pre_1);
          template_effect(
            ($0) => set_text(text_15, `
                                        ${$0 ?? ""}
                                    `),
            [() => "\n" + JSON.stringify(get(item), null, 2)]
          );
          append($$anchor4, fragment_8);
        });
        append($$anchor3, details_1);
      };
      if_block(node_9, ($$render) => {
        if (get(account).timelockedObjects.length != 0) $$render(consequent_11);
      });
    }
    action(div_6, ($$node, $$action_arg) => dragHandleZone?.($$node, $$action_arg), () => ({ items: get(account).objects, flipDurationMs: 200 }));
    template_effect(
      ($0, $1) => {
        set_text(text_2, `${$0 ?? ""}: ${$1 ?? ""}`);
        set_text(text_3, `Owned objects (${get(account).objects.length ?? ""}):`);
        set_class(div_6, 1, clsx(get(account).id), "svelte-197n9ug");
      },
      [
        () => get(account).label || get(account).address.slice(0, 6) + "..." + get(account).address.slice(-4),
        () => get(account).objects.reduce(
          (acc, obj) => {
            let amountToAdd = 0;
            if (obj.data.content.fields?.balance) {
              amountToAdd = Number(nanoToIota(obj.data.content.fields.balance));
            } else if (obj.data.content.fields?.principal) {
              amountToAdd = Number(nanoToIota(obj.data.content.fields.principal));
            }
            return acc + amountToAdd;
          },
          0
        ) + get(account).timelockedObjects.reduce(
          (acc, obj) => {
            let amountToAdd = 0;
            if (obj.data.content.fields?.locked) {
              amountToAdd = Number(nanoToIota(obj.data.content.fields?.locked));
            } else if (obj.data.content.fields?.staked_iota?.fields?.principal) {
              amountToAdd = Number(nanoToIota(obj.data.content.fields.staked_iota.fields.principal));
            }
            return acc + amountToAdd;
          },
          0
        ) + " IOTA"
      ]
    );
    event("consider", div_6, handleDnd);
    event("finalize", div_6, handleDnd);
    append($$anchor2, div_3);
  });
  template_effect(() => set_text(text_1, `Balance of all accounts: ${get(allAccountsTotalBalance) ?? ""} IOTA`));
  bind_value(input, () => get(newAccountAddress), ($$value) => set(newAccountAddress, $$value));
  append($$anchor, main);
  pop();
  $$cleanup();
}
delegate(["click"]);
export {
  MultiAccountView as default
};
