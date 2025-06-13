import Link from "next/link";

export const CTALink = ({
    label,
    reference,
    className,
    children,
    ...props
  }: {
    label: string;
    reference: string;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }) => {
    return (
      <Link href={reference} className={className} {...props}>
        {label}
        {children}
      </Link>
    );
  };