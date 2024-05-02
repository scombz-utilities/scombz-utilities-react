import type { PlasmoCSConfig } from "plasmo";
import { serializeData } from "./util/functions";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course/make/tempfile*"],
  run_at: "document_end",
};

const fileId = document.body.innerHTML;
const url = new URL(location.href);
const params = url.searchParams;

if (params.has("scombzExtensionRedirect")) {
  const fileName = params.get("fileName");

  const result = {
    fileName,
    fileId,
    idnumber: params.get("redirectIdNumber"),
    resourceId: params.get("resource_Id"),
    screen: 1,
    contentId: params.get("dlMaterialId"),
    endDate: params.get("openEndDate"),
  };

  console.log(result);

  const encodedFileName = encodeURIComponent(fileName.replace(/\s+/g, "_").replace(/_+/g, "_")).replace(/#/g, "%23");

  const resultURL = `https://scombz.shibaura-it.ac.jp/lms/course/material/setfiledown/${encodedFileName}?${serializeData(result)}`;

  const a = document.createElement("a");
  a.href = resultURL;
  a.textContent = resultURL;

  document.body.appendChild(a);

  setTimeout(() => a.click(), 100);
}
