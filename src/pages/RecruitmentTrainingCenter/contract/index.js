import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { GridRow } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

import {
    Divider,
    Slide,
    Tooltip,
    styled,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Collapse,
    DialogContentText,
    Autocomplete,
} from '@mui/material';
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
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    CloudUploadOutlined,
    ClearAll,
    AddBoxOutlined,
    Refresh,
    WarningRounded,
    Preview,
    ArrowRightAltOutlined,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import dayjs from 'dayjs';
import { renderToString } from 'react-dom/server';
import {
    setContractsFromEmpty,
    resetCurrentContract,
    updateEnterprise,
} from '../../../redux/contractsSlice';
import {
    contractsAllApi,
    enterprisesApi,
    getAmountByPositionsApi,
    getClassByPositionApi,
    getTimeByPositionsApi,
    updateStatusContractApi,
} from '../../../api/auth';
import useRequestAuth from '../../../hooks/useRequestAuth';
import { useDispatch, useSelector } from 'react-redux';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';

import NotifierSnackbar from '../../../components/Notification/notifier-error';
import { Toaster, toast } from 'sonner';
import ReactQuill from 'react-quill';
import AlertDialogModalNested from '../../../components/Dialog';

export default function ContractEnterPrise() {
    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
    const requestAuth = useRequestAuth();
    const [valueTabFilter, setValueTabFilter] = useState('wait-approve');
    const gridDataRef = useRef();
    const gridDataSubRef = useRef();

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

    const CustomToolbarSub = forwardRef((props, ref) => {
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

    function CustomToolbar(props) {
        const { setRows } = props;

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
                    <ButtonStyle
                        variant="text"
                        component="label"
                        startIcon={<Refresh />}
                        onClick={() => {
                            handleRefreshClick();
                        }}
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

    const CrudGridContractDetails = forwardRef((props, ref) => {
        const apiSubRef = useGridApiRef();

        const { data } = props;
        const { contractDetailDTOList } = data;

        const [rows, setRows] = useState(contractDetailDTOList);

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

        const columns = [
            {
                field: 'position',
                headerName: 'Vị trí tuyển dụng',
                flex: 1,
                type: 'singleSelect',
                renderCell: (params) => <RenderCellSelected params={params} />,
            },
            {
                field: 'amount',
                headerName: 'Số lượng',
                flex: 1,
                renderCell: renderCell,
            },
            {
                field: 'comis',
                headerName: 'Tiền hoa hồng',
                flex: 1,
                renderCell: renderCell,
            },
        ];

        useImperativeHandle(ref, () => ({
            refresh() {
                setRows(contractDetailDTOList);
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
                        showQuickFilter: true,
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
        const dispatch = useDispatch();
        const apiRef = useGridApiRef();
        const [openDetails, setOpenDetails] = useState(false);
        const [idDetails, setIdDetails] = useState(0);
        const contractsReducer = useSelector((state) => state.contracts.value);
        const { contracts, enterprise } = contractsReducer;
        const [viewCell, setViewCell] = useState(false);

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

        const handleCheckTimeClick = async (row) => {
            const { contractDetailDTOList } = row;
            const positionIds = contractDetailDTOList.map(
                (c) => c.position.positionId,
            );

            const response = await getTimeByPositionsApi(
                requestAuth,
                positionIds,
            );

            const code = response.status;
            const data = response.data;
            if (code === 200) {
                const { timeCompatibility, timeCompatibilityPositions } = data;

                const dateContract = dayjs(row.terminationDate, 'DD/MM/YYYY');
                const dateCompatibility = dayjs(
                    timeCompatibility,
                    'DD/MM/YYYY',
                );
                if (dateContract.isBefore(dateCompatibility)) {
                    let note;
                    if (timeCompatibilityPositions.length > 0) {
                        note = (
                            <div>
                                <b>Thời hạn hợp đồng:</b>
                                <br />
                                <p>
                                    Thời gian phù hợp của vị trí với các khóa
                                    học:
                                    <ul>
                                        {timeCompatibilityPositions.map(
                                            (t, i) => {
                                                const lcds = t.localDates;

                                                return (
                                                    <li key={i}>
                                                        {t.position.name}:{' '}
                                                        {lcds.length > 3
                                                            ? lcds
                                                                  .slice(0, 3)
                                                                  .join(', ') +
                                                              '...'
                                                            : lcds.join(', ')}
                                                    </li>
                                                );
                                            },
                                        )}
                                    </ul>
                                    <p>
                                        {'==> '} Thời gian khuyến nghị tối thiểu
                                        cho hợp đồng: {timeCompatibility}
                                    </p>
                                </p>
                            </div>
                        );
                    } else {
                        note = (
                            <b>
                                <p>Chưa có khóa học phù hợp cho vị trí này</p>
                            </b>
                        );
                    }

                    const str = renderToString(note);

                    return str;
                }
            }

            return '';
        };

        const handleCheckAmountClick = async (row) => {
            const { contractDetailDTOList } = row;

            const response = await getAmountByPositionsApi(
                requestAuth,
                contractDetailDTOList,
            );

            const code = response.status;
            const data = response.data;
            if (code === 200) {
                const { amountCompatibility, amountCompatibilityPositions } =
                    data;

                const outsideThresholdAny = amountCompatibilityPositions.some(
                    (element) => element.outsideThreshold,
                );

                if (outsideThresholdAny) {
                    let note;
                    if (amountCompatibilityPositions.length > 0) {
                        note = (
                            <div>
                                <b>Số lượng ứng viên:</b>
                                <br />
                                <p>
                                    Số lượng ứng viên đang theo học khóa học phù
                                    hợp với vị trí này:
                                    <ul>
                                        {amountCompatibilityPositions.map(
                                            (t, i) => {
                                                const { position, maxAmount } =
                                                    t;

                                                return (
                                                    <li key={i}>
                                                        {position.name}:{' '}
                                                        {maxAmount}
                                                    </li>
                                                );
                                            },
                                        )}
                                    </ul>
                                    <p>
                                        {'==> '} Cập nhật lại số lượng ứng tuyển
                                        khuyến nghị cho hợp đồng!
                                    </p>
                                </p>
                            </div>
                        );
                    } else {
                        note = (
                            <b>
                                <p>
                                    Chưa có ứng viên học khóa học phù hợp cho vị
                                    trí này
                                </p>
                            </b>
                        );
                    }

                    const str = renderToString(note);
                    return str;
                }
            }

            return '';
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

        function CollapsibleDataGrid(props) {
            const [open, setOpen] = useState({});
            const { data } = props;
            const { contractDetailDTOList } = data;

            const [rows, setRows] = useState(contractDetailDTOList);
            const [rowsSub, setRowsSub] = useState([]);

            const columns = [
                {
                    field: 'position',
                    headerName: 'Vị trí tuyển dụng',
                    flex: 1,
                    renderCell: (params) => (
                        <RenderCellSelected params={params} />
                    ),
                },
                {
                    field: 'amount',
                    headerName: 'Số lượng',
                    flex: 1,
                },
                {
                    field: 'comis',
                    headerName: 'Tiền hoa hồng',
                    flex: 1,
                },
                {
                    field: 'expand',
                    flex: 1,
                    headerName: 'Xem lớp học phù hợp',
                    renderCell: (params) => (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen((prevOpen) => ({
                                    ...prevOpen,
                                    [params.id]: !prevOpen[params.id],
                                }));
                            }}
                        >
                            {open[params.id] ? 'Thu gọn' : 'Xem chi tiết'}
                        </Button>
                    ),
                },
            ];

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

            const columnsSub = [
                {
                    field: 'name',
                    headerName: 'Tên lớp học',
                    flex: 1,
                    renderCell: renderCell,
                },
                {
                    field: 'startDate',
                    headerName: 'Ngày khai giảng',
                    flex: 1,
                    valueFormatter: valueFormatDate,
                    renderCell: renderCell,
                },
                {
                    field: 'endDate',
                    headerName: 'Ngày kết thúc',
                    flex: 1,
                    valueFormatter: valueFormatDate,
                    renderCell: renderCell,
                },
                {
                    field: 'sizeClass',
                    headerName: 'Sỉ số',
                    flex: 1,
                    renderCell: renderCell,
                },
                {
                    field: 'present',
                    headerName: 'Hiện có',
                    flex: 1,
                    renderCell: renderCell,
                },
            ];

            const getClassByPosition = async (positionId) => {
                try {
                    const response = await getClassByPositionApi(
                        requestAuth,
                        positionId,
                    );

                    const code = response.status;
                    const data = response.data;
                    if (code === 200) {
                        setRowsSub(data);
                    }
                } catch (e) {}
            };

            return (
                <DataGrid
                    sx={{
                        w: 1,
                        marginLeft: 1,
                        marginRight: 1,
                        marginBottom: 2,
                        height: 350,
                    }}
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.contractDetailsId}
                    hideFooter={true}
                    onRowClick={(params) => {
                        const id = params.id;
                        // setOpen((prevOpen) => ({
                        //     ...prevOpen,
                        //     [id]: !prevOpen[id],
                        // }));

                        if (!open[id]) {
                            getClassByPosition(params.row.position.positionId);
                        }
                    }}
                    slots={{
                        row: (params) => {
                            return (
                                <div>
                                    <GridRow {...params}></GridRow>
                                    <Collapse
                                        in={
                                            params.selected &&
                                            open[params.rowId]
                                        }
                                    >
                                        <Box
                                            margin={2}
                                            sx={{
                                                width: '90%',
                                                h: 1,
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontSize: '1.4rem',
                                                }}
                                            >
                                                Lớp học phù hợp
                                            </h3>
                                            {rowsSub.length > 0 ? (
                                                <DataGrid
                                                    sx={{
                                                        w: 1,
                                                        m: 1,
                                                    }}
                                                    rows={rowsSub}
                                                    columns={columnsSub}
                                                    getRowId={(row) =>
                                                        row.classId
                                                    }
                                                    hideFooter={true}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        margin: 1,
                                                    }}
                                                >
                                                    Chưa có lớp học phù hợp
                                                </div>
                                            )}
                                        </Box>
                                    </Collapse>
                                </div>
                            );
                        },
                    }}
                />
            );
        }

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
            () => (params) =>
                dayjs(params.value, DEFAULT_DATE_FORMAT).format(
                    DEFAULT_DATE_FORMAT,
                ),
            [],
        );

        const RenderEditCellSelect = ({ params }) => {
            const { row } = params;
            const [valueNote, setValueNote] = useState(row.note);
            const [openEditNote, setOpenEditNote] = useState({
                status: '',
                value: false,
            });
            const [editNote, setEditNote] = useState(false);

            const statusOptions = ['Chờ xử lý', 'Đã ký', 'Từ chối'];
            if (!statusOptions.includes(params.value)) {
                statusOptions.unshift(params.value);
            }

            const currentValueIndex = statusOptions.indexOf(params.value);
            let availableOptions;
            if (currentValueIndex === -1) {
                availableOptions = statusOptions;
            } else {
                availableOptions = statusOptions.slice(currentValueIndex);
            }

            const handleOpenEditNoteClick = async (value, id) => {
                if (value === 'agree') {
                    setEditNote(true);
                }
            };

            useEffect(() => {
                console.log(valueNote);
            }, [valueNote]);

            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <SelectNoneBoderStyle
                        value={params.value}
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

                            const value = event.target.value;
                            selectedRows.forEach((v, k) => {
                                apiRef.current.setEditCellValue(
                                    {
                                        id: k,
                                        field: params.field,
                                        value: value,
                                    },
                                    k,
                                );
                            });

                            if (value === 'Từ chối' || value === 'Chờ xử lý') {
                                setOpenEditNote({
                                    status: value,
                                    value: true,
                                });
                            }
                        }}
                    >
                        {availableOptions.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </SelectNoneBoderStyle>
                    {openEditNote.value && (
                        <AlertDialogModalNested
                            minimum={true}
                            messagePositive="Cập nhật"
                            onButtonClick={(value) =>
                                handleOpenEditNoteClick(value, params.id)
                            }
                            onClose={(value) => {
                                if (value === 'negative') {
                                    const id = params.id;
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
                                            return prevRows.filter(
                                                (row) => row.contractId !== id,
                                            );
                                        }
                                        return prevRows;
                                    });
                                }
                            }}
                            status="warning"
                            content={`Cập nhật lý do từ ${openEditNote.status}`}
                        />
                    )}

                    <Dialog
                        open={editNote}
                        fullWidth
                        hideBackdrop
                        maxWidth="md"
                        keepMounted
                        disableScrollLock
                    >
                        <DialogTitle>Ghi chú</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Cập nhật Thông tin Ghi chú
                            </DialogContentText>
                            <Box
                                sx={{
                                    m: 1,
                                    w: 1,
                                    display: 'flex',
                                    gap: 1,
                                }}
                            >
                                <ReactQuill
                                    style={{
                                        height: 350,
                                    }}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter' ||
                                            event.key === 'Tab'
                                        ) {
                                            event.stopPropagation();
                                        }
                                    }}
                                    onChange={setValueNote}
                                    value={valueNote}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            onClick={async () => {
                                                const str =
                                                    await handleCheckTimeClick(
                                                        row,
                                                    );
                                                setValueNote((value) =>
                                                    value + value
                                                        ? '<br />'
                                                        : '' + str,
                                                );
                                            }}
                                        >
                                            Kiểm tra thời hạn
                                        </Button>
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            onClick={async () => {
                                                const str =
                                                    await handleCheckAmountClick(
                                                        row,
                                                    );
                                                setValueNote(
                                                    (value) =>
                                                        value + '<br />' + str,
                                                );
                                            }}
                                        >
                                            Kiểm tra số lượng
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setEditNote(false);

                                    const id = params.id;
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
                                            return prevRows.filter(
                                                (row) => row.contractId !== id,
                                            );
                                        }
                                        return prevRows;
                                    });
                                }}
                            >
                                Quay lại
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    params.api.setEditCellValue(
                                        {
                                            id: params.id,
                                            field: 'note',
                                            value: valueNote,
                                        },
                                        params.id,
                                    );

                                    setRowModesModel((prevRowModesModel) => {
                                        return {
                                            ...prevRowModesModel,
                                            [params.id]: {
                                                mode: GridRowModes.View,
                                                field: 'note',
                                                cellToFocusAfter: 'right',
                                            },
                                        };
                                    });

                                    setEditNote(false);
                                }}
                            >
                                Lưu
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        };

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
                                    style={{
                                        height: 'auto',
                                    }}
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

        const RenderDetails = (props) => {
            const { rows, id, open } = props;
            const [openSub, setOpen] = useState(open);
            const [checkFast, setCheckFast] = useState({
                check: false,
                value: '',
            });

            const row = rows.find((row) => row.contractId === id);

            return (
                <Dialog
                    open={openSub}
                    fullWidth
                    hideBackdrop
                    maxWidth="lg"
                    keepMounted
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
                        <DialogContentText
                            sx={{
                                display: 'inline',
                            }}
                        >
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
                                        {`Trạng thái: ${row.status}`}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Box>
                                <Box
                                    sx={{
                                        mt: 1,
                                    }}
                                >
                                    <CrudGridContractDetails
                                        data={row}
                                        ref={gridDataSubRef}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        width: '50%',
                                        mt: 1,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={async () => {
                                            const strCheckAmount =
                                                await handleCheckAmountClick(
                                                    row,
                                                );
                                            const strCheckTime =
                                                await handleCheckTimeClick(row);
                                            if (
                                                !strCheckAmount ||
                                                !strCheckTime
                                            ) {
                                                setCheckFast({
                                                    check: true,
                                                    value:
                                                        strCheckTime +
                                                        strCheckAmount,
                                                });
                                            }
                                        }}
                                    >
                                        Kiểm tra nhanh
                                    </Button>
                                    {checkFast.check && (
                                        <AlertDialogModalNested
                                            maxWidth="md"
                                            headerTitle="Kiểm tra nhanh"
                                            minimum={true}
                                            onClose={(v) => {
                                                setCheckFast({
                                                    check: false,
                                                    value: '',
                                                });
                                            }}
                                            messagePositive="Xác nhận"
                                            status="warning"
                                            hideNegative={true}
                                            content={
                                                checkFast.value ? (
                                                    <ReactQuill
                                                        style={{
                                                            height: 'auto',
                                                        }}
                                                        readOnly
                                                        value={checkFast.value}
                                                    />
                                                ) : (
                                                    'Thời gian và số lượng thỏa mãn!'
                                                )
                                            }
                                        />
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        width: '100%',
                                        mt: 1,
                                    }}
                                >
                                    <h3
                                        style={{
                                            marginTop: 5,
                                            fontSize: '1.6rem',
                                            marginBottom: 5,
                                        }}
                                    >
                                        Thông tin vị trí tuyển dụng
                                    </h3>
                                    <CollapsibleDataGrid data={row} />
                                </Box>
                            </Box>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpenDetails(false);
                                setOpen(false);
                            }}
                        >
                            Quay lại
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        };

        const columns = [
            {
                field: 'name',
                headerName: 'Tên hợp đồng',
                flex: 2,
                renderCell: renderCell,
            },
            {
                field: 'createDate',
                headerName: 'Ngày tạo',
                flex: 1,
                type: 'date',
                renderCell: renderCell,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'effectiveDate',
                headerName: 'Ngày hiệu lực',
                flex: 1,
                type: 'date',
                renderCell: renderCell,
                valueFormatter: valueFormatDate,
            },
            {
                field: 'terminationDate',
                headerName: 'Ngày chấm dứt',
                flex: 1,
                renderCell: renderCell,
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
                renderCell: renderCell,
                renderEditCell: (params) => (
                    <RenderEditCellSelect params={params} />
                ),
            },
            {
                field: 'note',
                headerName: ' Ghi chú',
                flex: 1,
                editable: true,

                renderCell: renderCellTextFormat,
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
                        <Tooltip title="Xem chi tiết">
                            <GridActionsCellItem
                                icon={<Preview />}
                                label="preview"
                                onClick={() => {
                                    setOpenDetails(true);
                                    setIdDetails(id);
                                }}
                                color="inherit"
                            />
                            {idDetails === id && openDetails && (
                                <RenderDetails
                                    rows={rows}
                                    id={id}
                                    open={openDetails}
                                />
                            )}
                        </Tooltip>,
                    ];
                },
            },
        ];

        const [rows, setRows] = useState(contracts);

        const [rowModesModel, setRowModesModel] = useState({});

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
                        operator: 'is',
                        value: valueFilter,
                    },
                ],
            });
        };

        const handleFilterByStatusAndEnterprise = (filter, enterpriseId) => {
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

            getContracts(enterpriseId);

            apiRef.current.setFilterModel({
                items: [
                    {
                        id: 1,
                        field: 'status',
                        operator: 'is',
                        value: valueFilter,
                    },
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

        const processRowUpdate = async (newRow, oldRow) => {
            const updatedRow = { ...newRow, isNew: false };

            const { status } = newRow;
            let dataRequest = newRow;
            if (status === 'Đã ký') {
                dataRequest = { ...newRow, note: '' };
            }
            const idLoading = toast.loading('Đang thay đổi ...');
            try {
                const response = await updateStatusContractApi(
                    requestAuth,
                    dataRequest,
                );

                const code = response.status;

                if (code === 200) {
                    dispatch(resetCurrentContract());

                    setRows(
                        rows.map((row) =>
                            row.contractId === newRow.contractId
                                ? updatedRow
                                : row,
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

                    handleFilterByStatus('wait-approve');

                    toast.dismiss(idLoading);
                    toast.custom((t) =>
                        NotifierSnackbar({
                            title: 'Thành công ',
                            sub1: 'Đã thay đổi trạng thái hợp đồng thành công!',
                            toast: toast,
                            idToats: t,
                        }),
                    );

                    return updatedRow;
                }

                toast.dismiss(idLoading);
                toast.custom((t) =>
                    NotifierSnackbar({
                        title: 'Thất bại',
                        sub1: 'Trạng thái hợp đồng chưa thay đổi. Hãy thử lại!',
                        toast: toast,
                        idToats: t,
                    }),
                );

                return oldRow;
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
                        sub1: 'Thay đổi trạng thái hợp đồng thất bại!',
                        sub2: message,
                        toast: toast,
                        idToats: t,
                        type: 'error',
                    }),
                );

                return oldRow;
            }
        };

        const getContracts = async (enterpriseId) => {
            try {
                const response = await contractsAllApi(requestAuth);

                const status = response.status;

                if (status === 200) {
                    const data = response.data;
                    let filteredContracts = data;
                    if (enterpriseId) {
                        filteredContracts = data.filter((row) => {
                            const enterprise = row.enterprise;

                            return enterprise.enterpriseId === enterpriseId;
                        });
                    }
                    setRows(filteredContracts);
                    dispatch(setContractsFromEmpty(filteredContracts));
                }
            } catch (e) {
                console.log('CONTRACTS_ERROR');
            }
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        const handleCellDoubleClick = (params, event) => {
            event.defaultMuiPrevented = true;
        };

        useEffect(() => {
            getContracts(enterprise ? enterprise.enterpriseId : null);
        }, []);

        useImperativeHandle(ref, () => ({
            refresh() {
                getContracts(enterprise ? enterprise.enterpriseId : null);
            },
            filterByStatus(filter) {
                handleFilterByStatus(filter);
            },
            filterByStatusAndEnterprise(filter, enterpriseId) {
                handleFilterByStatusAndEnterprise(filter, enterpriseId);
            },
        }));

        return (
            <DataGrid
                apiRef={apiRef}
                {...props}
                autoHeight
                rows={rows}
                columns={columns}
                getRowId={(row) => row.contractId}
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
                    noResultsOverlay: () => (
                        <CustomNoRowsOverlay text="Không tìm thấy hợp đồng!" />
                    ),
                    //pagination: CustomPagination,
                }}
                slotProps={{
                    toolbar: {
                        setRows,
                        showQuickFilter: true,
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

    const SearchContract = forwardRef((props, ref) => {
        const dispatch = useDispatch();
        const contractsReducer = useSelector((state) => state.contracts.value);
        const { enterprise } = contractsReducer;
        const [enterpriseSelect, setEnterprise] = useState(enterprise);

        const [optionsEnterprise, setOptionsEnterprise] = useState([]);

        const [openSelectEnterprise, setOpenSelectEnterprise] = useState(false);

        const handleEnterpriseChange = (event, newValue) => {
            setEnterprise(newValue);
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

        useImperativeHandle(ref, () => ({
            setNull() {
                setEnterprise(null);
            },
        }));

        useEffect(() => {
            if (enterpriseSelect) {
                gridDataRef.current.filterByStatusAndEnterprise(
                    valueTabFilter,
                    enterpriseSelect.enterpriseId,
                );
                dispatch(updateEnterprise(enterpriseSelect));
            }
        }, [dispatch, enterpriseSelect]);

        useEffect(() => {
            if (openSelectEnterprise) {
                getEnterprises();
            }
        }, [openSelectEnterprise]);

        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <h4>Chọn doanh nghiệp</h4>
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
                            value={enterpriseSelect}
                            getOptionLabel={(option) => option.name}
                            onChange={handleEnterpriseChange}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'clear') {
                                    dispatch(updateEnterprise(null));
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    });

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
        <>
            <Toaster duration={3000} position="top-right" theme="light" />
            <div
                style={{
                    padding: '10px',
                }}
            >
                <h2>QUẢN LÝ HỢP ĐỒNG</h2>
                <div>
                    <div>
                        <SearchContract />
                    </div>
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
                                label="Hợp đồng đã ký"
                                value="signed"
                            />
                            <Tab
                                style={{
                                    fontSize: '1.2rem',
                                    textTransform: 'none',
                                }}
                                label="Hợp đồng đang xử lý"
                                value="wait-handler"
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
                </TabContext>
            </div>

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
