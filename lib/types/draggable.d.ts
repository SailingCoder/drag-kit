import { DraggableOptions } from './types';
export declare class Draggable {
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
    initialPosition: {
        x: string;
        y: string;
    };
    constructor(element: HTMLElement, options?: DraggableOptions);
    static defaultOptions: DraggableOptions;
    updateBounds(): void;
    onMouseDown(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onMouseUp(): void;
    savePosition(): void;
    restorePosition(): void;
    observeElementVisibility(element: HTMLElement): void;
    init(): void;
    destroy(): void;
}
