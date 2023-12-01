import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

import { Input, Tooltip, styled } from '@mui/material';
import { randomId } from '@mui/x-data-grid-generator';

import {
    useTheme,
    TextField,
    // Chip,
    Collapse,
    // Button,
    AppBar,
    Tabs,
    Tab,
    Typography,

    // Box,
    // Grid,
    // Typography,
    Autocomplete,
    Checkbox,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    InputAdornment,
    Select,
    MenuItem,
    Divider,
    Button,
    Stack,
    Snackbar,
} from '@mui/material';

import { useGridApiRef } from '@mui/x-data-grid-pro';

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
    Refresh,
    Preview,
} from '@mui/icons-material';

import dayjs from 'dayjs';

import TabpanelCusTom from '../../../components/TabPanel';
import { useDispatch, useSelector } from 'react-redux';
import {
    contractsByEnterpriseApi,
    enterprisesApi,
    jobsApi,
    jobsByContractApi,
} from '../../../api/auth';
import useRequestAuth from '../../../hooks/useRequestAuth';

import {
    setJobs,
    updateJobs,
    setJobsSelected,
    setTabFilter,
    setCurrentJob,
    resetCurrentJob,
    setCurrentPostNameJob,
    setJobsFromEmpty,
    setJobsFilter,
    setJobsFilterMode,
    setJobsFilterValue,
    setJobsFilterData,
    setJobsSelectedFromEmpty,
    resetJobsSelected,
} from '../../../redux/jobsSlice';

function Candidate() {
    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

    const requestAuth = useRequestAuth();

    const dispatch = useDispatch();

    const enterpriseRef = useRef(null);
    const contractRef = useRef(null);

    const tabRef = useRef('wait-approve');
    const searchRef = useRef();
    const gridDataRef = useRef();

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

    const SearchCandidate = forwardRef((props, ref) => {
        const [enterprise, setEnterprise] = useState(enterpriseRef.current);
        const [contract, setContract] = useState(contractRef.current);
        const [optionsEnterprise, setOptionsEnterprise] = useState([]);
        const [optionsContract, setOptionsContract] = useState([]);

        const [openSelectEnterprise, setOpenSelectEnterprise] = useState(false);

        const handleEnterpriseChange = (event, newValue) => {
            setEnterprise(newValue);
        };
        const handleContractChange = (event, newValue) => {
            setContract(newValue);
        };

        const getEnterprises = async () => {
            try {
                const response = await enterprisesApi(requestAuth);

                if (response.status === 200) {
                    setOptionsEnterprise(response.data);
                }
            } catch (e) {
                console.log('ENTERPRISES_ERROR');
            }
        };

        const getContracts = async (enterpriseId) => {
            try {
                const response = await contractsByEnterpriseApi(
                    requestAuth,
                    enterpriseId,
                );

                if (response?.status === 200) {
                    setOptionsContract(response.data);
                }
            } catch (e) {
                console.log('CONTRACTS_ERROR');
            }
        };

        useImperativeHandle(ref, () => ({
            setNull() {
                setEnterprise(null);
            },
        }));

        useEffect(() => {
            if (enterprise) {
                enterpriseRef.current = enterprise;
            } else {
                setContract(null);
            }
        }, [enterprise]);

        useEffect(() => {
            if (contract) {
                contractRef.current = contract;
            }
        }, [contract]);

        useEffect(() => {
            getEnterprises();
        }, [openSelectEnterprise]);

        useEffect(() => {
            setContract(null);
            if (enterprise) {
                getContracts(enterprise?.enterpriseId);
            }
        }, [enterprise]);

        useEffect(() => {
            dispatch(
                setJobsFilter({
                    mode: 'quick',
                    value: contract,
                    data: [],
                }),
            );
        }, [contract]);

        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <h4>Tìm theo hợp đồng</h4>
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <Autocomplete
                            onOpen={() => {
                                setOpenSelectEnterprise(true);
                            }}
                            onClose={() => {
                                setOpenSelectEnterprise(false);
                            }}
                            open={openSelectEnterprise}
                            sx={{ m: 1, width: '40%' }}
                            disablePortal
                            id="combo-box-contract"
                            options={optionsEnterprise}
                            renderInput={(params) => (
                                <TextField {...params} label="Chọn công ty" />
                            )}
                            value={enterprise}
                            getOptionLabel={(option) => option.name}
                            onChange={handleEnterpriseChange}
                        />
                        <Autocomplete
                            sx={{ m: 1, width: '40%' }}
                            disablePortal
                            id="combo-box-contract"
                            options={optionsContract}
                            renderInput={(params) => (
                                <TextField {...params} label="Chọn hợp đồng" />
                            )}
                            value={contract}
                            getOptionLabel={(option) => option.name}
                            onChange={handleContractChange}
                        />
                    </div>
                </div>
            </div>
        );
    });

    function CustomToolbar(props) {
        const { setRows, setRowModesModel } = props;

        // const currentRow = useSelector(
        //     (state) => state.posts.value.currentPost,
        // );

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
                            fileName: 'posts',
                            hideToolbar: true,
                            hideFooter: true,
                        }}
                        printOptions={{
                            utf8WithBom: true,
                            fileName: 'posts',
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
                <Box
                    sx={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                    }}
                >
                    {text}
                </Box>
            </GridOverlay>
        );
    }

    const CrudGridCandidate = forwardRef((props, ref) => {
        const jobsReducer = useSelector((state) => state.jobs.value);

        const apiRef = useGridApiRef();
        // const [multilRow, setMultilRow] = useState([]);

        const { jobs, jobsFilter, tabFilter, jobsSelected } = jobsReducer;

        const { mode, value, data } = jobsFilter;

        console.log('re-render');
        const [rows, setRows] = useState(jobs);
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

        const valueFormatDate = useMemo(
            () => (params) =>
                dayjs(params.value, DEFAULT_DATE_FORMAT).format(
                    DEFAULT_DATE_FORMAT,
                ),
            [],
        );

        const columns = () => {
            const renderCell = (params) => {
                return (
                    <div
                        style={{
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word',
                            overflow: 'auto',
                            paddingTop: 10,
                            paddingBottom: 10,
                            flexWrap: 'wrap',
                            wordWrap: 'break-word',
                        }}
                    >
                        {params.value}
                    </div>
                );
            };

            return [
                {
                    field: 'name',
                    headerName: 'Tên ứng viên',
                    flex: 2,
                    // editable: true,
                    renderCell: renderCell,
                    valueGetter: (params) => params.row.student?.name,
                },
                {
                    field: 'dateApply',
                    headerName: 'Ngày ứng tuyển',
                    flex: 1,
                    type: 'date',
                    // editable: true,
                    renderCell: renderCell,
                    valueFormatter: valueFormatDate,
                },
                {
                    field: 'salary',
                    headerName: 'Mức lương',
                    flex: 1,
                    // editable: true,
                    renderCell: renderCell,
                    valueGetter: (params) => params.row.post?.salary,
                },
                {
                    field: 'nameJob',
                    headerName: 'Tên vị trí ứng tuyển',
                    flex: 2,
                    // editable: true,
                    renderCell: renderCell,
                    valueFormatter: valueFormatDate,
                    valueGetter: (params) => params.row.post?.nameJob,
                },
                {
                    field: 'status',
                    headerName: 'Trạng thái',
                    flex: 1,
                    editable: true,
                    type: 'singleSelect',
                    valueOptions: [
                        'Đang xử lý',
                        'Đã chấp nhận',
                        'Đang kiểm tra',
                        'Đang phỏng vấn',
                        'Đã nhận việc',
                        'Từ chối',
                    ],
                    renderEditCell: (params) => {
                        const statusOptions = [
                            'Đang xử lý',
                            'Đã chấp nhận',
                            'Đang kiểm tra',
                            'Đang phỏng vấn',
                            'Đã nhận việc',
                            'Từ chối',
                        ];
                        const currentValueIndex = statusOptions.indexOf(
                            params.value,
                        );
                        let availableOptions;
                        if (currentValueIndex === -1) {
                            availableOptions = statusOptions;
                        } else {
                            availableOptions =
                                statusOptions.slice(currentValueIndex);
                        }

                        return (
                            <SelectNoneBoderStyle
                                value={params.value}
                                defaultValue={availableOptions[0]}
                                onChange={(event) => {
                                    params.api.setEditCellValue(
                                        {
                                            id: params.id,
                                            field: params.field,
                                            value: event.target.value,
                                        },
                                        params.id,
                                    );

                                    const selectedRows =
                                        apiRef.current.getSelectedRows();

                                    selectedRows.forEach((v, k) => {
                                        apiRef.current.setEditCellValue(
                                            {
                                                id: k,
                                                field: params.field,
                                                value: event.target.value,
                                            },
                                            k,
                                        );
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
                        const a = apiRef.current.getSelectedRows();

                        const b = Array.from(a.keys()).includes(id);

                        const isInEditMode =
                            rowModesModel[id]?.mode === GridRowModes.Edit;

                        if (isInEditMode) {
                            return [
                                <Tooltip title="Lưu">
                                    <GridActionsCellItem
                                        disabled={!b}
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
                                        disabled={!b}
                                        icon={<CancelIcon />}
                                        label="Cancel"
                                        className="textPrimary"
                                        onClick={handleCancelClick(id)}
                                        color="inherit"
                                    />
                                </Tooltip>,
                            ];
                        }

                        const actions = [];

                        const row = rows.find((row) => row.jobApplyId === id);

                        if (row.status === 'Từ Chối') {
                            actions.push(
                                <Tooltip
                                    title="Xem chi tiết"
                                    disableFocusListener={!b}
                                >
                                    <span>
                                        <GridActionsCellItem
                                            disabled={!b}
                                            icon={<Preview />}
                                            label="preview"
                                            // onClick={handleDeleteClick(id)}
                                            color="inherit"
                                        />
                                    </span>
                                </Tooltip>,
                                <Tooltip
                                    key={'del'}
                                    title="Xóa"
                                    disableFocusListener={!b}
                                >
                                    <span>
                                        <GridActionsCellItem
                                            disabled={!b}
                                            icon={<DeleteIcon />}
                                            label="delete"
                                            onClick={handleDeleteClick(id)}
                                            color="inherit"
                                        />
                                    </span>
                                </Tooltip>,
                            );
                        } else {
                            actions.push(
                                <Tooltip
                                    title="Xem chi tiết"
                                    disableFocusListener={!b}
                                >
                                    <span>
                                        <GridActionsCellItem
                                            disabled={!b}
                                            icon={<Preview />}
                                            label="preview"
                                            // onClick={handleDeleteClick(id)}
                                            color="inherit"
                                        />
                                    </span>
                                </Tooltip>,
                                <Tooltip
                                    key={'edit'}
                                    title="Chỉnh sửa"
                                    disableFocusListener={!b}
                                >
                                    <span>
                                        <GridActionsCellItem
                                            disabled={!b}
                                            icon={<EditIcon />}
                                            label="edit"
                                            onClick={handleEditClick(id)}
                                            color="inherit"
                                        />
                                    </span>
                                </Tooltip>,
                            );
                        }

                        return [<Box key={'actions'}>{actions}</Box>];
                    },
                },
            ];
        };

        const handleRowEditStop = (params, event) => {
            if (params.reason === GridRowEditStopReasons.rowFocusOut) {
                event.defaultMuiPrevented = true;
            }
        };

        const handleEditClick = useCallback(
            (id) => () => {
                const selectedRows = apiRef.current.getSelectedRows();

                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.Edit },
                }));

                selectedRows.forEach((v, k) => {
                    setRowModesModel((prevRowModesModel) => ({
                        ...prevRowModesModel,
                        [k]: { mode: GridRowModes.Edit },
                    }));
                });

                dispatch(
                    setCurrentJob(rows.find((row) => row.jobApplyId === id)),
                );
            },
            [],
        );

        const handleSaveClick = useCallback(
            (id) => () => {
                const selectedRows = apiRef.current.getSelectedRows();

                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.View },
                }));

                selectedRows.forEach((v, k) => {
                    setRowModesModel((prevRowModesModel) => ({
                        ...prevRowModesModel,
                        [k]: { mode: GridRowModes.View },
                    }));
                });
            },
            [],
        );

        const handleDeleteClick = useCallback(
            (id) => () => {
                const keys = apiRef.current.getSelectedRows().keys();
                let newRows = rows;
                const keysArr = Array.from(keys);
                console.log(keysArr);
                if (keysArr.length > 0) {
                    newRows = rows.filter(
                        (row) => !keysArr.includes(row.jobApplyId),
                    );

                    setRows(newRows);
                } else {
                    setRows((prevRows) =>
                        prevRows.filter((row) => row.jobApplyId !== id),
                    );
                    console.log('delete: ', id);
                }

                dispatch(resetJobsSelected());
            },
            [],
        );

        const handleCancelClick = useCallback(
            (id) => () => {
                const selectedRows = apiRef.current.getSelectedRows();

                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: {
                        mode: GridRowModes.View,
                        ignoreModifications: true,
                    },
                }));

                selectedRows.forEach((v, k) => {
                    setRowModesModel((prevRowModesModel) => ({
                        ...prevRowModesModel,
                        [k]: {
                            mode: GridRowModes.View,
                            ignoreModifications: true,
                        },
                    }));
                });

                setRows((prevRows) => {
                    const editedRow = prevRows.find(
                        (row) => row.jobApplyId === id,
                    );
                    if (editedRow && editedRow.isNew) {
                        return prevRows.filter((row) => row.jobApplyId !== id);
                    }
                    return prevRows;
                });

                dispatch(
                    setJobsFromEmpty(() => {
                        const editedRow = rows.find(
                            (row) => row.postApplyId === id,
                        );
                        if (editedRow && editedRow.isNew) {
                            return rows.filter((row) => row.postApplyId !== id);
                        }
                        return rows;
                    }),
                );
                dispatch(resetCurrentJob());
                dispatch(resetJobsSelected());
            },
            [],
        );

        const processRowUpdate = (newRow) => {
            const updatedRow = { ...newRow, isNew: false };

            dispatch(updateJobs(updatedRow));
            dispatch(resetCurrentJob());

            return updatedRow;
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        const handleCellDoubleClick = (params, event) => {
            event.defaultMuiPrevented = true;
        };

        const getJobs = async () => {
            let params;
            if (tabFilter === 'wait-approve') {
                params = 'Đang Xử Lý';
            }
            if (tabFilter === 'signed') {
                params = 'Đã Chấp Nhận';
            }
            if (tabFilter === 'denied') {
                params = 'Từ Chối';
            }

            try {
                const response = await jobsApi(requestAuth, params);

                const status = response.status;

                if (status === 200) {
                    const data = response.data;

                    dispatch(setJobsFromEmpty(data));
                    setRows(data);
                }
            } catch (e) {
                console.log('POSTS_ERROR');
            }
        };

        const getJobsByContract = async (contractId) => {
            try {
                const response = await jobsByContractApi(
                    requestAuth,
                    contractId,
                );

                const status = response.status;

                if (status === 200) {
                    const data = response.data;

                    dispatch(setJobsFromEmpty(data));

                    let statusName;
                    if (tabFilter === 'wait-approve') {
                        statusName = 'Đang Xử Lý';
                    }
                    if (tabFilter === 'signed') {
                        statusName = 'Đã Chấp Nhận';
                    }
                    if (tabFilter === 'denied') {
                        statusName = 'Từ chối';
                    }

                    const newData = data.filter(
                        (data1) => data1.status === statusName,
                    );

                    setRows(newData);
                }

                return true;
            } catch (e) {
                console.log('JOBS_CONTRACTS_ERROR');
                return false;
            }
        };

        const handleJobsByContract = async (value) => {
            if (value) {
                const check = await getJobsByContract(value.contractId);
                if (check) {
                } else {
                    getJobs();
                }
            } else {
                getJobs();
            }
        };

        useImperativeHandle(ref, () => ({
            refresh() {
                searchRef.current.setNull();
                getJobs();
            },
        }));

        useEffect(() => {
            if (!rows[rows.length - 1]?.isNew) {
            }
            console.log(rows);
        }, [rows]);

        useEffect(() => {
            getJobs();
        }, []);

        useEffect(() => {
            handleJobsByContract(value);
        }, [data, mode, value, tabFilter]);

        return (
            <DataGrid
                apiRef={apiRef}
                {...props}
                autoHeight
                getRowHeight={() => 'auto'}
                rows={rows}
                getRowId={(row) => row.jobApplyId}
                columns={columns()}
                editMode="row"
                checkboxSelection
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
                    jobApplyId: false,
                }}
                slots={{
                    toolbar: CustomToolbar,
                    noRowsOverlay: () => (
                        <CustomNoRowsOverlay text="Không có ứng viên!" />
                    ),
                    noResultsOverlay: () => (
                        <CustomNoRowsOverlay text="Không tìm thấy ứng viên!" />
                    ),
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
                            items: [],
                            quickFilterLogicOperator: GridLogicOperator.Or,
                        },
                    },
                }}
            />
        );
    });

    function ManagerCandidate() {
        const tabFilter = useSelector(
            (state) => state.contracts.value.tabFilter,
        );
        const [valueTabFilter, setValueTabFilter] = useState(tabFilter);

        const handleChangeTabFilterStatus = (event, newValue) => {
            setValueTabFilter(newValue);
            tabRef.current = newValue;
            dispatch(setTabFilter(newValue));
        };

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
                                    label="Hồ sơ đang chờ duyệt"
                                    value="wait-approve"
                                />
                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Hồ sơ đã duyệt"
                                    value="signed"
                                />
                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Hồ sơ loại"
                                    value="denied"
                                />
                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Hồ sơ ứng tuyển"
                                    value="all"
                                />
                            </TabList>
                        </Box>
                    </TabContext>
                </div>
                <Box sx={{ height: 400, width: 1 }}>
                    <CrudGridCandidate ref={gridDataRef} />
                </Box>
            </>
        );
    }

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
                    QUẢN LÝ ỨNG VIÊN
                </h2>

                <SearchCandidate ref={searchRef} />
            </div>

            <ManagerCandidate />
        </div>
    );
}

export default Candidate;
