export default function Button({ children, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-primary hover:bg-accentPurple",
    secondary: "bg-gray-600 hover:bg-gray-700",
    danger: "bg-red-600 hover:bg-red-700",
    success: "bg-accentGreen text-dark hover:brightness-90"
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
