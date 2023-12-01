import { toast } from 'sonner';
import { Warning } from '@mui/icons-material';
export function useEnhancedToast() {
    const enhancedToast = { ...toast };
    enhancedToast.warn = (message, data) =>
        toast(message, {
            ...data,
            className: 'sonner-toast-warn',
            icon: <Warning />,
        });

    return enhancedToast;
}
