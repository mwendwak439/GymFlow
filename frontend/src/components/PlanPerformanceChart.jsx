
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
      <div className="chart-heading">
        <h2>Membership Plan Performance</h2>
        <p>Members subscribed to each membership plan</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#292929"
            vertical={false}
          />

          <XAxis
            dataKey="plan"
            stroke="#777777"
            tick={{ fill: "#999999", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            stroke="#777777"
            tick={{ fill: "#999999", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#191919",
              border: "1px solid #C6FF00",
              borderRadius: "8px",
              color: "#FFFFFF"
            }}
          />

          <Bar
            dataKey="members"
            fill="#C6FF00"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
