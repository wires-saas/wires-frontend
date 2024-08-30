export class CsvUtils {
    static jsonToCsv<T>(
        headers: Array<keyof T>,
        jsonData: Array<T>,
        delimiter: string = ';',
    ) {
        let csv = '';
        csv += headers.join(delimiter) + '\n';

        // Add the data
        jsonData.forEach((row) => {
            const data = headers
                .map((header) => JSON.stringify(row[header]))
                .join(delimiter); // Add JSON.stringify statement
            csv += data + '\n';
        });
        return csv;
    }
}
