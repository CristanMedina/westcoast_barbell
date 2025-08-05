export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <input
        {...props}
        className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-accentPurple"
      />
    </div>
  );
}
