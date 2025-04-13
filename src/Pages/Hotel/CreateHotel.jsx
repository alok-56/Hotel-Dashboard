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
import { DeleteFileUpload, MultipleFileUpload } from "../../Api/Services/FileUpload";


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

const steps = ["Basic Info", "Hotel Info", "Images"];
const availableHotelInfo = ["bathroom", "wifi", "pool", "gym", "spa"];

const CreateHotel = ({ open = false, onClose, edit, selectedHotel, onSubmit, onEdit }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        Branchname: "",
        Location: "",
        Heading: "",
        Description: "",
        HotelInfo: [],
        Image: {
            hotel: [],
            rooms: [],
            restaurant: [],
            other: [],
        },
    });
    const [loading, setLoading] = useState(false)

    const [preview, setPreview] = useState({
        hotel: [],
        rooms: [],
        restaurant: [],
        other: [],
    });

    useEffect(() => {
        if (selectedHotel) {
            setFormData({
                Branchname: selectedHotel.Branchname || "",
                Location: selectedHotel.Location || "",
                Heading: selectedHotel.Heading || "",
                Description: selectedHotel.Description || "",
                HotelInfo: selectedHotel.HotelInfo || [],
                Image: selectedHotel.Image || {
                    hotel: [],
                    rooms: [],
                    restaurant: [],
                    other: [],
                },
            });
            setPreview(selectedHotel.Image || {
                hotel: [],
                rooms: [],
                restaurant: [],
                other: [],
            });
        }
    }, [selectedHotel]);

    const handleTextChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleHotelInfoChange = (event) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            HotelInfo: typeof value === "string" ? value.split(",") : value,
        });
    };

    const handleFileUpload = (section) => async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setLoading(true)
        const res = await MultipleFileUpload(files);

        if (res?.status && Array.isArray(res.data)) {
            setFormData((prev) => ({
                ...prev,
                Image: {
                    ...prev.Image,
                    [section]: [...prev.Image[section], ...res.data],
                },
            }));

            setPreview((prev) => ({
                ...prev,
                [section]: [...prev[section], ...res.data],
            }));

            setLoading(false)
        } else {
            setLoading(false)
        }

        e.target.value = null;
    };


    const handleImageDelete = async (section, index) => {
        const imageToDelete = preview[section][index];
        setLoading(true)
        const res = await DeleteFileUpload(imageToDelete);

        if (res?.status) {
            setPreview((prev) => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index),
            }));

            setFormData((prev) => ({
                ...prev,
                Image: {
                    ...prev.Image,
                    [section]: prev.Image[section].filter((_, i) => i !== index),
                },
            }));
            setLoading(false)
        } else {
            console.error("Failed to delete image from server.");
            setLoading(false)
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
                        <TextField label="Hotel Name" fullWidth value={formData.Branchname} onChange={handleTextChange("Branchname")} />
                        <TextField label="Location" fullWidth value={formData.Location} onChange={handleTextChange("Location")} />
                        <TextField label="Heading" fullWidth value={formData.Heading} onChange={handleTextChange("Heading")} />
                        <TextField label="Description" fullWidth multiline rows={3} value={formData.Description} onChange={handleTextChange("Description")} />
                    </Stack>
                );
            case 1:
                return (
                    <FormControl fullWidth>
                        <InputLabel>Hotel Info</InputLabel>
                        <Select
                            multiple
                            value={formData.HotelInfo}
                            onChange={handleHotelInfoChange}
                            input={<OutlinedInput label="Hotel Info" />}
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {availableHotelInfo.map((info) => (
                                <MenuItem key={info} value={info}>
                                    <Checkbox checked={formData.HotelInfo.indexOf(info) > -1} />
                                    <ListItemText primary={info} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            case 2:
                return (
                    <Stack spacing={4}>
                        {Object.keys(preview).map((section) => (
                            <Box key={section}>
                                <Typography variant="subtitle1" mb={1}>
                                    Upload {section} images
                                </Typography>
                                <Box
                                    component="label"
                                    htmlFor={`upload-${section}`}
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
                                        id={`upload-${section}`}
                                        multiple
                                        accept="image/*"
                                        hidden
                                        onChange={handleFileUpload(section)}
                                    />
                                </Box>

                                {
                                    preview[section]?.length > 0 && (
                                        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                                            {loading ? <CircularProgress /> : preview[section].map((src, index) => (

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
                                                        onClick={() => handleImageDelete(section, index)}
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
                                            ))}
                                        </Box>
                                    )

                                }
                            </Box>
                        ))}
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
                    <Typography variant="h6" mb={3}>
                        {selectedHotel ? "Edit Hotel" : "Create Hotel"}
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

export default CreateHotel;
