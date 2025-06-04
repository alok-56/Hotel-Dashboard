import { Routes, Route, Navigate } from "react-router-dom";
import HotelList from "../Pages/Hotel/HotelList";
import CreateHotel from "../Pages/Hotel/CreateHotel";
import Dashboard from "../Pages/Dashboard";
import Roomlist from "../Pages/Rooms/Roomlist";
import AdminList from "../Pages/Admin/AdminList";
import BookingList from "../Pages/Booking/Bookinglist";
import PaymentList from "../Pages/Payments/Paymentslist";
import StaffList from "../Pages/Staff/StaffList";
import ExpenseList from "../Pages/Expence/ExpenceList";
import SalaryList from "../Pages/Salary/SalaryList";
import GetInventry from "../Pages/Inventery/GetInventry";
import BookingReport from "../Pages/Report/BookingReport";
import B2B from "../Pages/Bussiness/B2B";
import ListProperty from "../Pages/Bussiness/ListProperty";



function AppRoutes() {
    return (
        <Routes>
            <Route path="/admins" element={<AdminList />} />
            <Route path="/hotel" element={<HotelList />} />
            <Route path="/rooms" element={<Roomlist></Roomlist>} />
            <Route path="/bookings" element={<BookingList></BookingList>} />
            <Route path="/inventory" element={<GetInventry></GetInventry>} />
            <Route path="/payments" element={<PaymentList></PaymentList>} />
            <Route path="/staff" element={<StaffList></StaffList>} />
            <Route path="/expence" element={<ExpenseList></ExpenseList>} />
            <Route path="/reports/salary" element={<SalaryList></SalaryList>} />
            <Route path="/reports/bookingreport" element={<BookingReport></BookingReport>} />
             <Route path="/bussiness/b2b" element={<B2B></B2B>} />
            <Route path="/bussiness/listproperty" element={<ListProperty></ListProperty>} />
            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
            <Route path="*" element={<Dashboard></Dashboard>} />
        </Routes>
    );
}

export default AppRoutes;
