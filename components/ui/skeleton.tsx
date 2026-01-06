import { cn } from "@/lib/utils";

type SkeletonVariant =
  | "text"
  | "line"
  | "circle"
  | "avatar"
  | "rect"
  | "card"
  | "button"
  | "image";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

function Skeleton({ variant = "rect", className, ...props }: SkeletonProps) {
  const base = "animate-pulse bg-muted";

  const variantMap: Record<SkeletonVariant, string> = {
    text: "h-4 w-full rounded-sm",
    line: "h-3 w-full rounded-sm",
    circle: "w-10 h-10 rounded-full",
    avatar: "w-12 h-12 rounded-full",
    rect: "rounded-md",
    card: "rounded-2xl",
    button: "h-8 w-24 rounded-md",
    image: "rounded-md",
  };

  const classes = cn(base, variantMap[variant], className);
  return <div className={classes} {...props} />;
}

// Helper components for convenience
function SkeletonText(props: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="text" {...props} />;
}

function SkeletonLine(props: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="line" {...props} />;
}

function SkeletonCircle(props: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="circle" {...props} />;
}

function SkeletonAvatar(props: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="avatar" {...props} />;
}

function SkeletonCard(props: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="card" {...props} />;
}

export { Skeleton, SkeletonText, SkeletonLine, SkeletonCircle, SkeletonAvatar, SkeletonCard };
