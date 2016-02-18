# Modulus Notifier

The notifier handles modulus application events via a webhook. This project aims to handle notifying the appropriate systems when these application lifecycle events occur.
For more information regarding the examples of the events that are fired see [WebHook Notifications](http://help.modulus.io/customer/portal/articles/1701214webhook-notifications)
For more information regarding the events fired from modulus see [Project Notifications](https://help.modulus.io/customer/en_us/portal/articles/1701205-project-notifications)

## Notifications from Modulus

Events are fired for each of the following application lifecyle events.

* All
* Crash
* Deploy
* Scale
* Stop
* Start
* Restart

The data structure looks similar to these objects.

```json
{
  "type": "stop",
  "project": {
    "id": "100002",
    "autoSSLRedirect": false,
    "created_date": "2013-04-29T21:21:13.000Z",
    "creator": "100006",
    "domain": "the-matrix-100002.modulus.net",
    "name": "The Matrix",
    "puCount": "1",
    "puIds": [],
    "status": "STOPPED",
    "pus": [],
    "files": {
      "deploy_datetime": "Mon, 13 May 2013 18:01:16 GMT",
      "fileList": [],
      "projectId": "100002",
      "size": "443185" //In bytes
    },
    "envVars": [{
      "name": "NODE_ENV",
      "value": "production"
    }],
    "customSSL": [],
    "customDomains": []
  }
}

{
  "type": "crash",
  "project": {
    "id": "100002",
    "autoSSLRedirect": false,
    "created_date": "2013-04-29T21:21:13.000Z",
    "creator": "100006",
    "domain": "the-matrix-100002.modulus.net",
    "name": "The Matrix",
    "puCount": "1",
    "puIds": [],
    "status": "STOPPED",
    "pus": [],
    "files": {
      "deploy_datetime": "Mon, 13 May 2013 18:01:16 GMT",
      "fileList": [],
      "projectId": "100002",
      "size": "443185" //In bytes
    },
    "envVars": [{
      "name": "NODE_ENV",
      "value": "production"
    }],
    "customSSL": [],
    "customDomains": []
  }
  "servo": {
    "id": "07e0f78f-1afb-4f02-82c0-037d8a1a4c9a",
    "log": "
      [2013-11-08T18:13:04.767Z] Application CRASH detected. Exit code 8.
      [2013-11-08T18:13:06.686Z] Application restarted.

      /mnt/data/1/app.js:1
      module, __filename, __dirname) { nonexistant.valu
                                       ^
      ReferenceError: nonexistant is not defined
          at Object.<anonymous> (/mnt/data/1/app.js:1:63)
          at Module._compile (module.js:456:26)
          at Object.Module._extensions..js (module.js:474:10)
          at Module.load (module.js:356:32)
          at Function.Module._load (module.js:312:12)
          at Function.Module.runMain (module.js:497:10)
          at startup (node.js:119:16)
          at node.js:901:3
      [2013-11-08T18:13:09.872Z] Application CRASH detected. Exit code 8.
      [2013-11-08T18:13:11.788Z] Application restarted.

      /mnt/data/1/app.js:1
      module, __filename, __dirname) { nonexistant.valu
                                       ^
      ReferenceError: nonexistant is not defined
          at Object.<anonymous> (/mnt/data/1/app.js:1:63)
          at Module._compile (module.js:456:26)
          at Object.Module._extensions..js (module.js:474:10)
          at Module.load (module.js:356:32)
          at Function.Module._load (module.js:312:12)
          at Function.Module.runMain (module.js:497:10)
          at startup (node.js:119:16)
          at node.js:901:3
      [2013-11-08T18:13:15.094Z] Application CRASH detected. Exit code 8.
      [2013-11-08T18:13:16.905Z] Application restarted."
  }
}
```


## Subscribing Services

### Authentic

Applications will self subscribe, and remove their keys when the application is decommissioned.

### Slack

Send notifications to slack with relevant information





