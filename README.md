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

