# snake-pipe-node

[![npm](https://img.shields.io/npm/v/snakepipe?color=blue)](https://www.npmjs.com/package/snakepipe)

A partial node implementation of my rust cli [topheman/snake-pipe-rust](https://github.com/topheman/snake-pipe-rust).

## Prerequisites

- Node

## Install

```sh
npm install -g snakepipe # will install snakepipenode
```

Optional: Install the rust version - it will let you pipe original commands

```sh
cargo install snakepipe # will install snakepipe
```

## Usage

This is a partial implementation, for all the commands, see the [rust implementation](https://github.com/topheman/snake-pipe-rust).

### Piping

#### 📎 Validate incomming stream

```sh
# Without piping to render
snakepipe gamestate|snakepipenode validate

# Piping to render
snakepipe gamestate|snakepipenode validate|snakepipe render
```

### IPC (Inter-process communication)

This node version ships with an implementation of IPS supporting tcp and unix domain sockets, just like in the [rust version](https://github.com/topheman/snake-pipe-rust#ipc-inter-process-communication),

#### TCP

Open two terminals. `snakepipenode tcp-play` will expose a process that accepts tcp connections (on port 8050 by default). You can connect to it via [netcat](https://en.wikipedia.org/wiki/Netcat) (the `nc` command), that will pipe the tcp stream output to stdout.

Here are a few commands mixing the rust and node versions.

```sh
# main terminal
snakepipe gamestate|snakepipenode tcp-play|snakepipe render
```

```sh
# mirroring terminal
nc localhost 8050|snakepipe render # with netcat
snakepipenode tcp-watch|snakepipe render # or with snakepipe itself
```

#### Unix domain sockets

Open two terminals. `snakepipenode socket-play` will expose a [unix domain socket](https://en.wikipedia.org/wiki/Unix_domain_socket) (by default on `/tmp/snakepipe.sock`). You can connect to it via [netcat](https://en.wikipedia.org/wiki/Netcat) (the `nc` command), that will pipe the socket stream to stdout.

```sh
# main terminal
snakepipe gamestate|snakepipenode socket-play|snakepipe render
```

```sh
# mirroring terminal
nc -U /tmp/snakepipe.sock|snakepipe render # with netcat
snakepipenode socket-watch|snakepipe render # or with snakepipe itself
```

## Usage as a library

```
npm install snakepipe
```

See example of usage on [topheman/snake-pipe-rust](https://github.com/topheman/snake-pipe-rust/tree/master/node-helpers/dev-server-sse/index.ts).

## Known bugs

- tty issue when piping from `snakepipe gamestate` [#1](https://github.com/topheman/snake-pipe-node/issues/1)
