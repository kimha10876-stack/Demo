import { Route, Routes } from "react-router";
import CreateEvent from "./components/CreateEvent/CreateEvent";
import EnterCode from "./components/OTP/EnterCode";
import OTPVerify from "./components/OTP/OTPVerify";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SignInForm from "./components/SignInForm/SignInForm";
import SignUpForm from "./components/SingUpForm/SignUpForm";
import RootLayout from "./layout/RootLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminCompany from "./pages/admin/companies/AdminCompany";
import AdminEvent from "./pages/admin/events/AdminEvent";
import AccountsPage from "./pages/admin/ManagerAccPage";
import RevenuePage from "./pages/admin/revenue/Revenues";
import LoginGoogleSucces from "./pages/auth/LoginGoogleSucces";
import SignInPage from "./pages/auth/SignInPage";
import ChatApp from "./pages/chat/ChatApp";
import CreateCompany from "./pages/company/CreateCompany";
import Consumer from "./pages/consumer/components/Consumer";
import CheckIn from "./pages/consumer/components/Event/Checkin/CheckIn";
import EventManagement from "./pages/consumer/components/Event/EventManagement";
import Order from "./pages/consumer/components/Event/Order/Order";
import Revenue from "./pages/consumer/components/Event/Revenue/Revenue";
import SummaryRevenue from "./pages/consumer/components/Event/Summary/SummaryRevenue";
import Tasks from "./pages/consumer/components/Event/Tasks/Tasks";
import Voucher from "./pages/consumer/components/Event/Voucher/Voucher";
import Information from "./pages/consumer/components/Information/Information";
import Member from "./pages/consumer/components/Member/Member";
import Policy from "./pages/consumer/components/Policy/Policy";
import ReportsPage from "./pages/consumer/components/Report/Report";
import RootLayouts from "./pages/consumer/Layout";
import SearchPage from "./pages/consumer/SearchPage";
import ErrorPage from "./pages/errors/ErrorPage";
import EventDetail from "./pages/EventDetail";
import HomePage from "./pages/HomePage";
import CompanyApprovalsPage from "./pages/manager/components/Companies/Companies";
import ContractsPage from "./pages/manager/components/Contracts/ContractsPage";
import ContractTemplate from "./pages/manager/components/Contracts/ContractTemplate";
import EventsPage from "./pages/manager/components/Events/EventsPage";
import DashboardLayout from "./pages/manager/components/ManagerLayout";
import ManagerOverview from "./pages/manager/components/ManagerOverview";
import NotificationPage from "./pages/manager/components/Notifications/NotificationPage";
import PaymentsPage from "./pages/manager/components/payments/Payments";
import VietQRGenerator from "./pages/manager/components/VietQRGenerator";
import OrganizerCenter from "./pages/organizer";
import PaymentPage from "./pages/payment/PaymentPage";
import ProfileForm from "./pages/profile/ProfileForm";
import SuperLogin from "./pages/superlogin/SuperLogin";
import TicketPage from "./pages/ticket/TicketPage";
import TicketBooking from "./pages/TicketBooking";
import TicketBookingNoneSeatmap from "./pages/TicketBookingNoneSeatmap";
import CallbackPayment from "./pages/payment/QueueLoading/CallbackPayment";
import MyTask from "./pages/task/MyTask";
import TaskList from "./pages/task/components/TaskList";
import Cooperations from "./pages/task/components/Cooperations";
import ChangeTicket from "./pages/changeTicket/ChangeTicket";
import Buyers from "./pages/consumer/components/Event/Buyers/Buyers";

export default function App() {
  return (
    <div className="font-inter text-[14px] text-white min-h-screen bg-[#1E1E1E] overflow-x-hidden">
      <ScrollToTop />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="event-detail/:id" element={<EventDetail />} />
          <Route
            path="/manager-dashboard/events/event-detail/:id/manager"
            element={<EventDetail />}
          />

          <Route
            path="event-detail/:id/booking-ticket"
            element={<TicketBooking />}
          />
          <Route
            path="/manager-dashboard/events/event-detail/:id/manager/booking-ticket"
            element={<TicketBooking />}
          />
          <Route path="create-event" element={<CreateEvent />} />

          {/* Authitencation route */}
          <Route path="auth" element={<SignInPage />}>
            <Route index path="signin" element={<SignInForm />} />
            <Route path="signup" element={<SignUpForm />} />
            <Route path="verify" element={<OTPVerify />} />
            <Route path="code" element={<EnterCode />} />
          </Route>
          {/* Organizer route */}
          <Route path="404" element={<ErrorPage />} />

          {/*Company route */}
          <Route path="create-company" element={<CreateCompany />} />
          <Route path="search" element={<SearchPage />} />
        </Route>

        <Route
          path="event-detail/:id/booking-ticket-no-seatmap"
          element={<TicketBookingNoneSeatmap />}
        />
        <Route
          path="/manager-dashboard/events/event-detail/:id/manager/booking-ticket-no-seatmap"
          element={<TicketBookingNoneSeatmap />}
        />
        <Route path="login-google-success" element={<LoginGoogleSucces />} />

        {/* My task route */}
        <Route path="my-task" element={<MyTask />}>
          <Route index element={<TaskList />} />
          <Route path="cooperations" element={<Cooperations />} />
        </Route>

        <Route>
          <Route path="organizerCenter" element={<OrganizerCenter />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="payment/queue" element={<CallbackPayment />} />

          {/* MANAGER DASHBOARD */}
          <Route path="manager-dashboard" element={<DashboardLayout />}>
            <Route index element={<ManagerOverview />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route
              path="company-approvals"
              element={<CompanyApprovalsPage />}
            />
            <Route path="notifications" element={<NotificationPage />} />
          </Route>

          <Route path="profileForm" element={<ProfileForm />} />
          <Route path="superLogin" element={<SuperLogin />} />

          {/* COMPANY BOARD*/}
          <Route path="company" element={<RootLayouts />}>
            <Route index element={<Consumer />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="policies" element={<Policy />} />
            <Route path="members" element={<Member />} />
            <Route path="information" element={<Information />} />
          </Route>

          {/* Event Management */}
          <Route path="/company/events/:eventId" element={<EventManagement />}>
            <Route index path="summary-revenue" element={<SummaryRevenue />} />
            <Route path="orders" element={<Order />} />
            <Route path="buyers" element={<Buyers />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="vouchers" element={<Voucher />} />
          </Route>

          <Route />

          <Route path="ticketManagement" element={<TicketPage />} />

          {/* ADMIN DASHBOARD */}
          <Route path="proAdmin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvent />} />
            <Route path="companies" element={<AdminCompany />} />
            <Route path="managerManagement" element={<AccountsPage />} />
            <Route path="revenues" element={<RevenuePage />} />

            {/* <Route path="profile" element={<ProfileAdmin />} /> */}
          </Route>
        </Route>

        <Route path="404" element={<ErrorPage />} />
        <Route path="vietqr" element={<VietQRGenerator />} />

        {/* Chat app */}
        <Route path="chat" element={<ChatApp />} />
        <Route path="template" element={<ContractTemplate />} />
        <Route path="change-ticket" element={<ChangeTicket />} />
      </Routes>
    </div>
  );
}
