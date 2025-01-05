import { InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

interface InputWithButtonProps {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  buttonLabel?: string;
}

function InputWithButton(props: InputWithButtonProps) {
  const { inputProps, buttonProps, buttonLabel } = props;

  return (
    <div className="group flex w-full flex-row items-center overflow-hidden rounded-xl border border-default-gray bg-white focus-within:border-default-orange">
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
