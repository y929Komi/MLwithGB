import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

const Item = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    padding: '20px',
    margin: '20px',
    fontSize: '20px',
  }));

const create_table = (name, val) => {
    /* 
    name:設定項目名
    val:設定値
    */
  return {name, val};
}

const ViewSettings = (props) => {

    /* 現在の設定値をテーブル形式で表示 */

    const rows = [
        create_table('Model', props.hyperparam.model),
        create_table('Optimizer', props.hyperparam.optimizer),
        create_table('Activation', props.hyperparam.activation),
        create_table('Learning rate', props.hyperparam.lr),
        create_table('Dataset', props.hyperparam.dataset),
    ];
    
    return (
        <Container maxWidth="sm">
        <React.Fragment>
        <Grid container>
            <Grid item xs={12}>
            <Item>
            <Title>Settings</Title>
        <TableContainer component={Paper}>
            <Table sx={6} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Parameter settings</TableCell>
                        <TableCell align="right">Class/Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0} }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.val}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Item elevation={0}>
        <Button variant='contained' onClick={ () => {props.flag(true);}}>Change settings</Button>
        </Item>
        </Item>
        </Grid>
        </Grid>
        </React.Fragment>
        </Container>
        
    );
}

export default ViewSettings;