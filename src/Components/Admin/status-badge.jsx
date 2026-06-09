export default function StatusBadge({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400";
      case "inactive":
        return "bg-red-500/20 text-red-400";
      case "blocked":
        return "bg-red-500/10 text-red-400";
      case "Completed":
        return "bg-green-950/50 text-green-200";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <span
      className={`px-4 py-2 rounded-lg text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}
