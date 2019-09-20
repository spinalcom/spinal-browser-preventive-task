import ExcelManager from "./excelManager";
import JSZip from "jszip";

export default function(data) {
  let zip = new JSZip();

  let foldersPromise = data.map(group => {


    let groupFolder = zip.folder(group.name);

    let excelManager = new ExcelManager(group);
    let workbooksPromises = excelManager.CreateWorkBook();

    return Promise.all(workbooksPromises).then(values => {

      values.forEach(element => {
        groupFolder.file(`${element.name}.xlsx`, element.workbook, {
          base64: true
        });
      });

    })

  })

  return Promise.all(foldersPromise).then(() => {
    return zip;
  })

}