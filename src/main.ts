import { FormConfig, InputOption } from "./model";
import { getForm, getGlobalValue, saveForm } from "./db";

/**
 * Retrieves the form value for a given ID. It will first try to get the form state
 * and if it doesn't exist, it will get the form configuration as default values.
 * @param id - The ID of the form.
 * @returns A Promise that resolves to the FormConfig object if found, otherwise undefined.
 */
export async function getFormValue(
  id: string
): Promise<FormConfig | undefined> {
  const formState = await getFormState(id);
  if (formState !== undefined) {
    return formState;
  } else {
    return await getFormConfig(id);
  }
}

/**
 * Saves the form configuration to the database.
 *
 * @param form - The form configuration to save.
 * @returns A promise that resolves with the ID of the saved form configuration.
 */
export function saveFormConfig(form: FormConfig): Promise<IDBValidKey> {
  return saveForm(form, "Config");
}

/**
 * Retrieves the form configuration for a given ID.
 * @param id - The ID of the form.
 * @returns A Promise that resolves to the FormConfig object.
 */
export async function getFormConfig(
  id: string
): Promise<FormConfig | undefined> {
  return await getForm(id, "Config");
}

/**
 * Saves the state of a form configuration.
 *
 * @param form - The form configuration to save.
 * @returns A promise that resolves with the IDBValidKey of the saved form state.
 */
export function saveFormState(form: FormConfig): Promise<IDBValidKey> {
  return saveForm(form, "State");
}

/**
 * Retrieves the form state for a given ID.
 * @param id - The ID of the form.
 * @returns A Promise that resolves to the FormConfig object representing the form state.
 */
export async function getFormState(
  id: string
): Promise<FormConfig | undefined> {
  const formState = await getForm(id, "State");
  if (!formState) {
    return undefined;
  }

  return patchWithGlobalValues(formState);
}

/**
 * Updates the form inputs with global values.
 * @param form - The form configuration object.
 * @returns A promise that resolves to the updated form configuration object.
 */
export async function patchWithGlobalValues(
  form: FormConfig
): Promise<FormConfig> {
  for (const key in form.inputs) {
    const input = form.inputs[key];
    if (input && input.globalKey) {
      const globalValue = await getGlobalValue(input.globalKey);
      input.value = globalValue;
    }
  }
  return form;
}

/**
 * Retrieves the options for a specific input in a form.
 *
 * @param formId - The ID of the form.
 * @param inputId - The ID of the input.
 * @returns A promise that resolves to an array of InputOption objects.
 */
export async function getOptions(
  formId: string,
  inputId: string
): Promise<InputOption<unknown>[]> {
  //we take formValue because it will take the most recent state into account
  //and because input value could influence the options
  const formState = await getFormValue(formId);
  const inputConfig = formState?.inputs[inputId];
  //TODO add support for dynamic options based on input dependencies values
  const options = inputConfig?.options || [];
  return options;
}

/**
 * Retrieves the value of an input in a form.
 *
 * @param formId - The ID of the form.
 * @param inputId - The ID of the input.
 * @returns A Promise that resolves to the value of the input.
 */
export async function getValue(
  formId: string,
  inputId: string
): Promise<unknown> {
  //we take formValue because it will take the most recent state into account
  const formState = await getFormValue(formId);
  return formState?.inputs[inputId]?.value;
}
