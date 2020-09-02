import Transaction from '../models/Transaction';
import csvParse from 'csv-parse';
import fs from 'fs';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCsv = contactReadStream.pipe(parsers);

    const transactions = [];
    const categories = [];

    parseCsv.on('data', async line => {
      const { title, type, value, category } = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCsv.on('end', resolve));
    return {categories, transactions};
  }
}

export default ImportTransactionsService;
