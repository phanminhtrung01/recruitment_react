import { useState, useEffect, useMemo, useCallback } from 'react';
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
import Collapse from '@mui/material/Collapse';
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

import { randomId } from '@mui/x-data-grid-generator';

import Tippy from '@tippyjs/react';

import './style.scss';

function Test() {

    const contractsData = ['Hợp đồng 1', 'Hợp đồng 2', 'Hợp đồng 3'];
    const jobsData = {
        'Hợp đồng 1': [
            {
                job: 'Lập trình web',
                amount: 5,
            },
            {
                job: 'Thiết kế giao diện',
                amount: 3,
            },
        ],
        'Hợp đồng 2': [
            {
                job: 'Phân tích dữ liệu',
                amount: 4,
            },
            {
                job: 'Quản lý dự án',
                amount: 2,
            },
        ],
        'Hợp đồng 3': [
            {
                job: 'Lập trình di động',
                amount: 6,
            },
            {
                job: 'Thiết kế UX/UI',
                amount: 4,
            },
        ],
    };

    const [contract, setContract] = useState(null);
    const [tests, setTests] = useState([]);
    const [job, setJob] = useState(null);
    const [testDetails, setTestDetails] = useState([]);
    const [testName, setTestName] = useState('');
    const [time, setTime] = useState(null);

    const [testSelected, setTestSelected] = useState(null);

    const handleContractChange = (event, newValue) => {
        setContract(newValue);
        setJob(null);
    };

    const handleJobChange = (event, newValue) => {
        setJob(newValue);
    };

    const handleTestNameChange = (e) => {
        setTestName(e.target.value);
    };

    const handleTimeChange = (value, context) => {
        setTime(value);
    };

    const handleClickTestRow = (row) => {
        if (testSelected === row) {
            setTestSelected(null);
        } else {
            setTestSelected(row);
        }
    };

    const addTestRow = () => {
        const newTest = {
            testName,
            time,
        };
        setTests([...tests, newTest]);
        setTestName('');
        setTime(null);
    };

    const deleteTestRow = (testPar) => {
        setTests(tests.filter((test) => test.testName !== testPar.testName));
    };

    useEffect(() => {
        console.log(time);
    }, [time]);


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

    function CrudGridTestDetails({ testDetails }) {
        const columns = [
            {
                field: 'question',
                headerName: 'Câu hỏi',
                flex: 1,
                editable: true,
            },
            {
                field: 'answer',
                headerName: 'Câu trả lời',
                flex: 1,

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
        const [rows, setRows] = useState(testDetails);
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
            //console.log('processRowUpdate', newRow);
            const updatedRow = { ...newRow, isNew: false };
            setRows(
                rows.map((row) => (row.id === newRow.id ? updatedRow : row)),
            );

            return updatedRow;
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        useEffect(() => {
            if (!rows[rows.length - 1]?.isNew) {
                console.log(rows);
                setTestDetails(rows);
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
            />
        );
    }

    return (
        <div className="test-page">
            <h1>ĐĂNG KÝ BÀI THI</h1>
            <div className="test-container">
                <div className={`test-contract`}>
                    <h2>THÔNG TIN BÀI THI</h2>
                    <div className={`test-position contract`}>
                        <div
                            style={{
                                flex: 2,
                            }}
                        >
                            <h5>Hợp đồng bài thi</h5>
                            <Autocomplete
                                sx={{ m: 1 }}
                                disablePortal
                                id="combo-box-contract"
                                options={contractsData}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Chọn hợp đồng"
                                    />
                                )}
                                value={contract}
                                getOptionLabel={(option) => option}
                                onChange={handleContractChange}
                            />
                        </div>
                        <div
                            style={{
                                flex: 1,
                            }}
                        >
                            <h5>Vị trí đăng ký</h5>
                            <Autocomplete
                                sx={{ m: 1 }}
                                disablePortal
                                disabled={!contract}
                                id="combo-box-position"
                                options={contract ? jobsData[contract] : []}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Chọn công việc"
                                    />
                                )}
                                value={contract ? job : null}
                                getOptionLabel={(option) => option.job}
                                onChange={handleJobChange}
                                isOptionEqualToValue={(option, value) =>
                                    option.job === value.job
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className={`test-register`}>
                    <h2>ĐĂNG KÝ</h2>
                    <div className="test-container">
                        <div className="tests-info">
                            <div className="test-info">
                                <div>
                                    <h5>Tên bài thi</h5>
                                    <TextField
                                        disabled={!contract || !job}
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
                                            disabled={!contract || !job}
                                            sx={{ m: 1, width: '40%' }}
                                            label="Nhập thời gian bài thi"
                                            onChange={handleTimeChange}
                                            value={time}
                                        />
                                    </Tippy>
                                </div>
                                <div>
                                    <Button
                                        disabled={
                                            testName?.length === 0 || !time
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
                                    <Table
                                        size="small"
                                        aria-label="a dense table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Tên bài thi
                                                </TableCell>
                                                <TableCell align="right">
                                                    Thời gian thi
                                                </TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tests.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        align="center"
                                                        colSpan={6}
                                                    >
                                                        Chưa có bài thi
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                tests.map((row, index) => (
                                                    <StyledTableRow
                                                        key={index}
                                                        sx={{
                                                            '&:last-child td, &:last-child th':
                                                                {
                                                                    border: 0,
                                                                },
                                                            backgroundColor:
                                                                row ===
                                                                testSelected
                                                                    ? 'lightgray'
                                                                    : '#f9f8b6',
                                                        }}
                                                        selected={
                                                            row === testSelected
                                                        }
                                                        onClick={() =>
                                                            handleClickTestRow(
                                                                row,
                                                            )
                                                        }
                                                    >
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            {row.testName}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.time.format(
                                                                'HH:mm',
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                onClick={() =>
                                                                    deleteTestRow(
                                                                        row,
                                                                    )
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
                        <div className="test-details">
                            <h5>Chi tiết bài thi</h5>
                            <div>
                                <CrudGridTestDetails
                                    testDetails={testDetails}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Button
                    disabled={testDetails.length === 0}
                    sx={{
                        width: '20%',
                        float: 'right',
                    }}
                    variant="contained"
                >
                    ĐĂNG KÝ BÀI THI
                </Button>
            </div>
        </div>
    );
}

export default Test;
