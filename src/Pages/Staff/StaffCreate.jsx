import React, { useEffect, useState } from "react";
import {
    Box, Button, Modal, Stepper, Step, StepLabel, TextField,
    Typography, Stack, Select, MenuItem, InputLabel, FormControl,
    OutlinedInput, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50vw",
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const steps = ["Basic Info", "Branch & Role"];

const StaffCreate = ({
    open = false,
    onClose,
    onSubmit,
    onEdit,
    edit = false,
    selectedStaff,
    branches
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        Name: "",
        Number: "",
        Role: "",
        Address: "",
        BranchId: "",
        JoiningDate: "",
        Salary: "",
        Active: true,
    });

    useEffect(() => {
        if (edit && selectedStaff) {
            setFormData({
                Name: selectedStaff.Name || "",
                Number: selectedStaff.Number || "",
                Role: selectedStaff.Role || "",
                Address: selectedStaff.Address || "",
                BranchId: selectedStaff.BranchId?._id || "",
                JoiningDate: selectedStaff.JoiningDate || "",
                Salary: selectedStaff.Salary || "",
                Active: selectedStaff.Active !== undefined ? selectedStaff.Active : true,
            });
        }
    }, [edit, selectedStaff]);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        const payload = { ...formData };
        if (edit) {
            onEdit(payload);
        } else {
            onSubmit(payload);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.Name}
                            onChange={handleChange("Name")}
                        />
                        <TextField
                            label="Contact Number"
                            fullWidth
                            value={formData.Number}
                            onChange={handleChange("Number")}
                        />
                        <TextField
                            label="Role"
                            fullWidth
                            value={formData.Role}
                            onChange={handleChange("Role")}
                        />
                        <TextField
                            label="Address"
                            fullWidth
                            value={formData.Address}
                            onChange={handleChange("Address")}
                        />
                        <TextField
                            label="Joining Date"
                            fullWidth
                            type="date"
                            value={formData.JoiningDate}
                            onChange={handleChange("JoiningDate")}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Salary"
                            fullWidth
                            type="number"
                            value={formData.Salary}
                            onChange={handleChange("Salary")}
                        />
                        <FormControl>
                            <InputLabel>Active</InputLabel>
                            <Select
                                value={formData.Active}
                                onChange={handleChange("Active")}
                                label="Active"
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                );
            case 1:
                return (
                    <FormControl fullWidth>
                        <InputLabel>Branch</InputLabel>
                        <Select
                            value={formData.BranchId}
                            onChange={handleChange("BranchId")}
                            input={<OutlinedInput label="Branch" />}
                        >
                            {branches.map((branch) => (
                                <MenuItem key={branch._id} value={branch._id}>
                                    {branch.Branchname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                        {edit ? "Edit Staff" : "Create Staff"}
                    </Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>

                <Box mt={3}>{renderStepContent()}</Box>

                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>
                    {activeStep === steps.length - 1 ? (
                        <Button variant="contained" onClick={handleSubmit}>
                            {edit ? "Update" : "Finish"}
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={() => setActiveStep(prev => prev + 1)}>Next</Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default StaffCreate;
