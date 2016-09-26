# Minion template

## Rules for a minion

* It should be able to shut down gracefully. It must listen to SIGTERM and SIGINT. See https://nodejs.org/api/process.html for details on doing this in node.
* It should not write directly to its own datastore, but instead write upon SUBscriptions from the queue. This to ensure the minion can scale.
*
