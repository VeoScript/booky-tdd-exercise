import spinner from '../assets/spinner.svg';

interface Props {
  className: string;
}

function LoadingSpinner({ className }: Props) {
  return <img src={spinner} alt="Spinner" className={className} />;
}

export default LoadingSpinner;
