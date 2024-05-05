export interface FormConfig {
  id: string;
  inputsConfig: { [key: string]: InputConfig<unknown> };
}

export interface FormState {
  id: string;
  state: { [key: string]: unknown };
}

export interface InputConfig<T> {
  globalKey?: string;
  value?: T;
  options?: (
    state: FormState | undefined,
    config: FormConfig
  ) => InputOption<T>[];
  dependencies?: (InputDependency | string)[];
}

export interface InputOption<T> {
  value: T;
  label: string;
}

export interface globalValue {
  id: string;
  value: unknown;
}

export interface InputDependency {
  id: string;
  parentFormId?: string;
  triggeringValues?: unknown[];
}

export type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"
  | InputSpecialCase;

export type InputSpecialCase = "select" | "textarea";
