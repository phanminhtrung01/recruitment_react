import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

import { Input, Tooltip, styled } from '@mui/material';
import { randomId } from '@mui/x-data-grid-generator';
import {
    DataGrid,
    GridOverlay,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridRowModes,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridLogicOperator,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    CloudUploadOutlined,
    ClearAll,
    AddBoxOutlined,
} from '@mui/icons-material';

import dayjs from 'dayjs';

export default function ContractEnterPrise() {
    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

    const today = dayjs();
    const tomorrow = today.add(1, 'day');
    const testDetailsRef = useRef([
        {
            id: 'TD001',
            name: 'Hợp đồng ABC và BDE',
            createDate: new Date('2023-01-01'),
            status: 'Chờ ký',
        },
        {
            id: 'TD002',
            name: 'Hợp đồng ADC và BDE',
            createDate: new Date('2023-06-01'),
            status: 'Chờ duyệt',
        },
    ]);
    const [valueTabFilter, setValueTabFilter] = useState('wait-approve');

    const [filterDate, setFilterDate] = useState('');

    const handleChangeFilterDate = (event) => {
        setFilterDate(event.target.value);
    };

    const handleChangeTabFilterStatus = (event, newValue) => {
        setValueTabFilter(newValue);
    };

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

    const UploadButton = styled(Button)(({ theme }) => ({
        color: theme.palette.primary,
        backgroundColor: 'transparent',
        padding: theme.spacing(0.5, 1),
        '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
        },
    }));

    const ClearButton = styled(Button)(({ theme }) => ({
        color: theme.palette.error,
        backgroundColor: 'transparent',
        padding: theme.spacing(0.5, 1),
        '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
        },
    }));

    const AddButton = styled(Button)(({ theme }) => ({
        color: theme.palette.success,
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

    function CustomToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const handleAddClick = () => {
            const id = randomId();
            setRows((oldRows) => [...oldRows, { id, name: '', isNew: true }]);

            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            }));
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
                        }}
                        printOptions={{
                            utf8WithBom: true,
                            fileName: 'test',
                            hideToolbar: true,
                            hideFooter: true,
                        }}
                    />

                    <UploadButton
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<CloudUploadOutlined />}
                    >
                        NHẬP
                        <input
                            hidden
                            onChange={(event) => {}}
                            onClick={(event) => {
                                // setColumns(
                                //     data.data.columns.filter((column) =>
                                //         VISIBLE_FIELDS.includes(column.field),
                                //     ),
                                // );
                                // setRows(data.data.rows);
                            }}
                        />
                    </UploadButton>
                </div>
                <div>
                    <AddButton
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<AddBoxOutlined />}
                        onClick={handleAddClick}
                    >
                        THÊM CÂU HỎI
                    </AddButton>
                    <ClearButton
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<ClearAll />}
                        onClick={(event) => {
                            setRows([]);
                        }}
                    >
                        XÓA TẤT CẢ
                    </ClearButton>
                </div>

                <GridToolbarQuickFilter
                    disabled={false}
                    style={{ float: 'right' }}
                    quickFilterParser={(searchInput) =>
                        searchInput.split(',').map((value) => value.trim())
                    }
                    quickFilterFormatter={(quickFilterValues) =>
                        quickFilterValues.join(', ')
                    }
                    debounceMs={500}
                />
            </CustomToolbarContainer>
        );
    }

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

    function CrudGridContract({ ...props }) {
        const InputNoneBoderStyle = styled(Input)({
            '&:before': {
                content: 'none',
            },
            '&:after': {
                content: 'none',
            },
            padding: 5,
        });

        const DatePickerNoneBoderStyle = styled(DatePicker)({
            fieldset: {
                display: 'none',
            },
        });
        const SelectNoneBoderStyle = styled(Select)({
            width: '100%',
            fieldset: {
                display: 'none',
            },
        });

        const renderEditCellDate = useMemo(
            () => (params) =>
                (
                    <DatePickerNoneBoderStyle
                        value={dayjs(params.value)}
                        onChange={(newValue) => {
                            params.api.setEditCellValue({
                                ...params,
                                value: newValue.toDate(),
                            });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        format="DD/MM/YYYY"
                    />
                ),
            [],
        );

        const valueFormatDate = useMemo(
            () => (params) => dayjs(params.value).format(DEFAULT_DATE_FORMAT),
            [],
        );

        const columns = [
            {
                field: 'name',
                headerName: 'Tên hợp đồng',
                flex: 1,
                // editable: true,
                // renderEditCell: (params) => (
                //     <InputNoneBoderStyle placeholder="Nhập tên hợp đồng" />
                // ),
            },
            {
                field: 'createDate',
                headerName: 'Ngày tạo',
                flex: 1,
                type: 'date',
                //editable: true,
                // renderEditCell: renderEditCellDate,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'effectiveDate',
                headerName: 'Ngày hiệu lực',
                flex: 1,
                type: 'date',
                //editable: true,
                // renderEditCell: renderEditCellDate,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'terminationDate',
                headerName: 'Ngày chấm dứt',
                flex: 1,
                editable: true,
                type: 'date',
                renderEditCell: renderEditCellDate,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                flex: 1,
                editable: true,
                type: 'singleSelect',
                valueOptions: ['Chờ duyệt', 'Đã duyệt', 'Chờ ký', 'Đã ký'],
                renderEditCell: (params) => {
                    const statusOptions = [
                        'Chờ duyệt',
                        'Đã duyệt',
                        'Chờ ký',
                        'Đã ký',
                    ];
                    const currentValueIndex = statusOptions.indexOf(
                        params.value,
                    );
                    const availableOptions =
                        statusOptions.slice(currentValueIndex);

                    return (
                        <SelectNoneBoderStyle
                            value={params.value}
                            onChange={(event) => {
                                params.api.setEditCellValue({
                                    ...params,
                                    value: event.target.value,
                                });
                            }}
                        >
                            {availableOptions.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </SelectNoneBoderStyle>
                    );
                },
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                flex: 1,
                cellClassName: 'actions',
                getActions: ({ id }) => {
                    const isInEditMode =
                        rowModesModel[id]?.mode === GridRowModes.Edit;

                    if (isInEditMode) {
                        return [
                            <Tooltip title="Lưu">
                                <GridActionsCellItem
                                    icon={<SaveIcon />}
                                    label="Save"
                                    sx={{
                                        color: 'primary.main',
                                    }}
                                    onClick={handleSaveClick(id)}
                                />
                            </Tooltip>,
                            <Tooltip title="Hủy">
                                <GridActionsCellItem
                                    icon={<CancelIcon />}
                                    label="Cancel"
                                    className="textPrimary"
                                    onClick={handleCancelClick(id)}
                                    color="inherit"
                                />
                            </Tooltip>,
                        ];
                    }

                    return [
                        <Tooltip title="Chỉnh sửa">
                            <GridActionsCellItem
                                icon={<EditIcon />}
                                label="edit"
                                onClick={handleEditClick(id)}
                                color="inherit"
                            />
                        </Tooltip>,
                        <Tooltip title="Xóa">
                            <GridActionsCellItem
                                icon={<DeleteIcon />}
                                label="delete"
                                onClick={handleDeleteClick(id)}
                                color="inherit"
                            />
                        </Tooltip>,
                    ];
                },
            },
        ];

        const [rows, setRows] = useState(props.rows);
        const [rowModesModel, setRowModesModel] = useState({});

        const handleRowEditStop = (params, event) => {
            if (params.reason === GridRowEditStopReasons.rowFocusOut) {
                event.defaultMuiPrevented = true;
            }
        };

        const handleEditClick = useCallback(
            (id) => () => {
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.Edit },
                }));
            },
            [],
        );

        const handleSaveClick = useCallback(
            (id) => () => {
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.View },
                }));
            },
            [],
        );

        const handleDeleteClick = useCallback(
            (id) => () => {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            },
            [],
        );

        const handleCancelClick = useCallback(
            (id) => () => {
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: {
                        mode: GridRowModes.View,
                        ignoreModifications: true,
                    },
                }));

                setRows((prevRows) => {
                    const editedRow = prevRows.find((row) => row.id === id);
                    if (editedRow && editedRow.isNew) {
                        return prevRows.filter((row) => row.id !== id);
                    }
                    return prevRows;
                });
            },
            [],
        );

        const processRowUpdate = (newRow) => {
            // console.log('processRowUpdate', newRow);

            const updatedRow = { ...newRow, isNew: false };
            setRows(
                rows.map((row) => (row.id === newRow.id ? updatedRow : row)),
            );

            testDetailsRef.current = testDetailsRef.current.map((row) =>
                row.id === newRow.id ? updatedRow : row,
            );

            console.log(testDetailsRef.current);

            return updatedRow;
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        const handleCellDoubleClick = (params, event) => {
            event.defaultMuiPrevented = true;
        };

        useEffect(() => {
            if (!rows[rows.length - 1]?.isNew) {
            }
        }, [rows]);

        return (
            <DataGrid
                {...props}
                autoHeight
                rows={rows}
                columns={columns}
                editMode="row"
                onCellDoubleClick={handleCellDoubleClick}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
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
                        <CustomNoRowsOverlay text="Không có hợp đồng!" />
                    ),
                    //pagination: CustomPagination,
                }}
                slotProps={{
                    toolbar: {
                        setRows,
                        setRowModesModel,
                        showQuickFilter: true,
                    },
                }}
            />
        );
    }

    return (
        <>
            <div>
                <h2>QUẢN LÝ HỒ SƠ</h2>
                <div>
                    <div>
                        <h5>Từ khóa</h5>
                        <TextField
                            id="standard-basic"
                            sx={{ m: 2, minWidth: '40%', width: '50%' }}
                            label="Nhập từ khóa"
                            type="text"
                            //value={amount}
                            //onChange={handleAmountChange}
                        />
                    </div>
                    <div>
                        <h5>Tìm theo ngày</h5>
                        <FormControl sx={{ m: 2, minWidth: 150 }}>
                            <InputLabel id="demo-simple-select-label">
                                Loại
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filterDate}
                                label="Age"
                                onChange={handleChangeFilterDate}
                            >
                                <MenuItem value={'start'}>
                                    Ngày bắt đầu
                                </MenuItem>
                                <MenuItem value={'end'}>Ngày kết thúc</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <h5>Chọn ngày</h5>
                        <DatePicker
                            sx={{ m: 2, minWidth: 150 }}
                            label="Ngày kết thúc"
                            inputFormat="dd/MM/yyyy"
                            // disabled={allowTime}
                            // value={dayjs(endDate)}
                            // onChange={handleEndDateChange}

                            slotProps={{
                                field: {
                                    clearable: true,
                                    onClear: () => setCleared(true),
                                },
                            }}
                            minDate={tomorrow}
                        />
                    </div>

                    <Button
                        sx={{ m: 2, minWidth: 120 }}
                        disableRipple
                        variant="contained"
                        startIcon={<SearchIcon />}
                        style={{
                            fontSize: '1.2rem',
                            textTransform: 'none',
                        }}
                        // disabled={!submitPosition}
                        // onClick={handleAddPosition}
                    >
                        Tìm kiếm
                    </Button>
                </div>
            </div>
            <div>
                <TabContext value={valueTabFilter}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            onChange={handleChangeTabFilterStatus}
                            aria-label="lab API tabs example"
                        >
                            <Tab
                                style={{
                                    fontSize: '1.2rem',
                                    textTransform: 'none',
                                }}
                                label="Hợp đồng đang duyệt"
                                value="wait-approve"
                            />
                            <Tab
                                style={{
                                    fontSize: '1.2rem',
                                    textTransform: 'none',
                                }}
                                label="Hợp đồng chờ ký"
                                value="wait-signing"
                            />
                            <Tab
                                style={{
                                    fontSize: '1.2rem',
                                    textTransform: 'none',
                                }}
                                label="Hợp đồng đã ký"
                                value="signed"
                            />
                        </TabList>
                    </Box>
                    <div>{valueTabFilter}</div>
                </TabContext>
            </div>
            <CrudGridContract
                rows={testDetailsRef.current}
                style={{
                    with: '100%',
                    height: '300px',
                }}
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
