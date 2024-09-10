export interface DraggableOptions {
    initialPosition?: {
        x?: string;
        y?: string;
    };
    shouldSave?: boolean;
    onDragStart?: (element: HTMLElement) => void;
    onDrag?: (element: HTMLElement) => void;
    onDragEnd?: (element: HTMLElement) => void;
    dragArea?: HTMLElement;
    lockAxis?: 'x' | 'y';
    edgeBuffer?: number;
    gridSize?: number;
    mode?: 'screen' | 'page' | 'container';
    snapMode?: 'none' | 'auto' | 'right' | 'left' | 'top' | 'bottom';
}
