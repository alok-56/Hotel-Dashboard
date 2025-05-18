import React, { useEffect, useMemo, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, IconButton,
    TextField, Stack, Button, Skeleton, Typography,
    Avatar,
    Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import CreateRoom from './CreateRoom';
import { CreateRoomApi, DeleteRoomApi, GetAllRoomApi, UpdateRoomApi } from '../../Api/Services/Rooms';
import { GetAllHotelApi } from '../../Api/Services/Hotel';


export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalopen, setModalopen] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [hotel, setHotel] = useState([])

    const columns = [
        { id: 'serial', label: 'S.No', minWidth: 50, isSerial: true },
        { id: 'RoomName', label: 'Room Name', minWidth: 150 },
        { id: 'RoomNo', label: 'Room No', minWidth: 100 },
        { id: 'RoomId', label: 'Room ID', minWidth: 100 },
        {
            id: 'features',
            label: 'Features',
            minWidth: 200,
            render: (features) => features?.join(', ') || '-'
        },
        { id: 'Price', label: 'Price (₹)', minWidth: 100 },
        { id: 'numberofguest', label: 'Guests', minWidth: 80 },
        {
            id: 'Image',
            label: 'Image',
            minWidth: 100,
            render: (images, index) => (
                <Box display="flex" gap={1}>
                    {images?.slice(0, 2).map((src, idx) => (
                        <Avatar
                            key={idx}
                            src={src}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                        />
                    ))}
                </Box>
            ),
        },
        {
            id: 'BranchId',
            label: 'Branch',
            minWidth: 150,
            render: (branchId) => branchId?.Branchname || '-',
        },
    ];

    useEffect(() => {
        fetchRooms();
        fetchHotels()
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const res = await GetAllRoomApi();
            setRooms(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error("Failed to fetch rooms");
            setRooms([]);
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

    const filteredRooms = useMemo(() => {
        return rooms.filter(room =>
            room.RoomName?.toLowerCase().includes(search.toLowerCase()) ||
            room.RoomNo?.toLowerCase().includes(search.toLowerCase())
        );
    }, [rooms, search]);

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    const handleEdit = (room) => {
        setSelectedData(room);
        setModalopen(true);
        setEdit(true);
    };

    const handleDelete = async (room) => {
        setLoading(true);
        try {
            const res = await DeleteRoomApi(room._id);
            if (res.status) {
                toast.success("Room Deleted Successfully");
                fetchRooms();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error deleting room");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (formData) => {
        if (!formData.RoomName) {
            toast.error("Room Name is required");
            return;
        }

        // Validate RoomNo
        if (!formData.RoomNo) {
            toast.error("Room Number is required");
            return;
        }

        // Validate BranchId
        if (!formData.BranchId) {
            toast.error("Branch ID is required");
            return;
        }

        // Validate Price
        if (!formData.Price) {
            toast.error("Price is required");
            return;
        }

        // Validate numberofguest
        if (!formData.numberofguest) {
            toast.error("Number of Guests is required");
            return;
        }
        setLoading(true);
        try {
            const res = await CreateRoomApi(formData);
            if (res.status) {
                setModalopen(false);
                toast.success("Room Added Successfully");
                setSelectedData([]);
                fetchRooms();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error creating room");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        if (!formData.RoomName) {
            toast.error("Room Name is required");
            return;
        }

        // Validate RoomNo
        if (!formData.RoomNo) {
            toast.error("Room Number is required");
            return;
        }

        // Validate BranchId
        if (!formData.BranchId) {
            toast.error("Branch ID is required");
            return;
        }

        // Validate Price
        if (!formData.Price) {
            toast.error("Price is required");
            return;
        }

        // Validate numberofguest
        if (!formData.numberofguest) {
            toast.error("Number of Guests is required");
            return;
        }
        setLoading(true);
        try {
            const res = await UpdateRoomApi(formData, selectedData._id);
            if (res.status) {
                setModalopen(false);
                toast.success("Room Updated Successfully");
                setSelectedData([]);
                fetchRooms();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error updating room");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Loader loading={loading} />
            <CreateRoom
                open={modalopen}
                onClose={() => setModalopen(false)}
                selectedRoom={selectedData}
                edit={edit}
                onSubmit={handleCreate}
                onEdit={handleUpdate}
                hotel={hotel}
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
                <Button variant="contained" color="primary" onClick={() => {
                    setEdit(false);
                    setSelectedData([]);
                    setModalopen(true);
                }}>
                    Create Room
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
                        ) : filteredRooms.length > 0 ? (
                            filteredRooms
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((room, index) => (
                                    <TableRow hover key={room._id}>
                                        {columns.map((column) => {
                                            if (column.id === 'serial') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {page * rowsPerPage + index + 1}
                                                    </TableCell>
                                                );
                                            }
                                            const value = room[column.id];
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
                                            <IconButton color="primary" onClick={() => handleEdit(room)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(room)}>
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

            {!loading && filteredRooms.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredRooms.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
}
