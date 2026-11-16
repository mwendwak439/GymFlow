
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function RevenueChart({ data = [] }) {
  const formatCurrency = (value) =>
    `KES ${Number(value).toLocaleString("en-KE")}`;

  return (
    <div className="revenue-chart">
      <h2>Revenue Overview</h2>
      <p>Monthly revenue for the last six months</p>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis
            tickFormatter={(value) =>
              `${value / 1000}k`
            }
          />

          <Tooltip
            formatter={(value) => [
              formatCurrency(value),
              "Revenue"
            ]}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
