import * as React from 'react';

const Image = (props) => {
  /* 画像を表示するコンポーネント */
    return(
      <div style={{ padding: 5}}>
              <img 
              src={props.image}
              style={{
                  width: props.width,
                  aspectRatio: '1/1'
                }}/>
      </div>
    );
}

export default Image;
  