import React, { useEffect, useMemo, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, IconButton,
  TextField, Stack, Button, Skeleton, Avatar, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { CreateHotelApi, DeleteHotelApi, GetAllHotelApi, UpdateHotelApi } from '../../Api/Services/Hotel';
import CreateHotel from './CreateHotel';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalopen, setModalopen] = useState(false)
  const [selectedData, setSelectedData] = useState([])
  const [edit, setEdit] = useState(false)


  const columns = [
    { id: 'serial', label: 'S.No', minWidth: 50, isSerial: true },
    { id: 'Branchname', label: 'Name', minWidth: 150 },
    { id: 'Code', label: 'Code', minWidth: 80 },
    { id: 'Location', label: 'Location', minWidth: 150 },
    { id: 'Heading', label: 'Heading', minWidth: 150 },
    { id: 'Description', label: 'Description', minWidth: 200 },
    {
      id: 'Image',
      label: 'Images',
      minWidth: 200,
      render: (imageData) => (
        <Stack spacing={1}>
          {['hotel', 'rooms', 'restaurant', 'other'].map((category) => (
            imageData?.[category]?.length > 0 && (
              <Stack key={category} direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" sx={{ minWidth: 80 }}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}:
                </Typography>
                {imageData[category].slice(0, 2).map((src, index) => (
                  <Avatar
                    key={index}
                    src={src}
                    variant="rounded"
                    sx={{ width: 40, height: 40 }}
                  />
                ))}
              </Stack>
            )
          ))}
        </Stack>
      )
    }

  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await GetAllHotelApi();
      setHotels(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel =>
      hotel.Branchname?.toLowerCase().includes(search.toLowerCase()) ||
      hotel.Code?.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [hotels, search]);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleEdit = (hotel) => {
    setSelectedData(hotel)
    setModalopen(true)
    setEdit(true)
  };

  const handleDelete = async (hotel) => {
    setLoading(true)
    try {
      let res = await DeleteHotelApi(hotel._id)
      if (res.status) {
        toast.success("Hotel Deleted Successfully")
        fetchHotels()
      } else {
        toast.error(res.message)
        setLoading(false)
      }

    } catch (error) {

    } finally {
      setLoading(false)
    }

  };

  const handleCreate = async (formData) => {
    if (!formData.Branchname) {
      toast.error("Hotel name is required")
      return
    } else if (!formData.Heading) {
      toast.error("Heading name is required")
      return
    } else if (!formData.Location) {
      toast.error("Location is required")
      return
    }
    else if (formData.HotelInfo.length === 0) {
      toast.error("Hotel Features is required")
      return
    }
    setLoading(true)
    try {
      let res = await CreateHotelApi(formData)
      if (res.status) {
        setModalopen(false)
        toast.success("Hotel Added Successfully")
        setSelectedData([])
        fetchHotels()
      } else {
        toast.error(res.message)
        setLoading(false)
      }

    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (formData) => {

    if (!formData.Branchname) {
      toast.error("Hotel name is required")
      return
    } else if (!formData.Heading) {
      toast.error("Heading name is required")
      return
    } else if (!formData.Location) {
      toast.error("Location is required")
      return
    }
    else if (formData.HotelInfo.length === 0) {
      toast.error("Hotel Features is required")
      return
    }
    setLoading(true)
    try {
      let res = await UpdateHotelApi(formData, selectedData._id)
      if (res.status) {
        setModalopen(false)
        toast.success("Hotel Updated Successfully")
        setSelectedData([])
        fetchHotels()
      } else {
        toast.error(res.message)
        setLoading(false)
      }

    } catch (error) {

    } finally {
      setLoading(false)
    }

  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Loader loading={loading}></Loader>
      <CreateHotel open={modalopen} onClose={() => setModalopen(false)} selectedHotel={selectedData} edit={edit} onSubmit={handleCreate} onEdit={handleUpdate}></CreateHotel>
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
          setEdit(false)
          setSelectedData([])
          setModalopen(true)
        }}>
          Create
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
            ) : filteredHotels.length > 0 ? (
              filteredHotels
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((hotel, index) => (
                  <TableRow hover key={hotel.Code}>
                    {columns.map((column) => {
                      if (column.id === 'serial') {
                        return (
                          <TableCell key={column.id}>
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                        );
                      }

                      const value = hotel[column.id];

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
                      <IconButton color="primary" onClick={() => handleEdit(hotel)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(hotel)}>
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

      {!loading && filteredHotels.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredHotels.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}
