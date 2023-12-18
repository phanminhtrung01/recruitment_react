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

import Tippy from '@tippyjs/react';

import dayjs from 'dayjs';

import {
    Typography,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Divider,
    DialogContentText,
    AccordionSummary,
    Accordion,
    AccordionDetails,
    Card,
    CardContent,
} from '@mui/material';

import { Input, Slide, Tooltip, styled } from '@mui/material';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    CloudUploadOutlined,
    ClearAll,
    AddBoxOutlined,
    Preview,
    Refresh,
    WarningRounded,
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';

import {
    contractsApi,
    positionsByEnterpriseApi,
    updateContractApi,
} from '../../../api/auth';
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

import NotifierSnackbar from '../../../components/Notification/notifier-error';
import { Toaster, toast } from 'sonner';
import ReactQuill from 'react-quill';
import AlertDialogModalNested from '../../../components/Dialog';

export default function ContractEnterPrise() {
    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

    const dispatch = useDispatch();
    const requestAuth = useRequestAuth();

    const today = dayjs();
    const tomorrow = today.add(1, 'day');

    const tabRef = useRef('wait-approve');
    const gridDataRef = useRef();
    const gridDataSubRef = useRef();

    const [cleared, setCleared] = useState(false);
    const [richColor, setRichColor] = useState(false);

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
                    {/* <ButtonStyle
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<AddBoxOutlined />}
                        onClick={handleAddClick}
                    >
                        THÊM HỢP ĐỒNG
                    </ButtonStyle> */}
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

    const CustomToolbarSub = forwardRef((props, ref) => {
        const { setRows, setRowModesModel, setOn, on } = props;

        const handleAddClick = () => {
            const contractDetailsId = randomId();
            setOn(true);
            setRows((oldRows) => [
                ...oldRows,
                {
                    contractDetailsId: contractDetailsId,
                    amount: 1,
                    isNew: true,
                },
            ]);

            setRowModesModel((oldModel) => ({
                ...oldModel,
                [contractDetailsId]: {
                    mode: GridRowModes.Edit,
                    fieldToFocus: 'position',
                },
            }));
        };

        const handleRefreshSubClick = () => {
            gridDataSubRef?.current.refresh();
            gridDataRef?.current.setSave(false);
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
                    <ButtonStyle
                        disabled={on}
                        variant="text"
                        component="label"
                        startIcon={<AddBoxOutlined />}
                        onClick={handleAddClick}
                    >
                        Thêm chi tiết hợp đồng
                    </ButtonStyle>
                    <ButtonStyle
                        disabled={on}
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
                        quickFilterParser={(searchInput) =>
                            searchInput.split(',').map((value) => value.trim())
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

    const CrudGridContractDetails = forwardRef((props, ref) => {
        const apiSubRef = useGridApiRef();

        const [on, setOn] = useState(false);

        const { data, setSave } = props;
        const { contractDetailDTOList } = data;

        const [rows, setRows] = useState(contractDetailDTOList);
        const [rowModesModel, setRowModesModel] = useState({});

        // apiRef.setQuickFilterValues(['Hợp đồng 5']);

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

        const RenderCellSelected = ({ params }) => {
            const position = params.row.position;
            const name = position?.name;

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
                    {name}
                </div>
            );
        };

        const RenderEditCellSelected = ({ params, data }) => {
            const dataPositions = data.map((d) => d.position);

            const [positions, setPositions] = useState(dataPositions);
            const [positionOptions, setpositionOptions] = useState([]);

            const getPosition = async () => {
                try {
                    const response = await positionsByEnterpriseApi(
                        requestAuth,
                    );

                    const status = response.status;

                    if (status === 200) {
                        const data = response.data;
                        filter(data);
                    }
                } catch (e) {
                    console.log('POSITION_ERROR');
                }
            };

            useEffect(() => {
                getPosition();
            }, [positions]);

            const filter = useCallback(
                (data) => {
                    let result = data.filter(
                        (item) =>
                            !positions
                                .map((pos) => pos?.positionId)
                                .includes(item?.positionId),
                    );

                    setpositionOptions(result);
                },
                [positions],
            );

            return (
                <SelectNoneBoderStyle
                    onOpen={() => {
                        getPosition();
                    }}
                    value={params.value}
                    onChange={(event) => {
                        const value = event.target.value;

                        params.api.setEditCellValue({
                            ...params,
                            value: value,
                        });

                        const position = params.row.position;
                        const indexFind = positions.indexOf(position);
                        const newPositions = positions.map((pos, index) =>
                            index === indexFind ? value : pos,
                        );

                        setPositions(newPositions);
                    }}
                    renderValue={(value) => {
                        return value.name;
                    }}
                >
                    {positionOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option.name}
                        </MenuItem>
                    ))}
                </SelectNoneBoderStyle>
            );
        };

        const TextFieldStyle = useMemo(() => {
            return styled(TextField)({
                width: '100%',
            });
        }, []);

        const SelectNoneBoderStyle = styled(Select)({
            width: '100%',
            fieldset: {
                display: 'none',
            },
        });

        const columns = [
            {
                field: 'position',
                headerName: 'Vị trí tuyển dụng',
                flex: 1,
                editable: true,
                type: 'singleSelect',
                renderCell: (params) => <RenderCellSelected params={params} />,
                renderEditCell: (params) => (
                    <RenderEditCellSelected params={params} data={rows} />
                ),
            },
            {
                field: 'amount',
                headerName: 'Số lượng',
                flex: 1,
                editable: true,
                renderCell: renderCell,
                renderEditCell: (params) => (
                    <TextFieldStyle
                        type="number"
                        inputProps={{
                            min: 1,
                            pattern: '\\d+',
                            onInput: function (e) {
                                let value = parseInt(e.target.value);
                                if (value < 0) {
                                    value = 1;
                                }
                                e.target.value = value
                                    .toString()
                                    .replace(/[^0-9]/g, '');
                            },
                        }}
                        value={params.value}
                        onChange={(e) => {
                            params.api.setEditCellValue({
                                ...params,
                                value: e.target.value,
                            });
                        }}
                    />
                ),
            },
            {
                field: 'comis',
                headerName: 'Tiền hoa hồng',
                flex: 1,
                editable: true,
                renderCell: renderCell,
                renderEditCell: (params) => (
                    <TextFieldStyle
                        type="number"
                        inputProps={{
                            min: 1,
                            step: 1,
                            max: 100,
                            pattern: '\\d+',
                            onInput: function (e) {
                                let value = parseInt(e.target.value);
                                if (value < 1) {
                                    value = 1;
                                }
                                if (value > 100) {
                                    value = 100;
                                }
                                e.target.value = value
                                    .toString()
                                    .replace(/[^0-9]/g, '');
                            },
                        }}
                        value={params.value}
                        onChange={(e) => {
                            params.api.setEditCellValue({
                                ...params,
                                value: e.target.value,
                            });
                        }}
                        InputProps={{
                            endAdornment: (
                                <div style={{ fontSize: '1.3rem' }}>%</div>
                            ),
                        }}
                    />
                ),
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                flex: 1,
                cellClassName: 'actions',
                getActions: (params) => {
                    const { id } = params;
                    const isInEditMode =
                        rowModesModel[id]?.mode === GridRowModes.Edit;

                    const row = rows.find(
                        (row) => row.contractDetailsId === id,
                    );

                    if (isInEditMode) {
                        return [
                            <Tooltip title="Lưu">
                                <div>
                                    <GridActionsCellItem
                                        icon={<SaveIcon />}
                                        label="Save"
                                        sx={{
                                            color: 'primary.main',
                                        }}
                                        onClick={handleSaveClick(id)}
                                    />
                                </div>
                            </Tooltip>,
                            <Tooltip title="Hủy">
                                <div>
                                    <GridActionsCellItem
                                        icon={<CancelIcon />}
                                        label="Cancel"
                                        className="textPrimary"
                                        onClick={handleCancelClick(id)}
                                        color="inherit"
                                    />
                                </div>
                            </Tooltip>,
                        ];
                    }

                    const actions = [
                        <Tooltip title="Chỉnh sửa">
                            <div>
                                <GridActionsCellItem
                                    icon={<EditIcon />}
                                    label="Edit"
                                    className="textPrimary"
                                    onClick={handleEditClick(id)}
                                    color="inherit"
                                />
                            </div>
                        </Tooltip>,
                        <Tooltip title="Xóa">
                            <div>
                                <GridActionsCellItem
                                    icon={<DeleteIcon />}
                                    label="Delete"
                                    className="textPrimary"
                                    onClick={handleDeleteClick(id)}
                                    color="inherit"
                                />
                            </div>
                        </Tooltip>,
                    ];

                    return actions;
                },
            },
        ];

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
                setSave(false);
                setOn(true);
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
                    prevRows.filter((row) => row.contractDetailsId !== id),
                );

                const dataRow = apiSubRef.current.getRowModels();

                if (
                    checkAnyRowEdit() ||
                    checkEquality(contractDetailDTOList, dataRow)
                ) {
                    setSave(false);
                } else {
                    setSave(true);
                }
            },
            [],
        );

        function checkEquality(array, map) {
            //const dataEdit = array.filter((item) => item !== undefined);
            console.log(array);
            if (array.length !== map.size) {
                return false;
            }

            for (let i = 0; i < array.length; i++) {
                const arrayElement = array[i];
                const mapElement = map.get(arrayElement.contractDetailsId);

                if (
                    !mapElement ||
                    JSON.stringify(arrayElement) !== JSON.stringify(mapElement)
                ) {
                    return false;
                }
            }

            return true;
        }

        function checkAnyRowEdit() {
            const ids = apiSubRef.current.getAllRowIds();
            for (let id of ids) {
                const mode = apiSubRef.current.getRowMode(id);

                if (mode === 'edit') {
                    return true;
                }
            }
            return false;
        }

        const handleCancelClick = useCallback(
            (id) => () => {
                setOn(false);
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: {
                        mode: GridRowModes.View,
                        ignoreModifications: true,
                    },
                }));

                setRows((prevRows) => {
                    const editedRow = prevRows.find(
                        (row) => row.contractDetailsId === id,
                    );
                    if (editedRow && editedRow.isNew) {
                        return prevRows.filter(
                            (row) => row.contractDetailsId !== id,
                        );
                    }
                    return prevRows;
                });

                const dataRow = apiSubRef.current.getRowModels();
                console.log(dataRow, contractDetailDTOList);
                if (
                    checkAnyRowEdit() ||
                    checkEquality(contractDetailDTOList, dataRow)
                ) {
                    setSave(false);
                } else {
                    setSave(true);
                }
            },
            [],
        );

        const processRowUpdateSub = async (newRow, oldRow) => {
            const updatedRow = { ...newRow, isNew: false };
            setOn(false);

            setRows(
                rows.map((row) =>
                    row.contractDetailsId === newRow.contractDetailsId
                        ? updatedRow
                        : row,
                ),
            );

            setSave(true);

            return updatedRow;
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        const handleCellDoubleClick = (params, event) => {
            event.defaultMuiPrevented = true;
        };

        useImperativeHandle(ref, () => ({
            refresh() {
                setRows(contractDetailDTOList);
                setOn(false);
            },
            getRows() {
                return {
                    key: data.contractId,
                    value: rows,
                };
            },
        }));

        return (
            <DataGrid
                apiRef={apiSubRef}
                {...props}
                autoHeight
                rows={rows}
                getRowId={(row) => row.contractDetailsId}
                columns={columns}
                editMode="row"
                onCellDoubleClick={handleCellDoubleClick}
                // onCellEditStop={handleCellEditStop}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdateSub}
                pageSize={rows.length}
                hideFooter={true}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                columnVisibilityModel={{
                    contractDetailsId: false,
                }}
                slots={{
                    toolbar: CustomToolbarSub,
                    noRowsOverlay: () => (
                        <CustomNoRowsOverlay text="Không có chi tiết hợp đồng!" />
                    ),
                    noResultsOverlay: () => {
                        <CustomNoRowsOverlay text="Không tìm thấy chi tiết hợp đồng!" />;
                    },
                }}
                slotProps={{
                    toolbar: {
                        setRows,
                        setRowModesModel,
                        setOn,
                        on,
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

    const CrudGridContract = forwardRef((props, ref) => {
        const contractsReducer = useSelector((state) => state.contracts.value);

        const apiRef = useGridApiRef();

        const { info } = useSelector((state) => state.infoUser?.value);
        const nameTrainingCenter = 'Trung tâm đào tạo BN';
        const nameEnterprise = info.name;
        const time = dayjs().format('DD-MM-YYYY_HH:mm');

        const { contracts, currentContract, contractsFilter, tabFilter } =
            contractsReducer;

        const { mode, value, data } = contractsFilter;

        const [rows, setRows] = useState(contracts);
        const [rowModesModel, setRowModesModel] = useState({});

        const [openDetails, setOpenDetails] = useState(false);
        const [detailsEdit, setDetailsEdit] = useState(false);

        const [viewCell, setViewCell] = useState(false);

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

        const handleConfirmRemoveClick = async (value, id) => {
            if (value === 'agree') {
                const responsePromise = requestAuth.delete('/contract/delete', {
                    params: {
                        contractId: id,
                    },
                });

                const idToats = toast.promise(responsePromise, {
                    loading: 'Đang xóa hợp đồng...',
                    success: (data) => {
                        const dataResponse = data.data;
                        const code = dataResponse.status;

                        if (code === 200) {
                            getContracts();
                            return NotifierSnackbar({
                                title: 'Thành công ',
                                sub1: 'Xóa hợp đồng thành công!',
                                toast: toast,
                                idToats: idToats,
                            });
                        }
                    },
                    error: (e) => {
                        const responseErr = e?.response.data;
                        const code = e.code;
                        let message;
                        if (code === 'ERR_NETWORK') {
                            message = e.message;
                        } else if (code === 'ERR_BAD_REQUEST') {
                            message = responseErr.message;
                            console.log('Errrr', message);
                        }

                        return NotifierSnackbar({
                            title: 'Thất bại',
                            sub1: 'Xóa hợp đồng thất bại!',
                            sub2: message,
                            toast: toast,
                            idToats: idToats,
                            type: 'error',
                        });
                    },
                });
            }
        };

        const validateDate = useCallback(
            (nameField) => {
                if (nameField) {
                    if (nameField === 'createDate') {
                        const dateMin2 = currentContract.effectiveDate;
                        const dateMin3 = currentContract.terminationDate;
                        return {
                            max:
                                dayjs(dateMin2, DEFAULT_DATE_FORMAT).subtract(
                                    1,
                                    'day',
                                ) ??
                                dayjs(dateMin3, DEFAULT_DATE_FORMAT).subtract(
                                    1,
                                    'day',
                                ),
                            min: dayjs(),
                        };
                    }

                    if (nameField === 'effectiveDate') {
                        const dateMin1 = currentContract.createDate;
                        const dateMin3 = currentContract.terminationDate;
                        return {
                            min: dayjs(dateMin1, DEFAULT_DATE_FORMAT).add(
                                1,
                                'day',
                            ),
                            max: dayjs(dateMin3, DEFAULT_DATE_FORMAT).subtract(
                                1,
                                'day',
                            ),
                        };
                    }

                    if (nameField === 'terminationDate') {
                        const dateMin2 = currentContract.effectiveDate;

                        if (dateMin2) {
                            return {
                                min: dayjs(dateMin2, DEFAULT_DATE_FORMAT).add(
                                    1,
                                    'day',
                                ),
                                max: null,
                            };
                        }
                    }
                }
            },
            [
                currentContract.createDate,
                currentContract.effectiveDate,
                currentContract.terminationDate,
            ],
        );

        const handleEditCellTextChange = useCallback(
            (params, event) => {
                let value = event.target.value;
                if (!value) {
                    value =
                        nameTrainingCenter + '_' + nameEnterprise + '_' + time;
                }
                params.api.setEditCellValue({
                    ...params,
                    value: value,
                });
            },
            [nameEnterprise, time],
        );

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
                        textField={(params) => <TextField {...params} />}
                        format="DD/MM/YYYY"
                        minDate={validateDate(params.field).min}
                        maxDate={validateDate(params.field).max}
                    />
                ),
            [handleEditCellDateChange, validateDate],
        );

        const handleWarningEditClick = async (value, id) => {
            if (value === 'agree') {
                setRowModesModel((prevRowModesModel) => {
                    return {
                        ...prevRowModesModel,
                        [id]: { mode: GridRowModes.Edit },
                    };
                });

                dispatch(
                    setCurrentContract(
                        rows.find((row) => row.contractId === id),
                    ),
                );
            }
        };

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

        const TextFieldStyle = useMemo(() => {
            return styled(TextField)({
                width: '100%',
            });
        }, []);

        const renderCellTextFormat = (params) => {
            const { hasFocus, row, field, colDef } = params;

            const { status } = row;

            const isInViewModeCell = hasFocus;

            if (isInViewModeCell && viewCell) {
                return (
                    <Dialog
                        open={isInViewModeCell && viewCell}
                        fullWidth
                        hideBackdrop
                        maxWidth="md"
                        keepMounted
                        disableScrollLock
                    >
                        <DialogTitle>{colDef.headerName}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Xem thông tin {colDef.headerName}
                            </DialogContentText>
                            <Box
                                sx={{
                                    m: 1,
                                    width: '60%',
                                }}
                            >
                                <ReactQuill
                                    className="view-text"
                                    readOnly
                                    value={params.value}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setViewCell(false);
                                }}
                            >
                                Quay lại
                            </Button>
                        </DialogActions>
                    </Dialog>
                );
            }

            return (
                <ButtonStyle
                    onClick={() => {
                        setViewCell(true);
                    }}
                    sx={{
                        width: '100%',
                    }}
                    variant={
                        status === 'Từ chối' && field === 'note'
                            ? 'contained'
                            : 'outlined'
                    }
                    color={
                        status === 'Từ chối' && field === 'note'
                            ? 'warning'
                            : 'info'
                    }
                >
                    Xem
                </ButtonStyle>
            );
        };

        const columns = [
            {
                field: 'name',
                headerName: 'Tên hợp đồng',
                flex: 2,
                editable: true,
                renderCell: renderCell,
                renderEditCell: (params) => (
                    <TextFieldStyle
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
                valueFormatter: valueFormatDate,
            },
            {
                field: 'effectiveDate',
                headerName: 'Ngày hiệu lực',
                flex: 1,
                type: 'date',
                editable: true,
                //renderCell: renderCell,
                renderEditCell: renderEditCellDate,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'terminationDate',
                headerName: 'Ngày chấm dứt',
                flex: 1,
                editable: true,
                type: 'date',
                // renderCell: renderCell,
                renderEditCell: renderEditCellDate,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                flex: 1,
                renderCell: renderCell,
            },

            {
                field: 'note',
                headerName: ' Ghi chú',
                flex: 1,
                renderCell: renderCellTextFormat,
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                flex: 1,
                cellClassName: 'actions',
                getActions: (params) => {
                    const { id } = params;
                    const isInEditMode =
                        rowModesModel[id]?.mode === GridRowModes.Edit;

                    const row = rows.find((row) => row.contractId === id);
                    if (isInEditMode) {
                        return [
                            <Tooltip title="Lưu">
                                <div>
                                    <GridActionsCellItem
                                        icon={<SaveIcon />}
                                        label="Save"
                                        sx={{
                                            color: 'primary.main',
                                        }}
                                        onClick={handleSaveClick(id)}
                                    />
                                </div>
                            </Tooltip>,
                            <Tooltip title="Hủy">
                                <div>
                                    <GridActionsCellItem
                                        icon={<CancelIcon />}
                                        label="Cancel"
                                        className="textPrimary"
                                        onClick={handleCancelClick(id)}
                                        color="inherit"
                                    />
                                </div>
                            </Tooltip>,
                        ];
                    }

                    const actions = [
                        <Tooltip title="Xem chi tiết">
                            <div>
                                <GridActionsCellItem
                                    icon={<Preview />}
                                    label="preview"
                                    onClick={() => {
                                        setOpenDetails(true);
                                    }}
                                    color="inherit"
                                />
                            </div>
                        </Tooltip>,

                        <Dialog
                            open={openDetails}
                            fullWidth
                            hideBackdrop
                            maxWidth="md"
                            keepMounted
                            disableScrollLock
                        >
                            <DialogTitle
                                sx={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                }}
                            >
                                Chi tiết hợp đồng
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <Accordion
                                        sx={{
                                            mr: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <AccordionSummary
                                            sx={{
                                                mr: 1,
                                            }}
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            <Typography
                                                gutterBottom
                                                sx={{
                                                    fontSize: 15,
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {`Hợp đồng: ${row.name}`}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                                mr: 1,
                                            }}
                                        >
                                            <Typography
                                                sx={{ pl: 2 }}
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {` Ngày tạo: ${row.createDate}`}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                    pl: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {`Ngày bắt đầu: ${row.effectiveDate}`}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {`Ngày kết thúc: ${row.terminationDate}`}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                sx={{ pl: 2 }}
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                Trạng thái: Đã ký
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </DialogContentText>
                                <Box
                                    sx={{
                                        mt: 1,
                                        width: '60%',
                                    }}
                                >
                                    <CrudGridContractDetails
                                        data={row}
                                        setSave={setDetailsEdit}
                                        ref={gridDataSubRef}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setOpenDetails(false);
                                        gridDataSubRef?.current.refresh();
                                    }}
                                >
                                    Quay lại
                                </Button>

                                <Button
                                    style={{
                                        display: detailsEdit ? 'block' : 'none',
                                    }}
                                    variant="outlined"
                                    onClick={() => {
                                        const rowsSubMap =
                                            gridDataSubRef?.current.getRows();

                                        const rowsSub = rowsSubMap.value;
                                        const contractDetailDTOList =
                                            rowsSub.map((rowSub) => {
                                                let id =
                                                    rowSub.contractDetailsId;
                                                if (id.length !== 10) {
                                                    return {
                                                        position:
                                                            rowSub.position,
                                                        amount: rowSub.amount,
                                                        comis: rowSub.comis,
                                                    };
                                                }

                                                return {
                                                    contractDetailsId: id,
                                                    positionId:
                                                        rowSub.position
                                                            .positionId,
                                                    amount: rowSub.amount,
                                                    comis: rowSub.comis,
                                                };
                                            });

                                        const row = rows.find(
                                            (row) =>
                                                row.contractId ===
                                                rowsSubMap.key,
                                        );

                                        const dataRequest = {
                                            ...row,
                                            contractDetailDTOList:
                                                contractDetailDTOList,
                                        };

                                        const responsePromise = requestAuth.put(
                                            '/contract/update',
                                            JSON.stringify(dataRequest),
                                        );

                                        const idToats = toast.promise(
                                            responsePromise,
                                            {
                                                loading: 'Đang xử lý...',
                                                success: (data) => {
                                                    const dataResponse =
                                                        data.data;
                                                    const row =
                                                        dataResponse.data;
                                                    const code =
                                                        dataResponse.status;

                                                    if (code === 200) {
                                                        setRows(
                                                            rows.map((rowPar) =>
                                                                rowPar.contractId ===
                                                                row.contractId
                                                                    ? row
                                                                    : rowPar,
                                                            ),
                                                        );

                                                        setOpenDetails(false);
                                                        return NotifierSnackbar(
                                                            {
                                                                title: 'Thành công ',
                                                                sub1: 'Cập nhật hợp đồng thành công!',
                                                                toast: toast,
                                                                idToats:
                                                                    idToats,
                                                            },
                                                        );
                                                    }
                                                },
                                                error: (e) => {
                                                    const responseErr =
                                                        e?.response.data;
                                                    const code = e.code;
                                                    let message;
                                                    if (
                                                        code === 'ERR_NETWORK'
                                                    ) {
                                                        message = e.message;
                                                    } else if (
                                                        code ===
                                                        'ERR_BAD_REQUEST'
                                                    ) {
                                                        message =
                                                            responseErr.message;
                                                        console.log(
                                                            'Errrr',
                                                            message,
                                                        );
                                                    }

                                                    return NotifierSnackbar({
                                                        title: 'Thất bại',
                                                        sub1: 'Cập nhật hợp đồng thất bại!',
                                                        sub2: message,
                                                        toast: toast,
                                                        idToats: idToats,
                                                        type: 'error',
                                                    });
                                                },
                                            },
                                        );
                                    }}
                                >
                                    Lưu
                                </Button>
                            </DialogActions>
                        </Dialog>,
                    ];

                    if (tabFilter !== 'signed') {
                        actions.push(
                            <Tooltip title="Xóa">
                                <div>
                                    <AlertDialogModalNested
                                        icon={<DeleteIcon />}
                                        onButtonClick={(value) =>
                                            handleConfirmRemoveClick(value, id)
                                        }
                                        subContent={
                                            <Box>
                                                Các thông tin kèm theo sẽ bị mất
                                                <Box
                                                    sx={{
                                                        m: 1,
                                                    }}
                                                >
                                                    <li>
                                                        Thông tin các vị trí
                                                        tuyển dụng
                                                    </li>
                                                </Box>
                                            </Box>
                                        }
                                        maxWidth="sm"
                                    />
                                </div>
                            </Tooltip>,
                            <Tooltip title="Chỉnh sửa">
                                <div>
                                    <GridActionsCellItem
                                        icon={<EditIcon />}
                                        label="edit"
                                        onClick={handleEditClick(id)}
                                        color="inherit"
                                    />
                                </div>
                            </Tooltip>,
                        );
                    } else {
                        actions.push(
                            <Tooltip title="Chỉnh sửa">
                                <div>
                                    <AlertDialogModalNested
                                        icon={<EditIcon />}
                                        onButtonClick={(value) =>
                                            handleWarningEditClick(value, id)
                                        }
                                        status="warning"
                                        content="Hợp đồng đã được xử lý sửa sẽ trở về trạng thái duyệt!"
                                    />
                                </div>
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
            if (filter === 'wait-handler') {
                valueFilter = 'Chờ xử lý';
            }

            apiRef.current.setFilterModel({
                items: [
                    {
                        id: 1,
                        field: 'status',
                        operator: 'contains',
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

        function normalizeDatesInObject(obj) {
            const newObj = { ...obj };
            for (let key in newObj) {
                const formattedDate = formatDate(newObj[key]);
                if (formattedDate) {
                    newObj[key] = formattedDate;
                }
            }
            return newObj;
        }

        function formatDate(isoString) {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) {
                return null;
            } else {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        }

        const processRowUpdate = async (newRow, oldRow) => {
            const updatedRow = { ...newRow, isNew: false };

            const idLoading = toast.loading('Đang cập nhật');
            try {
                const dataRequest = normalizeDatesInObject(newRow);
                let dataRequestNol = {
                    ...dataRequest,
                };
                dataRequestNol = {
                    ...dataRequest,
                    note: '',
                };
                const response = await updateContractApi(
                    requestAuth,
                    dataRequestNol,
                );
                const code = response.status;
                const data = response.data;

                if (code === 200) {
                    setRows(
                        rows.map((row) =>
                            row.contractId === newRow.contractId ? data : row,
                        ),
                    );

                    dispatch(
                        setContractsFromEmpty(
                            rows.map((row) =>
                                row.contractId === newRow.contractId
                                    ? updatedRow
                                    : row,
                            ),
                        ),
                    );
                    dispatch(resetCurrentContract());

                    toast.dismiss(idLoading);
                    toast.custom((t) =>
                        NotifierSnackbar({
                            title: 'Thành công ',
                            sub1: 'Cập nhật hợp đồng thành công!',
                            toast: toast,
                            idToats: t,
                        }),
                    );
                    return updatedRow;
                }
            } catch (e) {
                console.error(e);
                const responseErr = e?.response.data;
                const code = e.code;
                let message;
                if (code === 'ERR_NETWORK') {
                    message = e.message;
                } else if (
                    code === 'ERR_BAD_REQUEST' ||
                    code === 'ERR_BAD_RESPONSE'
                ) {
                    message = responseErr.message;
                }

                toast.dismiss(idLoading);
                toast.custom((t) =>
                    NotifierSnackbar({
                        title: 'Thất bại',
                        sub1: 'Cập nhật hợp đồng không thành công!',
                        sub2: message,
                        toast: toast,
                        idToats: t,
                        type: 'error',
                    }),
                );

                return oldRow;
            }
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        const handleCellDoubleClick = (params, event) => {
            event.defaultMuiPrevented = true;
        };

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
                getContracts();
                handleFilterByStatus(filter);
            },
            setSave(value) {
                setDetailsEdit(value);
            },
        }));

        useEffect(() => {
            getContracts();
        }, []);

        useEffect(() => {
            if (mode === 'quick') {
                apiRef.current.setQuickFilterValues([value]);
            } else {
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

                if (tabFilter === 'wait-handler') {
                    valueTab = 'Chờ xử lý';
                }

                let nameField;
                if (data[0] === 'start') {
                    nameField = 'effectiveDate';
                } else {
                    nameField = 'terminationDate';
                }

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
                            items: [],
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
                if (valueTabFilter === 'wait-handler') {
                    gridDataRef.current.filterByStatus('wait-handler');
                }
            }
        }, [valueTabFilter]);

        return (
            <div>
                <Toaster
                    duration={3000}
                    position="top-right"
                    theme="light"
                    richColors={true}
                />
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
                                    label="Hợp đồng chờ xử lý"
                                    value="wait-handler"
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
            </div>
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
                    DANH SÁCH HỢP ĐỒNG
                </h2>

                <SearchContracts />
            </div>

            <ManagerContracts />
            {/* /dfkjdshisfisdfbsdbfh */}
        </div>
    );
}
