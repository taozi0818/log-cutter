# log-cutter

logs file cutter for application.

## USAGE

create a `app.json` file for application which you want to cut its logs file.

like this: 

```json
[{
  "name": "test",
  "out_file": "/Users/tyt/Workspace/com/info-manager-server-api/logs/out.log",
  "error_file": "/Users/tyt/Workspace/com/info-manager-server-api/logs/error.log",
  "instance": 4,
  "loop": 3
}]
```

- `name` Required. The name for application you want to apply this util

- `out_file` Required. The out files' absolute path for your apps, same as `out_file` in `pm2` application json file.

- `error_file` Required. The error files' absolute path for your apps

- `instance` The instance for your app. If your app mode is `cluster`, it should be great than 1

- `loop` Default 3. It will clear logs files before 3 days ago.

After completing the `json` file for apps, you can change directory to this project's root directory, and then enter `tsc` in terminal.