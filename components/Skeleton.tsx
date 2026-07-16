interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-[24px] bg-[linear-gradient(110deg,#f7efe8_8%,#fffdf9_18%,#f7efe8_33%)] bg-[length:200%_100%] ${className}`} />
  );
}
