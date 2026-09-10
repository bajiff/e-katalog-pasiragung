import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDataForExport = (data, columns) => {
  return data.map(item => {
    const row = {};
    columns.forEach(col => {
      row[col.header] = col.accessor(item);
    });
    return row;
  });
};

export const exportToExcel = (data, columns, filename = 'export') => {
  const formattedData = formatDataForExport(data, columns);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToCSV = (data, columns, filename = 'export') => {
  const formattedData = formatDataForExport(data, columns);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data, columns, filename = 'export', title = 'Data Export') => {
  const doc = new jsPDF();
  
  const tableColumn = columns.map(col => col.header);
  const tableRows = data.map(item => columns.map(col => {
    const val = col.accessor(item);
    return val === null || val === undefined ? '' : String(val);
  }));

  doc.text(title, 14, 15);
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 8, font: 'helvetica' },
    headStyles: { fillColor: [44, 62, 80] }
  });
  
  doc.save(`${filename}.pdf`);
};
