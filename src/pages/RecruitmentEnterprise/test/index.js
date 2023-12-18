import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useImperativeHandle,
    forwardRef,
    useRef,
} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {
    Collapse,
    Accordion,
    AccordionActions,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Dialog,
    DialogActions,
    DialogContentText,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TimeField } from '@mui/x-date-pickers/TimeField';
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
import { Button, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    CloudUploadOutlined,
    ClearAll,
    AddBoxOutlined,
} from '@mui/icons-material';
import { GridRow } from '@mui/x-data-grid';
import { random, randomId } from '@mui/x-data-grid-generator';

import Tippy from '@tippyjs/react';

import './style.scss';
import {
    updatePost,
    updateTest,
    updateName,
    updateTime,
    updateTestDetails,
    updateTests,
    updateTestsDetailsT,
    setTestsDetailsTS,
    updateTestsDetailsTS,
    resetRegisterTest,
} from '../../../redux/testSlice';
import { useDispatch, useSelector } from 'react-redux';
import { postsApi } from '../../../api/auth';
import useRequestAuth from '../../../hooks/useRequestAuth';
import dayjs from 'dayjs';
import NotifierSnackbar from '../../../components/Notification/notifier-error';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useGridApiRef } from '@mui/x-data-grid-pro';

function Test() {
    const navigate = useNavigate();
    const requestAuth = useRequestAuth();
    const dispatch = useDispatch();
    const [testNameA, setTestNameA] = useState('');
    const [testsA, setTestsA] = useState([]);
    const [post, setPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [testSelected, setTestSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const handlePostChange = (event, newValue) => {
        setPost(newValue);
    };

    const handleClickTestRow = (row) => {
        if (testSelected === row) {
            setTestSelected(null);
            dispatch(updateTest(null));
        } else {
            setTestSelected(row);
            dispatch(updateTest(row));
        }
    };

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

    function CustomPagination() {
        return null;
    }

    const CustomToolbarContainer = styled(GridToolbarContainer)({
        display: 'flex',
        justifyContent: 'space-between',
    });

    function CustomToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const handleAddClick = () => {
            const id = randomId();
            setRows((oldRows) => [
                ...oldRows,
                { id, question: '', answer: '', descriptions: '', isNew: true },
            ]);

            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'question' },
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
                        disabled={!testSelected ? true : false}
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
                        disabled={!testSelected ? true : false}
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
                        disabled={!testSelected ? true : false}
                        variant="text"
                        component="label"
                        startIcon={<AddBoxOutlined />}
                        onClick={handleAddClick}
                    >
                        THÊM CÂU HỎI
                    </AddButton>
                    <ClearButton
                        disabled={!testSelected ? true : false}
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
                    disabled={!testSelected ? true : false}
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

    function CustomToolbarSub(props) {
        const { setRows } = props;

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
                        disabled={!testSelected ? true : false}
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
                        disabled={!testSelected ? true : false}
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

                <GridToolbarQuickFilter
                    disabled={!testSelected ? true : false}
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
                        fontSize: '1.1rem',
                    }}
                >
                    {text}
                </div>
            </GridOverlay>
        );
    }

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: '#f9f8b6',
        },
        '&:hover': {
            backgroundColor: '#fcfbaa',
        },
        '&.Mui-selected': {
            backgroundColor: '#fefd8b',
        },
        '&.Mui-selected:hover': {
            backgroundColor: '#ebe984',
        },
    }));

    function CrudGridTestDetails() {
        const tests = useSelector((state) => state.registerTest.value.tests);
        const testR = useSelector((state) => state.registerTest.value.test);

        const testDetails = tests.find((testP) => testP.t.id === testR?.id)?.ts;

        const TextFieldStyle = useMemo(() => {
            return styled(TextField)({
                width: '100%',
            });
        }, []);

        const handleEditCellTextChange = useCallback((params, event) => {
            let value = event.target.value;

            params.api.setEditCellValue({
                ...params,
                value: value,
            });
        }, []);

        const columns = [
            {
                field: 'question',
                headerName: 'Câu hỏi',
                flex: 1,
                editable: true,
                renderEditCell: (params) => (
                    <TextFieldStyle
                        value={params.value}
                        onChange={(event) =>
                            handleEditCellTextChange(params, event)
                        }
                        placeholder="Nhập câu hỏi"
                    />
                ),
            },

            {
                field: 'answer',
                headerName: 'Câu trả lời',
                flex: 1,
                renderEditCell: (params) => (
                    <TextFieldStyle
                        value={params.value}
                        onChange={(event) =>
                            handleEditCellTextChange(params, event)
                        }
                        placeholder="Nhập câu trả lời"
                    />
                ),
                editable: true,
            },
            {
                field: 'type',
                headerName: 'Loại câu hỏi',
                flex: 1,
                editable: true,
                type: 'singleSelect',
                valueOptions: [
                    'Trắc nghiệm',
                    'Tự luận',
                    'Nhiều lựa chọn',
                    'Tổng hợp',
                ],
            },
            {
                field: 'descriptions',
                headerName: 'Mô tả',
                flex: 1,
                renderEditCell: (params) => (
                    <TextFieldStyle
                        value={params.value}
                        onChange={(event) =>
                            handleEditCellTextChange(params, event)
                        }
                        placeholder="Nhập mô tả"
                    />
                ),
                editable: true,
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
                            <GridActionsCellItem
                                icon={<SaveIcon />}
                                label="Save"
                                sx={{
                                    color: 'primary.main',
                                }}
                                onClick={handleSaveClick(id)}
                            />,
                            <GridActionsCellItem
                                icon={<CancelIcon />}
                                label="Cancel"
                                className="textPrimary"
                                onClick={handleCancelClick(id)}
                                color="inherit"
                            />,
                        ];
                    }

                    return [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={handleDeleteClick(id)}
                            color="inherit"
                        />,
                    ];
                },
            },
        ];
        const [rows, setRows] = useState(testDetails ? testDetails : []);
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
                dispatch(
                    setTestsDetailsTS({
                        id: testR.id,
                        testDetails: rows.filter((row) => row.id !== id),
                    }),
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
            //console.log('processRowUpdate', newRow);
            const updatedRow = { ...newRow, isNew: false };
            setRows(
                rows.map((row) => (row.id === newRow.id ? updatedRow : row)),
            );

            dispatch(
                updateTestsDetailsTS({ id: testR.id, testDetails: newRow }),
            );

            return updatedRow;
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        useEffect(() => {
            if (!rows[rows.length - 1]?.isNew) {
                console.log(rows);
                //setTestDetails(rows);
            }
        }, [rows]);

        return (
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                editMode="row"
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
                        <CustomNoRowsOverlay
                            text={
                                !testSelected
                                    ? 'Chọn bài thi'
                                    : 'Không có dữ liệu'
                            }
                        />
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
    }

    const RegisterTest = (props) => {
        //const test = useSelector((state) => state.registerTest.value.test);
        // const testDetails = test.testDetails;

        const { post } = props;

        const [testName, setTestName] = useState(testNameA);
        const [time, setTime] = useState(null);
        const [mark, setMark] = useState(0);
        const [tests, setTests] = useState(testsA);

        const handleTestNameChange = (e) => {
            setTestName(e.target.value);
        };

        const handleTimeChange = (value, context) => {
            setTime(value);
        };

        const addTestRow = () => {
            const id = randomId();
            const newTest = {
                id: id,
                testName,
                time,
                mark,
            };

            setTests([...tests, newTest]);
            setTestsA([...tests, newTest]);
            setTime(null);
            const timeNow = dayjs().format('DD-MM-YYYY_HH:mm:ss');
            const name = post ? 'Bài thi ' + post.nameJob + '_' + timeNow : '';
            setTestNameA(name);
            setTestName(name);
        };

        const deleteTestRow = (testPar) => {
            const newTests = tests.filter((test) => test.id !== testPar.id);
            setTests(newTests);
            console.log('delete test');
            setTestsA(newTests);
        };

        const handleMarkChange = (e) => {
            setMark(e.target.value);
        };

        useEffect(() => {}, [time]);

        useEffect(() => {
            dispatch(updateTestsDetailsT(tests));
        }, [tests]);

        return (
            <div className="tests-info">
                <div className="test-info">
                    <div>
                        <h5>Tên bài thi</h5>
                        <TextField
                            disabled={!post}
                            sx={{ m: 1, width: '80%' }}
                            label="Nhập thông tin tên bài thi"
                            onChange={handleTestNameChange}
                            value={testName}
                        />
                    </div>
                    <div>
                        <h5>Thời gian bài thi</h5>
                        <Tippy
                            placement="auto-start"
                            content="Chuyển đổi ngôn ngữ nhập US (United States)"
                        >
                            <TimeField
                                disabled={!post}
                                sx={{ m: 1, width: '40%' }}
                                label="Nhập thời gian bài thi"
                                onChange={handleTimeChange}
                                value={time}
                            />
                        </Tippy>
                    </div>
                    <div>
                        <h5>Điểm xét duyệt</h5>
                        <Tippy
                            placement="auto-start"
                            content="Chuyển đổi ngôn ngữ nhập US (United States)"
                        >
                            <TextField
                                label="Nhập điểm"
                                type="number"
                                sx={{
                                    m: 1,
                                    width: '30%',
                                }}
                                inputProps={{
                                    min: 1,
                                    max: 10,
                                    step: 1,
                                    pattern: '\\d+',
                                    onInput: function (e) {
                                        e.target.value = Math.max(
                                            0,
                                            parseInt(e.target.value),
                                        )
                                            .toString()
                                            .replace(/[^0-9]/g, '');
                                        if (e.target.value > 10) {
                                            e.target.value = 10;
                                        }
                                    },
                                }}
                                value={mark}
                                onChange={handleMarkChange}
                            />
                        </Tippy>
                    </div>
                    <div>
                        <Button
                            disabled={
                                testName?.length === 0 || !time || mark === 0
                            }
                            sx={{
                                width: '20%',
                                float: 'right',
                            }}
                            variant="contained"
                            onClick={addTestRow}
                        >
                            Thêm bài thi
                        </Button>
                    </div>
                </div>
                <div className="test-list">
                    <h5>Danh sách bài thi</h5>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên bài thi</TableCell>
                                    <TableCell align="right">
                                        Thời gian thi
                                    </TableCell>
                                    <TableCell align="right">
                                        Điểm xét duyệt
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tests.length === 0 ? (
                                    <TableRow>
                                        <TableCell align="center" colSpan={6}>
                                            Chưa có bài thi
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tests?.map((row, index) => (
                                        <StyledTableRow
                                            key={index}
                                            sx={{
                                                '&:last-child td, &:last-child th':
                                                    {
                                                        border: 0,
                                                    },
                                                backgroundColor:
                                                    row === testSelected
                                                        ? 'lightgray'
                                                        : '#f9f8b6',
                                            }}
                                            selected={row === testSelected}
                                            onClick={() =>
                                                handleClickTestRow(row)
                                            }
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row.testName}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.time.format('HH:mm')}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.mark}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() =>
                                                        deleteTestRow(row)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        );
    };

    const SubmitButton = () => {
        const registerTest = useSelector((state) => state.registerTest.value);
        const { tests, test, post } = registerTest;
        const testDetails = tests.find((testP) => testP.t.id === test?.id)?.ts;
        const renderRef = useRef();

        const RenderSubmit = forwardRef((props, ref) => {
            const [openDetails, setOpenDetails] = useState(false);
            const { tests } = props;
            const testDTOS = tests?.map((data) => {
                const { t, ts } = data;
                const { id, testName, time, mark } = t;

                const testDetailDTOS = ts.map((t) => {
                    const { id, question, answer, descriptions, type } = t;

                    return {
                        id: id ? id : randomId(),
                        question: question,
                        answer: answer,
                        type: type,
                        descriptions: descriptions,
                    };
                });

                return {
                    id: id ? id : randomId(),
                    time: dayjs(time).format('HH:mm'),
                    name: testName,
                    testDay: dayjs().format('DD/MM/YYYY'),
                    benchmarkJobDTO: { minMark: +mark },
                    isRegister: true,
                    testDetailDTOS: testDetailDTOS,
                };
            });

            const data = {
                testDTOS: testDTOS,
                postApplyId: post?.postApplyId,
            };

            console.log(data);

            const handleSubmitClick = (data) => {
                const responsePromise = requestAuth.post(
                    '/test/create',
                    JSON.stringify(data),
                );
                const idToats = toast.promise(responsePromise, {
                    loading: 'Đang kiểm tra ...',
                    success: (data) => {
                        setTimeout(() => {
                            navigate('../posts', { replace: true });
                            dispatch(resetRegisterTest());
                        }, 2500);

                        return NotifierSnackbar({
                            title: 'Thành công',
                            sub1: 'Tạo bài thi thành công!',
                            sub2: 'Danh sách bài thi sẽ thấy ở chi tiết bài đăng. Hãy chú ý theo dõi!',
                            toast: toast,
                            idToats: idToats,
                        });
                    },
                    error: (e) => {
                        console.log(e);
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
                            sub1: 'Tạo bài thi không thành công!',
                            sub2: message,
                            toast: toast,
                            idToats: idToats,
                            type: 'error',
                        });
                    },
                });
            };

            const CollapsibleDataGrid = forwardRef((props, ref) => {
                const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
                const [open, setOpen] = useState({});
                const { data } = props;
                const { testDTOS } = data;
                const [rows, setRows] = useState(testDTOS);
                const [rowsSub, setRowsSub] = useState([]);

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
                        headerName: 'Tên bài thi',
                        flex: 2,
                        renderCell: renderCell,
                    },
                    {
                        field: 'time',
                        headerName: 'Thời gian làm bài',
                        flex: 1,
                        renderCell: renderCell,
                    },
                    {
                        field: 'expand',
                        flex: 1,
                        headerName: 'Xem chi tiết bài thi',
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

                const columnsSub = [
                    {
                        field: 'question',
                        headerName: 'Câu hỏi',
                        flex: 1,
                        renderCell: renderCell,
                    },
                    {
                        field: 'answer',
                        headerName: 'Câu trả lời',
                        flex: 1,
                        valueFormatter: valueFormatDate,
                        renderCell: renderCell,
                    },
                    {
                        field: 'type',
                        headerName: 'Loại câu hỏi',
                        flex: 1,
                        valueFormatter: valueFormatDate,
                        renderCell: renderCell,
                    },
                    {
                        field: 'descriptions',
                        headerName: 'Mô tả câu trả lời',
                        flex: 1,
                        renderCell: renderCell,
                    },
                ];

                useImperativeHandle(ref, () => ({
                    setEmpty() {
                        setRows([]);
                        setRowsSub([]);
                    },
                }));

                return (
                    <DataGrid
                        sx={{
                            w: 1,
                            marginLeft: 1,
                            marginRight: 1,
                            marginBottom: 2,
                            height: 300,
                        }}
                        rows={rows ? rows : []}
                        columns={columns}
                        columnVisibilityModel={{
                            id: false,
                            testDay: false,
                            isRegister: false,
                        }}
                        getRowId={(row) => row.id}
                        hideFooter={true}
                        onRowClick={(params) => {
                            const id = params.id;
                            if (!open[id]) {
                                const testDTO = testDTOS.find(
                                    (ts) => ts.id === id,
                                );

                                const { testDetailDTOS } = testDTO;

                                setRowsSub(testDetailDTOS);
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
                                                    {`Chi tiết : ${params.row.name}`}
                                                </h3>
                                                {rowsSub.length > 0 ? (
                                                    <DataGrid
                                                        sx={{
                                                            w: 1,
                                                            m: 1,
                                                        }}
                                                        rows={rowsSub}
                                                        columns={columnsSub}
                                                        columnVisibilityModel={{
                                                            id: false,
                                                        }}
                                                        getRowId={(row) =>
                                                            row.id
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
                                                        Chưa có chi tiết bài thi
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
            });

            useImperativeHandle(ref, () => ({
                open() {
                    setOpenDetails(true);
                },
            }));

            return (
                <Dialog
                    open={openDetails}
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
                        Thông tin xác nhận
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
                                        m: 0,
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
                                        {`Thông tin bài đăng: ${
                                            post ? post.nameJob : ''
                                        }`}
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
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                pl: 2,
                                                width: 200,
                                            }}
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {`Ngày đăng tin: ${post?.datePost}`}
                                        </Typography>
                                        <Typography
                                            sx={{ pl: 2 }}
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {`Ngày hết hạn: ${post?.dateExpire}`}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                pl: 2,
                                                width: 200,
                                            }}
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {`Tuổi: ${post?.age}`}
                                        </Typography>
                                        <Typography
                                            sx={{ pl: 2 }}
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {`Giới tính: ${post?.gender}`}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{ pl: 2 }}
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {`Số lượng: ${post?.amount}`}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{ pl: 2 }}
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {`Mức lương: ${post?.salary}`}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{ pl: 2 }}
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {`Địa chỉ: ${post?.workAddress}`}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            sx={{ pl: 2 }}
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {`Trạng thái: ${post?.status}`}
                                        </Typography>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </DialogContentText>
                        <Box>
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
                                    Thông tin bài thi
                                </h3>
                                <CollapsibleDataGrid data={data} />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setOpenDetails(false);
                                handleSubmitClick(data);
                            }}
                        >
                            Xác nhận
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpenDetails(false);
                            }}
                        >
                            Quay lại
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        });

        return (
            <div>
                <Button
                    disabled={
                        !testSelected ||
                        !post ||
                        !testNameA ||
                        !testsA ||
                        !(testsA.length !== 0) ||
                        !testDetails ||
                        !(testDetails.length !== 0)
                    }
                    sx={{
                        width: '20%',
                        float: 'right',
                    }}
                    onClick={() => {
                        renderRef.current.open();
                    }}
                    variant="contained"
                >
                    ĐĂNG KÝ BÀI THI
                </Button>
                <RenderSubmit ref={renderRef} tests={tests} />
            </div>
        );
    };

    const getPosts = async () => {
        try {
            const params = {
                tested: true,
            };
            const response = await postsApi(requestAuth, params);

            const code = response?.status;
            const data = response?.data;

            if (code === 200) {
                setPosts(data);
            }
        } catch (error) {
            console.log('POST_ERROR');
        }
    };

    useEffect(() => {
        dispatch(updatePost(post));
        const time = dayjs().format('DD-MM-YYYY_HH:mm:ss');
        const name = post ? 'Bài thi ' + post.nameJob + '_' + time : '';
        setTestNameA(name);
    }, [post]);

    useEffect(() => {
        if (posts.length === 0) {
            if (open) {
                getPosts();
            }
        }
    }, [posts, open]);

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div className="test-page">
            <Toaster
                duration={3000}
                position="top-right"
                theme="light"
                richColors={true}
            />
            <h1>ĐĂNG KÝ BÀI THI</h1>
            <div className="test-container">
                <div className={`test-contract`}>
                    <h2>THÔNG TIN BÀI ĐĂNG</h2>
                    <div className={`test-position contract`}>
                        <div
                            style={{
                                flex: 2,
                            }}
                        >
                            <h5>Bài đăng</h5>
                            <Autocomplete
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                sx={{ m: 1 }}
                                disablePortal
                                id="combo-box-contract"
                                options={posts}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Chọn bài đăng"
                                    />
                                )}
                                value={post}
                                getOptionLabel={(option) => option.nameJob}
                                isOptionEqualToValue={(option, value) =>
                                    option.postApplyId === value.postApplyId
                                }
                                onChange={handlePostChange}
                            />
                        </div>
                    </div>

                    {post && (
                        <Accordion
                            sx={{
                                mr: 1,
                                mb: 1,
                            }}
                        >
                            <AccordionSummary
                                sx={{
                                    mr: 1,
                                    m: 0,
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
                                    {`Thông tin bài đăng: ${
                                        post ? post.nameJob : ''
                                    }`}
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            pl: 2,
                                            width: 200,
                                        }}
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {`Ngày đăng tin: ${post?.datePost}`}
                                    </Typography>
                                    <Typography
                                        sx={{ pl: 2 }}
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {`Ngày hết hạn: ${post?.dateExpire}`}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            pl: 2,
                                            width: 200,
                                        }}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {`Tuổi: ${post?.age}`}
                                    </Typography>
                                    <Typography
                                        sx={{ pl: 2 }}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {`Giới tính: ${post?.gender}`}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{ pl: 2 }}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {`Số lượng: ${post?.amount}`}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{ pl: 2 }}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {`Mức lương: ${post?.salary}`}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{ pl: 2 }}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {`Địa chỉ: ${post?.workAddress}`}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        sx={{ pl: 2 }}
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {`Trạng thái: ${post?.status}`}
                                    </Typography>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </div>

                <div className={`test-register`}>
                    <h2>ĐĂNG KÝ</h2>
                    <div className="test-container">
                        <RegisterTest post={post} />

                        <div className="test-details">
                            <h5>Chi tiết bài thi</h5>
                            <div>
                                <CrudGridTestDetails />
                            </div>
                            {/* csdc */}
                        </div>
                    </div>
                </div>
            </div>

            <SubmitButton />
        </div>
    );
}

export default Test;
