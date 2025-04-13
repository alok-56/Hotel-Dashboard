import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Stack,
    Skeleton,
    Autocomplete,
    TextField,
} from "@mui/material";
import {
    Hotel,
    MeetingRoom,
    AttachMoney,
    Bed,
    MoneyOff,
} from "@mui/icons-material";
import { BarChart, PieChart } from "@mui/x-charts";
import { GetMYProfileApi } from "../Api/Services/Admin";
import {
    GetDashboardApi,
    GetPaymentDashboardApi,
    GetSalesDashboardApi,
} from "../Api/Services/Reports";

const Dashboard = () => {
    const [bookingdata, setbookingdata] = useState([]);
    const [earningdata, setEarningdata] = useState([]);
    const [dashboardcount, setDashboardCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);

    useEffect(() => {
        fetchInitialBranches();
    }, []);

    useEffect(() => {
        if (selectedBranches.length > 0) {
            fetchDashboardData(selectedBranches.map((b) => b._id));
        }
    }, [selectedBranches]);

    const fetchInitialBranches = async () => {
        try {
            let res = await GetMYProfileApi();
            if (res.status) {
                const allBranches = res.data.Branch || [];
                setBranches(allBranches);
                setSelectedBranches(allBranches); // Select all initially
            }
        } catch (error) {
            console.error("Error fetching profile/branches:", error);
        }
    };

    const fetchDashboardData = async (branchIdsArray) => {
        setLoading(true);
        try {
            const branchIds = branchIdsArray.join(",");

            const bookingRes = await GetSalesDashboardApi(branchIds);
            const paymentRes = await GetPaymentDashboardApi(branchIds);
            const dashboardRes = await GetDashboardApi(branchIds);

            setbookingdata(bookingRes.data);
            setEarningdata(paymentRes.data);
            setDashboardCount(dashboardRes.data);
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const dataSummary = [
        {
            title: "Total Rooms",
            icon: <Hotel fontSize="large" />,
            value: dashboardcount?.totalRooms || 0,
            bgColor: "#e3f2fd",
        },
        {
            title: "Total Booking",
            icon: <MeetingRoom fontSize="large" />,
            value: dashboardcount?.totalBookings || 0,
            bgColor: "#e8f5e9",
        },
        {
            title: "Total Earning",
            icon: <AttachMoney fontSize="large" />,
            value: `₹${dashboardcount?.totalEarnings || 0}`,
            bgColor: "#f3e5f5",
        },
        {
            title: "Today's Booking",
            icon: <Bed fontSize="large" />,
            value: dashboardcount?.todayBookingCount || 0,
            bgColor: "#fff3e0",
        },
        {
            title: "Today's Earning",
            icon: <MoneyOff fontSize="large" />,
            value: `₹${dashboardcount?.todayEarnings || 0}`,
            bgColor: "#ffebee",
        },
    ];

    return (
        <Box p={2} minHeight="100vh">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                🏨 Hotel Dashboard
            </Typography>

            {/* Branch Multi Select Dropdown */}
            <Box mt={4} mb={2}>
                <Autocomplete
                    multiple
                    options={branches}
                    value={selectedBranches}
                    getOptionLabel={(option) => option.Branchname}
                    onChange={(event, newValue) => {
                        setSelectedBranches(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Select Branches"
                            placeholder="Choose branches"
                        />
                    )}
                />

            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} mt={5}>
                {dataSummary.map((item, i) => (
                    <Grid item size={{ xs: 6, md: 3, sm: 4 }} key={i}>
                        <Card
                            sx={{
                                backgroundColor: item.bgColor,
                                boxShadow: 3,
                                borderRadius: 2,
                            }}
                        >
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box color="primary.main">{item.icon}</Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            {item.title}
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" width={60} height={30} />
                                        ) : (
                                            <Typography variant="h6" fontWeight={600}>
                                                {item.value}
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={4} mt={5}>
                {/* Bookings Chart */}
                <Grid item size={{ xs: 12, md: 12, sm: 12 }}>
                    <Card sx={{ p: 3, boxShadow: 4, borderRadius: 5 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            📅 Weekly Booking Overview
                        </Typography>
                        <Box sx={{ width: "100%", overflowX: "auto" }}>
                            <Box sx={{ minWidth: 600 }}>
                                {loading ? (
                                    <Skeleton variant="rectangular" height={350} />
                                ) : (
                                    <BarChart
                                        xAxis={[
                                            {
                                                scaleType: "band",
                                                data: bookingdata?.map((d) => d.day),
                                                label: "Day",
                                            },
                                        ]}
                                        yAxis={[{ label: "Total Bookings" }]}
                                        series={[
                                            {
                                                data: bookingdata?.map((d) => d.value),
                                                label: "Bookings",
                                                color: "#42a5f5",
                                            },
                                        ]}
                                        layout={{
                                            barGap: 2,
                                            barCategoryGap: 10,
                                        }}
                                        height={350}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* Earnings Chart */}
                <Grid item size={{ xs: 12, md: 6, sm: 12 }}>
                    <Card sx={{ p: 3, boxShadow: 4, borderRadius: 5 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            💰 Daily Earnings Breakdown
                        </Typography>
                        <Box sx={{ width: "100%", overflowX: "auto" }}>
                            <Box sx={{ minWidth: 600 }}>
                                {loading ? (
                                    <Skeleton variant="rectangular" height={350} />
                                ) : (
                                    <BarChart
                                        xAxis={[
                                            {
                                                scaleType: "band",
                                                data: earningdata?.map((d) => d.day),
                                                label: "Day",
                                            },
                                        ]}
                                        yAxis={[{ label: "Earnings (₹)" }]}
                                        series={[
                                            {
                                                data: earningdata?.map((d) => d.value),
                                                label: "Earnings",
                                                color: "#66bb6a",
                                            },
                                        ]}
                                        layout={{
                                            barGap: 2,
                                            barCategoryGap: 10,
                                        }}
                                        height={350}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* Pie Chart */}
                <Grid item size={{ xs: 12, md: 6, sm: 12 }}>
                    <Card sx={{ p: 3, boxShadow: 4, borderRadius: 5 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            🧾 Earnings vs Expense
                        </Typography>
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                overflowX: "auto",
                            }}
                        >
                            {loading ? (
                                <Skeleton variant="circular" width={200} height={200} />
                            ) : (
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                {
                                                    id: 0,
                                                    value: dashboardcount?.totalEarnings || 0,
                                                    label: "Earnings",
                                                },
                                                { id: 1, value: dashboardcount?.totalExpense, label: "Expense" },
                                            ],
                                            innerRadius: 50,
                                            outerRadius: 100,
                                            paddingAngle: 5,
                                            cornerRadius: 4,
                                            startAngle: 0,
                                            endAngle: 360,
                                        },
                                    ]}
                                    height={350}
                                    legend={{
                                        direction: "row",
                                        position: {
                                            vertical: "bottom",
                                            horizontal: "middle",
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
