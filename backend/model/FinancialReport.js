// models/FinancialReport.js
import mongoose from 'mongoose'; // Changed from require

const financialReportSchema = new mongoose.Schema({
    date:{ type: String, required: true }, // ADDED - important if this is required in your data

    //BALANCED SHEET
    //ASSETS
    cash: { type: Number }, // Removed unique: true, might be problematic, and required: true
    inventory: { type: Number, required: true },
    accountsReceivable: { type: Number, required: true },
    totalAssets: { type: Number, required: true },

    //LIABILITIES
    accountsPayable: { type: Number, required: true },
    totalLiabilities: { type: Number, required: true },

    //EQUITY
    ownersEquity: { type: Number, required: true },
    totalEquity: { type: Number, required: true },
    totalLiabilitiesAndEquity: { type: Number, required: true },

    //INCOME STATEMENT
    //REVENUE
    salesRevenue: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },

    //COGS
    rawMaterials: { type: Number, required: true },
    laborCosts: { type: Number, required: true },
    totalCogs: { type: Number, required: true },

    //OPERATING EXPENSES
    salariesWages: { type: Number, required: true },
    utilities: { type: Number, required: true },
    employeeExpenses: { type: Number, required: true },
    totalOperatingExpenses: { type: Number, required: true },

    //NET PROFITS
    grossProfit: { type: Number, required: true },
    operatingIncome: { type: Number, required: true },
    netIncome: { type: Number, required: true },

    //CASH FLOW
    //CASH INFLOW
    customerPayments: { type: Number, required: true },
    saleOfOldEquipment: { type: Number, required: true },
    totalInflows: { type: Number, required: true },

    //CASH OUTFLOW OPERATING ACTIVITIES
    paymentToSupplier: { type: Number, required: true },
    salariesAndWages: { type: Number, required: true },
    totalOutflowsO: { type: Number, required: true },

    //CASH OUTFLOW INVESTING ACTIVITIES
    purchaseOfNewEquipments: { type: Number, required: true },
    utilities: { type: Number, required: true }, //Note: utilities is here and also under operating expenses. Is this intentional?
    totalOutflowsI: { type: Number, required: true },

    //TOTAL CASH FLOW
    netCashFlow: { type: Number, required: true },
    beginningBalance: { type: Number, required: true },
    endingBalance: { type: Number, required: true },

    narrativeReport: { type: String }

}, { timestamps: true})


const FinancialReport = mongoose.model('FinancialReport', financialReportSchema);

export default FinancialReport; // Changed from module.exports