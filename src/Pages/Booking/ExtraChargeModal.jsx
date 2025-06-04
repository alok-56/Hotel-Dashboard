import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, Box, IconButton, Divider,
    Stack, Alert
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { AddExtra, DeleteExtra, GetExtra } from '../../Api/Services/Payment';


const ExtraChargeModal = ({ open, onClose, booking, onUpdate }) => {
    const [extraCharges, setExtraCharges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Extratype: '',
        Name: '',
        Amount: ''
    });

    const extraTypes = ['Food', 'Penalty', 'ExtraTime', 'other'];

    useEffect(() => {
        if (open && booking) {
            fetchExtraCharges();
        }
    }, [open, booking]);

    const fetchExtraCharges = async () => {
        if (!booking?.BookingId) return;

        setLoading(true);
        try {
            const response = await GetExtra(booking.BookingId);
            if (response.status) {
                setExtraCharges(response.data || []);
            } else {
                setExtraCharges([]);
            }
        } catch (error) {
            toast.error('Failed to fetch extra charges');
            setExtraCharges([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddExtra = async () => {
        if (!formData.Extratype || !formData.Name || !formData.Amount) {
            toast.error('Please fill all fields');
            return;
        }

        if (isNaN(formData.Amount) || parseFloat(formData.Amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            console.log(booking)
            const response = await AddExtra({
                BookingId: booking.BookingId,
                Extratype: formData.Extratype,
                Name: formData.Name,
                Amount: parseFloat(formData.Amount)
            });

            if (response.status) {
                toast.success('Extra charge added successfully');
                setFormData({ Extratype: '', Name: '', Amount: '' });
                fetchExtraCharges();
                if (onUpdate) onUpdate();
            } else {
                toast.error(response.message || 'Failed to add extra charge');
            }
        } catch (error) {
            toast.error('Failed to add extra charge');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExtra = async (extraId) => {
        if (!window.confirm('Are you sure you want to delete this extra charge?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await DeleteExtra(extraId);
            if (response.status) {
                toast.success('Extra charge deleted successfully');
                fetchExtraCharges();
                if (onUpdate) onUpdate();
            } else {
                toast.error(response.message || 'Failed to delete extra charge');
            }
        } catch (error) {
            toast.error('Failed to delete extra charge');
        } finally {
            setLoading(false);
        }
    };

    const totalExtraAmount = extraCharges.reduce((sum, charge) => sum + (charge.Amount || 0), 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Extra Charges - {booking?.BookingId}
            </DialogTitle>
            <DialogContent>
                {booking && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Guest:</strong> {booking.UserInformation?.Name}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Room:</strong> {booking.RoomId?.RoomName}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ mb: 3 }} />

                {/* Add New Extra Charge Form */}
                <Typography variant="h6" gutterBottom>
                    Add New Extra Charge
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={formData.Extratype}
                            onChange={(e) => handleInputChange('Extratype', e.target.value)}
                            label="Type"
                        >
                            {extraTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        size="small"
                        label="Name/Description"
                        value={formData.Name}
                        onChange={(e) => handleInputChange('Name', e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        size="small"
                        label="Amount (₹)"
                        type="number"
                        value={formData.Amount}
                        onChange={(e) => handleInputChange('Amount', e.target.value)}
                        sx={{ width: 120 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddExtra}
                        disabled={loading || !formData.Extratype || !formData.Name || !formData.Amount}
                    >
                        Add
                    </Button>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Extra Charges List */}
                <Typography variant="h6" gutterBottom>
                    Current Extra Charges
                </Typography>
                {extraCharges.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Name/Description</TableCell>
                                    <TableCell align="right">Amount (₹)</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {extraCharges.map((charge, index) => (
                                    <TableRow key={charge._id || index}>
                                        <TableCell>{charge.Extratype}</TableCell>
                                        <TableCell>{charge.Name}</TableCell>
                                        <TableCell align="right">₹{charge.Amount}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteExtra(charge._id)}
                                                disabled={loading}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info">No extra charges added yet.</Alert>
                )}

                {/* Total Amount */}
                {extraCharges.length > 0 && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                        <Typography variant="h6" color="primary.contrastText">
                            Total Extra Charges: ₹{totalExtraAmount}
                        </Typography>
                       
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExtraChargeModal;