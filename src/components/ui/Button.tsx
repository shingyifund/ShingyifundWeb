import * as React from "react";
import Link from "next/link";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LinkPending } from "@/components/ui/link-pending";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        primary:
          "rounded-full bg-amber-500 text-navy-900 shadow-[0_10px_28px_-10px_rgb(245_166_35_/_0.7)] hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_14px_34px_-10px_rgb(245_166_35_/_0.8)]",
        secondary:
          "rounded-full bg-navy-700 text-white shadow-[0_10px_28px_-12px_rgb(15_38_71_/_0.6)] hover:-translate-y-0.5 hover:bg-navy-600",
        white:
          "rounded-full bg-white text-navy-700 ring-1 ring-navy-200 hover:-translate-y-0.5 hover:bg-white hover:ring-navy-300",
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:text-foreground",
        ghost: "text-foreground hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-2.5",
        sm: "h-9 rounded-full px-4 text-sm",
        md: "h-11 rounded-full px-6 text-[15px]",
        lg: "h-13 rounded-full px-8 text-base",
        xs: "h-6 px-2 text-xs",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type CommonProps = {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
} & ButtonVariantProps;

type LinkButtonProps = CommonProps & {
  href: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">;

type NativeButtonProps = CommonProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type ButtonProps = LinkButtonProps | NativeButtonProps;

function Button({
  href,
  asChild = false,
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  const cls = cn(buttonVariants({ variant, size, className }));

  if (href) {
    const linkProps = props as Omit<
      React.ComponentProps<typeof Link>,
      "href" | "className" | "children"
    >;

    return (
      <Link href={href} className={cls} {...linkProps}>
        <LinkPending />
        {children}
      </Link>
    );
  }

  if (asChild) {
    return (
      <Slot.Root className={cls} {...props}>
        {children}
      </Slot.Root>
    );
  }

  const buttonProps = props as Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

  return (
    <button className={cls} {...buttonProps}>
      {children}
    </button>
  );
}

export { Button, buttonVariants };
