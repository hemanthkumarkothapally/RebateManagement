sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet"
], function (Controller, JSONModel, MessageToast, Filter, FilterOperator, Fragment, Spreadsheet) {
    "use strict";

    return Controller.extend("com.cy.rbm.controller.RebateTransactionManagement", {

        onInit: function () {
            var oData = {
                ui: {
                    countTotal: 0,
                    countQualified: 0,
                    countRejected: 0,
                    countDisputed: 0,
                    countAccrued: 0,
                    eligibleAmount: 0,
                    totalRebate: 0,
                    avgRate: 0
                },
                filter: {
                    search: "",
                    period: "2025-01",
                    status: "ALL",
                    partner: ""
                },
                transactions: [
                    {
                        id: 'TXN-2025-00001', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00456', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-15',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Coca-Cola 500ml Case', qty: 1000, unit: 'CS', category: 'Beverages',
                        netAmount: 250000, eligible: 250000, rate: 2.0, rebate: 5000,
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: '',

                        // New Fields for Dialog
                        accrualInfo: {
                            runNumber: 'ACR-2025-01-003',
                            runDate: '2025-01-31',
                            postingDate: '2025-01-31',
                            fiDocument: 'FI-1000001230',
                            deltaAmount: 5000,
                            reversalRef: ''
                        },
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [
                                { check: 'Customer Match', detail: 'CUST-001 in agreement partner list', result: 'PASS' },
                                { check: 'Product Group', detail: 'BEV-001 belongs to BEVERAGES group', result: 'PASS' },
                                { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }

                            ],
                            volumeAccumulation: {
                                previousVolume: '5,000', unit: 'CS',
                                currentInvoice: '1,000',
                                newTotal: '6,000'
                            },
                            tierApplied: {
                                tierNumber: '1',
                                range: '0 - 10,000 CS',
                                rate: 2.0,
                                note: 'Standard tier rate applied'
                            },
                            calculation: {
                                formula: 'Eligible Amount × Rate'
                            }
                        }
                    },

                    // --- THE SPECIFIC EXAMPLE FROM YOUR REQUEST ---
                    {
                        id: 'TXN-2025-00004', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00459', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-22',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Coca-Cola 500ml Case', qty: 600, unit: 'CS', category: 'Beverages',
                        netAmount: 140000, eligible: 140000, rate: 2.0, rebate: 2800,
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: '',

                        // Detailed Accrual Info
                        accrualInfo: {
                            runNumber: 'ACR-2025-01-003',
                            runDate: '2025-01-31',
                            postingDate: '2025-01-31',
                            fiDocument: 'FI-1000001234',
                            deltaAmount: 2800,
                            reversalRef: ''
                        },

                        // Detailed Calculation Trace
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [
                                { check: 'Customer Match', detail: 'CUST-001 in agreement partner list', result: 'PASS' },
                                { check: 'Product Group', detail: 'BEV-003 belongs to BEVERAGES group', result: 'PASS' },
                                { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }
                            ],
                            volumeAccumulation: {
                                previousVolume: '10,000', unit: 'CS',
                                currentInvoice: '600',
                                newTotal: '10,600'
                            },
                            tierApplied: {
                                tierNumber: '2',
                                range: '10,001 - 50,000 CS',
                                rate: 2.0,
                                note: 'Tier threshold crossed at 10,000 CS'
                            },
                            calculation: {
                                formula: 'Eligible Amount × Rate'
                            }
                        }
                    },

                    {
                        id: 'TXN-2025-00003', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00458', item: '20',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-20',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Office Supplies Kit', qty: 50, unit: 'EA', category: 'Office Supplies',
                        netAmount: 25000, eligible: 0, rate: 0, rebate: 0,
                        status: 'REJECTED', currency: 'INR', rejectionReason: 'Product not in eligible product group',

                        accrualInfo: null, // No accrual for rejected items

                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [
                                { check: 'Customer Match', detail: 'CUST-001 in agreement partner list', result: 'PASS' },
                                { check: 'Product Group', detail: 'OFF-001 does NOT belong to BEVERAGES group', result: 'FAIL' },
                                { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }

                            ],
                            // Minimal trace for rejected items
                            volumeAccumulation: null,
                            tierApplied: null,
                            calculation: { formula: 'Eligibility Check Failed' }
                        }
                    },

                    {
                        id: 'TXN-2025-00005', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00460', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-25',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Coca-Cola 500ml Case', qty: 2000, unit: 'CS', category: 'Beverages',
                        netAmount: 500000, eligible: 500000, rate: 2.0, rebate: 10000,
                        status: 'DISPUTED', currency: 'INR', rejectionReason: '',
                        disputeReason: 'Rate Discrepancy', // Example existing dispute

                        accrualInfo: {
                            runNumber: 'ACR-2025-01-003',
                            runDate: '2025-01-31',
                            postingDate: '2025-01-31',
                            fiDocument: 'FI-1000001240',
                            deltaAmount: 10000,
                            reversalRef: ''
                        },
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [
                                { check: 'Customer Match', detail: 'CUST-001 in agreement partner list', result: 'PASS' },
                                { check: 'Product Group', detail: 'BEV-001 belongs to BEVERAGES group', result: 'PASS' },
                                { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }

                            ],
                            volumeAccumulation: {
                                previousVolume: '10,600', unit: 'CS',
                                currentInvoice: '2,000',
                                newTotal: '12,600'
                            },
                            tierApplied: {
                                tierNumber: '2',
                                range: '10,001 - 50,000 CS',
                                rate: 2.0,
                                note: ''
                            },
                            calculation: { formula: 'Eligible Amount × Rate' }
                        }
                    },

                    {
                        id: 'TXN-2025-00006', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00501', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-05',
                        partner: 'XYZ Supermart', partnerCode: 'CUST-002',
                        product: 'Kinley Water 1L', qty: 200, unit: 'CS', category: 'Beverages',
                        netAmount: 40000, eligible: 40000, rate: 1.5, rebate: 600,
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: '',
                        accrualInfo: {
                            runNumber: 'ACR-2025-01-003', runDate: '2025-01-31', postingDate: '2025-01-31',
                            fiDocument: 'FI-1000001255', deltaAmount: 600, reversalRef: ''
                        },
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [
                                { check: 'Customer Match', detail: 'CUST-002 in agreement partner list', result: 'PASS' },
                                { check: 'Product Group', detail: 'WAT-001 belongs to BEVERAGES group', result: 'PASS' },
                                { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }

                            ],
                            volumeAccumulation: {
                                previousVolume: '0', unit: 'CS',
                                currentInvoice: '200',
                                newTotal: '200'
                            },
                            tierApplied: { tierNumber: '1', range: '0 - 10,000 CS', rate: 1.5, note: 'Entry level tier' },
                            calculation: { formula: 'Eligible Amount × Rate' }
                        }
                    },

                    // 7. Rejected - Partner Not Eligible
                    {
                        id: 'TXN-2025-00007', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00505', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-12',
                        partner: 'Tech Solutions Ltd', partnerCode: 'CUST-099',
                        product: 'Coca-Cola 500ml Case', qty: 50, unit: 'CS', category: 'Beverages',
                        netAmount: 12500, eligible: 0, rate: 0, rebate: 0,
                        status: 'REJECTED', currency: 'INR', rejectionReason: 'Partner not part of agreement group',
                        accrualInfo: null,
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [
                                { check: 'Customer Match', detail: 'CUST-099 NOT found in agreement list', result: 'FAIL' },
                                { check: 'Product Group', detail: 'BEV-001 belongs to BEVERAGES group', result: 'PASS' },
                                { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }

                            ],
                            volumeAccumulation: null,
                            tierApplied: null,
                            calculation: { formula: 'Eligibility Check Failed' }
                        }
                    },

                    // 8. High Value - Tier 3 Qualified
                    {
                        id: 'TXN-2025-00008', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00512', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-28',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Thums Up 2L Case', qty: 5000, unit: 'CS', category: 'Beverages',
                        netAmount: 1500000, eligible: 1500000, rate: 3.0, rebate: 45000,
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: '',
                        accrualInfo: {
                            runNumber: 'ACR-2025-01-003', runDate: '2025-01-31', postingDate: '2025-01-31',
                            fiDocument: 'FI-1000001288', deltaAmount: 45000, reversalRef: ''
                        },
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [
                                { check: 'Customer Match', detail: 'CUST-001 in agreement partner list', result: 'PASS' },
                                { check: 'Product Group', detail: 'BEV-005 belongs to BEVERAGES group', result: 'PASS' },
                                { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }

                            ],
                            volumeAccumulation: {
                                previousVolume: '12,600', unit: 'CS',
                                currentInvoice: '5,000',
                                newTotal: '17,600'
                            },
                            tierApplied: { tierNumber: '3', range: '10,001 - 50,000 CS', rate: 3.0, note: 'Max tier rate applied' },
                            calculation: { formula: 'Eligible Amount × Rate' }
                        }
                    },

                    // 9. Rejected - Duplicate Transaction
                    {
                        id: 'TXN-2025-00009', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00456', item: '10', // Same as TXN-001
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-15',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Coca-Cola 500ml Case', qty: 1000, unit: 'CS', category: 'Beverages',
                        netAmount: 250000, eligible: 0, rate: 0, rebate: 0,
                        status: 'REJECTED', currency: 'INR', rejectionReason: 'Duplicate Invoice Line Item',
                        accrualInfo: null,
                        calculationTrace: {
                            agreementRule: 'System Check',
                            eligibilityChecks: [
                                { check: 'Uniqueness', detail: 'Invoice INV-2025-00456 Item 10 already processed', result: 'FAIL' }
                            ],
                            volumeAccumulation: null, tierApplied: null, calculation: { formula: 'Duplicate Check Failed' }
                        }
                    },

                    // 10. Disputed - Missing Accrual (System Error)
                    {
                        id: 'TXN-2025-00010', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00520', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-29',
                        partner: 'Metro Cash & Carry', partnerCode: 'CUST-005',
                        product: 'Fanta 1.5L Case', qty: 1200, unit: 'CS', category: 'Beverages',
                        netAmount: 300000, eligible: 300000, rate: 2.0, rebate: 6000,
                        status: 'DISPUTED', currency: 'INR', rejectionReason: '',
                        disputeReason: 'Accrual not posted in FI',
                        accrualInfo: null, // Missing accrual triggered dispute
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [{ check: 'Customer Match', result: 'PASS' }, { check: 'Product Group', result: 'PASS' }, ,
                            { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }
                            ],
                            volumeAccumulation: { previousVolume: '8,000', currentInvoice: '1,200', newTotal: '9,200' },
                            tierApplied: { tierNumber: '1', range: '0 - 10,000 CS', rate: 2.0, note: '' },
                            calculation: { formula: 'Eligible Amount × Rate' }
                        }
                    },

                    // 11. New Period (Feb) - Open Status
                    {
                        id: 'TXN-2025-00011', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2025-00601', item: '10',
                        period: '2025-02', periodStatus: 'OPEN', date: '2025-02-02',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Maaza 600ml', qty: 500, unit: 'CS', category: 'Beverages',
                        netAmount: 100000, eligible: 100000, rate: 2.0, rebate: 2000,
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: '',
                        accrualInfo: { runNumber: 'Pending', runDate: '-', fiDocument: '-', deltaAmount: 2000 },
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [{ check: 'Validity', result: 'PASS' }, { check: 'Product Group', result: 'PASS' },

                            { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }
                            ],
                            volumeAccumulation: { previousVolume: '17,600', currentInvoice: '500', newTotal: '18,100' },
                            tierApplied: { tierNumber: '3', rate: 2.0, note: 'Interim calculation' },
                            calculation: { formula: 'Eligible Amount × Rate' }
                        }
                    },

                    // 12. Different Product Category (Snacks) - Pass
                    {
                        id: 'TXN-2025-00012', agreement: 'AGR-2025-002', agreementName: 'Snacks Growth Incentive',
                        invoice: 'INV-2025-00605', item: '10',
                        period: '2025-02', periodStatus: 'OPEN', date: '2025-02-03',
                        partner: 'XYZ Supermart', partnerCode: 'CUST-002',
                        product: 'Lays Classic Salted', qty: 2000, unit: 'BOX', category: 'Snacks',
                        netAmount: 50000, eligible: 50000, rate: 5.0, rebate: 2500,
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: '',
                        accrualInfo: { runNumber: 'Pending', runDate: '-', fiDocument: '-', deltaAmount: 2500 },
                        calculationTrace: {
                            agreementRule: 'R005 - Snacks Flat Rate',
                            eligibilityChecks: [{ check: 'Category Match', result: 'PASS' }, { check: 'Product Group', result: 'PASS' },

                            { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }
                            ],
                            volumeAccumulation: null,
                            tierApplied: { tierNumber: 'Flat', rate: 5.0, note: 'Promotional Rate' },
                            calculation: { formula: 'Flat Rate Applied' }
                        }
                    },

                    // 13. Rejected - Out of Validity Date
                    {
                        id: 'TXN-2025-00013', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'INV-2024-00999', item: '10',
                        period: '2024-12', periodStatus: 'HARD_CLOSE', date: '2024-12-28',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Coca-Cola 500ml Case', qty: 1000, unit: 'CS', category: 'Beverages',
                        netAmount: 250000, eligible: 0, rate: 0, rebate: 0,
                        status: 'REJECTED', currency: 'INR', rejectionReason: 'Invoice Date prior to Agreement Start Date (2025-01-01)',
                        accrualInfo: null,
                        calculationTrace: {
                            agreementRule: 'R001 - Beverage Volume Tier',
                            eligibilityChecks: [
                                { check: 'Customer Match', result: 'PASS' },
                                { check: 'Product Group', detail: 'WAT-001 belongs to BEVERAGES group', result: 'PASS' },

                                { check: 'Validity Period', detail: '2024-12-28 is before 2025-01-01', result: 'FAIL' }
                            ],
                            volumeAccumulation: null, tierApplied: null, calculation: { formula: 'Validity Check Failed' }
                        }
                    },

                    // 14. Manual Adjustment (Credit Memo)
                    {
                        id: 'TXN-2025-00014', agreement: 'AGR-2025-001', agreementName: 'Annual Volume Rebate',
                        invoice: 'CREDIT-MEMO-01', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-30',
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001',
                        product: 'Manual Adjustment', qty: 0, unit: '-', category: 'Financial',
                        netAmount: 0, eligible: 0, rate: 0, rebate: 1500,
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: '',
                        accrualInfo: {
                            runNumber: 'ACR-2025-01-003', runDate: '2025-01-31', fiDocument: 'FI-1000001299', deltaAmount: 1500
                        },
                        calculationTrace: {
                            agreementRule: 'Manual Override',
                            eligibilityChecks: [{ check: 'Authorization', detail: 'Approved by Sales Manager', result: 'PASS' },
                            { check: 'Product Group', detail: 'WAT-001 belongs to BEVERAGES group', result: 'PASS' },

                            { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }
                            ],
                            volumeAccumulation: null,
                            tierApplied: { note: 'Goodwill payout' },
                            calculation: { formula: 'Manual Entry' }
                        }
                    },

                    // 15. Disputed - Rate Disagreement
                    {
                        id: 'TXN-2025-00015', agreement: 'AGR-2025-003', agreementName: 'Summer Promo',
                        invoice: 'INV-2025-00700', item: '10',
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-20',
                        partner: 'Global Mart', partnerCode: 'CUST-010',
                        product: 'Sprite 2L Case', qty: 400, unit: 'CS', category: 'Beverages',
                        netAmount: 100000, eligible: 100000, rate: 4.0, rebate: 4000,
                        status: 'DISPUTED', currency: 'INR', rejectionReason: '',
                        disputeReason: 'Partner expects 5% rate',
                        accrualInfo: { runNumber: 'ACR-2025-01-003', fiDocument: 'FI-1000001300', deltaAmount: 4000 },
                        calculationTrace: {
                            agreementRule: 'R003 - Flat Rate',
                            eligibilityChecks: [{ check: 'Customer Match', result: 'PASS' },
                            { check: 'Product Group', detail: 'WAT-001 belongs to BEVERAGES group', result: 'PASS' },

                            { check: 'Validity Period', detail: 'Invoice date within agreement validity', result: 'PASS' }
                            ],
                            volumeAccumulation: null,
                            tierApplied: { tierNumber: 'Standard', rate: 4.0, note: 'System Configured Rate' },
                            calculation: { formula: 'Eligible Amount × Rate' }
                        }
                    }
                ]
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);

            this.onSearch();
        },

        onTableUpdateFinished: function (oEvent) {
            var oTable = oEvent.getSource();
            var oBinding = oTable.getBinding("items");

            // Get the current visible contexts (the rows currently shown/filtered)
            var aContexts = oBinding.getCurrentContexts();

            var iTotal = 0;
            var iQualified = 0;
            var iRejected = 0;
            var iDisputed = 0;
            var iAccrued = 0;
            var iea = 0;
            var totr = 0;
            var avg = 0;

            if (aContexts) {
                iTotal = aContexts.length;

                // Loop through visible items to count specific statuses
                aContexts.forEach(function (oContext) {
                    var oData = oContext.getObject();

                    totr += oData.netAmount;
                    iea += oData.eligible;
                    avg += oData.rate;

                    // Count Statuses
                    if (oData.status === "QUALIFIED") {
                        iQualified++;
                    } else if (oData.status === "REJECTED") {
                        iRejected++;
                    } else if (oData.status === "DISPUTED") {
                        iDisputed++;
                    }

                    // Count Accrued (Check if accrualInfo exists and has a runNumber)
                    if (oData.accrualInfo && oData.accrualInfo.runNumber) {
                        iAccrued++;
                    }
                });
            }
            console.log(iTotal,iQualified)
            var oViewModel = this.getView().getModel();
            oViewModel.setProperty("/ui/countTotal", iTotal);
            oViewModel.setProperty("/ui/countQualified", iQualified);
            oViewModel.setProperty("/ui/countRejected", iRejected);
            oViewModel.setProperty("/ui/countDisputed", iDisputed);
            oViewModel.setProperty("/ui/countAccrued", iAccrued);
            oViewModel.setProperty("/ui/totalRebate", totr);
            oViewModel.setProperty("/ui/eligibleAmount", iea);
            oViewModel.setProperty("/ui/avgRate", avg/iTotal);
        },
        reCal(){
            MessageToast.show("Recalculation Initiated");
        },

        onSearch: function () {
            var oView = this.getView();
            var oViewModel = oView.getModel();
            var oFilterData = oViewModel.getProperty("/filter");
            var aFilters = [];

            if (oFilterData.period) {
                aFilters.push(new Filter("period", FilterOperator.EQ, oFilterData.period));
            }

            if (oFilterData.status && oFilterData.status !== "ALL") {
                aFilters.push(new Filter("status", FilterOperator.EQ, oFilterData.status));
            }

            if (oFilterData.partner) {
                aFilters.push(new Filter("partner", FilterOperator.Contains, oFilterData.partner));
            }

            if (oFilterData.search) {
                var aSearchFilters = [];
                aSearchFilters.push(new Filter("id", FilterOperator.Contains, oFilterData.search));
                aSearchFilters.push(new Filter("invoice", FilterOperator.Contains, oFilterData.search));
                aSearchFilters.push(new Filter("partner", FilterOperator.Contains, oFilterData.search));
                aFilters.push(new Filter({ filters: aSearchFilters, and: false }));
            }

            var oTable = oView.byId("transactionsTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },


        onFilterTile: function (oEvent) {
            var sHeader = oEvent.getSource().getHeader();
            var sStatusKey = "ALL";

            if (sHeader === "Qualified") sStatusKey = "QUALIFIED";
            else if (sHeader === "Rejected") sStatusKey = "REJECTED";
            else if (sHeader === "Disputed") sStatusKey = "DISPUTED";

            this.getView().getModel().setProperty("/filter/status", sStatusKey);
            this.onSearch();
        },


        onPressTransaction: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sTxnId = oContext.getProperty("id");

            MessageToast.show("Navigating to details for " + sTxnId);
        },


        onViewDetails: function (oEvent) {
            var oView = this.getView();
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext();
            var oSelectedData = oCtx.getObject();

            if (!this._pDetailDialog) {
                this._pDetailDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.cy.rbm.view.TransactionDetail",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDetailDialog.then(function (oDialog) {
                var oDialogModel = new JSONModel(oSelectedData);
                oDialog.setModel(oDialogModel, "transaction");
                oDialog.bindElement("transaction>/");

                var oTabBar = oView.byId("idIconTabBar");
                if (oTabBar) oTabBar.setSelectedKey("details");

                oDialog.open();
            });
        },

        onCloseDetailDialog: function () {
            this._pDetailDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onRaiseDispute: function (oEvent) {

            var oView = this.getView();
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext();
            var oSelectedData = oCtx.getObject();

            if (!this._pDisputeDialog) {
                this._pDisputeDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.cy.rbm.view.DisputeDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDisputeDialog.then(function (oDialog) {
                var oTransModel = new sap.ui.model.json.JSONModel(oSelectedData);
                oDialog.setModel(oTransModel, "transaction");
                oDialog.bindElement("transaction>/");

                var oFormModel = new sap.ui.model.json.JSONModel({
                    disputeReason: "",
                    claimedAmount: "",
                    disputeComment: "",
                    disputeDifference: "0.00",
                    disputeDifferenceValue: 0
                });
                oDialog.setModel(oFormModel, "view");
                oDialog.bindElement("view>/");

                oDialog.open();
            });
        },
        onDisputeAmountChange: function (oEvent) {
            var pDialogPromise = this._pDisputeDialog;

            if (!pDialogPromise) {
                console.error("Dispute Dialog Promise is undefined. Check onRaiseDispute logic.");
                return;
            }

            pDialogPromise.then(function (oDialog) {
                var oViewModel = oDialog.getModel("view");
                var oTransModel = oDialog.getModel("transaction");

                var sValue = oEvent.getParameter("value");
                var fClaimed = parseFloat(sValue) || 0;

                var fCurrent = 0;
                if (oTransModel && oTransModel.getProperty("/rebate")) {
                    fCurrent = parseFloat(oTransModel.getProperty("/rebate"));
                }

                var sCurrency = "USD"; // Default
                if (oTransModel && oTransModel.getProperty("/currency")) {
                    sCurrency = oTransModel.getProperty("/currency");
                }

                var fDiff = fClaimed - fCurrent;

                if (oViewModel) {
                    oViewModel.setProperty("/disputeDifferenceValue", fDiff);

                    var sSign = fDiff > 0 ? "+" : "";
                    try {
                        var sFormatted = sSign + new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: sCurrency
                        }).format(fDiff);
                        oViewModel.setProperty("/disputeDifference", sFormatted);
                    } catch (e) {
                        oViewModel.setProperty("/disputeDifference", sSign + fDiff);
                    }
                }
            });
        },

        onSubmitDispute: function () {
            this._pDisputeDialog.then(function (oDialog) {
                var oData = oDialog.getModel("view").getData();

                MessageToast.show("Dispute DSP-1769492952466 created");

                oDialog.close();
            });
        },

        onCloseDisputeDialog: function () {
            this._pDisputeDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onExport: function () {
            var aCols, oRowBinding, oSettings, oSheet, oTable;

            oTable = this.byId("transactionsTable");
            oRowBinding = oTable.getBinding("items");
            aCols = this._createColumnConfig();

            oSettings = {
                workbook: { columns: aCols },
                dataSource: oRowBinding,
                fileName: "Rebate_Transactions_2025.xlsx",
                worker: false
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },

        



        _createColumnConfig: function () {
            return [
                { label: 'Transaction ID', property: 'id', width: '20' },
                { label: 'Status', property: 'status', width: '15' },
                { label: 'Date', property: 'date', width: '15' },
                { label: 'Partner', property: 'partner', width: '25' },
                { label: 'Product', property: 'product', width: '25' },
                { label: 'Net Amount', property: 'netAmount', type: 'currency', currency: 'currency', width: '15' },
                { label: 'Rebate', property: 'rebate', type: 'currency', currency: 'currency', width: '15' }
            ];
        }
    });
});