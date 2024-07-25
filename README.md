<div align="center">
  <img src="./assets/logo.png" alt="Perseform logo" width="200" />
  <h1>Perseform</h1>
  <p>
    <strong>Persistent forms state and inputs dependencies</strong>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/perseform"><img src="https://img.shields.io/npm/v/perseform.svg" alt="npm version"></a>
    <img src="https://img.shields.io/npm/dm/perseform.svg" alt="npm downloads">

![example branch parameter](https://github.com/heargo/perseform/actions/workflows/main.yml/badge.svg?branch=main)

</p>

</div>

Perseform is a tool to keep track of forms state and inputs dependencies. This is useful if you have an app with a lot of filters and you want to keep track of the state of each filter and the dependencies between them.

<!-- table of content -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [State management](#state-management)
  - [Dependencies](#dependencies)
- [API](#api)
  - [`saveFormConfig`](#saveformconfig)
  - [`saveFormState`](#saveformstate)
  - [`getFormState`](#getformstate)
  - [`getInputDependenciesState`](#getinputdependenciesstate)
  - [`isEnable`](#isenable)
  - [`initPerseform`](#initperseform)
  - [`getInputValue`](#getinputvalue)
  - [`getGlobalValue`](#getglobalvalue)
- [Attribution](#attribution)

## Features

- Keep a form state saved when the user navigates between pages/leave the app
- Enable/disable inputs based on the value of other inputs
- Easily get the values of inputs that would influence another input (e.g. get the value of a country to get the cities of that country)

## Installation

```bash
npm install perseform
```

## Usage

You first need to init the library with the following code once in your app

```typescript
import { initPerseform } from "perseform";

initPerseform();
```

### State management

If we want to create a form with 2 inputs, `country` and `city`, where `country` is a global input and we want to keep track of the state of the form, we can do the following:

```typescript
//create perseform form
saveFormConfig({
  id: "myFormId",
  inputsConfig: {
    //country will be a global input
    country: {
      globalKey: "country",
    },
    //no need to configure special behavior for city
  },
});

// load state of the form
const state = await getFormState("myFormId");

//you can then use the state to populate the form
...

//Listen to changes in your form (the implementation depend on your framework)
// and save form state
this.form.valueChanges.subscribe((value) => {
  saveFormState({
    id: "form 1",
    state: {
      country: value.country,
      city: value.city,
    },
  });
});
```

### Dependencies

If we want to create a form with 2 inputs, `country` and `city`, where `city` depends on `country`, we can do the following:

```typescript
import {
  saveFormConfig,
  isEnable,
  getInputDependenciesState,
} from 'perseform';

//create perseform form
saveFormConfig({
  id: "myFormId",
  inputsConfig: {
    //country will be a global input
    country: {
      globalKey: "country",
    },
    //city depends on country
    city: {
      dependencies: ["country"],
    },
  },
});

...

//get the state of input dependencies
const stateDependencies = await getInputDependenciesState("myFormId","city");

//check if input is enabled (based on dependencies triggering values. If none are defined, it will return true)
const isEnabled = await isEnable("myFormId","city");

```

> Warning : Both `getInputDependenciesState` and `isEnable` are making internal calls to the local indexedDB. It's recommended to not use them in the DOM as they will slow down the performance of your app. Use them when you have a change in the form state for example.

## API

### `saveFormConfig`

Register a form configuration.

example :

```typescript
saveFormConfig({
  id: "myFormId",
  inputsConfig: {
    country: {
      globalKey: "country",
    },
    city: {
      dependencies: ["country"],
    },
  },
});
```

### `saveFormState`

Save the state of a form.

example :

```typescript
saveFormState({
  id: "myFormId",
  state: {
    country: "France",
    city: "Paris",
  },
});
```

### `getFormState`

Get the state of a form.

example :

```typescript
const state = await getFormState("myFormId");
```

### `getInputDependenciesState`

Get the state of the dependencies of an input.

example :

```typescript
const stateDependencies = await getInputDependenciesState("myFormId", "city");
```

> Warning: see the warning in the Dependencies section

### `isEnable`

Check if an input is enabled.

example :

```typescript
const isEnabled = await isEnable("myFormId", "city");
```

> Warning: see the warning in the Dependencies section

### `initPerseform`

Initialize the library. This function should be called once in your app.

### `getInputValue`

Get the current state value of an input.

example :

```typescript
const value = await getInputValue("myFormId", "city");
```

### `getGlobalValue`

Get the current state value of a global input.

example :

```typescript
const value = await getGlobalValue("myFormId", "country");
```

## Attribution

<a href="https://www.flaticon.com/free-icons/tree" title="tree icons">Tree icons created by justicon - Flaticon</a>
