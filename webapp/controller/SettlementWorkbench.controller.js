sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("com.cy.rbm.controller.SettlementWorkbench", {

        onInit: function () {
            // Mock Data
            var oData = {
                settlements: [
                    { id: "STL-2025-Q1-001", period: "2025-Q1", partner: "ABC Retail", agreement: "AGR-001", statusText: "Pending", statusState: "Warning", statusIcon: "sap-icon://pending", accrued: "1,00,000", adjustments: "+56,000", adjustmentState: "Success", amount: "1,56,000", dueDate: "15-Apr-2025" },
                    { id: "STL-2025-Q1-002", period: "2025-Q1", partner: "XYZ Stores", agreement: "AGR-002", statusText: "Pending", statusState: "Warning", statusIcon: "sap-icon://pending", accrued: "85,000", adjustments: "0", adjustmentState: "None", amount: "85,000", dueDate: "15-Apr-2025" },
                    { id: "STL-2025-Q1-003", period: "2025-Q1", partner: "LMN Dist", agreement: "AGR-004", statusText: "Approved", statusState: "Success", statusIcon: "sap-icon://accept", accrued: "2,40,000", adjustments: "-15,000", adjustmentState: "Error", amount: "2,25,000", dueDate: "15-Apr-2025" }
                ]
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },

        // Navigation
        onNavToDetail: function (oEvent) {;

            this.getOwnerComponent()
                .getRouter()
                .navTo("SettlementWorkbenchDetail", {
                    runId: "1"
                });
        },

        onNavBack: function () {
            var oApp = this.byId("app") || sap.ui.getCore().byId("app");
            oApp.back();
        },

        // Dialog Handlers
        onOpenCreateDialog: function () {
            this._openDialog("CreateSettlement");
        },

        onOpenAdjustmentDialog: function () {
            this._openDialog("AddAdjustment");
        },

        onOpenApproveDialog: function () {
            this._openDialog("ApproveSettlement");
        },

        onOpenRejectDialog: function () {
            // Logic to open reject fragment would go here
            MessageToast.show("Reject Dialog Opening...");
        },

        _openDialog: function (sFragmentName) {
            var oView = this.getView();
            var sPath = "my.namespace.view.fragments." + sFragmentName;

            if (!this["p" + sFragmentName]) {
                this["p" + sFragmentName] = Fragment.load({
                    id: oView.getId(),
                    name: sPath,
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this["p" + sFragmentName].then(function (oDialog) {
                oDialog.open();
            });
        },

        onDialogClose: function (oEvent) {
            oEvent.getSource().getParent().close();
        },

        // Action Confirmations
        onCreateConfirm: function (oEvent) {
            oEvent.getSource().getParent().close();
            MessageToast.show("Settlement Created Successfully");
        },

        onAdjustmentConfirm: function (oEvent) {
            oEvent.getSource().getParent().close();
            MessageToast.show("Adjustment Added");
        },

        onApproveConfirm: function (oEvent) {
            oEvent.getSource().getParent().close();
            MessageToast.show("Settlement Approved");
        },

        onRefresh: function () {
            MessageToast.show("Data Refreshed");
        },

        onExport: function () {
            MessageToast.show("Export started");
        }
    });
});