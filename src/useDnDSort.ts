import React from 'react';

const { useState, useRef } = React;

const isHover = (event: MouseEvent, element: HTMLElement): boolean => {
  const clientX = event.clientX;
  const clientY = event.clientY;

  const rect = element.getBoundingClientRect();

  return (
    clientY < rect.bottom &&
    clientY > rect.top &&
    clientX < rect.right &&
    clientX > rect.left
  );
};

interface Position {
  x: number;
  y: number;
}

// ドラック＆ドロップ要素の情報をまとめた型
interface DnDItem<T> {
  value: T; // useDnDSort()の引数に渡れた配列の要素の値
  key: string; // 要素と紐付いた一意な文字列
  position: Position; //要素の座標
  element: HTMLElement; //DOM情報
}

interface DnDRef<T> {
  keys: Map<T, string>; // 要素に紐付いたkey文字列を管理するMap
  dndItems: DnDItem<T>[]; // 並び替えるすべての要素を保存するための配列
  canCheckHovered: boolean; // 重なり判定ができるかのフラグ
  pointerPosition: Position; // マウスポインターの座標
  dragElement: DnDItem<T> | null; //ドラッグしている要素
}

interface DnDSortResult<T> {
  key: string;
  value: T;
  events: {
    ref: (element: HTMLElement | null) => void;
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  };
}

export const useDnDSort = <T>(defaultItems: T[]): DnDSortResult<T>[] => {
  const [items, setItems] = useState(defaultItems);

  // 状態をrefで管理する

  const state = useRef<DnDRef<T>>({
    dndItems: [],
    keys: new Map(),
    dragElement: null,
    canCheckHovered: true,
    pointerPosition: { x: 0, y: 0 },
  }).current;

  const onMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { dndItems, dragElement, pointerPosition } = state;

    if (!dragElement) return;

    const x = clientX - pointerPosition.x;
    const y = clientY - pointerPosition.y;

    const dragStyle = dragElement.element.style;

    dragStyle.zIndex = '100';
    dragStyle.cursor = 'grabbing';
    dragStyle.transform = `translate(${x}px,${y}px)`;

    if (!state.canCheckHovered) return;

    state.canCheckHovered = false;

    setTimeout(() => (state.canCheckHovered = true), 300);

    const dragIndex = dndItems.findIndex(({ key }) => key === dragElement.key);

    const hovererdIndex = dndItems.findIndex(
      ({ element }, index) => index !== dragIndex && isHover(event, element)
    );

    if (hovererdIndex !== -1) {
      state.pointerPosition.x = clientX;
      state.pointerPosition.y = clientY;

      dndItems.splice(dragIndex, 1);
      dndItems.splice(hovererdIndex, 0, dragElement);

      const { left: x, top: y } = dragElement.element.getBoundingClientRect();

      dragElement.position = { x, y };
      setItems(dndItems.map((v) => v.value));
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    const { dragElement } = state;

    if (!dragElement) return;

    const dragStyle = dragElement.element.style;

    dragStyle.zIndex = '';
    dragStyle.cursor = '';
    dragStyle.transform = '';

    state.dragElement = null;

    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
  };

  return items.map(
    (value: T): DnDSortResult<T> => {
      const key = state.keys.get(value) || Math.random().toString(16);
      state.keys.set(value, key);

      return {
        value,
        key,
        events: {
          ref: (element: HTMLElement | null) => {
            if (!element) return;
            const { dndItems, dragElement, pointerPosition } = state;

            element.style.transform = '';

            const { left: x, top: y } = element.getBoundingClientRect();
            const position: Position = { x, y };
            const itemIndex = dndItems.findIndex((item) => item.key === key);

            if (itemIndex === -1) {
              return dndItems.push({ key, value, element, position });
            }

            if (dragElement?.key === key) {
              const dragX = dragElement.position.x - position.x;
              const dragY = dragElement.position.y - position.y;

              element.style.transform = `translate(${dragX}px,${dragY}px`;

              pointerPosition.x -= dragX;
              pointerPosition.y -= dragY;
            }

            if (dragElement?.key !== key) {
              const item = dndItems[itemIndex];

              const x = item.position.x - position.x;
              const y = item.position.y - position.y;

              element.style.transition = '';
              element.style.transform = `translate(${x}px,${y}px)`;

              requestAnimationFrame(() => {
                element.style.transform = '';
                element.style.transition = 'all 300ms';
              });
            }

            state.dndItems[itemIndex] = { key, value, element, position };
          },
          //   onMouseDown: () => void 0,
          onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
            const element = event.currentTarget;

            state.pointerPosition.x = event.clientX;
            state.pointerPosition.y = event.clientY;

            element.style.transition = '';
            element.style.cursor = 'grabbing';

            const { left: x, top: y } = element.getBoundingClientRect();
            const position: Position = { x, y };

            state.dragElement = { key, value, element, position };

            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('mousemove', onMouseMove);
          },
        },
      };
    }
  );
};
