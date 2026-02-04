sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "com/cy/rbm/controller/BaseController",
    "sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, Fragment, MessageToast, History, BaseController, DateFormat) {
    "use strict";

    return BaseController.extend("com.cy.rbm.controller.SettlementWorkbenchDetail", {

        onInit: function () {
            // 1. Initialize Mock Data matching the XML bindings
            // var oData = {

            //     history: [
            //         { dateTime: "01/04/2025 10:30", title: "Settlement Created", user: "Rahul Kumar", icon: "sap-icon://create", status: "Success" },
            //         { dateTime: "03/04/2025", title: "Adjustments Added", user: "Priya Sharma", icon: "sap-icon://edit", status: "Success" },
            //         { dateTime: "05/04/2025 14:22", title: "Submitted for Approval", user: "Rahul Kumar", icon: "sap-icon://paper-plane", status: "Success" },
            //         { dateTime: "Pending", title: "Pending Finance Manager Approval", user: "Finance Manager", icon: "sap-icon://pending", status: "Warning" }
            //     ],

            // };

            // var oModel = new JSONModel(oData);
            // this.getView().setModel(oModel, "detailModel");

            var oRouter = this.getOwnerComponent().getRouter();
            // Attach to the route matched event
            oRouter.getRoute("SettlementWorkbenchDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sSetId = oEvent.getParameter("arguments").setId;
            console.log(sSetId, this._getRecordIndex(sSetId))
            var oView = this.getView();

            oView.bindElement({
                path: "/settlements/" + this._getRecordIndex(sSetId),
                model: "settlement"
            });
        },

        _getRecordIndex: function (sId) {
            // Helper to find the array index based on the STL ID
            var aData = this.getView().getModel("settlement").getProperty("/settlements");
            return aData.findIndex(function (item) {
                return item.id === sId;
            });
        },

        /* =========================================================== */
        /* Navigation                                                  */
        /* =========================================================== */

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("listView", {}, true);
            }
        },

        /* =========================================================== */
        /* Dialog Management (Open/Close)                              */
        /* =========================================================== */

        _openDialog: function (sFragmentName) {
            var oView = this.getView();
            var sPath = "my.namespace.view.fragments." + sFragmentName;

            // Lazy loading of fragments
            if (!this["p" + sFragmentName]) {
                this["p" + sFragmentName] = Fragment.load({
                    id: oView.getId(),
                    name: sPath,
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    // Ensure the dialog has access to the detail model
                    oDialog.setModel(oView.getModel("detailModel"), "detailModel");
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

        /* =========================================================== */
        /* Actions: Adjustments                                        */
        /* =========================================================== */

        onOpenAdjustmentDialog: function () {
            // Reset form data before opening
            var oModel = this.getView().getModel("detailModel");
            oModel.setProperty("/forms/newAdjustment", {
                type: "Retroactive Rate Correction",
                amount: "",
                direction: "inc",
                reason: ""
            });
            this._openDialog("AddAdjustment");
        },

        onAdjustmentConfirm: function () {
            var oModel = this.getView().getModel("detailModel");
            var oFormData = oModel.getProperty("/forms/newAdjustment");

            // Simple validation
            if (!oFormData.amount || !oFormData.reason) {
                MessageToast.show("Please fill in Amount and Reason.");
                return;
            }

            // Create new entry
            var oNewEntry = {
                type: oFormData.type,
                reason: oFormData.reason,
                date: DateFormat.getDateInstance({ pattern: "dd-MMM-yyyy" }).format(new Date()),
                amount: oFormData.amount, // In real app, format currency properly
                state: "Success"
            };

            // Update Model (add to list)
            var aAdjustments = oModel.getProperty("/adjustments");
            aAdjustments.push(oNewEntry);
            oModel.setProperty("/adjustments", aAdjustments);

            // Update Reconciliation totals (Mock calculation)
            var iCurrentAdj = parseInt(oModel.getProperty("/reconciliation/adjustments").replace(/,/g, ""));
            var iNewAdj = parseInt(oFormData.amount);
            var iTotal = iCurrentAdj + iNewAdj;
            oModel.setProperty("/reconciliation/adjustments", iTotal.toLocaleString());

            // Close and Toast
            this.byId("addAdjustmentDialog").close(); // Assuming ID in fragment, or use helper
            // Note: If using the generic _openDialog helper, use:
            this.pAddAdjustment.then(function (oDialog) { oDialog.close(); });

            MessageToast.show("Adjustment added successfully.");
        },

        /* =========================================================== */
        /* Actions: Approval                                           */
        /* =========================================================== */

        onOpenApproveDialog: function () {
            this.getView().getModel("detailModel").setProperty("/forms/approvalConfirmed", false);
            this._openDialog("ApproveSettlement");
        },

        onApproveConfirm: function () {
            var oModel = this.getView().getModel("detailModel");

            // Update Status in Header
            oModel.setProperty("/header/status", "Approved");
            oModel.setProperty("/header/statusState", "Success");
            oModel.setProperty("/header/statusIcon", "sap-icon://accept");

            // Update Timeline
            var aHistory = oModel.getProperty("/history");
            // Remove 'Pending' item
            aHistory.pop();
            // Add 'Approved' item
            aHistory.push({
                dateTime: DateFormat.getDateTimeInstance().format(new Date()),
                title: "Approved by Finance Manager",
                user: "Finance Manager",
                icon: "sap-icon://accept",
                status: "Success"
            });
            // Add 'Post' pending step
            aHistory.push({
                dateTime: "Pending",
                title: "Posting to SAP FI",
                user: "System",
                icon: "sap-icon://upload-to-cloud",
                status: "None"
            });
            oModel.setProperty("/history", aHistory);

            // Close
            this.pApproveSettlement.then(function (oDialog) { oDialog.close(); });
            MessageToast.show("Settlement Approved for Payment.");
        },

        /* =========================================================== */
        /* Actions: Rejection                                          */
        /* =========================================================== */

        onOpenRejectDialog: function () {
            var oModel = this.getView().getModel("detailModel");
            oModel.setProperty("/forms/rejection", { reason: "", comments: "" });
            this._openDialog("RejectSettlement"); // You need to create this fragment similarly
        },

        onRejectConfirm: function () {
            var oModel = this.getView().getModel("detailModel");

            // Update Status
            oModel.setProperty("/header/status", "Rejected");
            oModel.setProperty("/header/statusState", "Error");
            oModel.setProperty("/header/statusIcon", "sap-icon://decline");

            // Close
            // this.pRejectSettlement.then(function(oDialog){ oDialog.close(); });
            MessageToast.show("Settlement Rejected.");
        },

        // OpenAdjustment
        onOpenAdjustmentDialog() {
            if (!this._AdjustmentDialog) {
                this._AdjustmentDialog = this.loadFragment("com.cy.rbm.view.settlementFragments.AddAdjustment")
            }
            this._AdjustmentDialog.then(function (oDialog) {
                
                var oNewRuleModel = new sap.ui.model.json.JSONModel({
                    Adjustment: null,
                    Amount:null,
                    Reason:null
                });

                oDialog.setModel(oNewRuleModel, "newRule");

                // 3. Open the Dialog
                oDialog.open();
            }.bind(this));
        },
        onCloseAdjustmentDialog: function () {

            this._AdjustmentDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onSaveAdjustment() {
            this._AdjustmentDialog.then(function (oDialog) {
                oDialog.close();
            });
            MessageToast.show("Adjustment Saved");
        },
        onSaveDraft() {
            this._AgreementDialog.then(function (oDialog) {
                oDialog.close();
            });
            MessageToast.show("Draft Saved");
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

        // RejectSettlement
        onOpenRejectSettlementDialog() {
            if (!this._RejectSettlementDialog) {
                this._RejectSettlementDialog = this.loadFragment("com.cy.rbm.view.settlementFragments.RejectSettlement")
            }
            this._RejectSettlementDialog.then(function (oDialog) {
                
                var oNewRuleModel = new sap.ui.model.json.JSONModel({
                    Reason: null,
                    Comments:null
                });

                oDialog.setModel(oNewRuleModel, "newRule");

                // 3. Open the Dialog
                oDialog.open();
            }.bind(this));
        },
        onCloseRejectSettlementDialog: function () {

            this._RejectSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onSaveRejectSettlement() {
            this._RejectSettlementDialog.then(function (oDialog) {
                oDialog.close();
            });
            MessageToast.show("✗ Settlement rejected and sent back for revision");

        },

        formatAvatarColor: function (sStatus) {
            switch (sStatus) {
                case "Approved":
                    return "Accent8"; // Green (Success)
                case "Pending":
                    return "Accent1"; // Purple/Blue (Warning-ish)
                case "Rejected":
                    return "Accent2"; // Red (Error)
                case "Posted":
                    return "Accent5"; // Light Blue (Information)
                default:
                    return "Accent6"; // Grey (Default)
            }
        }


    });
});