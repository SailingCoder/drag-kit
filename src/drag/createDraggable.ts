import { Draggable } from './draggable';
import { DraggableOptions } from './types';

export function createDraggable(elementId: string, options: DraggableOptions = {}): Draggable | null {
  const element = document.getElementById(elementId) as HTMLElement;

  // 如果找不到对应的元素，输出错误信息并返回 null
  if (!element) {
    console.error(`Element with id ${elementId} not found.` );
    return null;
  }

  // mode只能为空或者为'screen'、'page'、'container'中的一个
  if (options.mode && !['screen', 'page', 'container'].includes(options.mode)) {
    console.error('Invalid mode option. Valid options are "screen", "page", or "container".');
    return null;
  }

  // 检查拖拽模式和容器模式是否匹配
  if (options.mode === 'container' && !options.dragArea || options.dragArea && options.mode !== 'container') {
    console.error('Draggable container requires a dragArea option.');
    return null;
  }

  // 拖拽功能在 iframe 内部被禁用
  if (window.self !== window.top) {
    console.warn('Draggable is disabled inside iframes.');
    element.remove();
    return null;
  } else {
    // element.style.display = 'block';
  }

  // 元素已经被初始化为可拖拽的
  if (element.dataset.draggableInitialized) {
    console.warn(`Element with id ${elementId} is already draggable.`);
    return null;
  }
  element.dataset.draggableInitialized = 'true';

  return new Draggable(element, options);
}
