import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import * as React from 'react';
import Axios from 'axios';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Title from './Title';
import Image from './Image';

const Item = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  padding: '20px',
  margin: '20px',
  fontSize: '20px',
}));

const Pred = (props) => {
    /*
      selected_image:選択された画像を格納
      image_label:選択された画像正解ラベル
      image_pred:選択された画像をモデルに入力した時の予測値
    */
    const [selected_image, setImage] = React.useState(props.image);
    const [image_label, setImagelabel] = React.useState(props.label);
    const [image_pred, setImagepred] = React.useState(props.pred);

    const choose_image = () => {
      /* バックエンドからランダムに選択された画像を取得して表示する関数 */
        Axios.get('http://127.0.0.1:5000/sendimage').then(
          (response) => {
            /* 
            img_base64:バックエンドからbase64形式で送られた画像をpngに変換してセット
            props.childToParentImgを呼び出す事でApp.js側でも画像を保持するようにする */
            let img_base64 = 'data:image/png;base64,' + response.data.src;
            setImage(img_base64);
            props.childToParentImg(img_base64);
          }
        )
        .catch((error) => {
          alert("Error: cannot get images", error);
        })
      };

    const infer = () => {
      /* 選択された画像をバックエンドで推論させて、結果を取得する関数 */
      Axios.get('http://127.0.0.1:5000/infer').then(
        response => {
          let pred = response.data.pred;
          let label = response.data.label;
          setImagepred(pred);
          setImagelabel(label);
          props.childToParentPred(pred);
          props.childToParentLabel(label);
        }
      )
      .catch((error) => {
        alert("Error: cannot infer given image", error);
      })
    };

    return (  
  <Container maxWidth="sm">
  <React.Fragment>
  <Grid container>
  <Grid item xs={12}>
    <Item>
    <Title>Image</Title>
    <Image image={selected_image} width='100px'/>
    </Item>
  </Grid>

  <Grid item xs={12}>
    <Item>
    <Stack direction="row" spacing={3}
  sx={{
    justifyContent: "center",
    alignItems: "center",
  }}>
    <Item xs={12} elevation={0}>
      <Button variant='contained' onClick={choose_image}>
        Select
      </Button>
    </Item>
    <Item xs={12} elevation={0}>
      <Button variant='contained' onClick={infer}>
        Infer
      </Button>
    </Item>
    </Stack>
    </Item>
  </Grid>

  {/* 予測値と正解ラベルを表示 */}
  <Grid item xs={6}>
    <Item>
    <Title>Predict</Title>
    <Typography variant="h5">{image_pred}</Typography>
    </Item>
  </Grid>
  <Grid item xs={6}>
    <Item>
    <Title>Correct</Title>
    <Typography variant="h5">{image_label}</Typography>
    </Item>
  </Grid>
  </Grid>
  
  </React.Fragment>
  </Container>
    );
}

export default Pred;