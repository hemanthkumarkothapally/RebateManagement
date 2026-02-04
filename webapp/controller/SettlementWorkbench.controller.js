sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "com/cy/rbm/controller/BaseController",

    "sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, BaseController, Fragment) {
    "use strict";

    return BaseController.extend("com.cy.rbm.controller.SettlementWorkbench", {

        onInit: function () {
            // Mock Data
            // var oData = {
            //     settlements: [
            //         { id: "STL-2025-Q1-001", period: "2025-Q1", partner: "ABC Retail", agreement: "AGR-001", statusText: "Pending", statusState: "Warning", statusIcon: "sap-icon://pending", accrued: "1,00,000", adjustments: "+56,000", adjustmentState: "Success", amount: "1,56,000", dueDate: "15-Apr-2025", e: true, a: true, p: false, c: false, r: false },
            //         { id: "STL-2025-Q1-002", period: "2025-Q1", partner: "XYZ Stores", agreement: "AGR-002", statusText: "Pending", statusState: "Warning", statusIcon: "sap-icon://pending", accrued: "85,000", adjustments: "0", adjustmentState: "None", amount: "85,000", dueDate: "15-Apr-2025", e: true, a: true, p: false, c: false, r: false },
            //         { id: "STL-2025-Q1-003", period: "2025-Q1", partner: "LMN Dist", agreement: "AGR-004", statusText: "Approved", statusState: "Success", statusIcon: "sap-icon://accept", accrued: "2,40,000", adjustments: "-15,000", adjustmentState: "Error", amount: "2,25,000", dueDate: "15-Apr-2025", e: true, a: false, p: true, c: false, r: false },
            //         { id: "STL-2025-Q1-004", period: "2025-Q1", partner: "Global Corp", agreement: "AGR-005", statusText: "Rejected", statusState: "Error", statusIcon: "sap-icon://decline", accrued: "50,000", adjustments: "-5,000", adjustmentState: "Error", amount: "45,000", dueDate: "20-Apr-2025", e: true, a: false, p: false, c: false, r: true },
            //         { id: "STL-2025-Q1-005", period: "2025-Q1", partner: "Sunrise Ltd", agreement: "AGR-008", statusText: "Posted", statusState: "Information", statusIcon: "sap-icon://upload", accrued: "3,20,000", adjustments: "+12,500", adjustmentState: "Success", amount: "3,32,500", dueDate: "10-Apr-2025", e: true, a: false, p: false, c: true, r: false },
            //         { id: "STL-2025-Q1-006", period: "2025-Q1",
            //             partner: "Jupiter Retail",
            //             agreement: "AGR-009",
            //             statusText: "Pending",
            //             statusState: "Warning",
            //             statusIcon: "sap-icon://pending",
            //             accrued: "1,20,000",
            //             adjustments: "0",
            //             adjustmentState: "None",
            //             amount: "1,20,000",
            //             dueDate: "25-Apr-2025",
            //             e: true, a: true, p: false, c: false, r: false
            //         },
            //         {
            //             id: "STL-2025-Q1-007",
            //             period: "2025-Q1",
            //             partner: "Titan Supply",
            //             agreement: "AGR-012",
            //             statusText: "Pending",
            //             statusState: "Warning",
            //             statusIcon: "sap-icon://pending",
            //             accrued: "95,000",
            //             adjustments: "+5,000",
            //             adjustmentState: "Success",
            //             amount: "1,00,000",
            //             dueDate: "28-Apr-2025",
            //             e: true, a: true, p: false, c: false, r: false
            //         },
            //         {
            //             id: "STL-2025-Q1-008",
            //             period: "2025-Q1",
            //             partner: "Apex Logistics",
            //             agreement: "AGR-015",
            //             statusText: "Approved",
            //             statusState: "Success",
            //             statusIcon: "sap-icon://accept",
            //             accrued: "38,50,000",
            //             adjustments: "+1,52,500",
            //             adjustmentState: "Success",
            //             amount: "40,02,500",
            //             dueDate: "05-May-2025",
            //             e: true, a: false, p: true, c: false, r: false
            //         }
            //     ]
            // };
            // var oModel = new JSONModel(oData);
            // this.getView().setModel(oModel);
        },

        // Navigation
        onNavToDetail: function (oEvent) {
            var oItem = oEvent.getSource();
            var sSelectedId = oItem.getBindingContext("settlement").getProperty("id");
            MessageToast.show(`Opening View of ${sSelectedId}`);

            this.getOwnerComponent()
                .getRouter()
                .navTo("SettlementWorkbenchDetail", {
                    setId: sSelectedId
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

        onBulkApprove() {
            MessageToast.show("✓ Bulk approval initiated");
        },

        onRefresh: function () {
            MessageToast.show("Data Refreshed");
        },

        onExport: function () {
            MessageToast.show("Export started");
        },
        onReview: function () {
            MessageToast.show("Review Button Pressed");
        },
        onPayment: function () {
            MessageToast.show("Payment Button Pressed");
        },

        // ScheduleSettlement
        onOpenScheduleSettlementDialog() {
            if (!this._ScheduleSettlementDialog) {
                this._ScheduleSettlementDialog = this.loadFragment("com.cy.rbm.view.settlementFragments.ScheduleSettlement")
            }
            this._ScheduleSettlementDialog.then(function (oDialog) {
                var oNewRuleModel = new sap.ui.model.json.JSONModel({
                    period: null
                });

                oDialog.setModel(oNewRuleModel, "newRule");

                // 3. Open the Dialog
                oDialog.open();
            }.bind(this));
        },
        onCloseScheduleSettlementDialog: function () {
            this._ScheduleSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onSaveScheduleSettlement() {
            this._ScheduleSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
            MessageToast.show("✓ Settlement run scheduled");
        },

        // CreateSettlement
        onOpenCreateSettlementDialog() {
            if (!this._CreateSettlementDialog) {
                this._CreateSettlementDialog = this.loadFragment("com.cy.rbm.view.settlementFragments.CreateSettlement")
            }
            this._CreateSettlementDialog.then(function (oDialog) {
                var oNewRuleModel = new sap.ui.model.json.JSONModel({
                    Agreement: null,
                    Period: null,
                    DueDate: null,
                });

                oDialog.setModel(oNewRuleModel, "newRule");

                // 3. Open the Dialog
                oDialog.open();
            }.bind(this));
        },
        
        onCloseCreateSettlementDialog: function () {

            this._CreateSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onSaveCreateSettlement() {
            this._CreateSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
            MessageToast.show("✓ Settlement created successfully");

        },

        // PostSettlementDialog
        onOpenPostSettlementDialog() {
            if (!this._PostSettlementDialog) {
                this._PostSettlementDialog = this.loadFragment("com.cy.rbm.view.settlementFragments.PostSettlement")
            }
            this._PostSettlementDialog.then(function (oDialog) {
                var oNewRuleModel = new sap.ui.model.json.JSONModel({
                    Agreement: null
                });

                oDialog.setModel(oNewRuleModel, "newRule");

                // 3. Open the Dialog
                oDialog.open();
            }.bind(this));
        },
        onClosePostSettlementDialog: function () {

            this._PostSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onSavePostSettlement() {
            this._PostSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
            MessageToast.show("✓ Settlement posted to FI - Document #1000005678 created");

        },

        // ApproveSettlement
        onOpenApproveSettlementDialog() {
            if (!this._ApproveSettlementDialog) {
                this._ApproveSettlementDialog = this.loadFragment("com.cy.rbm.view.settlementFragments.ApproveSettlement")
            }
            this._ApproveSettlementDialog.then(function (oDialog) {
                var oNewRuleModel = new sap.ui.model.json.JSONModel({
                    Agreement: false
                });

                oDialog.setModel(oNewRuleModel, "newRule");

                // 3. Open the Dialog
                oDialog.open();
            }.bind(this));
        },
        onCloseApproveSettlementDialog: function () {

            this._ApproveSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onSaveApproveSettlement() {
            this._ApproveSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
            MessageToast.show("✓ Settlement approved successfully");

        },

    });
});