import { DraggableOptions } from './types';
import { savePosition, restorePosition } from './utils';

export class Draggable {
  element: HTMLElement;
  shouldSave: boolean;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  diffX: number;
  diffY: number;
  mouseMoveHandler: ((event: MouseEvent) => void) | null;
  mouseUpHandler: ((event: MouseEvent) => void) | null;
  observerElement: MutationObserver | null;
  config: DraggableOptions;
  initialPosition: { x: string; y: string };

  constructor(element: HTMLElement, options: DraggableOptions = {}) {
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
    this.config = { ...Draggable.defaultOptions, ...options };
    this.initialPosition = {
      x: options.initialPosition?.x || '0px',
      y: options.initialPosition?.y || '0px',
    };

    this.init();
  }

  static defaultOptions: DraggableOptions = {
    shouldSave: false,
    onDragStart: undefined,
    onDrag: undefined,
    onDragEnd: undefined,
    dragArea: undefined,
    lockAxis: undefined,
    edgeBuffer: 0,
    gridSize: undefined,
    mode: 'screen',
    snapMode: 'none',
  };

  updateBounds(): void {
    if (this.config.dragArea) {
      // 判断dragArea中position是否有值，如果没有则设置为relative
      if (getComputedStyle(this.config.dragArea).position === 'static') {
        this.config.dragArea.style.position = 'relative';
      }
      this.element.style.position = 'absolute';
      const { width, height } = this.config.dragArea.getBoundingClientRect();
      this.maxX = width - this.element.offsetWidth;
      this.maxY = height - this.element.offsetHeight;
    } else if (this.config.mode === 'screen') {
      this.element.style.position = 'fixed';
      this.maxX = window.innerWidth - this.element.offsetWidth;
      this.maxY = window.innerHeight - this.element.offsetHeight;
    } else if (this.config.mode === 'page') {
      this.element.style.position = 'absolute';
      this.maxX = document.documentElement.scrollWidth - this.element.offsetWidth;
      this.maxY = document.documentElement.scrollHeight - this.element.offsetHeight;
    }
  }

  onMouseDown(event: MouseEvent): void {
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

    if (this.config.onDragStart) this.config.onDragStart(this.element);
  }

  onMouseMove(event: MouseEvent): void {
    event.preventDefault();

    let moveX = event.clientX - this.diffX;
    let moveY = event.clientY - this.diffY;

    if (this.config.lockAxis === 'x') {
      moveY = this.element.offsetTop;
    } else if (this.config.lockAxis === 'y') {
      moveX = this.element.offsetLeft;
    }
    
    if (this.config.mode === 'container' && this.config.dragArea) {
      this.updateBounds();
    } else if (this.config.mode === 'screen') {
      this.maxX = window.innerWidth - this.element.offsetWidth;
      this.maxY = window.innerHeight - this.element.offsetHeight;
    } else if (this.config.mode === 'page') {
      this.maxX = document.documentElement.scrollWidth - this.element.offsetWidth;
      this.maxY = document.documentElement.scrollHeight - this.element.offsetHeight;
    }

    const edgeBuffer = this.config.edgeBuffer || 0;

    if (moveX < this.minX - edgeBuffer) moveX = this.minX - edgeBuffer;
    if (moveX > this.maxX + edgeBuffer) moveX = this.maxX + edgeBuffer;

    if (moveY < this.minY - edgeBuffer) moveY = this.minY - edgeBuffer;
    if (moveY > this.maxY + edgeBuffer) moveY = this.maxY + edgeBuffer;

    if (this.config.gridSize) {
      const gridSize = this.config.gridSize || 1;
      moveX = Math.round(moveX / gridSize) * gridSize;
      moveY = Math.round(moveY / gridSize) * gridSize;
    }

    this.element.style.left = `${moveX}px`;
    this.element.style.top = `${moveY}px`;

    if (this.config.onDrag) this.config.onDrag(this.element);
  }

  onMouseUp(): void {
    if (this.config.snapMode && this.config.snapMode !== 'none') {
      const snapBuffer = this.config.edgeBuffer || 0;
      const elementRect = this.element.getBoundingClientRect();

      let viewportWidth, viewportHeight;
      // 当 mode 为 screen 时，吸附窗口的边缘；
      // 当 mode 为 page 时，吸附页面内容的边缘（即可以拖动并吸附到页面超出可视范围的部分）；
      // 当 mode 为 container 时，吸附到容器边缘。
      if (this.config.mode === 'screen') {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
      } else if (this.config.mode === 'page') {
        viewportWidth = document.documentElement.scrollWidth;
        viewportHeight = document.documentElement.scrollHeight;
      } else if (this.config.mode === 'container' && this.config.dragArea) {
        const dragAreaRect = this.config.dragArea.getBoundingClientRect();
        viewportWidth = dragAreaRect.width;
        viewportHeight = dragAreaRect.height;
      } else { // 默认为 screen
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
      }
  
      const distanceToLeft = this.element.offsetLeft;
      const distanceToRight =
        viewportWidth - (this.element.offsetLeft + elementRect.width);
      const distanceToTop = this.element.offsetTop;
      const distanceToBottom =
        viewportHeight - (this.element.offsetTop + elementRect.height);
  
      if (this.config.snapMode === 'auto') {
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
      } else if (this.config.snapMode === 'right') {
        this.element.style.left = `${viewportWidth -
          elementRect.width -
          snapBuffer}px`;
      } else if (this.config.snapMode === 'left') {
        this.element.style.left = `${snapBuffer}px`;
      } else if (this.config.snapMode === 'top') {
        this.element.style.top = `${snapBuffer}px`;
      } else if (this.config.snapMode === 'bottom') {
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
  
    if (this.config.onDragEnd) this.config.onDragEnd(this.element);
  }

  savePosition(): void {
    if (!this.shouldSave) return;
    savePosition(this.element, this.shouldSave);
  }

  restorePosition(): void {
    restorePosition(this.element, this.shouldSave, { initialPosition: this.initialPosition });
  }

  // 解决vue、React等框架中，重复渲染导致的元素 display 属性被修改的问题
  observeElementVisibility(element: HTMLElement) {
    this.observerElement = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "style" &&
          element.style.display === "none"
        ) {
          // 恢复为可见
          element.style.display = "block";
        }
      });
    });
  
    this.observerElement.observe(element, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  init(): void {
    // 设置初始位置
    this.restorePosition();
    this.element.onmousedown = this.onMouseDown.bind(this);
    window.addEventListener('resize', this.updateBounds.bind(this));
    this.updateBounds();
    this.observeElementVisibility(this.element);
  }

  destroy(): void {
    try {
      // 移除元素上的 mousedown 事件监听器
      this.element.onmousedown = null;

      // 如果鼠标移动和鼠标松开事件仍在监听，移除这些监听器
      if (this.mouseMoveHandler) {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        this.mouseMoveHandler = null;
      }

      if (this.mouseUpHandler) {
        document.removeEventListener('mouseup', this.mouseUpHandler);
        this.mouseUpHandler = null;
      }

      // 移除窗口的 resize 事件监听器
      window.removeEventListener('resize', this.updateBounds);

      // 如果元素的 display 属性被修改，停止监听这些变化
      if (this.observerElement) {
        this.observerElement.disconnect();
        this.observerElement = null;
      }
    } catch (error) {
      console.warn('Error in destroy method:', error);
    }
  }
}
