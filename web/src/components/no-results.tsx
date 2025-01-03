import noResultsImage from '../assets/no-result.png';

interface NoResultsProps {
  title?: string;
}

function NoResults(props: NoResultsProps) {
  const { title } = props;

  return (
    <div className="flex w-full flex-col items-center gap-y-5">
      <img
        src={noResultsImage}
        alt="Logo"
        className="h-[10rem] w-[10rem] object-cover"
      />
      <p className="text-default-gray">{title ?? 'No results'}</p>
    </div>
  );
}

export default NoResults;
