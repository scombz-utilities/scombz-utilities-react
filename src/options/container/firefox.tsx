import { useState, useEffect, useRef } from "react";
import { Input } from "~options/components/blocks/FireFoxInput";
import { defaultSaves, type Saves } from "~settings";

import "./firefox.css";

const OptionsIndexFirefox = () => {
  const notifRef = useRef<HTMLDivElement>(null);
  const [currentLocalStorage, setCurrentLocalStorage] = useState<Saves>(null);

  const setSettings = async (key: string, value: unknown) => {
    const keys = key.split(".");
    if (keys.length === 1) {
      const newLocalStorage = {
        ...currentLocalStorage,
        settings: {
          ...currentLocalStorage.settings,
          [key]: value,
        },
      };
      setCurrentLocalStorage(newLocalStorage);
      await chrome.storage.local.set(newLocalStorage);
    } else if (keys.length === 2) {
      const newLocalStorage = {
        ...currentLocalStorage,
        settings: {
          ...currentLocalStorage.settings,
          [keys[0]]: {
            ...currentLocalStorage.settings[keys[0]],
            [keys[1]]: value,
          },
        },
      };
      setCurrentLocalStorage(newLocalStorage);
      await chrome.storage.local.set(newLocalStorage);
    }
    const notif = notifRef.current;
    if (notif) {
      notif.style.display = "block";
      notif.style.transform = "translate(-50%, 0)";
      setTimeout(() => {
        notif.style.transform = "translate(-50%, -300px)";
      }, 1000);
      setTimeout(() => {
        notif.style.display = "none";
      }, 1500);
    }
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
      <h2>Tips: FireFox版のオプション画面は、技術的要因により最適化が行われません。Chrome版の使用を推奨します。</h2>
      <div
        ref={notifRef}
        style={{
          display: "none",
          backgroundColor: "#2E7D32",
          width: "400px",
          padding: "24px",
          textAlign: "center",
          color: "white",
          borderRadius: "5px",
          fontSize: "20px",
          fontWeight: "bold",
          position: "fixed",
          top: "10px",
          left: "50%",
          transform: "translate(-50%, -300px)",
          transition: "all 0.4s",
        }}
      >
        設定が保存されました！
      </div>
      <div className="option-item">
        <h2>学部</h2>
        <p>学部を選択してください。学部情報は、ScombZとシラバス間の連携機能にのみ使用されます。</p>
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
      <div className="option-item">
        <h2>自動ログイン</h2>
        <h3>学籍番号</h3>
        <p>
          ログイン時に使用する学籍番号を入力してください。情報はPC本体にのみ保存され、外部に送信されることはありません。
        </p>
        <Input
          type="text"
          defaultValue={currentLocalStorage?.settings.loginData.username ?? ""}
          onSaveButtonClick={(value) => setSettings("loginData.username", value)}
        />
        <h3>パスワード</h3>
        <p>
          ログイン時に使用するパスワードを入力してください。情報はPC本体にのみ保存され、外部に送信されることはありません。
        </p>
        <Input
          type="password"
          defaultValue={currentLocalStorage?.settings.loginData.password ?? ""}
          onSaveButtonClick={(value) => setSettings("loginData.password", value)}
        />
        <h3>ログインボタンを自動クリック</h3>
        <p>ScombZのログイン画面に遷移した際、学生ログインを自動でクリックします。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.clickLogin ?? false}
            onChange={(e) => setSettings("clickLogin", e.target.checked)}
          />
        </div>
        <h3>自動ログイン</h3>
        <p>
          ログイン情報を自動入力し、ADFS二段階認証確認画面の次へボタンを自動でクリックします。
          ログイン後、自動でScombZの画面に入れます。 スマートフォンを利用した二段階認証にも対応しています。
        </p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.autoAdfs ?? false}
            onChange={(e) => setSettings("autoAdfs", e.target.checked)}
          />
        </div>
      </div>
      <div className="option-item">
        <h2>ポップアップ設定</h2>
        <h3>未提出課題数のバッジ表示</h3>
        <p>未提出の課題の個数をバッジに表示します。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.popupBadge ?? false}
            onChange={(e) => setSettings("popupBadge", e.target.checked)}
          />
        </div>
        <h3>課題タブを表示する</h3>
        <p>
          ポップアップ内の時間割に課題タブを表示します。 課題タブからは未提出の課題を確認することができます。
          課題タブ内の項目をクリックするとその課題の提出ページを開くことができます。
        </p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.popupTasksTab ?? false}
            onChange={(e) => setSettings("popupTasksTab", e.target.checked)}
          />
        </div>
      </div>

      <div className="option-item">
        <h1>その他</h1>
        <h2>インポート</h2>
        <p>その他の設定は、Chromeからエクスポートしたデータを読み込むことで引き継ぐことができます。</p>
        <input type="file" ref={fileRef} onChange={onFileChange} />
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
