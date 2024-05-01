export interface FormConfig {
  id: string;
  inputs: { [key: string]: InputConfig<unknown> };
}

export interface InputConfig<T> {
  type: InputType;
  globalKey?: string;
  label?: string;
  placeholder?: string;
  value?: T;
  required?: boolean;
  disabled?: boolean;
  options?: InputOption<T>[];
  hidden?: boolean;
  readonly?: boolean;
  defaultValue?: string;
  dependencies?: (InputDependency | string)[];
  //TODO: add a way to change options based on the value of dependencies
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
