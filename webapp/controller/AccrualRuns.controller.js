sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";
    return Controller.extend("com.cy.rbm.controller.AccrualRuns", {
       
        onInit() {

        },

         onScheduleNewRun: function () {
            if (!this._oScheduleDialog) {
                this._oScheduleDialog = sap.ui.xmlfragment(
                    "com.cy.rbm.view.Schedulerundialog",
                    this
                );
                this.getView().addDependent(this._oScheduleDialog);
            }
            this._oScheduleDialog.open();
        },
        
        onReprocessPeriod: function () {
            if (!this._oReprocessDialog) {
                this._oReprocessDialog = sap.ui.xmlfragment(
                    "com.cy.rbm.view.Reprocessdialog",
                    this
                );
                this.getView().addDependent(this._oReprocessDialog);
            }
            this._oReprocessDialog.open();
        },
        
        onScheduleRun: function () {
            MessageToast.show("Accrual run scheduled successfully");
            if (this._oScheduleDialog) {
                this._oScheduleDialog.close();
            }
        },
        
        onCancelSchedule: function () {
            if (this._oScheduleDialog) {
                this._oScheduleDialog.close();
            }
        },
        
        onStartReprocess: function () {
            MessageToast.show("Reprocessing started");
            if (this._oReprocessDialog) {
                this._oReprocessDialog.close();
            }
        },
        
        onCancelReprocess: function () {
            if (this._oReprocessDialog) {
                this._oReprocessDialog.close();
            }
        },
        
        onExport: function () {
            MessageToast.show("Export functionality");
        },
        
        onRefresh: function () {
            MessageToast.show("Data refreshed");
        },
        
        onSelectionChange: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            if (oItem) {
                MessageToast.show("Selected: " + oItem.getBindingContext("accrualRunsModel").getProperty("runId"));
            }
        },
        
        onItemPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("accrualRunsModel");
            var sRunId = oContext.getProperty("runId");
            MessageToast.show("Navigate to: " + sRunId);
            // In real app: navigate to detail view
            var oRouter = this.getOwnerComponent().getRouter();;
            oRouter.navTo("AccrualRundetail", { runId: sRunId });
        },
        
        onRunIdPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("accrualRunsModel");
            var sRunId = oContext.getProperty("runId");
            MessageToast.show("Navigate to run detail: " + sRunId);
        },
        
        onPeriodChange: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            MessageToast.show("Period filter changed to: " + sKey);
        },
        
        onStatusChange: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            MessageToast.show("Status filter changed to: " + sKey);
        },
        
        onTypeChange: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            MessageToast.show("Type filter changed to: " + sKey);
        },
        
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            MessageToast.show("Searching for: " + sQuery);
        },
        
        onNext: function () {
            MessageToast.show("Navigate to next page");
        },
        
        onScopeChange: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            MessageToast.show("Reprocess scope changed to: " + sKey);
        },
        
        onDialogClose: function () {
            // Clean up if needed
        }
    });
});