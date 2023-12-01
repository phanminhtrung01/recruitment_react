import { Snackbar, styled } from '@mui/material';
import { useState, useEffect } from 'react';

function SnackbarCustom({
    open = false,
    time = 2000,
    message,
    severity,
    position,
}) {
    const [openSnackbar, setOpen] = useState(open);

    const SnackbarStyle = styled(Snackbar)({
        '& .MuiSnackbarContent-root': {
            color: 'black',
            fontWeight: 'bold',
            backgroundColor: '#faff91',
            padding: '10px',
        },
        '& .MuiSnackbarContent-message': {
            fontSize: '1.5rem',
        },
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        if (openSnackbar) {
            setTimeout(
                () => {
                    setOpen(false);
                },
                { time },
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openSnackbar]);

    useEffect(() => {
        setOpen(open);
    }, [open]);

    return (
        <SnackbarStyle
            anchorOrigin={position}
            open={open}
            onClose={handleClose}
            severity={severity}
            message={message}
        />
    );
}

export default SnackbarCustom;
