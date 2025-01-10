function ListSkeleton() {
  const skeletons = new Array(20).fill(null);

  return (
    <div className="flex w-full flex-col gap-y-3">
      {skeletons.map((_, index) => (
        <div key={index} className="h-[3rem] w-full animate-pulse rounded-xl bg-neutral-200 p-3" />
      ))}
    </div>
  );
}

export default ListSkeleton;
