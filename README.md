# Restify CQRS

A simple CQRS library for handling commands and queries in restify.


Restify CQRS automatically configures routes based on the commands and queries in your project.  Commands and queries are given the following routes:

```
COMMANDS
GET  /commands                      # see a list of available commands
POST /commands                      # submit a new command (passing name in body)
POST /commands/<command-name>       # submit a new command (payload only)
GET  /commands/:id                  # get an existing command to view status

QUERIES
GET  /<model>                       # execute default query for model
GET  /<model>/<query>               # execute a named query for model
GET  /<model>/<query>?view=detail   # execute named query with a specified view
GET  /<model>/<query>?name=foo      # execute named query passing in a parameter
GET  /<model>/:id                   # get a single model
```

## Quick Example

Say you wanted to build an API on top of a file system.  In your API you wanted to support the following models and commands:

* Model: **file**
   * commands
      * new-file
       * rename-file
       * delete-file
       * move-file
   * queries
       * all-files (default)
       * large-files
       * small-files
* Model: **drive**
   * queries
       * all-drives (default)

This would yield the following API routes for your application:

```
GET  /commands                # list of commands: [new-file, rename-file, delete-file, move-file]
POST /commands                # submit a new command
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
