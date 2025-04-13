// ExpenseCreate.js
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
  OutlinedInput,
  IconButton,
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

const steps = ["Expense Details", "Select Branch"];

const ExpenseCreate = ({
  open = false,
  onClose,
  onSubmit,
  onEdit,
  edit = false,
  selectedExpense,
  branches = [],
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    ExpenseName: "",
    Amount: "",
    Month: "",
    Year: "",
    BranchId: "",
  });

  useEffect(() => {
    if (edit && selectedExpense) {
      setFormData({
        ExpenseName: selectedExpense.ExpenseName || "",
        Amount: selectedExpense.Amount || "",
        Month: selectedExpense.Month || "",
        Year: selectedExpense.Year || "",
        BranchId:
          selectedExpense.BranchId?._id || selectedExpense.BranchId || "",
      });
    }
  }, [edit, selectedExpense]);

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
              label="Expense Name"
              fullWidth
              value={formData.ExpenseName}
              onChange={handleChange("ExpenseName")}
            />
            <TextField
              label="Amount"
              fullWidth
              type="number"
              value={formData.Amount}
              onChange={handleChange("Amount")}
            />
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={formData.Month}
                onChange={handleChange("Month")}
                input={<OutlinedInput label="Month" />}
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Year"
              fullWidth
              type="number"
              value={formData.Year}
              onChange={handleChange("Year")}
            />
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
            {edit ? "Edit Expense" : "Create Expense"}
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
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSubmit}>
              {edit ? "Update" : "Finish"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ExpenseCreate;
