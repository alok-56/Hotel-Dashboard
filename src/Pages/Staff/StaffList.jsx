import React, { useEffect, useMemo, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, IconButton,
    TextField, Stack, Button, Skeleton, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import {
    CreateSalaryApi,
    CreateStaffApi,
    GetAllStaffApi,
    UpdateStaffApi,

} from '../../Api/Services/Staff';
import StaffCreate from './StaffCreate';
import { GetMYProfileApi } from '../../Api/Services/Admin';

export default function StaffList() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [myhotel, setMyhotel] = useState([]);
    const [salaryModalOpen, setSalaryModalOpen] = useState(false);
    const [salaryData, setSalaryData] = useState({
        StaffId: '',
        BranchId: '',
        Year: new Date().getFullYear(),
        Month: new Date().getMonth() + 1,
        Amount: ''
    });

    const columns = [
        { id: 'serial', label: 'S.No', minWidth: 50, isSerial: true },
        { id: 'Name', label: 'Name', minWidth: 150 },
        { id: 'Number', label: 'Contact Number', minWidth: 150 },
        { id: 'Role', label: 'Role', minWidth: 150 },
        { id: 'BranchId.Branchname', label: 'Branch Name', minWidth: 150 },
        { id: 'JoiningDate', label: 'Joining Date', minWidth: 150 },
        { id: 'Salary', label: 'Salary', minWidth: 150 },
        { id: 'Active', label: 'Active', minWidth: 100, render: (active) => (active ? 'Yes' : 'No') },
    ];

    useEffect(() => {
        fetchStaff();
        fetchMYHotels();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await GetAllStaffApi();
            if (res.status) {
                setStaff(res.data);
            } else {
                setStaff([]);
            }
        } catch (error) {
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMYHotels = async () => {
        try {
            const res = await GetMYProfileApi();
            if (res.status) {
                setMyhotel(res.data.Branch || []);
            } else {
                setMyhotel([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = useMemo(() => {
        return staff.filter(st =>
            st.Name?.toLowerCase().includes(search.toLowerCase()) ||
            st.Number?.toString().includes(search) ||
            st.Role?.toLowerCase().includes(search)
        );
    }, [staff, search]);

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    const handleEdit = (staff) => {
        setSelectedData(staff);
        setModalOpen(true);
        setEdit(true);
    };

    const handleCreate = async (formData) => {
        if (!formData.Name || !formData.Number) {
            toast.error("Name and Contact Number are required");
            return;
        }
        setLoading(true);
        try {
            const res = await CreateStaffApi(formData);
            if (res.status) {
                setModalOpen(false);
                toast.success("Staff Added Successfully");
                setSelectedData([]);
                fetchStaff();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error creating staff");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        if (!formData.Name || !formData.Number) {
            toast.error("Name and Contact Number are required");
            return;
        }
        setLoading(true);
        try {
            const res = await UpdateStaffApi(formData, selectedData._id);
            if (res.status) {
                setModalOpen(false);
                toast.success("Staff Updated Successfully");
                setSelectedData([]);
                fetchStaff();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error updating staff");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSalary = async () => {
        if (!salaryData.Amount || !salaryData.StaffId || !salaryData.BranchId) {
            toast.error("Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            const res = await CreateSalaryApi(salaryData);
            if (res.status) {
                setSalaryModalOpen(false);
                toast.success("Salary Added Successfully");
                setSalaryData({ StaffId: '', BranchId: '', Year: '', Month: '', Amount: '' });
                fetchStaff();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error adding salary");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Loader loading={loading} />
            <StaffCreate
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                selectedStaff={selectedData}
                edit={edit}
                onSubmit={handleCreate}
                onEdit={handleUpdate}
                branches={myhotel}
            />

            {/* Salary Modal */}
            <Dialog open={salaryModalOpen} onClose={() => setSalaryModalOpen(false)}>
                <DialogTitle>Add Salary</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Amount"
                        value={salaryData.Amount}
                        onChange={(e) => setSalaryData({ ...salaryData, Amount: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Year"
                        select
                        value={salaryData.Year}
                        onChange={(e) => setSalaryData({ ...salaryData, Year: e.target.value })}
                        sx={{ mb: 2 }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {Array.from({ length: 7 }, (_, index) => 2024 + index).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Month"
                        select
                        value={salaryData.Month}
                        onChange={(e) => setSalaryData({ ...salaryData, Month: e.target.value })}
                        sx={{ mb: 2 }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </TextField>


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSalaryModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddSalary} color="primary">
                        Add Salary
                    </Button>
                </DialogActions>
            </Dialog>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ maxWidth: 300 }}
                />
                <Button variant="contained" onClick={() => {
                    setEdit(false);
                    setSelectedData([]);
                    setModalOpen(true);
                }}>
                    Create Staff
                </Button>
            </Stack>

            <TableContainer sx={{ maxHeight: 740 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
                                    {col.label}
                                </TableCell>
                            ))}
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <TableRow key={idx}>
                                    {columns.map((_, colIdx) => (
                                        <TableCell key={colIdx}><Skeleton variant="text" /></TableCell>
                                    ))}
                                    <TableCell><Skeleton variant="rectangular" width={60} height={20} /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredStaff.length > 0 ? (
                            filteredStaff
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((staff, index) => (
                                    <TableRow hover key={staff._id}>
                                        {columns.map((column) => {
                                            if (column.id === 'serial') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {page * rowsPerPage + index + 1}
                                                    </TableCell>
                                                );
                                            }

                                            const keys = column.id.split('.');
                                            let value = staff;
                                            keys.forEach(key => value = value?.[key]);

                                            return (
                                                <TableCell key={column.id}>
                                                    {column.render
                                                        ? column.render(value)
                                                        : value || '-'}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleEdit(staff)}>
                                                <EditIcon />
                                            </IconButton>
                                            {/* Add salary button */}
                                            <IconButton color="secondary" onClick={() => {
                                                setSalaryData({ ...salaryData, StaffId: staff._id, BranchId: staff.BranchId._id });
                                                setSalaryModalOpen(true);
                                            }}>
                                                <AddIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && filteredStaff.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredStaff.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
}
