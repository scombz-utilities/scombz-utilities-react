import { Box, Link, Typography } from "@mui/material";

export const Information = () => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">情報</Typography>
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

        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeahBs8kcBB2dVmVA54KIIOxa4DKUE8v4a1E30ncawd9W4vjg/viewform">
          <Typography variant="body1">Google Form</Typography>
        </Link>
        <Link href="https://github.com/scombz-utilities/scombz-utilities-react/issues">
          <Typography variant="body1">GitHub Issues</Typography>
        </Link>
        <Link href="https://twitter.com/ScombZ_utl">
          <Typography variant="body1">Twitter</Typography>
        </Link>
      </Box>
      <Box>
        <Typography variant="h6" mb={0.5}>
          リンク
        </Typography>
        <Link href="https://scombz-utilities.com">
          <Typography variant="body1">公式サイト</Typography>
        </Link>
        <Link href="https://chromewebstore.google.com/detail/scombz-utilities/iejnanaabfgocfjbnmhkfheghbkanibj?hl=ja">
          <Typography variant="body1">Chrome Web Store</Typography>
        </Link>
        <Link href="https://github.com/scombz-utilities/scombz-utilities-react">
          <Typography variant="body1">GitHub</Typography>
        </Link>
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
