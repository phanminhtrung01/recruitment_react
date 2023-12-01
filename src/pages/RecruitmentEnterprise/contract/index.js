import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import TextField from '@mui/material/TextField';
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

import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';

import { Input, Tooltip, styled } from '@mui/material';
import { randomId } from '@mui/x-data-grid-generator';
import {
    DataGrid,
    GridToolbar,
    GridOverlay,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridRowModes,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridLogicOperator,
} from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    CloudUploadOutlined,
    ClearAll,
    AddBoxOutlined,
    Preview,
    Refresh,
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';

import { contractsApi } from '../../../api/auth';
import {
    setContracts,
    setTabFilter,
    setContractsFromEmpty,
    setContractsFilter,
    setContractsFilterMode,
    setContractsFilterValue,
    setContractsFilterData,
    resetCurrentContract,
    setCurrentContract,
    setCurrentContractName,
    setCurrentContractCreateDate,
    setCurrentContractEffectiveDate,
    setCurrentContractTerminationDate,
    setCurrentContractStatus,
} from '../../../redux/contractsSlice';
import useRequestAuth from '../../../hooks/useRequestAuth';

export default function ContractEnterPrise() {
    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

    const dispatch = useDispatch();
    const requestAuth = useRequestAuth();

    const today = dayjs();
    const tomorrow = today.add(1, 'day');

    const tabRef = useRef('wait-approve');
    const gridDataRef = useRef();

    const [cleared, setCleared] = useState(false);

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

    function CustomToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const currentRow = useSelector(
            (state) => state.contracts.value.currentContract,
        );

        const handleAddClick = () => {
            const contractId = randomId();

            setRows((oldRows) => [
                ...oldRows,
                { ...currentRow, contractId, isNew: true },
            ]);

            setRowModesModel((oldModel) => ({
                ...oldModel,
                [contractId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            }));
        };

        const handleRefreshClick = () => {
            setRows([]);
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
                    <ButtonStyle
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<AddBoxOutlined />}
                        onClick={handleAddClick}
                    >
                        THÊM HỢP ĐỒNG
                    </ButtonStyle>
                    <ButtonStyle
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<ClearAll />}
                        onClick={(event) => {
                            setRows([]);
                        }}
                    >
                        XÓA TẤT CẢ
                    </ButtonStyle>
                </div>

                <div>
                    <GridToolbarQuickFilter
                        disabled={false}
                        style={{ float: 'right', display: 'none' }}
                        quickFilterParser={(searchInput) =>
                            searchInput.split(',').map((value) => value.trim())
                        }
                        quickFilterFormatter={(quickFilterValues) =>
                            quickFilterValues.join(', ')
                        }
                        debounceMs={500}
                    />

                    <ButtonStyle
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<Refresh />}
                        onClick={handleRefreshClick}
                    >
                        Làm mới
                    </ButtonStyle>
                </div>
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

    const CrudGridContract = forwardRef((props, ref) => {
        const contractsReducer = useSelector((state) => state.contracts.value);

        const apiRef = useGridApiRef();

        const { contracts, currentContract, contractsFilter, tabFilter } =
            contractsReducer;

        const { mode, value, data } = contractsFilter;

        const [rows, setRows] = useState(contracts);
        const [rowModesModel, setRowModesModel] = useState({});
        // apiRef.setQuickFilterValues(['Hợp đồng 5']);
        const InputNoneBoderStyle = styled(Input)({
            '&:before': {
                content: 'none',
            },
            '&:after': {
                content: 'none',
            },
            fontSize: '1.2rem',
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

        const validateDate = useCallback(
            (nameField) => {
                if (nameField) {
                    if (nameField === 'createDate') {
                        return dayjs();
                    }

                    if (nameField === 'effectiveDate') {
                        const dateMin1 = currentContract.createDate;
                        console.log('dateMin1', dateMin1);
                        if (dateMin1) {
                            return dayjs(dateMin1, DEFAULT_DATE_FORMAT).add(
                                1,
                                'day',
                            );
                        }
                    }

                    if (nameField === 'terminationDate') {
                        const dateMin2 = currentContract.effectiveDate;
                        console.log('dateMin2', dateMin2);

                        if (dateMin2) {
                            return dayjs(dateMin2, DEFAULT_DATE_FORMAT).add(
                                1,
                                'day',
                            );
                        }
                    }
                }
            },
            [currentContract.createDate, currentContract.effectiveDate],
        );

        const handleEditCellTextChange = useCallback((params, event) => {
            params.api.setEditCellValue({
                ...params,
                value: event.target.value,
            });
        }, []);

        const handleEditCellDateChange = useCallback((params, value) => {
            params.api.setEditCellValue({
                ...params,
                value: value,
            });

            if (params.field === 'createDate') {
                dispatch(setCurrentContractCreateDate(value));
            }

            if (params.field === 'effectiveDate') {
                dispatch(setCurrentContractEffectiveDate(value));
            }

            if (params.field === 'terminationDate') {
                dispatch(setCurrentContractTerminationDate(value));
            }
        }, []);

        const renderEditCellDate = useMemo(
            () => (params) =>
                (
                    <DatePickerNoneBoderStyle
                        value={dayjs(params.value, DEFAULT_DATE_FORMAT)}
                        onChange={(newValue) => {
                            handleEditCellDateChange(params, newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        format="DD/MM/YYYY"
                        minDate={validateDate(params.field)}
                    />
                ),
            [handleEditCellDateChange, validateDate],
        );

        const valueFormatDate = useMemo(
            () => (params) =>
                dayjs(params.value, DEFAULT_DATE_FORMAT).format(
                    DEFAULT_DATE_FORMAT,
                ),
            [],
        );

        const columns = [
            {
                field: 'name',
                headerName: 'Tên hợp đồng',
                flex: 1,
                editable: true,
                renderEditCell: (params) => (
                    <TextField
                        value={params.value}
                        onChange={(event) =>
                            handleEditCellTextChange(params, event)
                        }
                        placeholder="Nhập tên hợp đồng"
                    />
                ),
            },
            {
                field: 'createDate',
                headerName: 'Ngày tạo',
                flex: 1,
                type: 'date',
                editable: true,
                renderEditCell: renderEditCellDate,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'effectiveDate',
                headerName: 'Ngày hiệu lực',
                flex: 1,
                type: 'date',
                editable: true,
                renderEditCell: renderEditCellDate,
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
                // editable: true,
                type: 'singleSelect',
                valueOptions: [
                    'Đang chờ duyệt',
                    'Đã duyệt',
                    'Đã ký',
                    'Từ chối',
                ],

                // renderEditCell: (params) => {
                //     const statusOptions = [
                //         'Đang chờ duyệt',
                //         'Đã duyệt',
                //         'Đã ký',
                //         'Từ chối',
                //     ];
                //     const currentValueIndex = statusOptions.indexOf(
                //         params.value,
                //     );
                //     let availableOptions;
                //     let defaultValue;
                //     if (currentValueIndex === -1) {
                //         availableOptions = statusOptions;
                //     } else {
                //         availableOptions =
                //             statusOptions.slice(currentValueIndex);
                //     }

                //     return (
                //         <SelectNoneBoderStyle
                //             value={params.value}
                //             defaultValue={availableOptions[0]}
                //             onChange={(event) => {
                //                 params.api.setEditCellValue({
                //                     ...params,
                //                     value: event.target.value,
                //                 });
                //             }}
                //         >
                //             {availableOptions.map((option, index) => (
                //                 <MenuItem key={index} value={option}>
                //                     {option}
                //                 </MenuItem>
                //             ))}
                //         </SelectNoneBoderStyle>
                //     );
                // },
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

                    const actions = [
                        <Tooltip title="Xem chi tiết">
                            <GridActionsCellItem
                                icon={<Preview />}
                                label="preview"
                                // onClick={handleDeleteClick(id)}
                                color="inherit"
                            />
                        </Tooltip>,
                    ];

                    if (tabFilter === 'denied') {
                        actions.push(
                            <Tooltip title="Xóa">
                                <GridActionsCellItem
                                    icon={<DeleteIcon />}
                                    label="delete"
                                    onClick={handleDeleteClick(id)}
                                    color="inherit"
                                />
                            </Tooltip>,
                        );
                    }

                    if (tabFilter === 'wait-approve') {
                        actions.push(
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
                        );
                    }

                    return actions;
                },
            },
        ];

        const handleFilterByStatus = (filter) => {
            let valueFilter;

            if (filter === 'wait-approve') {
                valueFilter = 'Đang chờ duyệt';
            }

            if (filter === 'signed') {
                valueFilter = 'Đã ký';
            }

            if (filter === 'denied') {
                valueFilter = 'Từ chối';
            }

            apiRef.current.setFilterModel({
                items: [
                    {
                        id: 1,
                        field: 'status',
                        operator: 'is',
                        value: valueFilter,
                    },

                    // more filters...
                ],
            });
        };

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
                setRows((prevRows) =>
                    prevRows.filter((row) => row.contractId !== id),
                );
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
                    const editedRow = prevRows.find(
                        (row) => row.contractId === id,
                    );
                    if (editedRow && editedRow.isNew) {
                        return prevRows.filter((row) => row.contractId !== id);
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
                rows.map((row) =>
                    row.contractId === newRow.contractId ? updatedRow : row,
                ),
            );

            // const newRows = rows.map((row) => {
            //     const updatedRow = { ...row };

            //     updatedRow.createDate = dayjs(row.createDate).format(
            //         'DD/MM/YYYY',
            //     );
            //     updatedRow.effectiveDate = dayjs(row.effectiveDate).format(
            //         'DD/MM/YYYY',
            //     );
            //     updatedRow.terminationDate = dayjs(row.terminationDate).format(
            //         'DD/MM/YYYY',
            //     );

            //     return row.contractId === newRow.contractId ? updatedRow : row;
            // });
            // console.log(newRows);
            dispatch(
                setContractsFromEmpty(
                    rows.map((row) =>
                        row.contractId === newRow.contractId ? updatedRow : row,
                    ),
                ),
            );
            dispatch(resetCurrentContract());

            return updatedRow;
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        const handleCellDoubleClick = (params, event) => {
            event.defaultMuiPrevented = true;
        };

        // const handleCellEditStop = (params, event) => {
        //     console.log('stop', { params });
        //     const { id, field } = params;
        //     setTimeout(() => {
        //         params.value = params.apiRef.current.getCellValue(id, field);
        //     }, 100);
        // };

        const getContracts = async () => {
            try {
                const response = await contractsApi(requestAuth);

                const status = response.status;

                if (status === 200) {
                    const data = response.data;
                    dispatch(setContractsFromEmpty(data));
                    setRows(data);
                }
            } catch (e) {
                console.log('CONTRACTS_ERROR');
            }
        };

        useImperativeHandle(ref, () => ({
            refresh() {
                getContracts();
            },
            filterByStatus(filter) {
                handleFilterByStatus(filter);
            },
        }));

        useEffect(() => {
            if (!rows[rows.length - 1]?.isNew) {
                console.log('row lasted old', rows[rows.length - 1]);
            }
        }, [rows]);

        useEffect(() => {
            getContracts();
        }, []);

        useEffect(() => {
            if (mode === 'quick') {
                apiRef.current.setQuickFilterValues([value]);
            } else {
                console.log(value);

                let valueTab;
                if (tabFilter === 'wait-approve') {
                    valueTab = 'Đang chờ duyệt';
                }
                if (tabFilter === 'signed') {
                    valueTab = 'Đã ký';
                }
                if (tabFilter === 'denied') {
                    valueTab = 'Từ chối';
                }

                let nameField;
                if (data[0] === 'start') {
                    nameField = 'effectiveDate';
                } else {
                    nameField = 'terminationDate';
                }
                console.log(nameField);

                apiRef.current.setFilterModel({
                    items: [
                        {
                            id: 1,
                            field: nameField,
                            operator: 'after',
                            value: value.startDate?.toISOString(),
                        },
                        // {
                        //     id: 2,
                        //     field: nameField,
                        //     operator: 'before',
                        //     value: value.endDate?.toISOString(),
                        // },
                        // {
                        //     id: 3,
                        //     field: 'status',
                        //     operator: 'is',
                        //     value: valueTab,
                        // },
                    ],
                });

                // setRows(
                //     rows.f,
                // );
                // status;
                // contractId: 'CT12AB34DE';
                // createDate: '01/01/2023';
                // effectiveDate: '01/02/2023';
                // name: 'Hợp đồng 1';
                // status: 'Đang chờ duyệt';
                // terminationDate: '01/01/2024';
                let filteredContracts = rows.filter((row) => {
                    let datePar = new Date(row[nameField]);
                    let dateE = new Date(value.endDate);
                    return row.status === valueTab && datePar < dateE;
                });
                setRows(filteredContracts);
            }
        }, [data, mode, value]);

        return (
            <DataGrid
                apiRef={apiRef}
                {...props}
                autoHeight
                rows={rows}
                getRowId={(row) => row.contractId}
                columns={columns}
                editMode="row"
                onCellDoubleClick={handleCellDoubleClick}
                // onCellEditStop={handleCellEditStop}
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
                    contractId: false,
                }}
                slots={{
                    toolbar: CustomToolbar,
                    noRowsOverlay: () => (
                        <CustomNoRowsOverlay text="Không có hợp đồng!" />
                    ),
                    noResultsOverlay: () => {
                        <CustomNoRowsOverlay text="Không tìm thấy hợp đồng!" />;
                    },
                    //pagination: CustomPagination,
                }}
                slotProps={{
                    toolbar: {
                        setRows,
                        setRowModesModel,
                    },
                }}
                initialState={{
                    filter: {
                        filterModel: {
                            items: [
                                {
                                    id: 1,
                                    field: 'name',
                                    operator: 'contains',
                                    value: 'DG',
                                },
                            ],
                            quickFilterLogicOperator: GridLogicOperator.Or,
                        },
                    },
                }}
            />
        );
    });

    function ManagerContracts() {
        const tabFilter = useSelector(
            (state) => state.contracts.value.tabFilter,
        );
        const [valueTabFilter, setValueTabFilter] = useState(tabFilter);

        const handleChangeTabFilterStatus = (event, newValue) => {
            console.log(newValue);
            setValueTabFilter(newValue);
            // tabRef.current = newValue;
            dispatch(setTabFilter(newValue));
        };

        useEffect(() => {
            if (valueTabFilter) {
                if (valueTabFilter === 'wait-approve') {
                    gridDataRef.current.filterByStatus('wait-approve');
                }
                if (valueTabFilter === 'signed') {
                    gridDataRef.current.filterByStatus('signed');
                }
                if (valueTabFilter === 'denied') {
                    gridDataRef.current.filterByStatus('denied');
                }
            }
        }, [valueTabFilter]);

        return (
            <>
                <div ref={tabRef}>
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
                                    label="Hợp đồng đã ký"
                                    value="signed"
                                />
                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Hợp đồng từ chối"
                                    value="denied"
                                />
                            </TabList>
                        </Box>
                        {/* <div>{valueTabFilter}</div> */}
                    </TabContext>
                </div>
                <Box sx={{ height: 400, width: 1 }}>
                    <CrudGridContract
                        ref={gridDataRef}
                        // rows={contracts}
                    />
                </Box>
            </>
        );
    }

    function SearchContracts() {
        const [filterDate, setFilterDate] = useState('');
        const [searchInput, setSearch] = useState('');
        const [startDate, setStartDate] = useState();
        const [endDate, setEndDate] = useState();

        const handleChangeFilterDate = (event) => {
            setFilterDate(event.target.value);
            dispatch(setContractsFilterData([event.target.value]));
        };

        const handleSearchChange = (event) => {
            setSearch(event.target.value);
            dispatch(
                setContractsFilter({
                    mode: 'quick',
                    value: event.target.value,
                    data: [],
                }),
            );
        };

        const handleStartDateChange = (newValue) => {
            setStartDate(newValue);
        };
        const handleEndDateChange = (newValue) => {
            setEndDate(newValue);
        };

        useEffect(() => {
            if (endDate) {
                dispatch(
                    setContractsFilter({
                        mode: 'time',
                        value: {
                            startDate: startDate
                                ? new Date(startDate)
                                : new Date(dayjs()),
                            endDate: new Date(endDate),
                        },
                        data: [],
                    }),
                );
            }
        }, [endDate, startDate]);

        return (
            <div
                ref={tabRef}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    rowGap: 10,
                    columnGap: 30,
                    width: '100%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        flex: 2,
                        gap: 30,
                    }}
                >
                    <div
                        style={{
                            flex: 2,
                        }}
                    >
                        <h5>Từ khóa</h5>
                        <TextField
                            id="standard-basic"
                            sx={{ m: 2, width: 1 }}
                            label="Nhập từ khóa"
                            type="text"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        <h5>Tìm theo ngày</h5>
                        <FormControl sx={{ m: 2, width: 1 }}>
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
                                    Ngày hiệu lực
                                </MenuItem>
                                <MenuItem value={'end'}>Ngày chấm dứt</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div
                        style={{
                            flex: 2,
                        }}
                    >
                        <h5>Chọn ngày</h5>
                        <DatePicker
                            sx={{ m: 1, width: 1 }}
                            label="Từ Ngày"
                            inputFormat="dd/MM/yyyy"
                            value={dayjs(startDate)}
                            onChange={handleStartDateChange}
                            slotProps={{
                                field: {
                                    clearable: true,
                                    onClear: () => setCleared(true),
                                },
                            }}
                        />
                        <DatePicker
                            sx={{ m: 1, width: 1 }}
                            label="Đến Ngày"
                            inputFormat="dd/MM/yyyy"
                            value={dayjs(endDate)}
                            onChange={handleEndDateChange}
                            slotProps={{
                                field: {
                                    clearable: true,
                                    onClear: () => setCleared(true),
                                },
                            }}
                            minDate={dayjs(startDate).add(1, 'day')}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                    }}
                ></div>
            </div>
        );
    }

    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => {};
    }, [cleared]);

    return (
        <div
            style={{
                paddingLeft: 20,
                paddingRight: 20,
            }}
        >
            <div>
                <h2
                    style={{
                        marginBottom: 10,
                    }}
                >
                    HỒ SƠ
                </h2>

                <SearchContracts />
            </div>

            <ManagerContracts />
            {/* /dfkjdshisfisdfbsdbfh */}
        </div>
    );
}
