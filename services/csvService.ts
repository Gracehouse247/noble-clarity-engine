
import Papa from 'papaparse';
import { FinancialData } from '../types';
import { BLANK_FINANCIAL_DATA } from '../constants';

/**
 * Mapping of common accounting terms from QuickBooks/Xero exports
 * to the Noble Clarity Engine's internal data fields.
 */
const FIELD_MAPPING: Record<string, keyof FinancialData | string[]> = {
    revenue: ['Total Revenue', 'Gross Sales', 'Sales', 'Total Income', 'Net Sales'],
    netCreditSales: ['Credit Sales', 'Net Credit Sales'],
    cogs: ['Cost of Goods Sold', 'COGS', 'Total COGS', 'Direct Costs'],
    operatingExpenses: ['Total Operating Expenses', 'OpEx', 'Total Expenses', 'Operating Costs'],
    interestExpense: ['Interest Expense', 'Total Interest'],
    taxExpense: ['Tax Expense', 'Income Tax Expense', 'Taxes'],
    currentAssets: ['Total Current Assets', 'Current Assets'],
    currentLiabilities: ['Total Current Liabilities', 'Current Liabilities'],
    totalAssets: ['Total Assets'],
    totalLiabilities: ['Total Liabilities'],
    inventory: ['Inventory', 'Total Inventory', 'Stock'],
    accountsReceivable: ['Accounts Receivable', 'A/R', 'Debtors'],
    cashInflow: ['Total Inflow', 'Cash Inflow', 'Receipts'],
    cashOutflow: ['Total Outflow', 'Cash Outflow', 'Payments'],
    marketingSpend: ['Marketing', 'Ads', 'Advertising'],
    leadsGenerated: ['Leads', 'Total Leads'],
    conversions: ['Conversions', 'Sales count', 'New Customers'],
};

export const parseFinancialCsv = (file: File): Promise<Partial<FinancialData>> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const data = results.data as Record<string, string>[];
                    if (!data || data.length === 0) {
                        resolve({});
                        return;
                    }

                    // We'll take the first data row for now, or aggregate if needed.
                    // Usually exports are one row per period or many rows of transactions.
                    // This logic assumes a single record export or a summary row.
                    const row = data[0];
                    const mappedData: Partial<FinancialData> = {};

                    Object.entries(FIELD_MAPPING).forEach(([field, aliases]) => {
                        const aliasList = Array.isArray(aliases) ? aliases : [aliases];

                        for (const alias of aliasList) {
                            const matchedKey = Object.keys(row).find(k =>
                                k.toLowerCase().trim() === alias.toLowerCase().trim()
                            );

                            if (matchedKey && row[matchedKey]) {
                                const val = parseFloat(row[matchedKey].replace(/[$,\s]/g, ''));
                                if (!isNaN(val)) {
                                    (mappedData as any)[field] = val;
                                    break;
                                }
                            }
                        }
                    });

                    // Attempt to find Reporting Period
                    const periodAlias = ['Period', 'Date', 'Month', 'Reporting Period'];
                    for (const alias of periodAlias) {
                        const matchedKey = Object.keys(row).find(k =>
                            k.toLowerCase().trim() === alias.toLowerCase().trim()
                        );
                        if (matchedKey && row[matchedKey]) {
                            mappedData.period = row[matchedKey];
                            break;
                        }
                    }

                    resolve(mappedData);
                } catch (error) {
                    reject(error);
                }
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
