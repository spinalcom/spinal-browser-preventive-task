import Excel from "exceljs";

export default class ExcelManager {

  constructor(data) {
    this.data = data;
  }

  CreateWorkBook() {
    return this.data.visits.map(visit => {
      let workbook = new Excel.Workbook();
      workbook.creator = 'Spinalcom';
      workbook.created = new Date();
      workbook.name = visit.name;

      let promises = visit.events.map((event => {
        return this.createWorkSheet(workbook, event)
      }))

      return Promise.all(promises).then(() => {
        return {
          name: visit.name,
          workbook: workbook.xlsx.writeBuffer()
        };
      })


    })
  }


  createWorkSheet(workbook, event) {
    let sheet = workbook.addWorksheet(this.getDate(event.date));

    sheet.state = "visible";

    return this.generateSheetContent(sheet, event);


  }

  getDate(argDate) {
    let date = new Date(argDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  generateSheetContent(sheet, event) {
    // let columns = [

    // ]
  }

}