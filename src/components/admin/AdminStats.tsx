import { IAdminStatistics } from '@/src/interfaces/admin';
import { FaUsers, FaDog, FaNewspaper, FaBook, FaCreditCard, FaFlag, FaChartLine, FaBuilding } from 'react-icons/fa';

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{Number(value).toLocaleString()}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function MonthlyChart({ data }: { data: IAdminStatistics['monthlyStats'] }) {
  if (!data || data.length === 0) return null;
  const months = data.slice(-6);
  const max = Math.max(...months.map((d) => d.users + d.pets + d.posts), 1);
  const BAR_MAX_PX = 90;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Hoạt động theo tháng</h3>
      <div className="flex gap-2" style={{ height: '110px' }}>
        {months.map((d) => {
          const total = d.users + d.pets + d.posts;
          const heightPx = Math.max(4, Math.round((total / max) * BAR_MAX_PX));
          return (
            <div key={d.month} className="flex-1 flex flex-col justify-end items-center min-w-0">
              <span className="text-xs text-gray-500 font-medium mb-1">{total}</span>
              <div
                className="w-full bg-amber-400 rounded-t-md transition-all"
                style={{ height: heightPx + 'px' }}
                title={`${d.month}: ${total} (${d.users} người dùng, ${d.pets} thú cưng, ${d.posts} bài đăng)`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-1">
        {months.map((d) => (
          <div key={d.month} className="flex-1 text-center text-xs text-gray-400 truncate">{d.month}</div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          Tổng hoạt động (người dùng mới + thú cưng mới + bài đăng mới)
        </span>
      </div>
    </div>
  );
}

interface IAdminStatsProps {
  stats: IAdminStatistics | null;
}

export function AdminStats({ stats }: IAdminStatsProps) {
  if (!stats) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">
        Không thể tải dữ liệu thống kê.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tổng người dùng"
          value={stats.totalUsers}
          sub={`${stats.activeUsers} đang hoạt động`}
          icon={FaUsers}
          color="bg-blue-500"
        />
        <StatCard
          label="Tổ chức"
          value={stats.totalOrganizations}
          icon={FaBuilding}
          color="bg-indigo-500"
        />
        <StatCard
          label="Thú cưng"
          value={stats.totalPets}
          sub={`${stats.availablePets} sẵn sàng nhận nuôi`}
          icon={FaDog}
          color="bg-amber-500"
        />
        <StatCard
          label="Đã được nhận nuôi"
          value={stats.adoptedPets}
          sub="Thú cưng không còn available"
          icon={FaChartLine}
          color="bg-green-500"
        />
        <StatCard
          label="Bài đăng"
          value={stats.totalPosts}
          icon={FaNewspaper}
          color="bg-purple-500"
        />
        <StatCard
          label="Blog"
          value={stats.totalBlogs}
          icon={FaBook}
          color="bg-pink-500"
        />
        <StatCard
          label="Giao dịch"
          value={stats.totalPayments}
          sub={`${stats.totalRevenue?.toLocaleString()} VND doanh thu`}
          icon={FaCreditCard}
          color="bg-teal-500"
        />
        <StatCard
          label="Báo cáo chờ xử lý"
          value={stats.pendingReports}
          sub={`${stats.resolvedReports} đã giải quyết`}
          icon={FaFlag}
          color="bg-red-500"
        />
      </div>

      {stats.monthlyStats && stats.monthlyStats.length > 0 && (
        <MonthlyChart data={stats.monthlyStats} />
      )}
    </div>
  );
}
