
interface HeaderProps {
  className?: string; // className optional, as it might not always be provided
}

export function Header({ className }: HeaderProps) {
  return (
    <div className={`border-2 border-gray-200 flex items-center justify-center ${className}`}>
      Code Data Wiz!
    </div>
  );
}