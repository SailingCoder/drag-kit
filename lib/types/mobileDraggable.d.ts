import { DraggableOptions } from './types';

export declare class MobileDraggable {
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
    initialPosition: {
        x: string;
        y: string;
    };
    startX: number;
    startY: number;
    dragThreshold: number;
    isDragging: boolean;
    
    static defaultOptions: DraggableOptions;
    
    constructor(element: HTMLElement, options?: DraggableOptions);
    
    private getEventCoordinates(event: TouchEvent): {
        x: number;
        y: number;
    };
    
    updateBounds(): void;
    onTouchStart(event: TouchEvent): void;
    onTouchMove(event: TouchEvent): void;
    onTouchEnd(event: TouchEvent): void;
    stopPreventEvent(event: TouchEvent): void;
    disableClickEvent(): void;
    savePosition(): void;
    restorePosition(): void;
    observeElementVisibility(element: HTMLElement): void;
    
    static isMobileDevice(): boolean;
    
    init(): void;
    destroy(): void;
}
