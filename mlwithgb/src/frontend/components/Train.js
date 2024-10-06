import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import * as React from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Title from './Title';

const Item = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  padding: '20px',
  margin: '20px',
  fontSize: '20px',
}));

const LinearProgressWithLabel = (props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1}}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35}}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(props.value, )}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

const server_learn = (hyparam) => {
  /* 現在設定されているハイパーパラメータをバックエンドに送って学習させる際に呼び出される関数 */
  Axios.post('http://127.0.0.1:5000/train', hyparam)
  .catch((error) => {
    alert("Error:", error);
  })
};

const LinearWithValueLabel = (props) => {
  /* 
    学習の進捗を取得
    progress:進捗状況を保持する状態変数
    currenct_prog:親コンポーネントにprogressの値を送るための変数
    ※setProgressでprogressの値を変更してから反映されるまで時間差があるため、
    progressを直接親コンポーネントに送った場合、すぐに値が反映されない
    その問題を回避するために一時変数current_progを使用している
  */
  const [progress, setProgress] = React.useState(props.prog);
  let current_prog = progress;

  React.useEffect(() => {
    props.childToParent(current_prog);
    async function server_progresslearn(prog) {
      /* バックエンドから5秒毎(=5000ms)に学習の進捗状況と正解率を取得 */
      Axios.get('http://127.0.0.1:5000/progressLearn').then(
        (response) => {
          /* バックエンドから送られた進捗状況を10進数に変換 */
          prog = parseInt(response.data.progress, 10);
          /* バックエンドから送られた正解率を浮動小数点型に変換 */
          let acc = parseFloat(response.data.accuracy);
          setProgress(prog);
          current_prog = prog;
          props.getAcc(acc);
        }
      )
      .catch((error) => {
        alert("Error: server progresslearn cannot get", error);
      })
    }
    
    const timer = setInterval(() => {
      setProgress(server_progresslearn(progress));
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}

const AccuracyView = (props) => {
  /* 正解率を表示する部分 */
  const [accuracy, setAccuracy] = React.useState(props.acc);

  React.useEffect(() => {
    setAccuracy(props.acc);
  },[props.acc])

  return (
    <Grid>
      <Item>
      <Title>Accuracy</Title>
      {(accuracy * 100).toFixed(2)}%
      </Item>
    </Grid>
  )
}

const TrainAlertDialog = (props) => {
  /* Trainボタンを押した際に表示されるダイアログを表示する */
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Initialize model?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          If you click Train button, the trained model is initialized, OK?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {handleClose(); props.close();}}>Cancel</Button>
          <Button onClick={() => {handleClose(); props.close(); props.init(); props.learn();}}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const Train = (props) => {
  /* 
    train_dialog:ダイアログの開閉判定フラグ
    accuracy:正解率を保持
    prog:学習の進捗状況を保持
  */
  const [train_dialog, set_traindialog] = React.useState(false);
  const [accuracy, setAccuracy] = React.useState(props.acc);
  const [prog, setProg] = React.useState(props.prog);

  const handleLearing = () => {
    /* 学習を開始する際に子コンポーネントから呼び出される関数 */
    server_learn(props.hyperparam);
  };

  const getAccuracy = (acc) => {
    /* 正解率を取得する関数(子コンポーネントから呼び出される) */
    setAccuracy(acc);
    props.getAcc(acc);
  }

  const handleOpen = () => {
    set_traindialog(true);
  };

  const handleClose = () => {
    set_traindialog(false);
  };


  return (
  <Container maxWidth="sm">
  <TrainAlertDialog open={train_dialog} close={handleClose} init={props.init} learn={handleLearing} />
  <React.Fragment>
  <Grid container>
  <Grid item xs={12}>
  </Grid>
  </Grid>
  <Grid>
    <Item>
      <Button variant="contained" onClick={() => {handleOpen();}}>Train</Button>
      <LinearWithValueLabel prog={prog} childToParent={props.childToParent} getAcc={getAccuracy}/>
    </Item>
    <AccuracyView acc={accuracy}/>
  </Grid>
  
  </React.Fragment>
  </Container>
      );
  }

  export default Train;