import {
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    DialogContentText,
    IconButton,
} from '@mui/material';
import { WarningRounded } from '@mui/icons-material';
import { forwardRef } from 'react';
import { useState } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogModalNested = forwardRef((props, ref) => {
    const {
        onClose = (value) => {},
        messagePositive = 'Xóa',
        headerTitle = ' Xác nhận',
        minimum = false,
        icon,
        textIcon = 'Edit',
        onButtonClick = (v) => {},
        status = 'error',
        content = 'Bạn đã chắc chắn xóa',
        subContent = '',
        maxWidth = 'xs',
        keepMounted = false,
        disabledPositive = false,
        hideNegative = false,
    } = props;
    const [open, setOpen] = useState(false);
    const [minimumS, setMinimum] = useState(minimum);

    console.log(minimum);
    let color, message;
    if (status === 'error') {
        color = 'red';
        message = 'Xóa';
    }
    if (status === 'warning') {
        color = '#e65100';
        message = 'Đồng ý';
    }
    if (status === 'success') {
        color = 'green';
        message = 'Đồng ý';
    }

    if (messagePositive) {
        message = messagePositive;
    }

    return (
        <div {...props}>
            {icon ? (
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    sx={{
                        scale: 0.6,
                    }}
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    {icon}
                </IconButton>
            ) : minimumS ? (
                <></>
            ) : (
                <Button
                    onClick={() => {
                        setOpen(true);
                    }}
                    variant="outlined"
                >
                    {textIcon}
                </Button>
            )}

            <Dialog
                TransitionComponent={Transition}
                fullWidth
                hideBackdrop
                maxWidth={maxWidth}
                keepMounted={keepMounted}
                open={open || minimumS}
                onClose={() => setOpen(false)}
            >
                <DialogTitle
                    color={color}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                    }}
                >
                    <WarningRounded
                        sx={{
                            fontSize: 20,
                        }}
                    />
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                        }}
                    >
                        {headerTitle}
                    </div>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {content}
                    <DialogContentText
                        sx={{
                            m: 1,
                        }}
                    >
                        {subContent}
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        disabled={disabledPositive}
                        variant="contained"
                        color={status}
                        onClick={() => {
                            onButtonClick('agree');
                            setOpen(false);
                            setMinimum(false);
                            onClose('positive');
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 'bold',
                            }}
                        >
                            {message}
                        </div>
                    </Button>
                    <Button
                        style={{
                            display: !hideNegative ? 'block' : 'none',
                        }}
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            onButtonClick('cancel');
                            setOpen(false);
                            setMinimum(false);
                            onClose('negative');
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 'bold',
                            }}
                        >
                            Hủy
                        </div>
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});

export default AlertDialogModalNested;
