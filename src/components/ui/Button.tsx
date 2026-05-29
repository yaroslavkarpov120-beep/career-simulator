import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
};

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-900/40",
  secondary: "glass text-white hover:bg-white/10",
  ghost: "text-[var(--muted)] hover:text-white",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: Props) {
  const base = `inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
    >
      {children}
    </button>
  );
}
