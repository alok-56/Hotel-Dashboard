import React, { useEffect, useMemo, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, IconButton,
    TextField, Stack, Button, Skeleton, Avatar, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import { CreateAdminApi, DeleteAdminApi, GetAllAdminApi, UpdateAdminApi } from '../../Api/Services/Admin';
import AdminCreate from './AdminCreate';
import { GetAllHotelApi } from '../../Api/Services/Hotel';

export default function AdminList() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalopen, setModalopen] = useState(false)
    const [selectedData, setSelectedData] = useState([])
    const [edit, setEdit] = useState(false)
    const [hotel, setHotel] = useState([])

    const columns = [
        { id: 'serial', label: 'S.No', minWidth: 50, isSerial: true },
        { id: 'Name', label: 'Name', minWidth: 150 },
        { id: 'Username', label: 'Username', minWidth: 150 },
        {
            id: 'Branch',
            label: 'Access Branch',
            minWidth: 200,
            render: (branches) =>
                Array.isArray(branches)
                    ? branches.map((b) => b.Branchname).join(', ')
                    : '-'
        }
        ,
        { id: 'Permission', label: 'Permissions', minWidth: 200, render: (permissions) => permissions.join(', ') },
        { id: 'Blocked', label: 'Blocked', minWidth: 100, render: (blocked) => (blocked ? 'Yes' : 'No') },
    ];

    useEffect(() => {
        fetchAdmins();
        fetchHotels()
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await GetAllAdminApi();
            if (res.status) {
                setAdmins(res.data)
            } else {
                setAdmins([])
            }
        } catch (error) {
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchHotels = async () => {
        try {
            const res = await GetAllHotelApi();
            setHotel(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            setHotel([]);
        }
    };

    const filteredAdmins = useMemo(() => {
        return admins.filter(admin =>
            admin.Name?.toLowerCase().includes(search.toLowerCase()) ||
            admin.Username?.toLowerCase().includes(search.toLowerCase())
        );
    }, [admins, search]);

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    const handleEdit = (admin) => {
        setSelectedData(admin)
        setModalopen(true)
        setEdit(true)
    };

    const handleDelete = async (admin) => {
        setLoading(true)
        try {
            let res = await DeleteAdminApi(admin._id);
            if (res.status) {
                fetchAdmins();
                toast.success("Admin Deleted Successfully");
            } else {
                toast.error(res.message);
                setLoading(false);
            }
        } catch (error) {
            toast.error("Error deleting admin");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (formData) => {
        if (!formData.Name) {
            toast.error("Name is required");
            return;
        } else if (!formData.Username) {
            toast.error("Username is required");
            return;
        }
        setLoading(true);
        try {
            let res = await CreateAdminApi(formData);  
            if (res.status) {
                setModalopen(false);
                toast.success("Admin Added Successfully");
                setSelectedData([]);
                fetchAdmins();
            } else {
                toast.error(res.message);
                setLoading(false);
            }
        } catch (error) {
            toast.error("Error creating admin");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        if (!formData.Name) {
            toast.error("Name is required");
            return;
        } else if (!formData.Username) {
            toast.error("Username is required");
            return;
        }
        setLoading(true);

        try {
            let res = await UpdateAdminApi(formData, selectedData._id);
            if (res.status) {
                setModalopen(false);
                toast.success("Admin Updated Successfully");
                setSelectedData([]);
                fetchAdmins();
            } else {
                toast.error(res.message);
                setLoading(false);
            }
        } catch (error) {
            toast.error("Error updating admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Loader loading={loading} />
            <AdminCreate open={modalopen} onClose={() => setModalopen(false)} selectedAdmin={selectedData} edit={edit} onSubmit={handleCreate} onEdit={handleUpdate} hotel={hotel} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ maxWidth: 300 }}
                />
                <Button variant="contained" color="primary" onClick={() => {
                    setEdit(false);
                    setSelectedData([]);
                    setModalopen(true);
                }}>
                    Create Admin
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
                        ) : filteredAdmins.length > 0 ? (
                            filteredAdmins
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((admin, index) => (
                                    <TableRow hover key={admin._id}>
                                        {columns.map((column) => {
                                            if (column.id === 'serial') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {page * rowsPerPage + index + 1}
                                                    </TableCell>
                                                );
                                            }

                                            const value = admin[column.id];

                                            return (
                                                <TableCell key={column.id}>
                                                    {column.render
                                                        ? column.render(value)
                                                        : Array.isArray(value)
                                                            ? value.join(', ')
                                                            : value || '-'}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleEdit(admin)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(admin)}>
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
                </Table>
            </TableContainer>

            {!loading && filteredAdmins.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredAdmins.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
}

