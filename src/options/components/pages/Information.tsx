import { Box, Link, Typography } from "@mui/material";

export const Information = () => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">{chrome.i18n.getMessage("info")}</Typography>
      <Typography variant="body1">
        この拡張機能は、ScombZのユーザビリティの向上を目的としたオープンソースプロジェクトです。
      </Typography>
      <Box>
        <Typography variant="h6" mb={0.5}>
          バージョン情報
        </Typography>
        <Typography variant="body1">ScombZ Utilities v{chrome.runtime.getManifest().version}</Typography>
      </Box>
      <Box>
        <Typography variant="h6" mb={0.5}>
          バグ報告・要望
        </Typography>
        <Typography variant="body1">以下のいずれかの方法でお知らせください。</Typography>

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
        <Typography variant="h6" mb={0.5}>
          リンク
        </Typography>
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
        <Typography variant="h6" mb={0.5}>
          ライセンス
        </Typography>
        <Typography variant="body1">MIT License</Typography>
      </Box>
    </Box>
  );
};
