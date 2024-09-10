const StorageKey = 'SailingDraggablePositions';

export function savePosition(element: HTMLElement, shouldSave: boolean): void {
    if (!shouldSave) return;

    const savedPositions = JSON.parse(localStorage.getItem(StorageKey) || '{}');
    
    const key = element.id;
    const position = {
      left: element.style.left,
      top: element.style.top,
    };
    
    savedPositions[key] = position;
    localStorage.setItem(StorageKey, JSON.stringify(savedPositions));
}
  
export function restorePosition(element: HTMLElement, shouldSave: boolean, options:any): void {
    if (!shouldSave) {
        element.style.left = options.initialPosition.x;
        element.style.top = options.initialPosition.y;
    } else {
        const savedPositions = JSON.parse(localStorage.getItem(StorageKey) || '{}');

        const key = element.id;
        if (savedPositions[key]) {
            const position = savedPositions[key];
            element.style.left = position.left || '0px';
            element.style.top = position.top || '0px';
        } else {
            element.style.left = options.initialPosition.x;
            element.style.top = options.initialPosition.y;
        }
    }
    
}
  