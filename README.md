# Integrator API Client

A JavaScript client for the Integrator API. Written in TypeScript, type definitions are available for easier usage of the API.

## Prerequisites

In order to get started with the client, you'll need to enable the API in the Integrator application. This setting can be found under:

`Integrator > Configuration > API > Local Http(s) listener > Enabled.`

Enabling secure sockets is recommended so that the `https` protocol can be used.

## Installation

```bash
$ npm install @mondago/integrator-api
```

## Configuration

When creating an instance of the client, you can pass a configuration object with the following properties:

### `https`

Defines whether to use `http` or `https`. Can only be enabled if secure sockets are also enabled.

Default `true`.

### `id`

A valid UUID can be passed as an identifier for the application being developed. This is used so a user does not have to confirm the popup dialog each time a new client is created.

Default `random UUID`.

### `name`

The name to be used against the id when creating the application. This name will appear on the popup when asking for confirmation and also in `Integrator > Configuration > API > Registered applications`.

Default `Integrator App`.

## Usage

To get started with the client, you'll need to create an instance of the `IntegratorAPI` class:

```ts
import IntegratorAPI from '@mondago/integrator-api'

const integrator = new IntegratorAPI({
	https: true,
	id: uuid(),
	name: 'Integrator App',
})
```

It is recommended to call the `init` function to ensure that it's safe to call other methods:

```ts
const initialized: boolean = await integrator.init()
```

The `initialized` property will be set after calling init with a `boolean` value, for ease of use in different contexts:

```ts
if (integrator.initialized) {
	integrator.version().then(/*...*/)
}
```
