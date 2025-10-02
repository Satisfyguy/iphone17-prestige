import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary/20 border-t-primary", sizeClasses[size], className)}>
      <span className="sr-only">Chargement...</span>
    </div>
  );
};

export const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 bg-primary rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

export const LoadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse bg-muted rounded", className)} />
  );
};
