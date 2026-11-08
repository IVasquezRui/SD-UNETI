type SiteLogoProps = {
  variant?: "light" | "dark" | "footer";
  className?: string;
};

export default function LogotipoSitio({ variant = "dark", className = "" }: SiteLogoProps) {
  const variantClass =
    variant === "light" ? "uneti-logo--light" : variant === "footer" ? "uneti-logo--footer" : "";
  const esFooter = variant === "footer";

  return (
    <img
      src="/assets/images/uneti/logo.png"
      srcSet={
        esFooter
          ? "/assets/images/uneti/logo.png 1x, /assets/images/uneti/logo@2x.png 2x"
          : undefined
      }
      alt="UNETI — Universidad Nacional Experimental de las Telecomunicaciones e Informática"
      className={`uneti-logo ${variantClass} ${className}`.trim()}
      width={180}
      height={55}
      decoding="async"
      loading={esFooter ? "lazy" : "eager"}
    />
  );
}
