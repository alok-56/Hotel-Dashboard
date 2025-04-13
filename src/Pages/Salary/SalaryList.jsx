import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, Skeleton, TextField, Box
} from '@mui/material';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import { GetAllSalaryApi } from '../../Api/Services/Staff';

export default function SalaryList() {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns = [
        { id: 'StaffId.Name', label: 'Staff Name', minWidth: 150 },
        { id: 'BranchId.Branchname', label: 'Branch Name', minWidth: 150 },
        { id: 'Amount', label: 'Amount', minWidth: 150 },
        { id: 'Month', label: 'Month', minWidth: 100 },
        { id: 'Year', label: 'Year', minWidth: 100 },
        { id: 'CreatedAt', label: 'Created At', minWidth: 150 }
    ];

    useEffect(() => {
        fetchSalaries();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = salaries.filter((salary) =>
                salary.StaffId.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                salary.BranchId.Branchname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSalaries(filtered);
        } else {
            setFilteredSalaries(salaries);
        }
    }, [searchTerm, salaries]);

    const fetchSalaries = async () => {
        setLoading(true);
        try {
            const res = await GetAllSalaryApi();
            if (res.status) {
                setSalaries(res.data);
            } else {
                setSalaries([]);
            }
        } catch (error) {
            toast.error('Error fetching salary data');
            setSalaries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page number when rows per page is changed
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Loader loading={loading} />

            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Search by Staff Name or Branch"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <TableContainer sx={{ maxHeight: 740 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <TableRow key={idx}>
                                    {columns.map((_, colIdx) => (
                                        <TableCell key={colIdx}><Skeleton variant="text" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : filteredSalaries.length > 0 ? (
                            filteredSalaries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((salary) => (
                                <TableRow hover key={salary._id}>
                                    {columns.map((column) => {
                                        const value = column.id.split('.').reduce((o, i) => o[i], salary); // To handle nested fields like StaffId.Name
                                        return (
                                            <TableCell key={column.id}>
                                                {value || '-'}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No salary data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && filteredSalaries.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredSalaries.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
}
