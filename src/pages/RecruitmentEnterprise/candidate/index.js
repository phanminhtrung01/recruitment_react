import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

import { Input, Tooltip, styled } from '@mui/material';
import LinearProgress, {
    linearProgressClasses,
} from '@mui/material/LinearProgress';

import {
    TextField,
    // Chip,
    Card,
    CardContent,
    Tab,
    Typography,

    // Box,
    // Grid,
    // Typography,
    Autocomplete,
    Select,
    MenuItem,
    Button,
    Dialog,
    CardActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import { CloudUploadOutlined, Refresh, Preview } from '@mui/icons-material';

import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import {
    enterprisesApi,
    getContractApi,
    getTestsByIdsApi,
    jobsApi,
    jobsByPostApi,
    postsApi,
    updateJobApi,
} from '../../../api/auth';
import useRequestAuth from '../../../hooks/useRequestAuth';
import AlertDialogModalNested from '../../../components/Dialog/index';

import {
    updateJobs,
    setTabFilter,
    setLevelFilter,
    setCurrentJob,
    resetCurrentJob,
    setJobsFromEmpty,
    setJobsFilter,
    resetJobsSelected,
} from '../../../redux/jobsSlice';

import NotifierSnackbar from '../../../components/Notification/notifier-error';
import { Toaster, toast } from 'sonner';

function CandidateEnterpeise() {
    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

    const requestAuth = useRequestAuth();

    const dispatch = useDispatch();

    const contractRef = useRef(null);
    const postRef = useRef(null);

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
        const [post, setPost] = useState(postRef.current);
        const [open, setOpen] = useState(false);
        const [optionsPost, setOptionsPost] = useState([]);

        const handlePostChange = (event, newValue) => {
            setPost(newValue);
        };

        const getPosts = async () => {
            try {
                const response = await postsApi(requestAuth);

                if (response?.status === 200) {
                    setOptionsPost(response.data);
                }
            } catch (e) {
                console.log('CONTRACTS_ERROR');
            }
        };

        useEffect(() => {
            if (open) {
                getPosts();
            }
        }, [open]);

        useEffect(() => {
            if (post) {
                postRef.current = post;
            }
        }, [post]);

        useEffect(() => {
            dispatch(
                setJobsFilter({
                    mode: 'quick',
                    value: post,
                    data: [],
                }),
            );
        }, [post]);

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
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            open={open}
                            sx={{ m: 1, width: '40%' }}
                            disablePortal
                            id="combo-box-contract"
                            options={optionsPost}
                            renderInput={(params) => (
                                <TextField {...params} label="Chọn bài đăng" />
                            )}
                            value={post}
                            getOptionLabel={(option) => option.nameJob}
                            onChange={handlePostChange}
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
        const [openDetails, setOpenDetails] = useState(false);

        const apiRef = useGridApiRef();

        const { jobs, jobsFilter, tabFilter, levelFilter } = jobsReducer;

        const { mode, value, data } = jobsFilter;

        const [rows, setRows] = useState(jobs);
        const [rowModesModel, setRowModesModel] = useState({});

        function RenderPdf(props) {
            const { contentCv } = props;
            let arrayBuffer = Uint8Array.from(atob(contentCv), (c) =>
                c.charCodeAt(0),
            );
            let blob = new Blob([arrayBuffer], { type: 'application/pdf' }); // thay "application/pdf" bằng loại tệp thích hợp
            let url = URL.createObjectURL(blob);
        }

        // apiRef.setQuickFilterValues(['Hợp đồng 5']);

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

        const CrudGridClasses = forwardRef((props, ref) => {
            const apiSubRef = useGridApiRef();

            const { classes } = props;

            const rows = classes;

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

            const BorderLinearProgress = styled(LinearProgress)(
                ({ theme }) => ({
                    height: 5,
                    borderRadius: 5,
                    [`&.${linearProgressClasses.colorPrimary}`]: {
                        backgroundColor:
                            theme.palette.grey[
                                theme.palette.mode === 'light' ? 400 : 800
                            ],
                    },
                    [`& .${linearProgressClasses.bar}`]: {
                        borderRadius: 5,

                        backgroundColor:
                            theme.palette.mode === 'light'
                                ? '#1a90ff'
                                : '#308fe8',
                    },
                }),
            );

            const renderCellProgress = (params) => {
                const value = Math.round(params.value) ?? 0;
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box sx={{ mr: 1, minWidth: 100, flex: 2 }}>
                            <BorderLinearProgress
                                variant="determinate"
                                value={params.value}
                            />
                        </Box>
                        <Box sx={{ minWidth: 35, flex: 1 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >{`${value}%`}</Typography>
                        </Box>
                    </Box>
                );
            };

            const columns = [
                {
                    field: 'name',
                    headerName: 'Tên lớp học',
                    flex: 1,
                },
                {
                    field: 'startDate',
                    headerName: 'Ngày khai giảng',
                    flex: 1,
                    renderCell: renderCell,
                },
                {
                    field: 'endDate',
                    headerName: 'Ngày kết thúc',
                    flex: 1,
                    renderCell: renderCell,
                },
                {
                    field: 'mark',
                    headerName: 'Điểm học phần',
                    flex: 1,
                    renderCell: renderCell,
                },
                {
                    field: 'progress',
                    headerName: 'Tiến độ',
                    flex: 1,
                    renderCell: renderCellProgress,
                },
            ];

            const handleCellDoubleClick = (params, event) => {
                event.defaultMuiPrevented = true;
            };

            return (
                <DataGrid
                    apiRef={apiSubRef}
                    {...props}
                    autoHeight
                    rows={rows}
                    getRowId={(row) => row.classId}
                    columns={columns}
                    editMode="row"
                    onCellDoubleClick={handleCellDoubleClick}
                    pageSize={rows.length}
                    hideFooter={true}
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    columnVisibilityModel={{
                        classId: false,
                    }}
                    slots={{
                        noRowsOverlay: () => (
                            <CustomNoRowsOverlay text="Không có lớp học!" />
                        ),
                        noResultsOverlay: () => {
                            <CustomNoRowsOverlay text="Không tìm thấy lớp học!" />;
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

        const columns = (levelFilter) => {
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

            const RenderCellMarkClasses = (params) => {
                const value = params.value;

                const markClasses = value
                    .map((classE, i) =>
                        classE && classE?.mark
                            ? `Khóa học ${classE.name}: ${classE?.mark}`
                            : 'Chưa có kết quả',
                    )
                    .join(', ');

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
                        {markClasses}
                    </div>
                );
            };

            const RenderCellExam = (params) => {
                const value = params.value;

                let examsStudentStr;
                if (value.length > 0) {
                    examsStudentStr = value
                        .map((exam, i) =>
                            exam && exam?.score
                                ? `Bài thi ${i + 1}: ${exam?.score}`
                                : 'Chưa thi',
                        )
                        .join(', ');
                } else {
                    examsStudentStr = 'Chưa tham gia bài thi nào!';
                }

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
                        {examsStudentStr}
                    </div>
                );
            };

            const RenderCellAverage = (props) => {
                const { params, tabFilter } = props;
                const { row } = params;
                const { examsStudent, classDTOList } = row;
                const key = tabFilter?.key;

                let avg = 0;
                if (key === 'level_1') {
                    const markClasses = classDTOList
                        .map((classE, i) => classE?.mark)
                        .filter((mark) => mark !== null && mark !== undefined);
                    const total = markClasses.reduce((a, b) => a + b, 0);
                    avg = total / markClasses.length;
                } else {
                    const examsStudents = examsStudent
                        .map((exam, i) => exam?.score)
                        .filter(
                            (score) => score !== null && score !== undefined,
                        );
                    const total = examsStudents.reduce((a, b) => a + b, 0);
                    avg = total / examsStudents.length;
                }

                if (isNaN(avg)) {
                    avg = 0;
                }

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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}
                    >
                        {avg}
                    </div>
                );
            };

            const RenderEditCellSelect = ({ params }) => {
                const { value } = params;
                const [openDialogAmount, setOpenDialogAmount] = useState({
                    status: '',
                    value: false,
                    actions: [],
                    revActions: [],
                });

                const statusOptions = ['Đã nhận việc', 'Từ chối'];

                const handleOpenEditNoteClick = async (value, ids, ids1) => {
                    if (value === 'agree') {
                        ids.forEach((id) => {
                            setRowModesModel((prevRowModesModel) => ({
                                ...prevRowModesModel,
                                [id]: {
                                    mode: GridRowModes.View,
                                    ignoreModifications: true,
                                },
                            }));
                        });
                        apiRef.current.setRowSelectionModel(ids1);
                    }
                };

                const currentValueIndex = statusOptions.indexOf(value);
                let availableOptions;
                if (currentValueIndex === -1) {
                    availableOptions = statusOptions;
                } else {
                    availableOptions = statusOptions.slice(currentValueIndex);
                }

                if (!statusOptions.includes(value)) {
                    statusOptions.unshift(value);
                }

                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <SelectNoneBoderStyle
                            value={value}
                            defaultValue={value}
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

                                let i = 0;
                                let check = false;
                                const ids = [];
                                const ids1 = [];
                                const max = +params.row.post.amount;
                                selectedRows.forEach((v, k) => {
                                    if (
                                        event.target.value === 'Đang phỏng vấn'
                                    ) {
                                        if (i < max) {
                                            apiRef.current.setEditCellValue(
                                                {
                                                    id: k,
                                                    field: params.field,
                                                    value: event.target.value,
                                                },
                                                k,
                                            );
                                            ids1.push(k);
                                            i++;
                                        } else {
                                            check = true;
                                            ids.push(k);
                                        }
                                    } else {
                                        apiRef.current.setEditCellValue(
                                            {
                                                id: k,
                                                field: params.field,
                                                value: event.target.value,
                                            },
                                            k,
                                        );
                                    }
                                });

                                if (check) {
                                    setOpenDialogAmount({
                                        status: max,
                                        value: true,
                                        actions: ids,
                                        revActions: ids1,
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

                        {openDialogAmount.value && (
                            <AlertDialogModalNested
                                minimum={true}
                                messagePositive="Đồng ý"
                                status="warning"
                                hideNegative={true}
                                onClose={() => {
                                    setOpenDialogAmount(false);
                                }}
                                onButtonClick={(value) =>
                                    handleOpenEditNoteClick(
                                        value,
                                        openDialogAmount.actions,
                                        openDialogAmount.revActions,
                                    )
                                }
                                content={`Bài đăng chỉ cho phép tối đa ${openDialogAmount.status} lựa chọn với trạng thái đậu`}
                            />
                        )}
                    </div>
                );
            };

            const RenderTests = (props) => {
                const { examsStudent } = props;
                const idsTest = examsStudent.map((exam) => exam.id.testId);
                const [mount, setMount] = useState(false);
                const [indexTest, setIndexTest] = useState(0);
                const [openExams, setOpenExams] = useState(false);
                const [rowsTest, setRowsTest] = useState([]);

                const getTests = async (ids) => {
                    try {
                        const response = await getTestsByIdsApi(
                            requestAuth,
                            ids,
                        );

                        const code = response?.status;
                        const data = response?.data;

                        if (code === 200) {
                            setRowsTest(data);
                        }
                    } catch (error) {
                        console.log('GET_TESTS_ERROR');
                    }
                };
                useEffect(() => {
                    if (!mount) {
                        getTests(idsTest);
                        setMount(true);
                    }
                }, [idsTest, mount]);

                return (
                    <div
                        style={{
                            padding: 5,
                            display: 'flex',
                            rowGap: 10,
                            columnGap: 15,
                        }}
                    >
                        {rowsTest.map((test, i) => {
                            const exam = examsStudent[i];
                            return (
                                <Card
                                    sx={{
                                        maxWidth: '40%',
                                        flex: 1,
                                    }}
                                    key={i}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            component="div"
                                        >
                                            Bài thi: {test.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Thời gian thi: {test.time}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'end',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                setOpenExams(true);
                                                setIndexTest(i);
                                            }}
                                        >
                                            Xem
                                        </Button>
                                        {openExams && i === indexTest && (
                                            <AlertDialogModalNested
                                                minimum={true}
                                                content="Thông tin điểm thi"
                                                messagePositive="Đồng ý"
                                                status={
                                                    exam.score >= 5
                                                        ? 'success'
                                                        : 'error'
                                                }
                                                subContent={
                                                    <RenderExam
                                                        test={test}
                                                        exam={exam}
                                                    />
                                                }
                                                onClose={(v) =>
                                                    setOpenExams(false)
                                                }
                                                hideNegative={true}
                                                maxWidth="sm"
                                            />
                                        )}
                                    </CardActions>
                                </Card>
                            );
                        })}
                    </div>
                );
            };

            const RenderExam = (props) => {
                const { test, exam } = props;
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <Box sx={{ m: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {`Bài thi: ${test.name}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`Điểm số: ${exam.score}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`Ghi chú: ${exam.note}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`Trạng thái: ${exam.status}`}
                            </Typography>
                        </Box>
                    </Box>
                );
            };

            const newRows = data.map((job) => {
                const { examsStudent, classDTOList } = job;
                const examsStudentStr = examsStudent
                    .map((exam, i) => `Bài thi ${i + 1}: ${exam?.score}`)
                    .join(', ');
                const markClasses = classDTOList
                    .map((classE, i) => `Bài thi ${i + 1}: ${classE?.mark}`)
                    .join(', ');
                const newJob = {
                    ...job,
                    examsStudent: examsStudentStr,
                    classDTOList: markClasses,
                };

                return newJob;
            });

            const avgComparator = (v1, v2) => +v1 - +v2;

            return [
                {
                    field: 'name',
                    headerName: 'Tên ứng viên',
                    flex: 2,
                    renderCell: renderCell,
                    valueGetter: (params) => params.row.student?.name,
                },
                {
                    field: 'dateApply',
                    headerName: 'Ngày ứng tuyển',
                    flex: 1,
                    type: 'date',
                    renderCell: renderCell,
                    valueFormatter: valueFormatDate,
                },
                {
                    field: 'salary',
                    headerName: 'Mức lương',
                    flex: 1,
                    renderCell: renderCell,
                    valueGetter: (params) => params.row.post?.salary,
                },
                {
                    field: 'nameJob',
                    headerName: 'Tên vị trí ứng tuyển',
                    flex: 2,
                    renderCell: renderCell,
                    valueFormatter: valueFormatDate,
                    valueGetter: (params) => params.row.post?.nameJob,
                },
                {
                    field: 'status',
                    headerName: 'Trạng thái',
                    flex: 1,
                    editable: levelFilter.key !== 'level_1',
                    type: 'singleSelect',
                    renderEditCell: (params) => (
                        <RenderEditCellSelect params={params} />
                    ),
                },
                {
                    field: 'examsStudent',
                    headerName: 'Điểm các bài thi',
                    flex: 1,
                    renderCell: RenderCellExam,
                },
                {
                    field: 'classDTOList',
                    headerName: 'Điểm học phần',
                    flex: 3,
                    renderCell: RenderCellMarkClasses,
                },
                {
                    field: 'averageMark',
                    headerName: 'Điểm trung bình',
                    flex: 1,
                    sortComparator: avgComparator,
                    renderCell: (params) => (
                        <RenderCellAverage
                            params={params}
                            tabFilter={levelFilter}
                        />
                    ),
                },
                {
                    field: 'actions',
                    type: 'actions',
                    headerName: 'Actions',
                    flex: 1,
                    cellClassName: 'actions',
                    getActions: ({ id }) => {
                        const a = apiRef.current.getSelectedRows();

                        const b =
                            Array.from(a.keys()).includes(id) &&
                            levelFilter.key !== 'level_1';

                        const isInEditMode =
                            rowModesModel[id]?.mode === GridRowModes.Edit;

                        const row = rows.find((row) => row.jobApplyId === id);
                        const { student, post, examsStudent, classDTOList } =
                            row;

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
                                    Chi tiết hồ sơ ứng viên
                                </DialogTitle>
                                <DialogContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 5,
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={2}
                                    >
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
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
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
                                                        {`Thông tin ứng viên: ${student?.name}`}
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
                                                            alignItems:
                                                                'center',
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
                                                            {`Ngày sinh: ${student?.dateOfBirth}`}
                                                        </Typography>
                                                        <Typography
                                                            sx={{ pl: 2 }}
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {`Giới tính: ${student?.gender}`}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            sx={{ pl: 2 }}
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {`Địa chỉ: ${student?.address}`}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
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
                                                            {`Số điện thoại: ${student?.phone}`}
                                                        </Typography>
                                                        <Typography
                                                            sx={{ pl: 2 }}
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {`Email: ${student?.email}`}
                                                        </Typography>
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        </DialogContentText>

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
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
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
                                                        {`Thông tin bài đăng: ${post?.nameJob}`}
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
                                                            alignItems:
                                                                'center',
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
                                                            alignItems:
                                                                'center',
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
                                    </Box>

                                    {levelFilter.key === 'level_2' && (
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
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
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
                                                        {`Thông tin điểm thi: ${student?.name}_${post?.nameJob}`}
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
                                                    {examsStudent.length ===
                                                    0 ? (
                                                        <>
                                                            Chưa có thông tin
                                                            điểm thi của ứng
                                                            viên
                                                        </>
                                                    ) : (
                                                        <RenderTests
                                                            examsStudent={
                                                                examsStudent
                                                            }
                                                        />
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        </DialogContentText>
                                    )}

                                    {levelFilter.key === 'level_1' && (
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
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
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
                                                        {`Thông tin học vấn: ${student?.name}`}
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
                                                    {classDTOList?.length ===
                                                    0 ? (
                                                        <>
                                                            Chưa có thông tin
                                                            học vấn của ứng viên
                                                        </>
                                                    ) : (
                                                        <CrudGridClasses
                                                            classes={
                                                                classDTOList
                                                            }
                                                        />
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        </DialogContentText>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setOpenDetails(false);
                                        }}
                                    >
                                        Quay lại
                                    </Button>
                                </DialogActions>
                            </Dialog>,
                        ];

                        if (row.status === 'Từ Chối') {
                            actions.push(
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

        const processRowUpdate = async (newRow, oldRow) => {
            const updatedRow = { ...newRow, isNew: false };

            const idLoading = toast.loading('Đang thay đổi ...');
            try {
                const response = await updateJobApi(requestAuth, newRow);

                const code = response.status;

                if (code === 200) {
                    setRows(
                        rows.map((row) =>
                            row.jobApplyId === newRow.jobApplyId
                                ? updatedRow
                                : row,
                        ),
                    );

                    dispatch(updateJobs(updatedRow));
                    dispatch(resetCurrentJob());
                    getJobs();

                    toast.dismiss(idLoading);
                    toast.custom((t) =>
                        NotifierSnackbar({
                            title: 'Thành công ',
                            sub1: 'Đã thay đổi trạng thái hồ sơ ứng viên thành công!',
                            toast: toast,
                            idToats: t,
                        }),
                    );

                    return updatedRow;
                }

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
                        sub1: 'Thay đổi trạng thái hồ sơ ứng viên thất bại!',
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

        const getJobs = async () => {
            let params;
            if (tabFilter === 'wait-approve') {
                params = 'Đang xử lý';
            }
            if (tabFilter === 'applied') {
                params = 'Đã nhận việc';
            }
            if (tabFilter === 'denied') {
                params = 'Từ chối';
            }
            if (tabFilter === 'testing') {
                params = 'Đang kiểm tra';
            }

            try {
                const response = await jobsApi(requestAuth, params);

                const status = response.status;

                if (status === 200) {
                    const data = response.data;

                    const newData = data.map((json) => {
                        return { ...json, averageMark: 0 };
                    });
                    dispatch(setJobsFromEmpty(newData));
                    setRows(newData);
                }
            } catch (e) {
                console.log('POSTS_ERROR');
            }
        };

        const getJobsByPost = async (postApplyId) => {
            try {
                const response = await jobsByPostApi(requestAuth, postApplyId);

                const status = response.status;

                if (status === 200) {
                    const data = response.data;

                    dispatch(setJobsFromEmpty(data));

                    let statusName;
                    if (tabFilter === 'wait-approve') {
                        statusName = 'Đang xử lý';
                    }
                    if (tabFilter === 'applied') {
                        statusName = 'Đã nhận việc';
                    }
                    if (tabFilter === 'denied') {
                        statusName = 'Từ chối';
                    }
                    if (tabFilter === 'testing') {
                        statusName = 'Đang kiểm tra';
                    }

                    let newData;
                    if (statusName) {
                        newData = data.filter(
                            (data1) => data1.status === statusName,
                        );
                    } else {
                        newData = data;
                    }

                    console.log(newData, data);
                    setRows(newData);
                }

                return true;
            } catch (e) {
                console.log('JOBS_POSTS_ERROR');
                return false;
            }
        };

        const handleJobsByPost = async (value) => {
            if (value) {
                const check = await getJobsByPost(value.postApplyId);
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
                searchRef.current?.setNull();
                getJobs();
            },
        }));

        useEffect(() => {
            getJobs();
        }, []);

        useEffect(() => {
            handleJobsByPost(value);
        }, [data, mode, value, tabFilter]);

        return (
            <DataGrid
                apiRef={apiRef}
                {...props}
                autoHeight
                getRowHeight={() => 'auto'}
                rows={rows}
                getRowId={(row) => row.jobApplyId}
                columns={columns(levelFilter)}
                editMode="row"
                checkboxSelection={
                    levelFilter.key !== 'level_1' && tabFilter !== 'all'
                }
                onCellDoubleClick={handleCellDoubleClick}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                // sortModel={sortModel}
                // onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                pageSize={rows.length}
                hideFooter={true}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                columnVisibilityModel={{
                    jobApplyId: false,
                    classDTOList: levelFilter.key === 'level_1',
                    examsStudent: levelFilter.key === 'level_2',
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
        const tabFilter = useSelector((state) => state.jobs.value.tabFilter);

        const levelFilter = useSelector(
            (state) => state.jobs.value.levelFilter,
        );
        const [valueTabFilter, setValueTabFilter] = useState(tabFilter);
        const [valueApprove, setValueApprove] = useState(levelFilter);

        const approveOptions = [
            { key: 'level_1', value: 'Xét duyệt đầu vào' },
            { key: 'level_2', value: 'Xét duyệt đầu ra' },
        ];

        const handleChangeTabFilterStatus = (event, newValue) => {
            setValueTabFilter(newValue);
        };

        const handleApproveChange = (event, newValue) => {
            setValueApprove(newValue);
        };

        useEffect(() => {
            if (!valueApprove) {
                setValueApprove({
                    key: 'level_1',
                    value: 'Xét duyệt đầu vào',
                });
                dispatch(
                    setLevelFilter({
                        key: 'level_1',
                        value: 'Xét duyệt đầu vào',
                    }),
                );
            } else {
                dispatch(setLevelFilter(valueApprove));
            }

            if (valueApprove?.key === 'level_1') {
                setValueTabFilter('wait-approve');
            } else {
                setValueTabFilter('testing');
            }
        }, [valueApprove]);

        const TabNoneStyle = styled(Tab)({
            maxWidth: 0,
            minWidth: 0,
            padding: 0,
            height: 0,
        });

        useEffect(() => {
            tabRef.current = valueTabFilter;
            dispatch(setTabFilter(valueTabFilter));
        }, [valueTabFilter]);

        return (
            <div
                style={{
                    marginTop: 10,
                    marginBottom: 10,
                }}
            >
                <h4>Hình thức xét duyệt</h4>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <Autocomplete
                        sx={{ m: 1, width: '40%' }}
                        disablePortal
                        id="combo-box-contract"
                        options={approveOptions}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn kiểu xét duyệt"
                            />
                        )}
                        value={valueApprove}
                        getOptionLabel={(option) => option.value}
                        isOptionEqualToValue={(option, value) =>
                            option.key === value.key
                        }
                        onChange={handleApproveChange}
                        // onInputChange={(event, value, reason) => {
                        //     if (reason === 'clear') {
                        //         dispatch(set(null));
                        //     }
                        // }}
                    />
                </div>
                <div ref={tabRef}>
                    <TabContext value={valueTabFilter}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChangeTabFilterStatus}>
                                <TabNoneStyle
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                        maxWidth:
                                            valueApprove?.key === 'level_1'
                                                ? 360
                                                : 0,
                                        minWidth:
                                            valueApprove?.key === 'level_1'
                                                ? 90
                                                : 0,
                                        minHeight:
                                            valueApprove?.key === 'level_1'
                                                ? 48
                                                : 0,
                                        padding:
                                            valueApprove?.key === 'level_1'
                                                ? '12px 16px'
                                                : 0,
                                    }}
                                    label="Hồ sơ đang chờ duyệt"
                                    value="wait-approve"
                                />

                                <TabNoneStyle
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                        maxWidth:
                                            valueApprove?.key === 'level_2'
                                                ? 360
                                                : 0,
                                        minWidth:
                                            valueApprove?.key === 'level_2'
                                                ? 90
                                                : 0,
                                        minHeight:
                                            valueApprove?.key === 'level_2'
                                                ? 48
                                                : 0,
                                        padding:
                                            valueApprove?.key === 'level_2'
                                                ? '12px 16px'
                                                : 0,
                                    }}
                                    label="Hồ sơ đang kiểm tra"
                                    value="testing"
                                />

                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Hồ sơ đã nhận việc"
                                    value="applied"
                                />
                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Hồ sơ loại"
                                    value="denied"
                                />
                                <TabNoneStyle
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                        maxWidth:
                                            valueApprove?.key === 'level_1'
                                                ? 360
                                                : 0,
                                        minWidth:
                                            valueApprove?.key === 'level_1'
                                                ? 90
                                                : 0,
                                        minHeight:
                                            valueApprove?.key === 'level_1'
                                                ? 48
                                                : 0,
                                        padding:
                                            valueApprove?.key === 'level_1'
                                                ? '12px 16px'
                                                : 0,
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
            </div>
        );
    }

    return (
        <div
            style={{
                paddingLeft: 20,
                paddingRight: 20,
            }}
        >
            <Toaster duration={3000} position="top-right" theme="light" />
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

export default CandidateEnterpeise;
