import Excel from "exceljs";
import utilities from '../utilities';


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

      // let promises = visit.events.map((event => {
      //   return this.createWorkSheet(workbook, event)
      // }))

      let promises = [
        this.createDetailWorkSheet(workbook, visit),
        this.createWorkSheet(workbook, visit)
      ];

      return Promise.all(promises).then(() => {
        return {
          name: visit.name,
          workbook: workbook.xlsx.writeBuffer()
        };
      })


    })
  }

  createDetailWorkSheet(workbook, visit) {
    let sheet = workbook.addWorksheet("Info");
    sheet.state = "visible";

    let columns = [{
        header: "Name",
        key: "name",
        width: 32
      },
      {
        header: "Period Number",
        key: "periodNumber",
        width: 15
      },
      {
        header: "Period Mesure",
        key: "periodMesure",
        width: 15
      },
      {
        header: "Intervention Number",
        key: "interventionNumber",
        width: 15
      },
      {
        header: "Intervention Mesure",
        key: "interventionMesure",
        width: 15
      },
      {
        header: "Visit Type",
        key: "visitType",
        width: 32
      },
      {
        header: "description",
        key: "description",
        width: 32
      }
    ];

    sheet.columns = columns;

    this.changeHeaderStyle(sheet);

    sheet.addRow({
      name: visit.name,
      periodNumber: visit.periodicity.number,
      periodMesure: visit.periodicity.mesure,
      interventionNumber: visit.intervention.number,
      interventionMesure: visit.intervention.mesure,
      visitType: visit.visitType,
      description: visit.description
    })

    return Promise.resolve(true);

  }


  validateAllCells(key, col) {
    let dataValidation = {
      type: "",
      allowBlank: true,
      errorStyle: "error",
      errorTitle: "errot",
      error: "The value is incorrect !!!"
    };

    if (key === "periodNumber" || key === "interventionNumber") {
      dataValidation["type"] = "whole";
    } else if (key === "periodMesure" || key === "interventionMesure") {
      dataValidation["type"] = "list";
      dataValidation["formulae"] =
        key === "interventionMesure" ? [
          '"minute(s), day(s), week(s), month(s), year(s)"'
        ] : ['"day(s), week(s), month(s), year(s)"'];
    } else if (key === "visitType") {
      dataValidation["type"] = "list";
      dataValidation["formulae"] = [
        '"MAINTENANCE_VISIT,REGULATORY_VISIT,SECURITY_VISIT,DIAGNOSTIC_VISIT"'
      ];
    }

    return new Promise(resolve => {
      let cpt = 0;
      col.eachCell(cell => {
        if (cpt !== 0) {
          cell.dataValidation = dataValidation;
        }
        cpt++;
      });
      resolve(true);
    });
  }


  createWorkSheet(workbook, visit) {
    let sheet = workbook.addWorksheet("events");
    sheet.state = "visible";


    /*
    ---------------------------------------------------------------------------
                                        Header
    ---------------------------------------------------------------------------
    */
    let columns = [{
        header: "Equipment Name",
        key: "name",
        width: 40
      },
      {
        header: "Equipement Id",
        key: "id",
        width: 15
      },
      {
        header: "Date",
        key: "date",
        width: 40
      },
      {
        header: "Visit",
        key: "visit",
        width: 40
      },
      {
        header: "Is done",
        key: "done",
        width: 10
      }
    ]

    sheet.columns = columns;

    this.changeHeaderStyle(sheet);

    /*
    ---------------------------------------------------------------------------
                                        Header
    ---------------------------------------------------------------------------
    */

    let promises = visit.events.map(event => this.generateSheetContent(sheet,
      event,
      visit.name));

    return Promise.all(promises);
  }

  getDate(argDate) {
    let date = new Date(argDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  async generateSheetContent(sheet, event, visitName) {



    let tasks = await utilities.getEventTasks(event.id);


    let listItems = tasks.map(el => {
      return {
        name: el.name,
        id: el.dbId,
        done: el.done ? "Done" : "Not Done",
        date: this.getDate(event.date),
        visit: visitName
      }
    })

    sheet.addRows(listItems);

    return true;

  }

  changeHeaderStyle(sheet) {
    sheet.getRow(1).eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'darkGrid',
        // bgColor: {
        //   argb: '00000000'
        // },
        // fgColor: {
        //   argb: 'FFFFFFFF'
        // }
      };
    })
  }

}