import React from 'react';
import { render } from 'react-dom';

type Style<T extends HTMLElement> = React.HTMLAttributes<T>['style'];

const bodyStyle: Style<HTMLDivElement> = {
  height: '100vh',
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
};

const containerStyle: Style<HTMLDivElement> = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '350px',
  maxHeight: '500px',
};

const imageCardStyle: Style<HTMLDivElement> = {
  cursor: 'grab',
  userSelect: 'none',
  width: '100px',
  height: '130px',
  overflow: 'hidden',
  borderRadius: '5px',
  margin: 3,
};

const imageStyle: Style<HTMLImageElement> = {
  pointerEvents: 'none',
  objectFit: 'cover',
  width: '100%',
  height: '100%',
};

// 並び替えしたい画像URLの配列
const imageList: string[] = [
  'https://images.pexels.com/photos/1830252/pexels-photo-1830252.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/2759658/pexels-photo-2759658.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1743165/pexels-photo-1743165.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/3246665/pexels-photo-3246665.png?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1690351/pexels-photo-1690351.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/2086361/pexels-photo-2086361.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/2088203/pexels-photo-2088203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/5603660/pexels-photo-5603660.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
];

// ドラッグ＆ドロップ並び替えサンプルのコンポーネント
const SortSampleApp = () => {
  return (
    <div style={bodyStyle}>
      <div style={containerStyle}>
        {imageList.map((item: string) => (
          <div key={item} style={imageCardStyle}>
            <img src={item} alt="ソート可能な画像" style={imageStyle} />
          </div>
        ))}
      </div>
    </div>
  );
};

let rootElement = document.getElementById('root');

// rootElementが無ければ作成してdocument.bodyに追加する
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

// SortSampleAppコンポーネントを表示する
render(<SortSampleApp />, rootElement);
