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
  EventBusy,
  DateRange,
  MonetizationOn,
} from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";
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
        setSelectedBranches(allBranches);
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
    {
      title: "Today's Vacant Rooms",
      icon: <EventBusy fontSize="large" />,
      value: dashboardcount?.todayVacantRooms || 0,
      bgColor: "#e0f7fa",
    },
    {
      title: "Last Month Bookings",
      icon: <DateRange fontSize="large" />,
      value: dashboardcount?.lastMonthBookingCount || 0,
      bgColor: "#ede7f6",
    },
    {
      title: "Last Month Earnings",
      icon: <MonetizationOn fontSize="large" />,
      value: `₹${dashboardcount?.lastMonthEarnings || 0}`,
      bgColor: "#fbe9e7",
    },
    {
      title: "Total Rooms",
      icon: <Hotel fontSize="large" />,
      value: dashboardcount?.totalRooms || 0,
      bgColor: "#e3f2fd",
    },
    {
      title: "All Time Booking",
      icon: <MeetingRoom fontSize="large" />,
      value: dashboardcount?.totalBookings || 0,
      bgColor: "#e8f5e9",
    },
    {
      title: "All Time Earning",
      icon: <AttachMoney fontSize="large" />,
      value: `₹${dashboardcount?.totalEarnings || 0}`,
      bgColor: "#f3e5f5",
    },
  ];

  return (
    <Box p={2} minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🏨 Hotel Dashboard
      </Typography>

      {/* Branch Selector */}
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
      <Grid container spacing={4} mt={5}>
        {dataSummary.map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                backgroundColor: item.bgColor,
                boxShadow: 3,
                borderRadius: 2,
                height: "100%",
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
        {/* Bookings Bar Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, boxShadow: 4, borderRadius: 5 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📅 Weekly Booking Overview
            </Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box sx={{ minWidth: 1000 }}>
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
                    layout={{ barGap: 2, barCategoryGap: 10 }}
                    height={350}
                  />
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Earnings Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 4, borderRadius: 5 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              💰 Daily Earnings Breakdown
            </Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box sx={{ minWidth: 1000 }}>
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
                    layout={{ barGap: 2, barCategoryGap: 10 }}
                    height={350}
                  />
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
