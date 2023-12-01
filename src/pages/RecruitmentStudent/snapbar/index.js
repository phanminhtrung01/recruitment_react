import * as React from 'react';
import { Toaster, toast } from 'sonner';
import { Button } from '@mui/material';
import { Alert, IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useEnhancedToast } from '../../../hooks/useEnhancedToast';
import { LocalDining } from '@mui/icons-material';

const SnapBarMUI = ({ type, component }) => {
    const enhancedToast = useEnhancedToast();
    const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));

    return (
        <>
            <Toaster
                duration={3000}
                position="top-right"
                richColors
                closeButton
            />

            {/* <Button
                variant="solid"
                color="warning"
                onClick={() => enhancedToast.warn('Event has been removed!')}
                children="Warn"
            />
            <Button
                variant="solid"
                color="primary"
                onClick={() =>
                    toast.promise(promise, {
                        loading: 'Loading...',
                        success: (data) => {
                            return `${data.name} toast has been added`;
                        },
                        error: 'Error',
                    })
                }
                children="Loading"
            />
            <Button
                variant="solid"
                color="load"
                onClick={() =>
                    toast('Event has been created', {
                        action: {
                            label: 'Thu hồi',
                            onClick: () => console.log('Undo'),
                        },
                    })
                }
                children="Create"
            />
            <Button
                variant="outlined"
                color="info"
                onClick={() =>
                    toast.custom((t) => (
                        <Alert
                            sx={{
                                width: 300,
                            }}
                            severity={type}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="medium"
                                    onClick={() => toast.dismiss(t)}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {component}
                        </Alert>
                    ))
                }
                children="Custom"
            /> */}
        </>
    );
};

export default SnapBarMUI;
