import { FormConfig, FormState, InputOption } from "./types";
import {
  get,
  getGlobalValueFromDb,
  save,
  saveAllGlobalValues,
  saveGlobalValue,
} from "./db";

/**
 * Retrieves the form value for a given ID. It will first try to get the form state
 * and if it doesn't exist, it will get the form configuration as default values.
 * @param id - The ID of the form.
 * @returns A Promise that resolves to the FormConfig object if found, otherwise undefined.
 */
export async function getFormState(id: string): Promise<FormState | undefined> {
  let formState = await getFormCurrentState(id);
  if (!formState) {
    const formConfig = await getFormConfig(id);
    if (formConfig !== undefined) {
      const state = Object.keys(formConfig.inputsConfig).reduce((acc, key) => {
        acc[key] = formConfig.inputsConfig[key]!.value;
        return acc;
      }, {} as { [key: string]: unknown });

      formState = {
        id: formConfig.id,
        state: state,
      };
    }
  }
  return formState;
}

/**
 * Saves the form configuration to the database.
 *
 * @param form - The form configuration to save.
 * @returns A promise that resolves with the ID of the saved form configuration.
 */
export async function saveFormConfig(form: FormConfig): Promise<IDBValidKey> {
  //create global state if needed
  for (const key in form.inputsConfig) {
    const input = form.inputsConfig[key]!;
    const globalValue = getGlobalValueFromDb(input.globalKey!);
    if (input.globalKey && !globalValue) {
      await saveGlobalValue(input.globalKey, input.value);
    }
  }
  return save(form, "Config");
}

/**
 * Retrieves the form configuration for a given ID.
 * @param id - The ID of the form.
 * @returns A Promise that resolves to the FormConfig object.
 */
async function getFormConfig(id: string): Promise<FormConfig | undefined> {
  return await get<FormConfig>(id, "Config");
}

/**
 * Saves the state of a form configuration.
 *
 * @param form - The form configuration to save.
 * @returns A promise that resolves with the IDBValidKey of the saved form state.
 */
export async function saveFormState(form: FormState): Promise<IDBValidKey> {
  //save global values
  await saveAllGlobalValues(form);
  return save(form, "State");
}

/**
 * Retrieves the form state for a given ID.
 * @param id - The ID of the form.
 * @returns A Promise that resolves to the FormConfig object representing the form state.
 */
async function getFormCurrentState(id: string): Promise<FormState | undefined> {
  const formState = await get<FormState>(id, "State");
  const formConfig = await getFormConfig(id);
  let patchedState = formState;
  if (formState && formConfig) {
    patchedState = await patchWithGlobalValues(formConfig, formState);
  }
  return patchedState;
}

/**
 * Updates the form inputs with global values.
 * @param form - The form configuration object.
 * @returns A promise that resolves to the updated form configuration object.
 */
async function patchWithGlobalValues(
  config: FormConfig,
  state: FormState
): Promise<FormState> {
  for (const key in state) {
    const value = state.state[key];
    const conf = config.inputsConfig[key]!;
    if (value && conf.globalKey) {
      const globalValue = await getGlobalValue(conf.globalKey);
      //patch the value with the global value
      state.state[key] = globalValue;
    }
  }
  return state;
}

/**
 * Retrieves the options for a specific input in a form.
 *
 * @param formId - The ID of the form.
 * @param inputId - The ID of the input.
 * @returns A promise that resolves to an array of InputOption objects.
 */
export async function getInputOptions(
  formId: string,
  inputId: string
): Promise<InputOption<unknown>[]> {
  //we take formValue because it will take the most recent state into account
  //and because input value could influence the options
  const formConfig = await getFormConfig(formId)!;
  const formState = await getFormState(formId)!;
  if (!formConfig) {
    console.warn(`Form config <${formId}> not found`);
  }
  const inputConfig = formConfig?.inputsConfig[inputId];
  const options = inputConfig!.options!(formState, formConfig!) || [];
  return options;
}

/**
 * Retrieves the value of an input in a form.
 *
 * @param formId - The ID of the form.
 * @param inputId - The ID of the input.
 * @returns A Promise that resolves to the value of the input.
 */
export async function getInputValue(
  formId: string,
  inputId: string
): Promise<unknown | undefined> {
  //we take formValue because it will take the most recent state into account
  const formState = await getFormState(formId);
  return formState!.state[inputId];
}

export async function getGlobalValue<T>(id: string): Promise<T> {
  return (await getGlobalValueFromDb(id)) as T;
}
