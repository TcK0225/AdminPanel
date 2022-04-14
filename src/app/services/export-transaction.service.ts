import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver'; 

@Injectable({
  providedIn: 'root'
})
export class ExportTransactionService {

  constructor() { }
  exportExcel(excelData) {
    const title = excelData.title;
    const header = excelData.header;
    const data = excelData.data;
    const worksheets = excelData.worksheets;

    let workbook = new Workbook();
    if(worksheets.length == 1) {
      let worksheet = workbook.addWorksheet(worksheets[0],{views:[{state: 'frozen', xSplit: 1, ySplit:1}]});
      worksheet.properties.defaultColWidth = 20;
      worksheet.autoFilter = {
        from: 'F1',
        to: 'I1',
      }
      let headerRow = worksheet.addRow(header);
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.eachCell((cell, number) => {
        cell.font = {
          bold: true,
          color: { argb: '000000' },
          size: 12,
        }
      }) 

      data.forEach(d => {
        let row = worksheet.addRow(d);
        row.alignment = {vertical: 'middle', horizontal: 'left'};
      });
      
      worksheet.getColumn(13).eachCell(function(cell, rownumber) {
        cell.value ='';
      });
      
      worksheet.getColumn(14).eachCell(function(cell, rownumber) {
        cell.value ='';
      });
    } else {
      for (let i = 0; i < worksheets.length ; i++) {
        let worksheet = workbook.addWorksheet(worksheets[i],{views:[{state: 'frozen', xSplit: 1, ySplit:1}]});
        worksheet.properties.defaultColWidth = 20;
        worksheet.autoFilter = {
          from: 'F1',
          to: 'I1',
        }
        let headerRow = worksheet.addRow(header[i]);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.eachCell((cell, number) => {
          cell.font = {
            bold: true,
            color: { argb: '000000' },
            size: 12,
          }
        }) 

        data[i].forEach(d => {
          let row = worksheet.addRow(d);
          row.alignment = {vertical: 'middle', horizontal: 'left'};
        });
        
        worksheet.getColumn(13).eachCell(function(cell, rownumber) {
          cell.value ='';
        });
        
        worksheet.getColumn(14).eachCell(function(cell, rownumber) {
          cell.value ='';
        });
      }
    }

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })
  }
}
