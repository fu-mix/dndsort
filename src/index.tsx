import React from 'react';
import { render } from 'react-dom';
import style from './index.module.css';
import { useDnDSort } from './useDnDSort';

const App: React.FC = () => {
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

  const result = useDnDSort(imageList);

  return (
    <div className={style.body}>
      <div className={style.container}>
        {result.map((item) => (
          <div key={item.key} className={style.imageCard} {...item.events}>
            <img
              src={item.value}
              alt="ソート可能な画像"
              className={style.image}
            />
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
render(<App />, rootElement);
