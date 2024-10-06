import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import * as React from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Header from './components/Header';
import Train from './components/Train'
import Pred from './components/Pred';
import ViewSettings from './components/ViewSettings';
import Settings from './components/Settings';
import mnist_image from './mnist_test_5.png';

const useStyles = styled({
  root: {
    flexGrow: 1,
  },
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={'simple-tabpanel-${index}'}
      aria-labelledby={'simple-tab-${index}'}
      {...other}>
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
  );
}

const CenteredTabs = (props) => {
  const classes = useStyles();
  /* 
    valueにはタブの番号が格納
    0: Training
    1: Inference
    2: Settings
  */
  const [value, setValue] = React.useState(0);

  const handleChangeTabs = (event, newValue) => {
    /* タブ変更用関数 */
    setValue(newValue);
  };

  return (
    <div>
        <Paper className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChangeTabs}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                {props.labels.map(label => <Tab label={label}></Tab>)} 
            </Tabs>
        </Paper>

        {props.children.map((child, index) => 
            <TabPanel value={value} index={index}>{child}</TabPanel>)
        }
    </div>
  );
}

  const App = () => {
    /* ハイパーパラメータの初期値 */
    const hyperparam_init = {
      model: 'SimpleNN',
      lr: 2e-3,
      optimizer: 'SGD',
      activation: 'ReLU',
      dataset: 'MNIST',
    }
  
    /* タブを切り替えても現在選択されている状態を保持するための状態変数 */

    const [hyperparam_stat, setHyperparam] = React.useState(hyperparam_init);
    const [prog, setProg] = React.useState(0);
    const [image, setImage] = React.useState(mnist_image);
    const [predict, setPred] = React.useState('-');
    const [label, setLabel] = React.useState('-');
    const [accuracy, setAccuracy] = React.useState(0);
    const [act_stgs, flgStgs] = React.useState(false);

    const setModel = () => {
      /* モデル初期化の際に呼び出される関数 */
      Axios.post('http://127.0.0.1:5000/setModel', hyperparam_stat).catch(
        (error) => {
          alert("Error: cannot set initial model.", error);
        }
      )
    }

    const dataset_setting = () => {
      /* データセットの変更時に呼び出される関数 */
      Axios.get('http://127.0.0.1:5000/dataset').catch(
        (error) => {
          alert("Error: cannot set selected dataset.", error);
        }
      )
    }

    React.useEffect(() => {
      setModel();
      dataset_setting();
    },[])

    const getTrainProcess = (args) => {
      /* 学習がどれくらい終了したかを示す進捗状況をセットする */
      setProg(args);
    }

    const imageSet = (image) => {
      /* 推論時の画像のセット */
      setImage(image);
    }

    const predictSet = (pred) => {
      /* 推論時の予測値のセット */
      setPred(pred);
    }

    const labelSet = (args) => {
      /* 推論時の正解ラベルのセット */
      setLabel(args);
    }

    const accSet = (args) => {
      /* 学習時の正解率のセット */
      setAccuracy(args);
    }

    const changeStgs = (flag) => {
      /* 
      設定変更時のフラグ
      true:
      false:
      */
      flgStgs(flag);
    }

    const init_dashboard = () => {
      /*
      学習開始時の正解率および進捗状況の初期化
      */
      setAccuracy(0);
      setProg(0);
    }

    const hyperparamSet = (param) => {
      /*
        Settings.jsでのハイパーパラメータ設定値を親側で取得するための関数
        設定変更時に呼び出される
      */
      hyperparam_stat.model = param.model;
      hyperparam_stat.layer = param.layer;
      hyperparam_stat.lr = param.lr;
      hyperparam_stat.optimizer = param.optimizer;
      hyperparam_stat.activation = param.activation;
      hyperparam_stat.dataset = param.dataset;

      setHyperparam(hyperparam_stat);
      changeStgs(false);
    }

      return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#e6f0f0', padding: '20px'}}>
        <Grid container direction="column">
        <Header />
          <Grid item>
            <CenteredTabs labels={['Training', 'Inference', 'Settings']}>
              <div>
                <Train prog={prog} acc={accuracy} childToParent={getTrainProcess} hyperparam={hyperparam_stat} getAcc={accSet} init={init_dashboard} />
              </div>
              <div><Pred image={image} pred={predict} label={label} childToParentImg={imageSet} childToParentPred={predictSet} childToParentLabel={labelSet}/></div>
              <div>
              {!act_stgs && (
                <ViewSettings hyperparam={hyperparam_stat} flag={changeStgs}/>
                )}
              {act_stgs && (
                <Settings hyperparam={hyperparam_stat} changeSettings={hyperparamSet} flag={changeStgs} setModel={setModel}/>
                )}
              </div>
            </CenteredTabs>
          </Grid>
       </Grid>
    </Box>
  );
  }

export default App;