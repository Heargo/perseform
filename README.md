<div align="center">
  <h1>Perseform</h1>
  <p>
    <strong>Keep track of forms state and inputs dependencies</strong>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/perseform"><img src="https://img.shields.io/npm/v/perseform.svg" alt="npm version"></a>
    <img src="https://img.shields.io/npm/dm/perseform.svg" alt="npm downloads">

![example branch parameter](https://github.com/heargo/perseform/actions/workflows/main.yml/badge.svg?branch=main)

</p>

</div>

Perseform is a tool to keep track of forms state and inputs dependencies. This is useful if you have an app with a lot of filters and you want to keep track of the state of each filter and the dependencies between them.

## Features

- [x] Keep track of the state of each input

- [ ] Allow to define dependencies between inputs

## Installation

```bash
npm install perseform
```

## Usage

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
