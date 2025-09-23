import { DraggableOptions } from './types';
import { savePosition, restorePosition } from './utils';

export class MobileDraggable {
  element: HTMLElement;
  shouldSave: boolean;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  diffX: number;
  diffY: number;
  touchMoveHandler: ((event: TouchEvent) => void) | null;
  touchEndHandler: ((event: TouchEvent) => void) | null;
  observerElement: MutationObserver | null;
  config: DraggableOptions;
  initialPosition: { x: string; y: string };
  startX: number;
  startY: number;
  dragThreshold: number;
  isDragging: boolean;

  constructor(element: HTMLElement, options: DraggableOptions = {}) {
    this.element = element;
    this.shouldSave = options.shouldSave || false;
    this.minX = 0;
    this.minY = 0;
    this.maxX = window.innerWidth - element.offsetWidth;
    this.maxY = window.innerHeight - element.offsetHeight;
    this.diffX = 0;
    this.diffY = 0;
    this.touchMoveHandler = null;
    this.touchEndHandler = null;
    this.observerElement = null;
    this.config = { ...MobileDraggable.defaultOptions, ...options };
    this.initialPosition = {
      x: options.initialPosition?.x || '0px',
      y: options.initialPosition?.y || '0px',
    };
    this.startX = 0;
    this.startY = 0;
    this.dragThreshold = 5; // 判定为拖动的最小移动距离
    this.isDragging = false;

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

  // 统一获取坐标的方法
  private getEventCoordinates(event: TouchEvent): { x: number; y: number } {
    if (event.touches && event.touches.length > 0) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    // 如果没有 touches，尝试使用 changedTouches（在 touchend 事件中）
    if (event.changedTouches && event.changedTouches.length > 0) {
      return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }
    return { x: 0, y: 0 };
  }

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

  onTouchStart(event: TouchEvent): void {
    // 只处理单点触摸
    if (event.touches.length !== 1) {
      return;
    }

    // 防止页面滚动和其他默认行为
    event.preventDefault();
    event.stopPropagation();

    const coords = this.getEventCoordinates(event);
    this.startX = coords.x;
    this.startY = coords.y;

    this.diffX = coords.x - this.element.offsetLeft;
    this.diffY = coords.y - this.element.offsetTop;

    this.isDragging = false;

    // 禁用 iframe 的指针事件，防止拖拽时出现问题
    const iframes = document.getElementsByTagName('iframe');
    for (const iframe of iframes) {
      iframe.style.pointerEvents = 'none';
    }

    this.touchMoveHandler = this.onTouchMove.bind(this);
    this.touchEndHandler = this.onTouchEnd.bind(this);

    document.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
    document.addEventListener('touchend', this.touchEndHandler, { passive: false });
    document.addEventListener('touchcancel', this.touchEndHandler, { passive: false });

    if (this.config.onDragStart) this.config.onDragStart(this.element);
  }

  onTouchMove(event: TouchEvent): void {
    // 只处理单点触摸
    if (event.touches.length !== 1) {
      return;
    }

    event.preventDefault();

    const coords = this.getEventCoordinates(event);
    
    // 检查是否超过拖拽阈值
    const moveX = Math.abs(coords.x - this.startX);
    const moveY = Math.abs(coords.y - this.startY);
    
    if (!this.isDragging && (moveX > this.dragThreshold || moveY > this.dragThreshold)) {
      this.isDragging = true;
    }

    if (!this.isDragging) {
      return;
    }

    let newX = coords.x - this.diffX;
    let newY = coords.y - this.diffY;

    // 轴锁定
    if (this.config.lockAxis === 'x') {
      newY = this.element.offsetTop;
    } else if (this.config.lockAxis === 'y') {
      newX = this.element.offsetLeft;
    }
    
    // 更新边界
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

    // 边界限制
    if (newX < this.minX - edgeBuffer) newX = this.minX - edgeBuffer;
    if (newX > this.maxX + edgeBuffer) newX = this.maxX + edgeBuffer;

    if (newY < this.minY - edgeBuffer) newY = this.minY - edgeBuffer;
    if (newY > this.maxY + edgeBuffer) newY = this.maxY + edgeBuffer;

    // 网格对齐
    if (this.config.gridSize) {
      const gridSize = this.config.gridSize || 1;
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;

    if (this.config.onDrag) this.config.onDrag(this.element);
  }

  stopPreventEvent(event: TouchEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  disableClickEvent(): void {
    this.element.addEventListener(
      'click',
      this.stopPreventEvent as any,
      true
    );

    setTimeout(() => {
      this.element.removeEventListener('click', this.stopPreventEvent as any, true);
    }, 0);
  }

  onTouchEnd(event: TouchEvent): void {
    const coords = this.getEventCoordinates(event);
    const moveX = Math.abs(coords.x - this.startX);
    const moveY = Math.abs(coords.y - this.startY);

    if (this.isDragging || moveX > this.dragThreshold || moveY > this.dragThreshold) {
      this.disableClickEvent();
    }

    // 自动吸附逻辑
    if (this.config.snapMode && this.config.snapMode !== 'none' && this.isDragging) {
      const snapBuffer = this.config.edgeBuffer || 0;
      const elementRect = this.element.getBoundingClientRect();

      let viewportWidth, viewportHeight;
      
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
      } else {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
      }
  
      const distanceToLeft = this.element.offsetLeft;
      const distanceToRight = viewportWidth - (this.element.offsetLeft + elementRect.width);
      const distanceToTop = this.element.offsetTop;
      const distanceToBottom = viewportHeight - (this.element.offsetTop + elementRect.height);
  
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
          this.element.style.left = `${viewportWidth - elementRect.width - snapBuffer}px`;
        } else if (minDistance === distanceToTop) {
          this.element.style.top = `${snapBuffer}px`;
        } else if (minDistance === distanceToBottom) {
          this.element.style.top = `${viewportHeight - elementRect.height - snapBuffer}px`;
        }
      } else if (this.config.snapMode === 'right') {
        this.element.style.left = `${viewportWidth - elementRect.width - snapBuffer}px`;
      } else if (this.config.snapMode === 'left') {
        this.element.style.left = `${snapBuffer}px`;
      } else if (this.config.snapMode === 'top') {
        this.element.style.top = `${snapBuffer}px`;
      } else if (this.config.snapMode === 'bottom') {
        this.element.style.top = `${viewportHeight - elementRect.height - snapBuffer}px`;
      }
    }
  
    // 恢复 iframe 的指针事件
    const iframes = document.getElementsByTagName('iframe');
    for (const iframe of iframes) {
      iframe.style.pointerEvents = '';
    }
  
    this.savePosition();
    
    // 移除事件监听器
    if (this.touchMoveHandler) {
      document.removeEventListener('touchmove', this.touchMoveHandler);
      this.touchMoveHandler = null;
    }
    
    if (this.touchEndHandler) {
      document.removeEventListener('touchend', this.touchEndHandler);
      document.removeEventListener('touchcancel', this.touchEndHandler);
      this.touchEndHandler = null;
    }

    this.isDragging = false;
  
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

  // 检测是否为移动设备
  static isMobileDevice(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0)
    );
  }

  init(): void {
    // 设置初始位置
    this.restorePosition();
    this.element.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    window.addEventListener('resize', this.updateBounds.bind(this));
    this.updateBounds();
    this.observeElementVisibility(this.element);
  }

  destroy(): void {
    try {
      // 移除元素上的 touchstart 事件监听器
      this.element.removeEventListener('touchstart', this.onTouchStart.bind(this));

      // 如果触摸移动和触摸结束事件仍在监听，移除这些监听器
      if (this.touchMoveHandler) {
        document.removeEventListener('touchmove', this.touchMoveHandler);
        this.touchMoveHandler = null;
      }

      if (this.touchEndHandler) {
        document.removeEventListener('touchend', this.touchEndHandler);
        document.removeEventListener('touchcancel', this.touchEndHandler);
        this.touchEndHandler = null;
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
