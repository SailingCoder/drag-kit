export interface DraggableOptions {
  initialPosition?: { x?: string; y?: string };
  shouldSave?: boolean;
  onDragStart?: (element: HTMLElement) => void;
  onDrag?: (element: HTMLElement) => void;
  onDragEnd?: (element: HTMLElement) => void;
  dragArea?: HTMLElement;
  lockAxis?: 'x' | 'y';
  edgeBuffer?: number;
  gridSize?: number;
  mode?: 'viewport' | 'fixed' | 'restricted';
  snapMode?: 'none' | 'auto' | 'right' | 'left' | 'top' | 'bottom';
}

interface Draggable {
  element: HTMLElement;
  shouldSave: boolean;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  diffX: number;
  diffY: number;
  mouseMoveHandler: ((event: MouseEvent) => void) | null;
  mouseUpHandler: (() => void) | null;

  updateBounds(): void;
  savePosition(): void;
  restorePosition(): void;
  onMouseDown(event: MouseEvent): void;
  onMouseMove(event: MouseEvent): void;
  onMouseUp(): void;
  init(): void;
}

export function createDraggable(elementId: string, options: DraggableOptions = {}): Draggable | null {
  const element = document.getElementById(elementId) as HTMLElement;

  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return null;
  }

  if (window.self !== window.top) {
    console.warn('Draggable is disabled inside iframes.');
    element.remove();
    return null;
  } else {
    element.style.display = 'block';
  }

  if (element.dataset.draggableInitialized) {
    console.warn(`Element with id ${elementId} is already draggable.`);
    return null;
  }
  element.dataset.draggableInitialized = 'true';

  // 设置初始位置
  const initialX = options.initialPosition?.x || '0px';
  const initialY = options.initialPosition?.y || '0px';
  element.style.left = initialX;
  element.style.top = initialY;
  console.log('initialX', initialX, 'initialY', initialY);

  const defaultOptions: DraggableOptions = {
    shouldSave: false,
    onDragStart: undefined,
    onDrag: undefined,
    onDragEnd: undefined,
    dragArea: undefined,
    lockAxis: undefined,
    edgeBuffer: 0,
    gridSize: undefined,
    mode: 'viewport',
    snapMode: 'none'
  };

  const config = { ...defaultOptions, ...options };

  const draggable: Draggable = {
    element,
    shouldSave: config.shouldSave || false,
    minX: 0,
    minY: 0,
    maxX: window.innerWidth - element.offsetWidth,
    maxY: window.innerHeight - element.offsetHeight,
    diffX: 0,
    diffY: 0,
    mouseMoveHandler: null,
    mouseUpHandler: null,

    updateBounds() {
      if (config.dragArea) {
        config.dragArea.style.position = 'relative';
        this.element.style.position = 'absolute';
        const { width, height } = config.dragArea.getBoundingClientRect();
        this.maxX = width - this.element.offsetWidth;
        this.maxY = height - this.element.offsetHeight;
      } else if (config.mode === 'viewport') {
        this.element.style.position = 'fixed';
        this.maxX = window.innerWidth - this.element.offsetWidth;
        this.maxY = window.innerHeight - this.element.offsetHeight;
      } else if (config.mode === 'fixed') {
        this.element.style.position = 'absolute';
        this.maxX = window.innerWidth - this.element.offsetWidth;
        this.maxY = window.innerHeight - this.element.offsetHeight;
      }
    },

    savePosition() {
      if (this.shouldSave) {
        const position = {
          left: this.element.style.left,
          top: this.element.style.top
        };
        localStorage.setItem(
          `SailingDraggable${this.element.id}`,
          JSON.stringify(position)
        );
      }
    },

    restorePosition() {
      if (this.shouldSave) {
        const savedPosition = localStorage.getItem(
          `SailingDraggable${this.element.id}`
        );
        if (savedPosition) {
          const position = JSON.parse(savedPosition);
          this.element.style.left = position.left || '0px';
          this.element.style.top = position.top || '0px';
        }
      }
    },

    onMouseDown(event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();

      this.diffX = event.clientX - this.element.offsetLeft;
      this.diffY = event.clientY - this.element.offsetTop;

      const iframes = document.getElementsByTagName('iframe');
      for (const iframe of iframes) {
        iframe.style.pointerEvents = 'none';
      }

      if (typeof this.element.setCapture !== 'undefined') {
        this.element.setCapture();
      }

      this.mouseMoveHandler = this.onMouseMove.bind(this);
      this.mouseUpHandler = this.onMouseUp.bind(this);

      document.addEventListener('mousemove', this.mouseMoveHandler);
      document.addEventListener('mouseup', this.mouseUpHandler);

      if (config.onDragStart) config.onDragStart(this.element);
    },

    onMouseMove(event: MouseEvent) {
      event.preventDefault();

      let moveX = event.clientX - this.diffX;
      let moveY = event.clientY - this.diffY;

      if (config.lockAxis === 'x') {
        moveY = this.element.offsetTop;
      } else if (config.lockAxis === 'y') {
        moveX = this.element.offsetLeft;
      }

      if (config.mode === 'restricted' && config.dragArea) {
        this.updateBounds();
      } else if (config.mode === 'viewport') {
        this.maxX = window.innerWidth - this.element.offsetWidth;
        this.maxY = window.innerHeight - this.element.offsetHeight;
      }

      const edgeBuffer = config.edgeBuffer || 0;

      if (moveX < this.minX - edgeBuffer) moveX = this.minX - edgeBuffer;
      if (moveX > this.maxX + edgeBuffer) moveX = this.maxX + edgeBuffer;

      if (moveY < this.minY - edgeBuffer) moveY = this.minY - edgeBuffer;
      if (moveY > this.maxY + edgeBuffer) moveY = this.maxY + edgeBuffer;

      if (config.gridSize) {
        const gridSize = config.gridSize || 1;
        moveX = Math.round(moveX / gridSize) * gridSize;
        moveY = Math.round(moveY / gridSize) * gridSize;
      }

      this.element.style.left = `${moveX}px`;
      this.element.style.top = `${moveY}px`;

      if (config.onDrag) config.onDrag(this.element);
    },

    onMouseUp() {
      if (config.snapMode && config.snapMode !== 'none') {
        const snapBuffer = config.edgeBuffer || 0;
        const elementRect = this.element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const distanceToLeft = this.element.offsetLeft;
        const distanceToRight =
          viewportWidth - (this.element.offsetLeft + elementRect.width);
        const distanceToTop = this.element.offsetTop;
        const distanceToBottom =
          viewportHeight - (this.element.offsetTop + elementRect.height);

        if (config.snapMode === 'auto') {
          const minDistance = Math.min(
            distanceToLeft,
            distanceToRight,
            distanceToTop,
            distanceToBottom
          );
          if (minDistance === distanceToLeft) {
            this.element.style.left = `${snapBuffer}px`;
          } else if (minDistance === distanceToRight) {
            this.element.style.left = `${viewportWidth -
              elementRect.width -
              snapBuffer}px`;
          } else if (minDistance === distanceToTop) {
            this.element.style.top = `${snapBuffer}px`;
          } else if (minDistance === distanceToBottom) {
            this.element.style.top = `${viewportHeight -
              elementRect.height -
              snapBuffer}px`;
          }
        } else if (config.snapMode === 'right') {
          this.element.style.left = `${viewportWidth -
            elementRect.width -
            snapBuffer}px`;
        } else if (config.snapMode === 'left') {
          this.element.style.left = `${snapBuffer}px`;
        } else if (config.snapMode === 'top') {
          this.element.style.top = `${snapBuffer}px`;
        } else if (config.snapMode === 'bottom') {
          this.element.style.top = `${viewportHeight -
            elementRect.height -
            snapBuffer}px`;
        }
      }

      const iframes = document.getElementsByTagName('iframe');
      for (const iframe of iframes) {
        iframe.style.pointerEvents = '';
      }

      this.savePosition();
      document.removeEventListener('mousemove', this.mouseMoveHandler as EventListener);
      document.removeEventListener('mouseup', this.mouseUpHandler as EventListener);
      if (typeof this.element.releaseCapture !== 'undefined') {
        this.element.releaseCapture();
      }

      if (config.onDragEnd) config.onDragEnd(this.element);
    },

    init() {
      this.restorePosition();
      this.element.onmousedown = this.onMouseDown.bind(this);
      window.addEventListener('resize', this.updateBounds.bind(this));
      this.updateBounds();
    }
  };

  draggable.init();
  return draggable;
}
