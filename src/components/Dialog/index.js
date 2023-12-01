import {
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
} from '@mui/material';
import { WarningRounded } from '@mui/icons-material';
import { forwardRef } from 'react';
import { useState } from 'react';

function AlertDialogModal(props) {
    const Transition = forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const {
        openDialog,
        activeButton,
        onButtonClick,
        status = 'error',
        icon = (
            <WarningRounded
                sx={{
                    fontSize: 20,
                }}
            />
        ),
        headerTitle = 'Xác nhận',
        content = 'Bạn đã chắc chắn xóa',
        messageError = 'Xóa',
        messageWarning = 'Đồng ý',
        messageSuccess = 'Chấp nhận',
        maxWidth = 'xs',
        oneButton = false,
    } = props;

    const [activeButtonIn, setActiveButtonIn] = useState(activeButton);

    const [open, setOpen] = openDialog;

    let color, message;
    if (status === 'error') {
        color = 'red';
        message = messageError;
    } else if (status === 'warning') {
        color = 'yellow';
        message = messageWarning;
    } else if (status === 'success') {
        message = messageSuccess;
    }

    return (
        <Dialog
            TransitionComponent={Transition}
            fullWidth
            hideBackdrop
            maxWidth={maxWidth}
            keepMounted
            disableScrollLock
            open={open}
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
                {icon}
                <div
                    style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}
                >
                    {headerTitle}
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Button
                    style={{
                        display: oneButton ? 'none' : 'block',
                    }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                        if (onButtonClick) {
                            onButtonClick('cancel');
                        }

                        setOpen(false);
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
                <Button
                    disabled={activeButtonIn}
                    variant="contained"
                    color={status}
                    onClick={() => {
                        if (onButtonClick) {
                            onButtonClick('agree');
                        }
                        setOpen(false);
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
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialogModal;
