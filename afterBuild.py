import json
import os


# chrome向けビルド以外のmanifest.jsonから、keyとoauth2とidentityの設定を削除する


def afterBuild():

    build_dirs = [
        d
        for d in os.listdir("build")
        if "prod" in d and os.path.isdir(os.path.join("build", d)) and "chrome" not in d
    ]

    for build_dir in build_dirs:
        manifest_path = os.path.join("build", build_dir, "manifest.json")
        with open(manifest_path, "r") as f:
            manifest = json.load(f)
            # keyとoauth2とidentityの設定を削除
            manifest.pop("key", None)
            manifest.pop("oauth2", None)
            # permissionsからidentityを削除
            if "permissions" in manifest:
                manifest["permissions"] = [
                    p for p in manifest["permissions"] if p != "identity"
                ]
        with open(manifest_path, "w") as f:
            json.dump(manifest, f)

        print(f"Removed done: {manifest_path}")


if __name__ == "__main__":
    afterBuild()
