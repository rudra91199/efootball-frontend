export default function StatusBadge({ status, type = "default" }) {
  const getStatusColor = (status, type) => {
    if (type === "phase") {
      switch (status) {
        case "Active":
          return "bg-green-500/20 text-green-400";
        case "Completed":
          return "bg-blue-500/20 text-blue-400";
        case "Pending":
          return "bg-gray-500/20 text-gray-400";
        default:
          return "bg-gray-500/20 text-gray-400";
      }
    }

    switch (status) {
      case "Live":
        return "bg-green-500/20 text-green-400";
      case "Upcoming":
        return "bg-blue-500/20 text-blue-400";
      case "Completed":
        return "bg-gray-500/20 text-gray-400";
      case "Published":
        return "bg-yellow-500/20 text-yellow-400";
      case "Scheduled":
        return "bg-blue-500/20 text-blue-400";
      case "Active":
        return "bg-green-500/20 text-green-400";
      case "Inactive":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status,
        type
      )}`}
    >
      {status}
    </span>
  );
}
