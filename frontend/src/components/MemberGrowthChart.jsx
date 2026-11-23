
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function MemberGrowthChart({ data = [] }) {
  return (
    <div className="member-growth-chart">
      <div className="chart-heading">
        <h2>Member Growth</h2>
        <p>New members registered over the last six months</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#292929"
            vertical={false}
          />

          <XAxis
            dataKey="month"
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

          <Line
            type="monotone"
            dataKey="members"
            stroke="#C6FF00"
            strokeWidth={3}
            dot={{ r: 5, fill: "#C6FF00", stroke: "#0A0A0A" }}
            activeDot={{ r: 7, fill: "#FFFFFF", stroke: "#C6FF00" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
