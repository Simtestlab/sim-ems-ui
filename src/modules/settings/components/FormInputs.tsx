
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      {...rest}
      className={`px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  );
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      type="number"
      {...rest}
      className={`px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  );
}

export function SmallNumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      type="number"
      {...rest}
      className={`w-20 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  );
}

export function TextAreaInput(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  );
}

export function CheckboxInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      type="checkbox"
      {...rest}
      className={`w-4 h-4 accent-blue focus:ring-black rounded ${className}`}
    />
  );
}

export function RadioInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      type="radio"
      {...rest}
      className={`w-4 h-4 accent-blue focus:ring-black ${className}`}
    />
  );
}

export function UnitLabel({ children, className = 'text-sm text-gray-500 w-8' }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}
