import { useState, useEffect, useRef } from "react";
import { SLIDER_BAR_MINS } from "~constants";
import { Input } from "~options/components/blocks/FireFoxInput";
import { defaultSaves, type Saves } from "~settings";

import "./firefox.css";

const OptionsIndexFirefox = () => {
  const notifRef = useRef<HTMLDivElement>(null);
  const [currentLocalStorage, setCurrentLocalStorage] = useState<Saves>(null);
  const [customCSS, setCustomCSS] = useState<string>("");

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
      setCustomCSS(currentData.settings.customCSS);
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
      <div className="title">
        <h1>ScombZ Utilities Options</h1>
        <h2>
          Tips:FireFox版のオプション画面は、技術的要因により最適化が行われません。
          <br />
          Chrome版の使用を推奨します。
        </h2>
      </div>
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
        <h2>科目ページ詳細設定</h2>
        <h3>リンク化</h3>
        <p>科目別のページ内において、テキスト内のURLをリンク化します。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.layout.linkify ?? false}
            onChange={(e) => setSettings("layout.linkify", e.target.checked)}
          />
        </div>
        <h3>マークダウンメモ帳</h3>
        <p>科目別ページ内において、マークダウン記法に対応したメモ帳を追加します。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.markdownNotePad ?? false}
            onChange={(e) => setSettings("markdownNotePad", e.target.checked)}
          />
        </div>
        <h3>タイトル変更</h3>
        <p>科目別のページ内において、ページタイトルをわかりやすいものに変更します。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.modifyCoursePageTitle ?? false}
            onChange={(e) => setSettings("modifyCoursePageTitle", e.target.checked)}
          />
        </div>
        <h3>シラバス連携ボタンの表示</h3>
        <p>科目別のページ内において、シラバスへのリンクを表示します。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.createSyllabusButton ?? false}
            onChange={(e) => setSettings("createSyllabusButton", e.target.checked)}
          />
        </div>
        <h3>使わない教材を非表示</h3>
        <p>
          教材要素にある様々なものを非表示にできるようにします。詳細設定から、自動的に非表示にするものも選択できます。
        </p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.hideMaterial ?? false}
            onChange={(e) => setSettings("hideMaterial", e.target.checked)}
          />
        </div>
        <h3>使わない教材を自動非表示</h3>
        <p>教材要素にある様々なもののうち、自動的に非表示にするものを選択します。</p>
        <select
          onChange={(e) => setSettings("autoHideMaterial", e.target.value === "false" ? false : e.target.value)}
          value={currentLocalStorage?.settings.autoHideMaterial.toString() ?? "false"}
        >
          <option value="false">自動的に非表示にしない</option>
          <option value="all">全て非表示</option>
          <option value="recent">最新のもの以外を非表示</option>
        </select>
        <h3>教材の順番を統一</h3>
        <p>科目によって初回が一番上だったり最新回が一番上だったりする教材の順番を統一します。</p>
        <select
          onChange={(e) => setSettings("materialSortOrder", e.target.value === "false" ? false : e.target.value)}
          value={currentLocalStorage?.settings.materialSortOrder.toString()}
        >
          <option value="false">統一しない</option>
          <option value="asc">昇順(初回が一番上)</option>
          <option value="desc">降順(最新回が一番上)</option>
        </select>
      </div>
      <div className="option-item">
        <h2>課題提出ページ詳細設定</h2>
        <h3>スライダーバーの最大値(分)</h3>
        <p>レポート提出時に、作成時間を簡易入力するためのスライダーバーの最大値を設定します。</p>
        <Input
          type="number"
          defaultValue={currentLocalStorage?.settings.sliderBarMax.toString() ?? "0"}
          onSaveButtonClick={(value) => setSettings("sliderBarMax", parseInt(value, 10))}
        />
        <h3>提出時間の初期値(分)</h3>
        <p>レポート提出時に、作成時間を簡易入力するためのスライダーバーの初期値を設定します。</p>
        <select
          onChange={(e) => setSettings("timesBtnValue", e.target.value)}
          value={currentLocalStorage?.settings.timesBtnValue}
        >
          {SLIDER_BAR_MINS.map((min, index) => (
            <option key={index} value={index}>
              {min.join("分, ") + "分"}
            </option>
          ))}
        </select>
        <h3>ファイル名の自動入力設定</h3>
        <p>レポート提出時にファイル名自動入力ボタンを押した際に入力される文字列を変更します。</p>
        <Input
          type="text"
          defaultValue={currentLocalStorage?.settings.defaultInputName ?? ""}
          onSaveButtonClick={(value) => setSettings("defaultInputName", value)}
        />
        <h3>課題削除できないバグの修正</h3>
        <p>
          課題提出画面の成果物提出を削除するとき、ドラッグ&ドロップ状態になっていると画面に何も表示されなくなり何もできなくなるという、ScombZ本体のバグを修正します。
        </p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.dragAndDropBugFix ?? false}
            onChange={(e) => setSettings("dragAndDropBugFix", e.target.checked)}
          />
        </div>
        <h3>課題ドラッグ&ドロップ提出</h3>
        <p>課題提出画面の成果物提出欄をクリックなしで最初からドラッグ&ドロップにします。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.forceDragAndDropSubmit ?? false}
            onChange={(e) => setSettings("forceDragAndDropSubmit", e.target.checked)}
          />
        </div>
        <h3>レポート提出ボタンの変更</h3>
        <p>
          レポート提出画面に、制作時間の簡易入力ボタンを追加します。また、提出ボタンをユーザビリティに配慮した色や配置にします。
        </p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.changeReportBtn ?? false}
            onChange={(e) => setSettings("changeReportBtn", e.target.checked)}
          />
        </div>
      </div>
      <div className="option-item">
        <h2>LMSページの詳細設定</h2>
        <h3>教室情報を表示</h3>
        <p>LMSページの時間割で、各授業欄に教室情報を常に表示します。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.lms.showClassroom ?? false}
            onChange={(e) => setSettings("lms.showClassroom", e.target.checked)}
          />
        </div>
        <h3>休日・放課後を非表示</h3>
        <p>
          LMSページのカレンダーで、授業のない日を非表示にします。
          また、5限以降の授業をとっていない場合はそれらも非表示にします。
        </p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.lms.hideNoClassDay ?? false}
            onChange={(e) => setSettings("lms.hideNoClassDay", e.target.checked)}
          />
        </div>
        <h3>文字センタリング</h3>
        <p>LMSページの時間割で、文字を中央揃えにします。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.lms.centering ?? false}
            onChange={(e) => setSettings("lms.centering", e.target.checked)}
          />
        </div>
      </div>
      <div className="option-item">
        <h2>詳細設定</h2>
        <h3>特殊リンクにおけるホイールクリックと右クリックの有効化</h3>
        <p>
          LMSページ内の科目ボタン、科目別ページのダウンロードリンクなど、右クリックが通常できないリンクを通常のリンクと同じようにサポートします。
        </p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.modifyClickableLinks ?? false}
            onChange={(e) => setSettings("modifyClickableLinks", e.target.checked)}
          />
        </div>
        <h3>クリックで名前非表示</h3>
        <p>名前をクリックして非表示にできるようにします。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.layout.clickToHideName ?? false}
            onChange={(e) => setSettings("layout.clickToHideName", e.target.checked)}
          />
        </div>
        <h3>ヘッダアイコンのリンク先</h3>
        <p>ヘッダのScombZアイコンをクリックした際のリンク先を設定します。</p>
        <select
          onChange={(e) => setSettings("headLinkTo", e.target.value)}
          value={currentLocalStorage?.settings.headLinkTo}
        >
          <option value="/portal/home">ホーム / Top</option>
          <option value="/lms/timetable">LMS</option>
          <option value="lms/task">課題・テスト一覧 / Assignments</option>
        </select>
        <h3>S*gsot学番自動入力</h3>
        <p>S*gsotのログイン時、ユーザー名入力欄に学籍番号を自動入力します。</p>
        <div>
          <input
            type="checkbox"
            checked={currentLocalStorage?.settings.autoFillSgsot ?? false}
            onChange={(e) => setSettings("autoFillSgsot", e.target.checked)}
          />
        </div>
      </div>

      <div className="option-item">
        <h1>その他</h1>
        <h2>カスタムCSS</h2>
        <textarea value={customCSS} onChange={(e) => setCustomCSS(e.target.value)} />
        <button
          onClick={() => {
            setSettings("customCSS", customCSS);
          }}
        >
          保存
        </button>
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
      <div className="option-item">
        <h1>情報</h1>
        <p>この拡張機能は、ScombZのユーザビリティの向上を目的としたオープンソースプロジェクトです。</p>
        <h2>バージョン情報</h2>
        <p>ScombZ Utilities v{chrome.runtime.getManifest().version}</p>
        <h2>バグ報告・要望</h2>
        <p>以下のいずれかの方法でお知らせください。</p>
        <ul>
          <li>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeahBs8kcBB2dVmVA54KIIOxa4DKUE8v4a1E30ncawd9W4vjg/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Forms
            </a>
          </li>
          <li>
            <a
              href="https://github.com/scombz-utilities/scombz-utilities-react/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Issues
            </a>
          </li>
          <li>
            <a href="https://x.com/ScombZ_utl" target="_blank" rel="noopener noreferrer">
              X (@ScombZ_utl)
            </a>
          </li>
        </ul>
        <h2>リンク</h2>
        <ul>
          <li>
            <a href="https://scombz-utilities.com" target="_blank" rel="noopener noreferrer">
              公式サイト
            </a>
          </li>
          <li>
            <a
              href="https://github.com/scombz-utilities/scombz-utilities-react"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
        <h2>ライセンス</h2>
        <p>MIT License</p>
      </div>
    </div>
  );
};

export default OptionsIndexFirefox;
