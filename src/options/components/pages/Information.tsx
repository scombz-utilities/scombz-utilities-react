import { Box, Link } from "@mui/material";

export const Information = () => {
  return (
    <>
      <h2>{chrome.i18n.getMessage("info")}</h2>
      <p>この拡張機能は、ScombZのユーザビリティの向上を目的としたオープンソースプロジェクトです。</p>
      <Box>
        <h3>バージョン情報</h3>
        <p>ScombZ Utilities v{chrome.runtime.getManifest().version}</p>
      </Box>
      <Box>
        <h3>バグ報告・要望</h3>
        <p>以下のいずれかの方法でお知らせください。</p>

        <ul>
          <li>
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSeahBs8kcBB2dVmVA54KIIOxa4DKUE8v4a1E30ncawd9W4vjg/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Forms
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/scombz-utilities/scombz-utilities-react/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Issues
            </Link>
          </li>
          <li>
            <Link href="https://x.com/ScombZ_utl" target="_blank" rel="noopener noreferrer">
              X (@ScombZ_utl)
            </Link>
          </li>
        </ul>
      </Box>
      <Box>
        <h3>リンク</h3>
        <ul>
          <li>
            <Link href="https://scombz-utilities.com" target="_blank" rel="noopener noreferrer">
              公式サイト
            </Link>
          </li>
          <li>
            <Link
              href="https://chromewebstore.google.com/detail/scombz-utilities/iejnanaabfgocfjbnmhkfheghbkanibj?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome Web Store
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/scombz-utilities/scombz-utilities-react"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </li>
        </ul>
      </Box>
      <Box>
        <h3>ライセンス</h3>
        <p>MIT License</p>
      </Box>
    </>
  );
};
