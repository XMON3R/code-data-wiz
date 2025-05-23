
// 1. Define an interface for the Header's props
interface HeaderProps {
  className?: string; // Make className optional, as it might not always be provided
}

// 2. Update the Header component to accept these props
export function Header({ className }: HeaderProps) {
  return (
    // 3. Apply the received className to the div
    <div className={`border-2 border-gray-200 flex items-center justify-center ${className}`}>
      Code Data Wiz!
    </div>
  );
}