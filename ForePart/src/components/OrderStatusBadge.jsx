// src/components/OrderStatusBadge.jsx
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const OrderStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || "pending";
  const style = statusColors[normalizedStatus] || statusColors.pending;

  return (
    <span
      className={`px-3 py-1 rounded-full border text-sm font-medium ${style}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default OrderStatusBadge;
