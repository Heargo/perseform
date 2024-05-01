import { FormConfig } from "./model";

/**
 * Initializes the indexedDB for form configuration.
 * Creates a new database called appFormsConfig in the indexedDB.
 */
export function initIndexDb() {
  // create a new database called form-config in the indexedDB
  const request = indexedDB.open("appFormsConfig", 3);
  request.onerror = (event) => {
    console.error("Error opening indexedDB appFormsConfig", event);
  };

  request.onupgradeneeded = () => {
    const db = request.result;

    const formConfigStore = db.createObjectStore("formConfig");
    formConfigStore.createIndex("id", "id", { unique: true });
    formConfigStore.createIndex("inputs", "inputs", { unique: false });

    const formStateStore = db.createObjectStore("formState");
    formStateStore.createIndex("id", "id", { unique: true });
    formStateStore.createIndex("inputs", "inputs", { unique: false });

    const globalValueStore = db.createObjectStore("globalValue");
    globalValueStore.createIndex("id", "id", { unique: true });
    globalValueStore.createIndex("value", "value", { unique: false });
  };
}

/**
 * Saves a form configuration or state to the indexedDB.
 * @param form - The form configuration or state to be saved.
 * @param type - The type of the form ('Config' or 'State').
 * @returns A promise that resolves with the IDBValidKey of the saved form.
 */
export async function saveForm(
  form: FormConfig,
  type: "Config" | "State"
): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("appFormsConfig", 3);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("form" + type, "readwrite");
      const store = transaction.objectStore("form" + type);

      const putRequest = store.put(form, form.id);

      putRequest.onerror = (event) => {
        reject(event);
      };
      putRequest.onsuccess = () => {
        resolve(putRequest.result);
      };
    };
  });
}

/**
 * Retrieves a form configuration from the indexedDB based on the provided id and type.
 * @param id - The id of the form configuration to retrieve.
 * @param type - The type of the form configuration ('Config' or 'State').
 * @returns A Promise that resolves with the retrieved FormConfig object.
 */
export async function getForm(
  id: string,
  type: "Config" | "State"
): Promise<FormConfig | undefined> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("appFormsConfig", 3);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("form" + type, "readonly");
      const store = transaction.objectStore("form" + type);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        console.log("getForm", id, type, getRequest.result);
        resolve(getRequest.result);
      };
      getRequest.onerror = (event) => {
        reject(event);
      };
    };
  });
}

/**
 * Retrieves the global value from the indexedDB based on the provided id.
 * @param id - The id of the global value to retrieve.
 * @returns A promise that resolves with the retrieved global value.
 */
export async function getGlobalValue(id: string) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("appFormsConfig", 3);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("globalValue", "readonly");
      const store = transaction.objectStore("globalValue");
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        resolve(getRequest.result);
      };
      getRequest.onerror = (event) => {
        reject(event);
      };
    };
  });
}

/**
 * Saves a global value in the indexedDB.
 * @param id - The ID of the value to be saved.
 * @param value - The value to be saved.
 * @returns A promise that resolves with the result of the save operation.
 */
export async function saveGlobalValue(id: string, value: unknown) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("appFormsConfig", 3);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("globalValue", "readwrite");
      const store = transaction.objectStore("globalValue");
      const putRequest = store.put({ id, value }, id);
      putRequest.onerror = (event) => {
        reject(event);
      };
      putRequest.onsuccess = () => {
        resolve(putRequest.result);
      };
    };
  });
}
