import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Title from './Title';

const Item = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    padding: '20px',
    margin: '20px',
    fontSize: '20px',
  }));

const SelectOptimizer = (props) => {
    /*
      セレクターから最適化アルゴリズム(Optimizer)を設定する関数
      status:SGD,Adam,AdaGradのいずれかが格納
      初期値はApp.js側のoptimizer変数から取得している
    */
    const [status, setStatus] = React.useState(props.optimizer);

    /* セレクターで変更した際に呼び出される関数 */
    const change = (event) => {
        setStatus(event.target.value);
        props.changeFunc(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m:1, minWidth: 150 }}>
                <InputLabel id="optimizer">Optimizer</InputLabel>
                <Select
                labelId="optimizer"
                id="optimizer_id"
                value={status}
                onChange={change}
                autoWidth
                label="optim">
                    <MenuItem value={'SGD'}>
                     SGD
                    </MenuItem>
                    <MenuItem value={'Adam'}>
                     Adam
                    </MenuItem>
                    <MenuItem value={'AdaGrad'}>
                     AdaGrad
                    </MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

const SelectActivation = (props) => {
    /*
      セレクターから活性化関数(Activation function)を設定する関数
      status:ReLU,Sigmoid,htanhのいずれかが格納
      初期値はApp.js側のactivation変数から取得している
    */
    const [status, setStatus] = React.useState(props.activation);

    /* セレクターで変更した際に呼び出される関数 */
    const change = (event) => {
        setStatus(event.target.value);
        props.changeFunc(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m:1, minWidth: 150 }}>
                <InputLabel id="activation">Activation</InputLabel>
                <Select
                labelId="activation"
                id="activation_id"
                value={status}
                onChange={change}
                autoWidth
                label="act">
                    <MenuItem value={'ReLU'}>
                     ReLU
                    </MenuItem>
                    <MenuItem value={'Sigmoid'}>
                     Sigmoid
                    </MenuItem>
                    <MenuItem value={'htanh'}>
                     htanh
                    </MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

const SelectDataset = (props) => {
    /*
      セレクターからデータセット(Dataset)を設定する関数
      status:MNIST,CIFAR-10のいずれかが格納
      初期値はApp.js側のdataset変数から取得している
    */
    const [status, setStatus] = React.useState(props.dataset);

    /* セレクターで変更した際に呼び出される関数 */
    const change = (event) => {
        setStatus(event.target.value);
        props.changeFunc(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m:1, minWidth: 150 }}>
                <InputLabel id="dataset">Dataset</InputLabel>
                <Select
                labelId="dataset"
                id="dataset_id"
                value={status}
                onChange={change}
                autoWidth
                label="data">
                    <MenuItem value={'MNIST'}>
                     MNIST
                    </MenuItem>
                    <MenuItem value={'CIFAR-10'}>
                     CIFAR-10
                    </MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

const SelectModel = (props) => {
    /*
      セレクターからモデル(Model)を設定する関数
      status:SimpleNN,SimpleConvのいずれかが格納
      初期値はApp.js側のmodel変数から取得している
    */
    const [status, setStatus] = React.useState(props.model);

    /* セレクターで変更した際に呼び出される関数 */
    const change = (event) => {
        setStatus(event.target.value);
        props.changeFunc(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m:1, minWidth: 150 }}>
                <InputLabel id="model">Model</InputLabel>
                <Select
                labelId="model"
                id="model_id"
                value={status}
                onChange={change}
                autoWidth
                label="data">
                    <MenuItem value={'SimpleNN'}>
                     SimpleNeuralNetwork(layer=2)
                    </MenuItem>
                    <MenuItem value={'SimpleConv'}>
                     SimpleConvNet(layer=4)
                    </MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

const SettingsAlertDialog = (props) => {
    /*
      設定変更(Applyボタン)をする際に表示されるダイアログを実装している部分
      open:trueの時にダイアログが開き、falseの時にダイアログが閉じる
    */
    const [open, setOpen] = React.useState(false);
  
    /* 親コンポーネント(App.js)で変数が変更された際に呼び出される */
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
            {"Change settings?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            If you click OK button, settings are changed, OK?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleClose(); props.close();}}>Cancel</Button>
            <Button onClick={() => {handleClose(); props.close(); props.changeSettings(); props.setModel();}}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

const create_table = (name, val) => {
    /* 
    name:設定項目名
    val:設定値
    */
    return {name, val};
}

const Settings = (props) => {
    /* 
      Settingsコンポーネント側でハイパーパラメータを保持する状態変数
      model:モデル
      optimizer:最適化アルゴリズム
      activation:活性化関数
      lr:学習率
      dataset:データセット
      setting_dialog:ダイアログの開閉フラグを保持
    */
    const [model, setModel] = React.useState(props.hyperparam.model);
    const [optimizer, setOptimizer] = React.useState(props.hyperparam.optimizer);
    const [activation, setAct] = React.useState(props.hyperparam.activation);
    const [lr, setLR] = React.useState(props.hyperparam.lr);
    const [dataset, changeDataset] = React.useState(props.hyperparam.dataset);
    const [setting_dialog, setSTGsdialog] = React.useState(false);

    let hyparam = {
        model: model,
        lr: lr,
        optimizer: optimizer,
        activation: activation,
        dataset: dataset,
      };

    /* テーブル形式で表示するための配列 */

    const rows_model = [
        create_table('Model', model),
    ]

    const rows_optim = [
        create_table('Optimizer', optimizer),
    ];

    const rows_act = [
        create_table('Activation', activation),
    ];

    const rows_dataset = [
        create_table('Dataset', dataset),
    ];

    const rows_val = [
        create_table('Learning rate', lr),
    ];

    
    /* ハイパーパラメータ変更時に呼び出される関数群 */

    const changeModel = (model) => {
        setModel(model);
    }

    const onChangeLR = (event) => {
        setLR(event.target.value);
    }

    const changeOptim = (optim) => {
        setOptimizer(optim);
    }

    const changeAct = (act) => {
        setAct(act);
    }

    const changeData = (data) => {
        changeDataset(data);
    }

    const changeFlgs = (flag) => {
        props.flag(flag);
    }

    const handleOpen = () => {
        setSTGsdialog(true);
    }

    const handleClose = () => {
        setSTGsdialog(false);
    }

    const changeSettings = () => {
        props.changeSettings(hyparam);
    }
    
    return (
        <Container maxWidth="sm">
        <React.Fragment>
        <Grid container>
            <Grid item xs={12}>
            <Item>
            <Title>Settings</Title>
            {/* dialog component */}
            <SettingsAlertDialog open={setting_dialog} close={handleClose} changeSettings={changeSettings} setModel={props.setModel}/>
        <TableContainer component={Paper}>

            {/* select Model */}
            <Table sx={6} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Parameter settings</TableCell>
                        <TableCell align="center">Class</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows_model.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0} }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">
                                <SelectModel model={model} changeFunc={changeModel} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* select Optimizer */}
            <Table sx={6} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Parameter settings</TableCell>
                        <TableCell align="center">Class</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows_optim.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0} }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">
                                <SelectOptimizer optimizer={optimizer} changeFunc={changeOptim} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* select activation function */}
            <Table sx={6} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows_act.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0} }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">
                                <SelectActivation activation={activation} changeFunc={changeAct} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            { /* select dataset */ }
            <Table sx={6} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows_dataset.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0} }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">
                                <SelectDataset dataset={dataset} changeFunc={changeData} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            { /* change learning rate */ }
            <Table sx={6} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows_val.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0} }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">
                                <TextField
                                name={row.name}
                                label={row.name}
                                sx={2}
                                onChange={onChangeLR}
                                defaultValue={lr}>
                                </TextField>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        {/* buttons */}

        <Item elevation={0}>
          <Grid container spacing={8}>
            <Grid item>
              <Item elevation={0}>
                <Button variant='outlined' onClick={ () => {changeFlgs(false);}}>Cancel</Button>
              </Item>
            </Grid>
            <Grid item>
              <Item elevation={0}>
                <Button variant='contained' onClick={ () => {handleOpen();}}>Apply</Button>
              </Item>
            </Grid>
          </Grid>
        </Item>

        </Item>
        </Grid>
        </Grid>
        </React.Fragment>
        </Container>
    );
}

export default Settings;