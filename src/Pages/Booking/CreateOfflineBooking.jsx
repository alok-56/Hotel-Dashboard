import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Modal,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Typography,
    Stack,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    CircularProgress,
    Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SearchRoomApi } from "../../Api/Services/Rooms";
import { CreateOfflineBookingApi } from "../../Api/Services/Payment";
import { toast } from 'react-toastify';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70vw",
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const steps = ["Booking Info", "Select Room", "Confirm & Book"];

const CreateBooking = ({ open = false, onClose, hotel ,trigger}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        BranchId: "",
        checkinDate: "",
        checkoutDate: "",
        numberofguest: "",
        selectedRoom: null,
        UserInformation: {
            Name: "",
            Phonenumber: "",
            Age: "",
        },
        Numberofchildren: "",
        Tax: "",
        TotalAmount: "",
    });

    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTextChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleFieldChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleUserInfoChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            UserInformation: {
                ...prev.UserInformation,
                [field]: e.target.value,
            },
        }));
    };

    const handleNext = async () => {
        if (activeStep === 0) {
            setLoading(true);
            const checkinDateISO = new Date(formData.checkinDate).toISOString();
            const checkoutDateISO = new Date(formData.checkoutDate).toISOString();

            const res = await SearchRoomApi(
                formData.BranchId,
                checkinDateISO,
                checkoutDateISO
            );

            if (res?.status) {
                setAvailableRooms(res.data || []);
            }
            setLoading(false);
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleRoomSelect = (room) => {
        setFormData((prev) => ({
            ...prev,
            selectedRoom: prev.selectedRoom?._id === room._id ? null : room,
        }));
    };

    const handleSubmit = async () => {

        const res = await CreateOfflineBookingApi({
            "BranchId": formData.BranchId,
            "RoomId": formData.selectedRoom._id,
            "CheckinDate": formData?.checkinDate,
            "CheckOutDate": formData?.checkoutDate,
            "UserInformation": formData?.UserInformation,
            "Numberofchildren": formData?.Numberofchildren,
            "Tax": formData?.Tax,
            "TotalAmount": formData?.TotalAmount
        }
        );
        if (res?.status) {
            toast.success("Booking successfully Done");
            trigger()
            onClose();
        } else {
            toast.error(res.message);
        }
    };

    // Automatically update TotalAmount on Step 3
    useEffect(() => {
        if (activeStep === 2 && formData.selectedRoom) {
            const checkin = new Date(formData.checkinDate);
            const checkout = new Date(formData.checkoutDate);
            const nights = Math.ceil(Math.abs(checkout - checkin) / (1000 * 60 * 60 * 24));
            const price = formData.selectedRoom.Price || 0;
            const tax = parseFloat(formData.Tax) || 0;
            const total = nights * price + tax;

            setFormData((prev) => ({ ...prev, TotalAmount: total.toFixed(2) }));
        }
    }, [activeStep, formData.checkinDate, formData.checkoutDate, formData.selectedRoom, formData.Tax]);

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel>Branch</InputLabel>
                            <Select
                                value={formData.BranchId}
                                onChange={handleTextChange("BranchId")}
                                label="Branch"
                            >
                                {hotel?.map((branch) => (
                                    <MenuItem key={branch._id} value={branch._id}>
                                        {branch.Branchname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Check-in Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.checkinDate}
                            onChange={handleTextChange("checkinDate")}
                        />

                        <TextField
                            label="Check-out Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.checkoutDate}
                            onChange={handleTextChange("checkoutDate")}
                        />

                        <TextField
                            type="number"
                            label="Number of Guests"
                            fullWidth
                            value={formData.numberofguest}
                            onChange={handleTextChange("numberofguest")}
                        />
                    </Stack>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="subtitle1" mb={2} fontWeight="bold">
                            🛏️ Select an Available Room
                        </Typography>

                        {loading ? (
                            <CircularProgress />
                        ) : availableRooms.length === 0 ? (
                            <Typography color="error">No rooms found for the selected date.</Typography>
                        ) : (
                            <Stack spacing={2}>
                                {availableRooms.map((room) => {
                                    const isSelected = formData.selectedRoom?._id === room._id;

                                    return (
                                        <Box
                                            key={room._id}
                                            p={2}
                                            border={2}
                                            borderColor={isSelected ? "primary.main" : "grey.300"}
                                            borderRadius={3}
                                            onClick={() => handleRoomSelect(room)}
                                            sx={{
                                                cursor: "pointer",
                                                backgroundColor: isSelected ? "primary.light" : "#fff",
                                                transition: "0.3s ease",
                                                boxShadow: isSelected
                                                    ? "0 4px 10px rgba(0, 0, 0, 0.1)"
                                                    : "0 2px 4px rgba(0, 0, 0, 0.05)",
                                                "&:hover": {
                                                    backgroundColor: isSelected ? "primary.light" : "#f5f5f5",
                                                },
                                            }}
                                        >
                                            <Typography variant="h6" gutterBottom color="primary">
                                                {room.RoomName} (Room No: {room.RoomNo})
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                💰 Price: <strong>₹{room.Price}</strong> | 👥 Guests: {room.numberofguest}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                🛠️ Features:{" "}
                                                {room.features?.map((feature, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={feature}
                                                        size="small"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ))}
                                            </Typography>

                                            {room.BookingDate?.length > 0 && (
    <Box mt={1.5}>
        <Typography variant="subtitle2" fontWeight="bold">
            📅 Current Bookings:
        </Typography>
        <Stack spacing={0.5} mt={1}>
            {room.BookingDate.map((booking) => (
                <Chip
                    key={booking._id}
                    label={`🛎️ ${new Date(booking.checkin).toLocaleDateString()} → ${new Date(booking.checkout).toLocaleDateString()}`}
                    size="small"
                    color="warning"
                />
            ))}
        </Stack>
    </Box>
)}

                                            {room.Image?.length > 0 && (
                                                <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                                                    {room.Image.map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={img}
                                                            alt={`Room-${idx}`}
                                                            style={{
                                                                width: 100,
                                                                height: 100,
                                                                objectFit: "cover",
                                                                borderRadius: 8,
                                                                border: "1px solid #ccc",
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}

                                            <Box mt={2} p={1.5} bgcolor="#f1f1f1" borderRadius={2}>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    🏨 {room.BranchId?.Branchname}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    📍 {room.BranchId?.Location}
                                                </Typography>
                                                <Typography variant="body2" mt={1}>
                                                    {room.BranchId?.Description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>
                );

            case 2:
                const checkin = new Date(formData.checkinDate);
                const checkout = new Date(formData.checkoutDate);
                const diffTime = Math.abs(checkout - checkin);
                const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                const roomPrice = formData.selectedRoom?.Price || 0;
                const subtotal = nights * roomPrice;
                const tax = parseFloat(formData.Tax) || 0;
                const total = subtotal + tax;

                return (
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight="bold">
                            🧾 Guest Information
                        </Typography>

                        <TextField
                            label="Full Name"
                            fullWidth
                            value={formData.UserInformation.Name}
                            onChange={handleUserInfoChange("Name")}
                        />
                        <TextField
                            label="Phone Number"
                            type="number"
                            fullWidth
                            value={formData.UserInformation.Phonenumber}
                            onChange={handleUserInfoChange("Phonenumber")}
                        />
                        <TextField
                            label="Age"
                            type="number"
                            fullWidth
                            value={formData.UserInformation.Age}
                            onChange={handleUserInfoChange("Age")}
                        />
                        <TextField
                            label="Number of Children"
                            type="number"
                            fullWidth
                            value={formData.Numberofchildren}
                            onChange={handleFieldChange("Numberofchildren")}
                        />
                        <TextField
                            label="Tax (₹)"
                            type="number"
                            fullWidth
                            value={formData.Tax}
                            onChange={handleFieldChange("Tax")}
                        />

                        <Box mt={2} p={2} bgcolor="#f9f9f9" borderRadius={2} border="1px solid #ddd">
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                💸 Booking Summary
                            </Typography>
                            <Typography>
                                🗓️ {nights} night{nights > 1 ? "s" : ""} × ₹{roomPrice} = <strong>₹{subtotal}</strong>
                            </Typography>
                            <Typography>
                                🧾 Tax: <strong>₹{tax}</strong>
                            </Typography>
                            <Typography variant="h6" mt={1}>
                                ✅ <strong>Total: ₹{total}</strong>
                            </Typography>
                        </Box>
                    </Stack>
                );

            default:
                return null;
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">📝 Book Room</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box mt={4}>{renderStepContent()}</Box>

                <Box mt={5} display="flex" justifyContent="space-between">
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!formData.selectedRoom}
                        >
                            Confirm Booking
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={
                                activeStep === 0 &&
                                (!formData.BranchId ||
                                    !formData.checkinDate ||
                                    !formData.checkoutDate)
                            }
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateBooking;
