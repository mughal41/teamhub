import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { cn } from "../lib/utils";
import { Card } from "../components/ui/LayoutAddons";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ChevronDown,
  ArrowUpDown,
  Download,
  CircleDollarSign,
  DollarSign,
  HandCoins,
  Clock,
  Banknote,
  CheckCircle,
  FileText,
  X,
  Plus,
  Trash2,
  Info,
  Calendar,
  Send,
  Edit,
  RotateCcw,
  Check,
  AlertCircle,
  CreditCard,
  User,
  Activity,
  Award,
  Loader2,
} from "lucide-react";
import {
  getPayrollRecordsApi,
  processPayrollApi,
  updatePayrollStatusApi,
  PayrollRecord as ApiPayrollRecord,
} from "../lib/api/payroll";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toast, setToast] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const fetchPayrollData = React.useCallback(() => {
    setIsLoading(true);
    getPayrollRecordsApi()
      .then((data) => {
        const mapped = data.map((item) => ({
          id: item.employee_id || item.employee,
          record_id: item.id,
          name: item.employee_name || "Employee",
          role: item.employee_role || "Staff Member",
          subRole: item.department_name || "General",
          date: item.pay_period,
          salary: `$${Number(item.base_salary).toLocaleString()}`,
          allowance: `$${Number(item.allowance).toLocaleString()}`,
          overtime: `$${Number(item.overtime_pay).toLocaleString()}`,
          incen: `$${Number(item.incentives).toLocaleString()}`,
          deduct: `$${Number(item.deductions).toLocaleString()}`,
          total: `$${Number(item.total_net_pay).toLocaleString()}`,
          status: item.status,
          avatar: item.employee_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
          raw_item: item,
        }));
        setPayrolls(mapped);
      })
      .catch((err) => console.error("Error loading payroll records:", err))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    fetchPayrollData();
  }, [fetchPayrollData]);

  const parseAmount = (valStr: any) => {
    if (!valStr) return 0;
    if (typeof valStr === "number") return valStr;
    return parseFloat(String(valStr).replace(/[$,]/g, "")) || 0;
  };

  const totalBaseSalary = payrolls.reduce((sum, item) => sum + parseAmount(item.salary), 0);
  const totalAllowances = payrolls.reduce((sum, item) => sum + parseAmount(item.allowance), 0);
  const totalOvertime = payrolls.reduce((sum, item) => sum + parseAmount(item.overtime), 0);
  const totalIncentives = payrolls.reduce((sum, item) => sum + parseAmount(item.incen), 0);
  const totalPayrollDeductions = payrolls.reduce((sum, item) => sum + parseAmount(item.deduct), 0);
  const totalNetPay = payrolls.reduce((sum, item) => sum + parseAmount(item.total), 0);

  const handleProcessAllPending = async () => {
    try {
      const res = await processPayrollApi();
      showToast(`Successfully processed ${res.processed_count} pending payouts!`);
      fetchPayrollData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsPaid = async (recordId: string) => {
    try {
      await updatePayrollStatusApi(recordId, "Paid");
      showToast("Payroll updated to Paid!");
      fetchPayrollData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPayrolls = React.useMemo(() => {
    return payrolls.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payrolls, searchTerm]);

  return (
    <AppLayout
      title="Payroll & Disbursements"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Payroll" }]}
    >
      <div className="space-y-5 relative">
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#203430] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-brand animate-bounce">
            <CheckCircle className="h-5 w-5 text-brand" />
            <span className="text-[13px] font-semibold">{toast}</span>
          </div>
        )}

        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Total Base Salary",
              val: "$" + totalBaseSalary.toLocaleString(),
              icon: CircleDollarSign,
              iconColor: "#35BFA3",
            },
            {
              label: "Total Allowances",
              val: "$" + totalAllowances.toLocaleString(),
              icon: HandCoins,
              iconColor: "#35BFA3",
            },
            {
              label: "Total Overtime Pay",
              val: "$" + totalOvertime.toLocaleString(),
              icon: Clock,
              iconColor: "#35BFA3",
            },
            {
              label: "Total Net Disbursements",
              val: "$" + totalNetPay.toLocaleString(),
              icon: Banknote,
              iconColor: "#35BFA3",
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="p-4 border-none rounded-[16px] bg-white shadow-sm flex items-center justify-between"
            >
              <div className="space-y-2">
                <p className="text-[12px] text-[#63716E]">{stat.label}</p>
                <p className="text-[28px] font-bold text-[#203430] leading-none">
                  {stat.val}
                </p>
                <span className="text-[10px] text-[#63716E]">Active Pay Period</span>
              </div>
              <div className="h-[60px] w-[60px] bg-[#F7F7F7] rounded-[8px] flex items-center justify-center">
                <stat.icon
                  className="h-8 w-8"
                  style={{ color: stat.iconColor }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#203430]">Salary Disbursements Ledger</h2>
            <p className="text-xs text-[#63716E]">Bulk salary payouts and individual payslip disbursements</p>
          </div>
          <button
            onClick={handleProcessAllPending}
            className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-[#0E4D41] transition-all shadow-sm flex items-center gap-2"
          >
            <Banknote className="h-4 w-4" /> Process Bulk Payouts
          </button>
        </div>

        {/* Table Card */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-3 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm font-semibold text-[#203430]">Loading payroll registers from backend...</p>
          </div>
        ) : (
          <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff name or role..."
                  className="pl-10 pr-4 py-2 w-full h-[36px] bg-[#F7F7F7] rounded-[10px] border-none text-[12px] text-[#63716E] outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F7F7F7]">
                  <tr className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Period</th>
                    <th className="px-6 py-3">Base Salary</th>
                    <th className="px-6 py-3">Allowances</th>
                    <th className="px-6 py-3">Overtime</th>
                    <th className="px-6 py-3">Incentives</th>
                    <th className="px-6 py-3">Deductions</th>
                    <th className="px-6 py-3">Net Pay</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayrolls.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400 font-semibold">
                        No payroll records found.
                      </td>
                    </tr>
                  ) : (
                    filteredPayrolls.map((p) => (
                      <tr key={p.record_id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.avatar} className="h-8 w-8 rounded-full object-cover border" />
                            <div>
                              <p className="font-bold text-[#203430]">{p.name}</p>
                              <p className="text-[10px] text-slate-400">{p.id} • {p.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 font-semibold text-slate-700">{p.date}</td>
                        <td className="px-6 py-3 font-semibold text-slate-700">{p.salary}</td>
                        <td className="px-6 py-3 font-semibold text-slate-700">{p.allowance}</td>
                        <td className="px-6 py-3 font-semibold text-slate-700">{p.overtime}</td>
                        <td className="px-6 py-3 font-semibold text-slate-700">{p.incen}</td>
                        <td className="px-6 py-3 font-semibold text-slate-700">{p.deduct}</td>
                        <td className="px-6 py-3 font-extrabold text-brand">{p.total}</td>
                        <td className="px-6 py-3">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              p.status === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            )}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          {p.status !== "Paid" ? (
                            <button
                              onClick={() => handleMarkAsPaid(p.record_id)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all font-bold text-[11px]"
                            >
                              Disburse Payout
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-end gap-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Disbursed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
