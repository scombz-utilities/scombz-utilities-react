import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import Button from "@mui/material/Button"
import Input from "@mui/material/Input"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://zenn.dev/*"]
}

const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

function PlasmoOverlay() {
  const [data, setData] = useState("")

  return (
    <CacheProvider value={styleCache}>
      <Stack minWidth={240} bgcolor={"white"} padding={2}>
        <Typography variant="h6">
          Welcome to your test{" "}
          <Link href="https://www.plasmo.com" target="_blank">
            Plasmo
          </Link>{" "}
          Extension!
        </Typography>
        <Input onChange={(e) => setData(e.target.value)} value={data} />
        <Button href="https://docs.plasmo.com" target="_blank">
          View Docs
        </Button>
        <Switch />
      </Stack>
    </CacheProvider>
  )
}

export default PlasmoOverlay
