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

    const [nested, setNested] = useState(false);

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

    const handleCloseNested = (e) => {
        setNested(false);
    };

    const handleOpenNested = (e) => {
        setNested(true);
    };

    return (
        <div>
            <Button onClick={handleOpenNested}>Đóng</Button>
            <Dialog
                TransitionComponent={Transition}
                fullWidth
                hideBackdrop
                maxWidth={maxWidth}
                keepMounted
                disableScrollLock
                open={!oneButton ? open : nested}
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
                        variant="contained"
                        color={status}
                        style={{
                            display: oneButton ? 'none' : 'block',
                        }}
                        onClick={() => {
                            if (!oneButton) {
                                if (onButtonClick) {
                                    onButtonClick('agree');
                                }
                                setOpen(false);
                            } else {
                                handleCloseNested();
                            }
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
        </div>
    );
}

export default AlertDialogModal;
