import { Draggable } from './draggable';
import { MobileDraggable } from './mobileDraggable';
import { DraggableOptions } from './types';
export declare function createDraggable(elementId: string, options?: DraggableOptions): Draggable | MobileDraggable | null;
