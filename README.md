# snake-pipe-node

[![npm](https://img.shields.io/npm/v/snakepipe?color=blue)](https://www.npmjs.com/package/snakepipe)

A partial node implementation of my rust cli [topheman/snake-pipe-rust](https://github.com/topheman/snake-pipe-rust).

## Prerequisites

- Node

## Install

```sh
npm install -g snakepipe # will install snakepipe-node
```

Optional: Install the rust version - it will let you pipe original commands

```sh
cargo install snakepipe # will install snakepipe
```

## Usage

This is a partial implementation, for all the commands, see the [rust implementation](https://github.com/topheman/snake-pipe-rust).

### 📎 Validate incomming stream

```sh
# Without piping to render
snakepipe gamestate|snakepipe-node validate

# Piping to render
snakepipe gamestate|snakepipe-node validate|snakepipe render
```

## Usage as a library

```
npm install snakepipe
```

See example of usage on [topheman/snake-pipe-rust](https://github.com/topheman/snake-pipe-rust/tree/master/node-helpers/dev-server-sse/index.ts).

## Known bugs

- tty issue when piping from `snakepipe gamestate` [#1](https://github.com/topheman/snake-pipe-node/issues/1)
