type SiteLogoProps = {
  variant?: "light" | "dark" | "footer";
  className?: string;
};

export default function LogotipoSitio({ variant = "dark", className = "" }: SiteLogoProps) {
  const variantClass =
    variant === "light" ? "uneti-logo--light" : variant === "footer" ? "uneti-logo--footer" : "";

  return (
    <img
      src="/assets/images/uneti/logo.png"
      alt="UNETI — Universidad Nacional Experimental de las Telecomunicaciones e Informática"
      className={`uneti-logo ${variantClass} ${className}`.trim()}
    />
  );
}
