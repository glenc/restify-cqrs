# Restify CQRS

A simple CQRS library for handling commands and queries in [restify](http://mcavage.me/node-restify).

## Overview

Restify CQRS is designed to make it easy to develop a CQRS-style API using restify.
It attempts to handle all of the restify plumbing and allow you to focus soley on
developing your domain model, queries, and command handlers.  It automatically sets
up routes for your commands and queries and passing requests along to the appropriate
command or query handler.

### Key Features

* Auto-discovery of command handlers, queries and views
* Automatic routing based on discovered command handlers, queries and views
* Back-end agnostic

### Key Concepts

* **Model** - an aggregate root in your domain model
* **Command** - an operation consisting of a name and a payload
* **Command Handler** - a function that captures a command and performs any appropriate actions
* **Query** - a function which queries your back-end to retrieve results
* **View** - used by queries to transform results before returning them to the caller

### Routing

Restify CQRS automatically configures routes based on the commands and queries in your
project.  Commands and queries are given the following routes:

```
COMMANDS
GET  /commands                        # see a list of available commands
POST /commands/<command-name>         # submit a new command (payload only)
GET  /commands/:id                    # get an existing command to view status

QUERIES
GET  /<model>                         # execute default query for model
GET  /<model>/<query>                 # execute a named query for model
GET  /<model>/<query>?view=detail     # execute named query with a specified view
GET  /<model>/<query>?name=foo        # execute named query passing in a parameter
GET  /<model>/:id                     # get a single model
```

#### Example

Say you wanted to build an API on top of a file system.  Your API might support the
following models, commands, and queries:

* Model: **file**
    * commands
        * new-file
        * rename-file
        * delete-file
        * move-file
    * queries
        * all-files (default)
        * get-file (getter)
        * large-files
        * small-files
* Model: **drive**
    * queries
        * all-drives (default)
        * get-drive (getter)

This would yield the following API routes for your application:

```
GET  /commands                # list of commands: [new-file, rename-file, delete-file, move-file]
POST /commands/new-file       # submit the new-file command
POST /commands/rename-file    # submit the rename-file command
POST /commands/delete-file    # submit the delete-file command
POST /commands/move-file      # submit the move-file command
GET  /files                   # execute the all-files query
GET  /files/large-files       # execute the large-files query
GET  /files/small-files       # execute the small-files query
GET  /files/:id               # execute the getter query for the file model
GET  /drives                  # execute the all-drives query
GET  /drives/:id              # execute the getter query for the drive model
```

## Getting Started
See the [Sample Application](https://github.com/glenc/restify-cqrs-sample) and
associated [Walkthrough](wiki) for a quick getting started guide.

