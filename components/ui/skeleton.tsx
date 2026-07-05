type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

export function MessageSkeleton() {
  return (
    <div className="px-4 py-6 animate-fade-in">
      <div className="mx-auto flex max-w-3xl gap-4">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="space-y-1 px-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-9 w-full rounded-lg" />
      ))}
    </div>
  );
}
