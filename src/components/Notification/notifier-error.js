import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Translate } from 'react-auto-translate';

function NotifierSnackbar(props) {
    const { title, sub1, sub2, toast, idToats, type = 'success' } = props;

    return (
        <Alert
            icon={false}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
            }}
            sx={{
                width: 'auto',
            }}
            severity={type}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: '1.6rem',
                        fontWeight: 'bold',
                    }}
                >
                    {title}
                </div>
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="medium"
                    onClick={() => toast.dismiss(idToats)}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </div>
            <Alert
                style={{
                    marginRight: 35,
                }}
                severity={type}
            >
                <div>
                    <div
                        style={{
                            fontSize: '1.3rem',
                        }}
                    >
                        {sub1}
                    </div>
                    <div
                        style={{
                            fontSize: '1.1rem',
                        }}
                    >
                        <Translate>{sub2}</Translate>
                    </div>
                </div>
            </Alert>
        </Alert>
    );
}

export default NotifierSnackbar;
