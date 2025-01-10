import json
import os


# chrome向けビルド以外のmanifest.jsonから、keyとoauth2とidentityの設定を削除する


def afterBuild():

    build_dirs = [
        d
        for d in os.listdir("build")
        if "prod" in d and os.path.isdir(os.path.join("build", d))
    ]

    # chromeディレクトリをコピーして、chromiumディレクトリを作成
    chrome_dir_name = [d for d in build_dirs if "chrome" in d][0]
    chromium_dir_name = chrome_dir_name.replace("chrome", "chromium")
    if os.path.exists(f"build/{chromium_dir_name}"):
        print(f"Remove: build/{chromium_dir_name}")
        os.system(f"rm -rf build/{chromium_dir_name}")
    os.system(f"cp -r build/{chrome_dir_name} build/{chromium_dir_name}")
    build_dirs.append(chromium_dir_name)

    for build_dir in build_dirs:
        manifest_path = os.path.join("build", build_dir, "manifest.json")
        with open(manifest_path, "r") as f:
            manifest = json.load(f)
            # chromeディレクトリは除外
            if "chrome" not in build_dir:
                # keyとoauth2とidentityの設定を削除
                manifest.pop("key", None)
                manifest.pop("oauth2", None)
                # permissionsからidentityを削除
                if "permissions" in manifest:
                    manifest["permissions"] = [
                        p for p in manifest["permissions"] if p != "identity"
                    ]
                print(f"Removed: key, oauth2, identity from {manifest_path}")

            # 存在しないresourcesを削除
            if "mv3" in build_dir:
                for web_accessible_resource in manifest["web_accessible_resources"]:
                    for resource in web_accessible_resource["resources"]:
                        # assets/*, css/*は許可
                        if resource == "assets/*" or resource == "css/*":
                            continue
                        # 存在しているかチェックする
                        resource_path = os.path.join("build", build_dir, resource)
                        if not os.path.exists(resource_path):
                            web_accessible_resource["resources"].remove(resource)
                            print(f"Removed resources: {resource}")
                    # resourcesが空になったら削除
                    if len(web_accessible_resource["resources"]) == 0:
                        manifest["web_accessible_resources"].remove(
                            web_accessible_resource
                        )
            if "mv2" in build_dir:
                for resource in manifest["web_accessible_resources"]:
                    # assets/*, css/*は許可
                    if resource == "assets/*" or resource == "css/*":
                        continue
                    # 存在しているかチェックする
                    resource_path = os.path.join("build", build_dir, resource)
                    if not os.path.exists(resource_path):
                        manifest["web_accessible_resources"].remove(resource)
                        print(f"Removed resources: {resource}")
        with open(manifest_path, "w") as f:
            json.dump(manifest, f)

        print(f"Removed done: {manifest_path}")


if __name__ == "__main__":
    afterBuild()
