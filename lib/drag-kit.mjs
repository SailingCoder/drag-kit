var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const StorageKey = "SailingDraggablePositions";
function savePosition(element, shouldSave) {
  if (!shouldSave)
    return;
  const savedPositions = JSON.parse(localStorage.getItem(StorageKey) || "{}");
  const key = element.id;
  const position = {
    left: element.style.left,
    top: element.style.top
  };
  savedPositions[key] = position;
  localStorage.setItem(StorageKey, JSON.stringify(savedPositions));
}
function restorePosition(element, shouldSave, options) {
  if (!shouldSave) {
    element.style.left = options.initialPosition.x;
    element.style.top = options.initialPosition.y;
  } else {
    const savedPositions = JSON.parse(localStorage.getItem(StorageKey) || "{}");
    const key = element.id;
    if (savedPositions[key]) {
      const position = savedPositions[key];
      element.style.left = position.left || "0px";
      element.style.top = position.top || "0px";
    } else {
      element.style.left = options.initialPosition.x;
      element.style.top = options.initialPosition.y;
    }
  }
}
const _Draggable = class _Draggable {
  constructor(element, options = {}) {
    __publicField(this, "element");
    __publicField(this, "shouldSave");
    __publicField(this, "minX");
    __publicField(this, "minY");
    __publicField(this, "maxX");
    __publicField(this, "maxY");
    __publicField(this, "diffX");
    __publicField(this, "diffY");
    __publicField(this, "mouseMoveHandler");
    __publicField(this, "mouseUpHandler");
    __publicField(this, "observerElement");
    __publicField(this, "config");
    __publicField(this, "initialPosition");
    var _a, _b;
    this.element = element;
    this.shouldSave = options.shouldSave || false;
    this.minX = 0;
    this.minY = 0;
    this.maxX = window.innerWidth - element.offsetWidth;
    this.maxY = window.innerHeight - element.offsetHeight;
    this.diffX = 0;
    this.diffY = 0;
    this.mouseMoveHandler = null;
    this.mouseUpHandler = null;
    this.observerElement = null;
    this.config = { ..._Draggable.defaultOptions, ...options };
    this.initialPosition = {
      x: ((_a = options.initialPosition) == null ? void 0 : _a.x) || "0px",
      y: ((_b = options.initialPosition) == null ? void 0 : _b.y) || "0px"
    };
    this.init();
  }
  updateBounds() {
    if (this.config.dragArea) {
      if (getComputedStyle(this.config.dragArea).position === "static") {
        this.config.dragArea.style.position = "relative";
      }
      this.element.style.position = "absolute";
      const { width, height } = this.config.dragArea.getBoundingClientRect();
      this.maxX = width - this.element.offsetWidth;
      this.maxY = height - this.element.offsetHeight;
    } else if (this.config.mode === "screen") {
      this.element.style.position = "fixed";
      this.maxX = window.innerWidth - this.element.offsetWidth;
      this.maxY = window.innerHeight - this.element.offsetHeight;
    } else if (this.config.mode === "page") {
      this.element.style.position = "absolute";
      this.maxX = document.documentElement.scrollWidth - this.element.offsetWidth;
      this.maxY = document.documentElement.scrollHeight - this.element.offsetHeight;
    }
  }
  onMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.diffX = event.clientX - this.element.offsetLeft;
    this.diffY = event.clientY - this.element.offsetTop;
    const iframes = document.getElementsByTagName("iframe");
    for (const iframe of iframes) {
      iframe.style.pointerEvents = "none";
    }
    if (typeof this.element.setCapture !== "undefined") {
      this.element.setCapture();
    }
    this.mouseMoveHandler = this.onMouseMove.bind(this);
    this.mouseUpHandler = this.onMouseUp.bind(this);
    document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
    if (this.config.onDragStart)
      this.config.onDragStart(this.element);
  }
  onMouseMove(event) {
    event.preventDefault();
    let moveX = event.clientX - this.diffX;
    let moveY = event.clientY - this.diffY;
    if (this.config.lockAxis === "x") {
      moveY = this.element.offsetTop;
    } else if (this.config.lockAxis === "y") {
      moveX = this.element.offsetLeft;
    }
    if (this.config.mode === "container" && this.config.dragArea) {
      this.updateBounds();
    } else if (this.config.mode === "screen") {
      this.maxX = window.innerWidth - this.element.offsetWidth;
      this.maxY = window.innerHeight - this.element.offsetHeight;
    } else if (this.config.mode === "page") {
      this.maxX = document.documentElement.scrollWidth - this.element.offsetWidth;
      this.maxY = document.documentElement.scrollHeight - this.element.offsetHeight;
    }
    const edgeBuffer = this.config.edgeBuffer || 0;
    if (moveX < this.minX - edgeBuffer)
      moveX = this.minX - edgeBuffer;
    if (moveX > this.maxX + edgeBuffer)
      moveX = this.maxX + edgeBuffer;
    if (moveY < this.minY - edgeBuffer)
      moveY = this.minY - edgeBuffer;
    if (moveY > this.maxY + edgeBuffer)
      moveY = this.maxY + edgeBuffer;
    if (this.config.gridSize) {
      const gridSize = this.config.gridSize || 1;
      moveX = Math.round(moveX / gridSize) * gridSize;
      moveY = Math.round(moveY / gridSize) * gridSize;
    }
    this.element.style.left = `${moveX}px`;
    this.element.style.top = `${moveY}px`;
    if (this.config.onDrag)
      this.config.onDrag(this.element);
  }
  onMouseUp() {
    if (this.config.snapMode && this.config.snapMode !== "none") {
      const snapBuffer = this.config.edgeBuffer || 0;
      const elementRect = this.element.getBoundingClientRect();
      let viewportWidth, viewportHeight;
      if (this.config.mode === "screen") {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
      } else if (this.config.mode === "page") {
        viewportWidth = document.documentElement.scrollWidth;
        viewportHeight = document.documentElement.scrollHeight;
      } else if (this.config.mode === "container" && this.config.dragArea) {
        const dragAreaRect = this.config.dragArea.getBoundingClientRect();
        viewportWidth = dragAreaRect.width;
        viewportHeight = dragAreaRect.height;
      } else {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
      }
      const distanceToLeft = this.element.offsetLeft;
      const distanceToRight = viewportWidth - (this.element.offsetLeft + elementRect.width);
      const distanceToTop = this.element.offsetTop;
      const distanceToBottom = viewportHeight - (this.element.offsetTop + elementRect.height);
      if (this.config.snapMode === "auto") {
        const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
        if (minDistance === distanceToLeft) {
          this.element.style.left = `${snapBuffer}px`;
        } else if (minDistance === distanceToRight) {
          this.element.style.left = `${viewportWidth - elementRect.width - snapBuffer}px`;
        } else if (minDistance === distanceToTop) {
          this.element.style.top = `${snapBuffer}px`;
        } else if (minDistance === distanceToBottom) {
          this.element.style.top = `${viewportHeight - elementRect.height - snapBuffer}px`;
        }
      } else if (this.config.snapMode === "right") {
        this.element.style.left = `${viewportWidth - elementRect.width - snapBuffer}px`;
      } else if (this.config.snapMode === "left") {
        this.element.style.left = `${snapBuffer}px`;
      } else if (this.config.snapMode === "top") {
        this.element.style.top = `${snapBuffer}px`;
      } else if (this.config.snapMode === "bottom") {
        this.element.style.top = `${viewportHeight - elementRect.height - snapBuffer}px`;
      }
    }
    const iframes = document.getElementsByTagName("iframe");
    for (const iframe of iframes) {
      iframe.style.pointerEvents = "";
    }
    this.savePosition();
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
    if (typeof this.element.releaseCapture !== "undefined") {
      this.element.releaseCapture();
    }
    if (this.config.onDragEnd)
      this.config.onDragEnd(this.element);
  }
  savePosition() {
    if (!this.shouldSave)
      return;
    savePosition(this.element, this.shouldSave);
  }
  restorePosition() {
    restorePosition(this.element, this.shouldSave, { initialPosition: this.initialPosition });
  }
  // 解决vue、React等框架中，重复渲染导致的元素 display 属性被修改的问题
  observeElementVisibility(element) {
    this.observerElement = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "style" && element.style.display === "none") {
          element.style.display = "block";
        }
      });
    });
    this.observerElement.observe(element, {
      attributes: true,
      attributeFilter: ["style"]
    });
  }
  init() {
    this.restorePosition();
    this.element.onmousedown = this.onMouseDown.bind(this);
    window.addEventListener("resize", this.updateBounds.bind(this));
    this.updateBounds();
    this.observeElementVisibility(this.element);
  }
  destroy() {
    try {
      this.element.onmousedown = null;
      if (this.mouseMoveHandler) {
        document.removeEventListener("mousemove", this.mouseMoveHandler);
        this.mouseMoveHandler = null;
      }
      if (this.mouseUpHandler) {
        document.removeEventListener("mouseup", this.mouseUpHandler);
        this.mouseUpHandler = null;
      }
      window.removeEventListener("resize", this.updateBounds);
      if (this.observerElement) {
        this.observerElement.disconnect();
        this.observerElement = null;
      }
    } catch (error) {
      console.warn("Error in destroy method:", error);
    }
  }
};
__publicField(_Draggable, "defaultOptions", {
  shouldSave: false,
  onDragStart: void 0,
  onDrag: void 0,
  onDragEnd: void 0,
  dragArea: void 0,
  lockAxis: void 0,
  edgeBuffer: 0,
  gridSize: void 0,
  mode: "screen",
  snapMode: "none"
});
let Draggable = _Draggable;
function createDraggable(elementId, options = {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return null;
  }
  if (getComputedStyle(element).display !== "none") {
    console.error(`Element with id ${elementId} is visible. It's recommended to set display: none for proper initial positioning.`);
  }
  if (options.mode && !["screen", "page", "container"].includes(options.mode)) {
    console.error('Invalid mode option. Valid options are "screen", "page", or "container".');
    return null;
  }
  if (options.mode === "container" && !options.dragArea || options.dragArea && options.mode !== "container") {
    console.error("Draggable container requires a dragArea option.");
    return null;
  }
  if (window.self !== window.top) {
    console.warn("Draggable is disabled inside iframes.");
    element.remove();
    return null;
  } else {
    if (getComputedStyle(element).display === "none") {
      element.style.display = "block";
    }
  }
  if (element.dataset.draggableInitialized) {
    console.warn(`Element with id ${elementId} is already draggable.`);
    return null;
  }
  element.dataset.draggableInitialized = "true";
  return new Draggable(element, options);
}
export {
  createDraggable
};
