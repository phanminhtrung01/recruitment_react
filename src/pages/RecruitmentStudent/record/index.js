import {
    useState,
    useEffect,
    useMemo,
    useRef,
    useImperativeHandle,
} from 'react';

import {
    DataGrid,
    GridOverlay,
    GridLogicOperator,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import dayjs from 'dayjs';

import { getClassByStudentApi } from '../../../api/auth';
import useRequestAuth from '../../../hooks/useRequestAuth';

import { useGridApiRef } from '@mui/x-data-grid-pro';

import { forwardRef } from 'react';
import { Button, styled } from '@mui/material';
import { CloudUploadOutlined, Refresh } from '@mui/icons-material';

export default function Recored() {
    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

    const requestAuth = useRequestAuth();
    const gridDataRef = useRef();

    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => {};
    }, [cleared]);

    const ButtonStyle = styled(Button)(({ theme }) => ({
        color: theme.palette.primary,
        backgroundColor: 'transparent',
        padding: theme.spacing(0.5, 1),
        '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
        },
    }));

    const CustomToolbarContainer = styled(GridToolbarContainer)({
        display: 'flex',
        justifyContent: 'space-between',
    });

    const CustomToolbar = forwardRef((props, ref) => {
        const handleRefreshSubClick = () => {
            gridDataRef?.current.refresh();
        };

        return (
            <CustomToolbarContainer>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <GridToolbarExport
                        disabled={false}
                        csvOptions={{
                            utf8WithBom: true,
                            fileName: 'test',
                            hideToolbar: true,
                            hideFooter: true,
                            getRowsToExport: (params) => {
                                let response = [];
                                if (params.apiRef.current) {
                                    params.apiRef.current.setSortModel([
                                        {
                                            field: 'name',
                                            sort: 'asc',
                                        },
                                    ]);
                                    response =
                                        params.apiRef.current.getSortedRowIds();
                                }

                                return response;
                            },
                        }}
                        printOptions={{
                            utf8WithBom: true,
                            fileName: 'test',
                            hideToolbar: true,
                            hideFooter: true,
                        }}
                    />

                    <ButtonStyle
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<CloudUploadOutlined />}
                    >
                        NHẬP
                        <input
                            hidden
                            onChange={(event) => {}}
                            onClick={(event) => {}}
                        />
                    </ButtonStyle>
                </div>

                <div>
                    <GridToolbarQuickFilter
                        quickFilterParser={(searchInput) =>
                            searchInput.split(',').map((value) => value?.trim())
                        }
                        quickFilterFormatter={(quickFilterValues) =>
                            quickFilterValues.join(', ')
                        }
                        debounceMs={500}
                    />

                    <ButtonStyle
                        variant="text"
                        component="label"
                        startIcon={<Refresh />}
                        onClick={() => {
                            handleRefreshSubClick();
                        }}
                    >
                        Làm mới
                    </ButtonStyle>
                </div>
            </CustomToolbarContainer>
        );
    });

    function CustomNoRowsOverlay({ text }) {
        return (
            <GridOverlay>
                <div
                    style={{
                        fontSize: '1.3rem',
                    }}
                >
                    {text}
                </div>
            </GridOverlay>
        );
    }

    const CrudGridContract = forwardRef((props, ref) => {
        const apiRef = useGridApiRef();

        const valueFormatDate = useMemo(
            () => (params) =>
                dayjs(params.value, DEFAULT_DATE_FORMAT).format(
                    DEFAULT_DATE_FORMAT,
                ),
            [],
        );

        const renderCell = (params) => {
            return (
                <div
                    style={{
                        whiteSpace: 'normal',
                        overflowWrap: 'break-word',
                        overflow: 'auto',
                        paddingTop: 8,
                        paddingBottom: 8,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        wordWrap: 'break-word',
                    }}
                >
                    {params.value}
                </div>
            );
        };

        const columns = [
            {
                field: 'name',
                headerName: 'Tên lớp học',
                flex: 2,
                renderCell: renderCell,
            },
            {
                field: 'startDate',
                headerName: 'Ngày khai giảng',
                flex: 1,
                type: 'date',
                renderCell: renderCell,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'endDate',
                headerName: 'Ngày kết thúc',
                flex: 1,
                type: 'date',
                renderCell: renderCell,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'sizeClass',
                headerName: 'Sỉ số',
                flex: 1,
                renderCell: renderCell,
            },
            {
                field: 'progress',
                headerName: 'Tiến độ',
                flex: 1,
                renderCell: renderCell,
            },
        ];

        const [rows, setRows] = useState([]);

        const getClassesStudent = async () => {
            try {
                const response = await getClassByStudentApi(requestAuth);

                const status = response.status;

                if (status === 200) {
                    const data = response.data;
                    setRows(data);
                }
            } catch (e) {
                console.log('CONTRACTS_ERROR');
            }
        };

        const handleCellDoubleClick = (params, event) => {
            event.defaultMuiPrevented = true;
        };

        useImperativeHandle(ref, () => ({
            refresh() {
                getClassesStudent();
            },
        }));

        useEffect(() => {
            getClassesStudent();
        }, []);

        return (
            <DataGrid
                apiRef={apiRef}
                {...props}
                autoHeight
                rows={rows}
                columns={columns}
                getRowId={(row) => row.classId}
                editMode="row"
                onCellDoubleClick={handleCellDoubleClick}
                pageSize={rows.length}
                hideFooter={true}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                columnVisibilityModel={{
                    id: false,
                }}
                slots={{
                    toolbar: CustomToolbar,
                    noRowsOverlay: () => (
                        <CustomNoRowsOverlay text="Chưa học lớp học nào!" />
                    ),
                    noResultsOverlay: () => (
                        <CustomNoRowsOverlay text="Không tìm thấy lớp học!" />
                    ),
                    //pagination: CustomPagination,
                }}
                slotProps={{
                    toolbar: {
                        setRows,
                        showQuickFilter: true,
                    },
                }}
            />
        );
    });

    return (
        <>
            <h2>DANH SÁCH LỚP HỌC CỦA HỌC VIÊN</h2>
            <CrudGridContract
                ref={gridDataRef}
                initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterLogicOperator: GridLogicOperator.Or,
                        },
                    },
                }}
            />
        </>
    );
}
