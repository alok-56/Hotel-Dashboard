import React, { useEffect, useState } from "react";
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
    Checkbox,
    ListItemText,
    OutlinedInput,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DeleteFileUpload, MultipleFileUpload } from "../../Api/Services/FileUpload";  // Adjust paths accordingly

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

const steps = ["Basic Info", "Features & Booking", "Images"];
const availableFeatures = ["bathroom", "mountain view", "balcony", "air conditioning", "TV"];

const CreateRoom = ({ open = false, onClose, edit, selectedRoom, onSubmit, onEdit, hotel }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        BranchId: "",
        RoomName: "",
        RoomNo: "",
        Price: "",
        numberofguest: "",
        features: [],
        BookingDate: [],
        Image: [],
    });
    const [loading, setLoading] = useState(false);
    console.log(hotel)

    const [preview, setPreview] = useState([]);

    useEffect(() => {
        if (selectedRoom) {
            setFormData({
                BranchId: selectedRoom.BranchId || "",
                RoomName: selectedRoom.RoomName || "",
                RoomNo: selectedRoom.RoomNo || "",
                Price: selectedRoom.Price || "",
                numberofguest: selectedRoom.numberofguest || "",
                features: selectedRoom.features || [],
                BookingDate: selectedRoom.BookingDate || [],
                Image: selectedRoom.Image || [],
            });
            setPreview(selectedRoom.Image || []);
        }
    }, [selectedRoom]);

    const handleTextChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleFeaturesChange = (event) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            features: typeof value === "string" ? value.split(",") : value,
        });
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setLoading(true);
        const res = await MultipleFileUpload(files);

        if (res?.status && Array.isArray(res.data)) {
            setFormData((prev) => ({
                ...prev,
                Image: [...prev.Image, ...res.data],
            }));

            setPreview((prev) => [...prev, ...res.data]);
            setLoading(false);
        } else {
            setLoading(false);
        }

        e.target.value = null;
    };

    const handleImageDelete = async (index) => {
        const imageToDelete = preview[index];
        setLoading(true);
        const res = await DeleteFileUpload(imageToDelete);

        if (res?.status) {
            setPreview((prev) => prev.filter((_, i) => i !== index));

            setFormData((prev) => ({
                ...prev,
                Image: prev.Image.filter((_, i) => i !== index),
            }));
            setLoading(false);
        } else {
            console.error("Failed to delete image from server.");
            setLoading(false);
        }
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = () => {
        if (edit) onEdit(formData);
        else onSubmit(formData);
    };

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

                        <TextField label="Room Name" fullWidth value={formData.RoomName} onChange={handleTextChange("RoomName")} />
                        <TextField label="Room Number" fullWidth value={formData.RoomNo} onChange={handleTextChange("RoomNo")} />
                        <TextField type="number" label="Price" fullWidth value={formData.Price} onChange={handleTextChange("Price")} />
                        <TextField type="number" label="Number of Guests" fullWidth value={formData.numberofguest} onChange={handleTextChange("numberofguest")} />
                    </Stack>
                );
            case 1:
                return (
                    <FormControl fullWidth>
                        <InputLabel>Features</InputLabel>
                        <Select
                            multiple
                            value={formData.features}
                            onChange={handleFeaturesChange}
                            input={<OutlinedInput label="Features" />}
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {availableFeatures.map((feature) => (
                                <MenuItem key={feature} value={feature}>
                                    <Checkbox checked={formData.features.indexOf(feature) > -1} />
                                    <ListItemText primary={feature} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="subtitle1" mb={1}>
                            Upload Room Images
                        </Typography>
                        <Box
                            component="label"
                            htmlFor="upload-room-images"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px dashed #ccc",
                                borderRadius: 2,
                                p: 3,
                                textAlign: "center",
                                cursor: "pointer",
                                "&:hover": { borderColor: "primary.main" },
                            }}
                        >
                            <Typography>Click or Drag to Upload</Typography>
                            <input
                                type="file"
                                id="upload-room-images"
                                multiple
                                accept="image/*"
                                hidden
                                onChange={handleFileUpload}
                            />
                        </Box>

                        {preview.length >= 0 && (
                            <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    preview.map((src, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                position: "relative",
                                                width: 100,
                                                height: 100,
                                                borderRadius: 1,
                                                overflow: "hidden",
                                                border: "1px solid #ccc",
                                            }}
                                        >
                                            <img
                                                src={src}
                                                alt={`preview-${index}`}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleImageDelete(index)}
                                                sx={{
                                                    position: "absolute",
                                                    top: 4,
                                                    right: 4,
                                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(255, 0, 0, 0.8)",
                                                        color: "white",
                                                    },
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" mb={3}>
                        {selectedRoom ? "Edit Room" : "Create Room"}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box mt={3}>{renderStepContent()}</Box>

                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button variant="contained" onClick={handleSubmit}>
                            {edit ? "Update" : "Finish"}
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={handleNext}>
                            Next
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateRoom;
