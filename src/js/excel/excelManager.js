import Excel from "exceljs";


class ExcelManager {

  constructor(data) {
    this.data = data;
    this.workbook = new Excel.Workbook();
    this.workbook.creator = 'Spinalcom';
    this.workbook.created = Date.now();
  }

  CreateWorkSheet() {
    this.data.events.forEach(eventData => {
      let sheet = this.workbook.addWorksheet(`${eventData.name}`, {
        properties: {
          tabColor: {
            argb: 'FFC0000'
          }
        }
      })
    });
  }

}