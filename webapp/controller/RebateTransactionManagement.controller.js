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
            // 1. Mock Data (Replicating the React 'MOCK_TRANSACTIONS')
            var oData = {
                filter: {
                    search: "",
                    period: "2025-01",
                    status: "ALL",
                    partner: ""
                },
                transactions: [
                    { 
                        id: 'TXN-2025-00001', agreement: 'AGR-2025-001', invoice: 'INV-2025-00456', item: '10', 
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-15', 
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001', 
                        product: 'Coca-Cola 500ml Case', qty: 1000, unit: 'CS', category: 'Beverages',
                        netAmount: 250000, eligible: 250000, rate: 2.0, rebate: 5000, 
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: ''
                    },
                    { 
                        id: 'TXN-2025-00002', agreement: 'AGR-2025-001', invoice: 'INV-2025-00457', item: '10', 
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-18', 
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001', 
                        product: 'Sprite 1L Case', qty: 800, unit: 'CS', category: 'Beverages',
                        netAmount: 180000, eligible: 180000, rate: 2.0, rebate: 3600, 
                        status: 'QUALIFIED', currency: 'INR', rejectionReason: ''
                    },
                    { 
                        id: 'TXN-2025-00003', agreement: 'AGR-2025-001', invoice: 'INV-2025-00458', item: '20', 
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-20', 
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001', 
                        product: 'Office Supplies Kit', qty: 50, unit: 'EA', category: 'Office Supplies',
                        netAmount: 25000, eligible: 0, rate: 0, rebate: 0, 
                        status: 'REJECTED', currency: 'INR', rejectionReason: 'Product not in eligible product group'
                    },
                    { 
                        id: 'TXN-2025-00005', agreement: 'AGR-2025-001', invoice: 'INV-2025-00460', item: '10', 
                        period: '2025-01', periodStatus: 'HARD_CLOSE', date: '2025-01-25', 
                        partner: 'ABC Retail Pvt Ltd', partnerCode: 'CUST-001', 
                        product: 'Coca-Cola 500ml Case', qty: 2000, unit: 'CS', category: 'Beverages',
                        netAmount: 500000, eligible: 500000, rate: 2.0, rebate: 10000, 
                        status: 'DISPUTED', currency: 'INR', rejectionReason: '' 
                    }
                    // Add more mock data as needed...
                ]
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);

            // Trigger initial search to apply default filters (e.g., Period 2025-01)
            this.onSearch();
        },

        /**
         * Triggered by the "Go" button in the FilterBar
         */
        onSearch: function () {
            var oView = this.getView();
            var oViewModel = oView.getModel();
            var oFilterData = oViewModel.getProperty("/filter");
            var aFilters = [];

            // 1. Period Filter (Exact Match)
            if (oFilterData.period) {
                aFilters.push(new Filter("period", FilterOperator.EQ, oFilterData.period));
            }

            // 2. Status Filter (Exact Match, ignore 'ALL')
            if (oFilterData.status && oFilterData.status !== "ALL") {
                aFilters.push(new Filter("status", FilterOperator.EQ, oFilterData.status));
            }

            // 3. Partner Name Filter (Contains)
            if (oFilterData.partner) {
                aFilters.push(new Filter("partner", FilterOperator.Contains, oFilterData.partner));
            }

            // 4. General Search (Checks multiple fields: ID, Invoice, Partner)
            if (oFilterData.search) {
                var aSearchFilters = [];
                aSearchFilters.push(new Filter("id", FilterOperator.Contains, oFilterData.search));
                aSearchFilters.push(new Filter("invoice", FilterOperator.Contains, oFilterData.search));
                aSearchFilters.push(new Filter("partner", FilterOperator.Contains, oFilterData.search));
                // Add OR condition for the search field
                aFilters.push(new Filter({ filters: aSearchFilters, and: false }));
            }

            // Apply filters to the Table binding
            var oTable = oView.byId("transactionsTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        /**
         * Triggered when clicking a KPI Tile (e.g., "Qualified")
         * Sets the filter status dropdown and triggers a table search.
         */
        onFilterTile: function (oEvent) {
            var sHeader = oEvent.getSource().getHeader();
            var sStatusKey = "ALL";

            if (sHeader === "Qualified") sStatusKey = "QUALIFIED";
            else if (sHeader === "Rejected") sStatusKey = "REJECTED";
            else if (sHeader === "Disputed") sStatusKey = "DISPUTED";

            // Update model and search
            this.getView().getModel().setProperty("/filter/status", sStatusKey);
            this.onSearch();
        },

        /**
         * Navigation to Transaction Detail (Example stub)
         */
        onPressTransaction: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sTxnId = oContext.getProperty("id");

            MessageToast.show("Navigating to details for " + sTxnId);
            // Router navigation logic would normally go here:
            // this.getOwnerComponent().getRouter().navTo("Detail", { id: sTxnId });
        },

        /**
         * "Eye" icon click - Shows a simple details dialog
         */
        onViewDetails: function (oEvent) {
            var oView = this.getView();
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext(); // Assuming main model is named "transaction"
            var oSelectedData = oCtx.getObject();

            // 1. Create Dialog if it doesn't exist
            if (!this._pDetailDialog) {
                this._pDetailDialog = Fragment.load({
                    id: oView.getId(),
                    name: "my.rebate.app.view.TransactionDetail", // Adjust path to match your project structure
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            // 2. Open Dialog and bind data
            this._pDetailDialog.then(function (oDialog) {
                // Create a dedicated model for the dialog so paths like {transaction>id} work directly
                var oDialogModel = new JSONModel(oSelectedData);
                oDialog.setModel(oDialogModel, "transaction");
                
                // Reset tab bar to first tab
                var oTabBar = oView.byId("idIconTabBar");
                if(oTabBar) oTabBar.setSelectedKey("details");
                
                oDialog.open();
            });
        },

        onCloseDetailDialog: function () {
            this._pDetailDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        /**
         * -----------------------------------------------------------------------
         * Dispute Modal Logic (Matches DisputeDialog.fragment.xml)
         * -----------------------------------------------------------------------
         */
        onRaiseDispute: function (oEvent) {
            var oView = this.getView();
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext();
            var oSelectedData = oCtx.getObject();

            if (!this._pDisputeDialog) {
                this._pDisputeDialog = Fragment.load({
                    id: oView.getId(),
                    name: "my.rebate.app.view.DisputeDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDisputeDialog.then(function (oDialog) {
                // 1. Bind Transaction Data (Read-only context)
                var oTransModel = new JSONModel(oSelectedData);
                oDialog.setModel(oTransModel, "transaction");

                // 2. Bind View Data (For Form Inputs & Calculation)
                var oFormModel = new JSONModel({
                    disputeReason: "",
                    claimedAmount: "", // Empty initially
                    disputeComment: "",
                    disputeDifference: "0.00",
                    disputeDifferenceValue: 0
                });
                oDialog.setModel(oFormModel, "view");

                oDialog.open();
            });
        },

        /**
         * Calculates the "Impact Preview" in real-time
         * Triggered by: liveChange="onDisputeAmountChange" in fragment
         */
        onDisputeAmountChange: function (oEvent) {
            this._pDisputeDialog.then(function(oDialog) {
                var oViewModel = oDialog.getModel("view");
                var oTransModel = oDialog.getModel("transaction");

                // Get values
                var fClaimed = parseFloat(oEvent.getParameter("value")) || 0;
                var fCurrent = parseFloat(oTransModel.getProperty("/rebate")) || 0;
                var sCurrency = oTransModel.getProperty("/currency");

                // Calculate Delta
                var fDiff = fClaimed - fCurrent;

                // Update Model (Formatted string and raw value for state/color)
                oViewModel.setProperty("/disputeDifferenceValue", fDiff);
                
                var sSign = fDiff > 0 ? "+" : "";
                var sFormatted = sSign + new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: sCurrency 
                }).format(fDiff);
                
                oViewModel.setProperty("/disputeDifference", sFormatted);
            });
        },

        onSubmitDispute: function () {
            this._pDisputeDialog.then(function (oDialog) {
                var oData = oDialog.getModel("view").getData();
                
                // Here you would call your OData Update/Create
                MessageToast.show("Dispute Submitted! Delta: " + oData.disputeDifference);
                
                oDialog.close();
            });
        },

        onCloseDisputeDialog: function () {
            this._pDisputeDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        /**
         * Excel Export using sap.ui.export.Spreadsheet
         */
        onExport: function () {
            var aCols, oRowBinding, oSettings, oSheet, oTable;

            oTable = this.byId("transactionsTable");
            oRowBinding = oTable.getBinding("items");
            aCols = this._createColumnConfig();

            oSettings = {
                workbook: { columns: aCols },
                dataSource: oRowBinding,
                fileName: "Rebate_Transactions_2025.xlsx",
                worker: false // Disable worker for simple mock environments
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