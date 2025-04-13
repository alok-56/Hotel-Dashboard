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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// You can replace this with your real data
const permissionsList = ["rooms", "dashboard", "bookings", "users"];
const dummyBranches = [
    { _id: "1", Branchname: "Mumbai" },
    { _id: "2", Branchname: "Delhi" },
    { _id: "3", Branchname: "Ranchi" },
];

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

const steps = ["Basic Info", "Branch & Permission"];

const AdminCreate = ({ open = false, onClose, onSubmit, onEdit, edit = false, selectedAdmin, hotel }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        Name: "",
        Username: "",
        Password: "",
        Branch: [],
        Permission: [],
    });

    useEffect(() => {
        if (edit && selectedAdmin) {
            setFormData({
                Name: selectedAdmin.Name || "",
                Username: selectedAdmin.Username || "",
                Password: selectedAdmin.Password || "",
                Branch: (selectedAdmin.Branch || []).map((b) =>
                    typeof b === "string" ? b : b._id
                ),
                Permission: selectedAdmin.Permission || [],
            });
        }
    }, [edit, selectedAdmin]);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        const uniqueBranchIds = [...new Set(formData.Branch.map(b => typeof b === 'object' ? b._id : b))];

        const payload = {
            ...formData,
            Branch: uniqueBranchIds,
        };
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
                        <TextField label="Name" fullWidth value={formData.Name} onChange={handleChange("Name")} />
                        <TextField label="Username" fullWidth value={formData.Username} onChange={handleChange("Username")} />
                        <TextField label="Password" fullWidth type="password" value={formData.Password} onChange={handleChange("Password")} />
                    </Stack>
                );
            case 1:
                return (
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel>Branch</InputLabel>

                            <Select
                                multiple
                                value={formData.Branch}
                                onChange={handleChange("Branch")}
                                input={<OutlinedInput label="Branch" />}
                                renderValue={(selected) => selected.map(id => {
                                    const branch = hotel.find(b => b._id === id);
                                    console.log(formData.Branch, branch?.Branchname)
                                    return branch?.Branchname;
                                }).join(", ")}
                            >
                                {hotel && hotel.map((branch) => (
                                    <MenuItem key={branch._id} value={branch._id}>
                                        <Checkbox checked={formData.Branch.indexOf(branch._id) > -1} />
                                        <ListItemText primary={branch.Branchname} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Permission</InputLabel>
                            <Select
                                multiple
                                value={formData.Permission}
                                onChange={handleChange("Permission")}
                                input={<OutlinedInput label="Permission" />}
                                renderValue={(selected) => selected.join(", ")}
                            >
                                {permissionsList.map((permission) => (
                                    <MenuItem key={permission} value={permission}>
                                        <Checkbox checked={formData.Permission.indexOf(permission) > -1} />
                                        <ListItemText primary={permission} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                        {edit ? "Edit Admin" : "Create Admin"}
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
                    <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button variant="contained" onClick={handleSubmit}>
                            {edit ? "Update" : "Finish"}
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={() => setActiveStep((prev) => prev + 1)}>
                            Next
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default AdminCreate;

