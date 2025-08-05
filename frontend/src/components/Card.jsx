export default function Card({ children, className }) {
  return (
    <div className={`bg-gray-800 p-6 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}
