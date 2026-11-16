import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function PlanPerformanceChart({ data = [] }) {
  return (
    <div className="plan-performance-chart">
      <h2>Membership Plan Performance</h2>
      <p>Members subscribed to each membership plan</p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="plan" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="members"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}