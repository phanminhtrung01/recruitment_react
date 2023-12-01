import { Typography } from '@mui/material';
import SnapBarMUI from '../snapbar';

function Recored() {
    return (
        <div>
            <div>Recored</div>
            <SnapBarMUI
                type="success"
                component={
                    <>
                        <Typography variant="h6">Tạo thành công</Typography>
                        <Typography variant="body2">Hợp đồng 2</Typography>
                    </>
                }
            />
        </div>
    );
}

export default Recored;
