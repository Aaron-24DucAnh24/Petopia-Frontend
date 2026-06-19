interface IAdminStatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function AdminStatusBadge({
  isActive,
  activeLabel = 'Hoạt động',
  inactiveLabel = 'Vô hiệu',
}: IAdminStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-600'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isActive ? 'bg-green-500' : 'bg-red-400'
        }`}
      />
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
