import { useState, useEffect, useRef } from "react";
import { defaultSaves, type Saves } from "~settings";

const OptionsIndexFirefox = () => {
  const [currentLocalStorage, setCurrentLocalStorage] = useState<Saves>(null);

  const setSettings = async (key: string, value: unknown) => {
    const newLocalStorage = {
      ...currentLocalStorage,
      settings: {
        ...currentLocalStorage.settings,
        [key]: value,
      },
    };
    setCurrentLocalStorage(newLocalStorage);
    await chrome.storage.local.set(newLocalStorage);
  };
  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      setCurrentLocalStorage(currentData);
    });
  }, []);

  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result as string) as Saves;
        if (
          data === null ||
          typeof data !== "object" ||
          data?.scombzData === undefined ||
          data?.settings === undefined
        ) {
          throw new Error("Invalid data");
        }
        chrome.storage.local.set(data, () => {
          alert("データの読み込みが完了しました。");
          window.location.reload();
        });
      } catch (error) {
        alert("ファイルの読み込みに失敗しました。");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1>ScombZ Utilities Options</h1>
      <h2>
        現在オプション設定画面は制作中です。学部以外の設定はChromeからエクスポートしたデータを読み込むことができます。
      </h2>
      <div>
        <h2>学部</h2>
        <select
          onChange={(e) => setSettings("faculty", e.target.value)}
          value={currentLocalStorage?.settings.faculty ?? "notSelected"}
        >
          <option value="notSelected" disabled>
            未選択
          </option>
          <option value="din">大学院</option>
          <option value="ko1">工学部</option>
          <option value="sys">システム理工学部</option>
          <option value="dsn">デザイン工学部</option>
          <option value="arc">建築学部</option>
        </select>
      </div>
      <div>
        <h2>インポート</h2>
        <p>Chromeからエクスポートしたデータを読み込むことができます。</p>
        <input type="file" ref={fileRef} onChange={onFileChange} />
      </div>
      <div>
        <h2>初期化</h2>
        <p>設定を初期化します。</p>
        <button
          onClick={() => {
            if (confirm("本当に初期化しますか？"))
              chrome.storage.local.set(defaultSaves, () => window.location.reload());
          }}
        >
          初期化
        </button>
      </div>
    </div>
  );
};

export default OptionsIndexFirefox;
