import NoResults from '../no-results';

function BoughtTab() {
  return (
    <div className="flex h-full w-full flex-col gap-y-10 p-3">
      <div className="flex w-full flex-col gap-y-3">
        <NoResults title="Nothing here yet..." />
      </div>
    </div>
  );
}

export default BoughtTab;
