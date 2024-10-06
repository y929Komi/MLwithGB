import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

function Title(props) {
    return (
    <Typography component="h3" variant="h5" color="primary" gutterBottom>
        {props.children}
    </Typography>
    );
}

Title.protoTypes = {
    children: PropTypes.node,
};

export default Title;