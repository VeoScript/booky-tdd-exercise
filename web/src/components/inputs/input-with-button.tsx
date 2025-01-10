import { InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputWithButtonProps {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  buttonLabel?: string;
  isError?: boolean;
}

function InputWithButton(props: InputWithButtonProps) {
  const { inputProps, buttonProps, buttonLabel, isError } = props;

  return (
    <div
      className={clsx(
        isError && 'focus-within:border-red-500',
        'group flex w-full flex-row items-center overflow-hidden rounded-xl border-2 border-default-gray bg-white focus-within:border-default-orange'
      )}
    >
      <input {...inputProps} className="w-full p-3 outline-none" />
      <button
        {...buttonProps}
        className="w-[10rem] bg-default-gray p-3 font-bold uppercase text-white hover:opacity-50 group-focus-within:bg-default-orange"
      >
        {buttonLabel ?? 'Label'}
      </button>
    </div>
  );
}

export default InputWithButton;
