import * as yup from 'yup';

const stringTrimmedAndValid = yup
  .string()
  .trim() // Ensure input is trimmed
  .matches(/^(?!\s*$).+$/, 'Input must not be empty or only whitespace.') // Ensure the string isn't empty or full of spaces
  .min(1, 'Input must be at least 1 character.') // Ensure it is at least 1 character
  .max(20, 'Input must be at most 20 characters.');

export const createGroceryItemValidation = yup.object({
  name: stringTrimmedAndValid.required('Email is required.'),
});
