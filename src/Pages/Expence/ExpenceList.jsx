import React, { useEffect, useMemo, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, IconButton,
    TextField, Stack, Button, Skeleton, TableFooter
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import { GetMYProfileApi } from '../../Api/Services/Admin';
import { CreateExpenseApi, DeleteExpenseApi, GetAllExpenseApi, UpdateExpenseApi } from '../../Api/Services/Expence';
import ExpenseCreate from './ExpenceCreate';

export default function ExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [branches, setBranches] = useState([]);

    const columns = [
        { id: 'serial', label: 'S.No', minWidth: 50, isSerial: true },
        { id: 'ExpenseName', label: 'Expense Name', minWidth: 150 },
        { id: 'Amount', label: 'Amount', minWidth: 100 },
        { id: 'Month', label: 'Month', minWidth: 100 },
        { id: 'Year', label: 'Year', minWidth: 100 },
        { id: 'BranchId.Branchname', label: 'Branch Name', minWidth: 150 },
        { id: 'BranchId.Location', label: 'Branch Location', minWidth: 200 },
    ];

    useEffect(() => {
        fetchExpenses();
        fetchBranches();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await GetAllExpenseApi();
            setExpenses(res?.data || []);
        } catch {
            toast.error("Failed to fetch expenses");
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await GetMYProfileApi();
            setBranches(res?.data?.Branch || []);
        } catch {
            setBranches([]);
        }
    };

    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp =>
            exp.ExpenseName?.toLowerCase().includes(search.toLowerCase()) ||
            exp.BranchId?.Branchname?.toLowerCase().includes(search.toLowerCase())
        );
    }, [expenses, search]);

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    const handleEdit = (expense) => {
        setSelectedData(expense);
        setEdit(true);
        setModalOpen(true);
    };

    const handleCreate = async (formData) => {
        if (!formData.ExpenseName || !formData.Amount || !formData.BranchId) {
            toast.error("Please fill all required fields");
            return;
        }
        setLoading(true);
        try {
            const res = await CreateExpenseApi(formData);
            if (res.status) {
                toast.success("Expense added successfully");
                setModalOpen(false);
                setSelectedData([]);
                fetchExpenses();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Error creating expense");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        if (!formData.ExpenseName || !formData.Amount || !formData.BranchId) {
            toast.error("Please fill all required fields");
            return;
        }
        setLoading(true);
        try {
            const res = await UpdateExpenseApi(formData, selectedData._id);
            if (res.status) {
                toast.success("Expense updated successfully");
                setModalOpen(false);
                setSelectedData([]);
                fetchExpenses();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Error updating expense");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        setLoading(true);
        try {
            const res = await DeleteExpenseApi(id);
            if (res.status) {
                toast.success("Expense deleted successfully");
                fetchExpenses();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Error deleting expense");
        } finally {
            setLoading(false);
        }
    };

    const getMonthName = (monthNumber) => {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[monthNumber - 1] || '-';
    };

    const totalAmount = filteredExpenses.reduce((total, expense) => total + parseFloat(expense.Amount || 0), 0);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Loader loading={loading} />
            <ExpenseCreate
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                selectedExpense={selectedData}
                edit={edit}
                onSubmit={handleCreate}
                onEdit={handleUpdate}
                branches={branches}
            />

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
                    Create Expense
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
                        ) : filteredExpenses.length > 0 ? (
                            filteredExpenses
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((expense, index) => (
                                    <TableRow hover key={expense._id}>
                                        {columns.map((column) => {
                                            if (column.id === 'serial') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {page * rowsPerPage + index + 1}
                                                    </TableCell>
                                                );
                                            }

                                            const keys = column.id.split('.');
                                            let value = expense;
                                            keys.forEach(key => value = value?.[key]);

                                            if (column.id === 'Month') {
                                                value = getMonthName(parseInt(value));
                                            }

                                            return (
                                                <TableCell key={column.id}>
                                                    {column.render
                                                        ? column.render(value)
                                                        : value || '-'}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleEdit(expense)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(expense._id)}>
                                                <DeleteIcon />
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
                    {filteredExpenses.length > 0 && (
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={columns.length} align="right">
                                    <strong>Total Amount:</strong>
                                </TableCell>
                                <TableCell align="right">
                                    <strong>{totalAmount.toFixed(2)}</strong>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </TableContainer>

            {!loading && filteredExpenses.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredExpenses.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
}
