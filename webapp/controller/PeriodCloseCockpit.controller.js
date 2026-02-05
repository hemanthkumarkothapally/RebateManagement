sap.ui.define([
    "com/cy/rbm/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("com.cy.rbm.controller.PeriodCloseCockpit", {
        onInit: function () {
            // const oData = {
            //     periods: [
            //         { key: "2025-03", name: "March 2025", readiness: 70, status: "Open", statusState: "Information" },
            //         { key: "2025-02", name: "February 2025", readiness: 100, status: "Soft Close", statusState: "Warning" }
            //     ],
            //     selectedPeriod: {},
                
            // };
            
            // const oModel = new JSONModel(oData);
            // this.getView().setModel(oModel);
            // this._updateSelection("2025-03");
        },

        onPeriodChange: function (oEvent) {
            const sKey = oEvent.getParameter("selectedItem").getKey();
            this._updateSelection(sKey);
            MessageToast.show("Switched to " + sKey);
        },

        _updateSelection: function (sKey) {
            const aPeriods = this.getOwnerComponent().getModel("PeriodCloseCockpit").getProperty("/period_summaries");
            const oMatch = aPeriods.find(p => p.period_id === sKey);
            this.getOwnerComponent().getModel("PeriodCloseCockpit").setProperty("/current_period_summary", oMatch);
        },

        onOpenSoftClose: function () {
            MessageBox.warning("Soft Close will prevent new transactions. Proceed?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        this.getView().getModel().setProperty("/selectedPeriod/status", "Soft Close");
                        this.getView().getModel().setProperty("/selectedPeriod/statusState", "Warning");
                        MessageToast.show("Period Soft Closed");
                    }
                }
            });
        },

        onOpenSoftClose() {
            if (!this._SoftCloseDialog) {
                this._SoftCloseDialog = this.loadFragment("com.cy.rbm.view.PeriodFragments.SoftCloseDialog")
            }
            this._SoftCloseDialog.then(function (oDialog) {
                var oNewRuleModel = new sap.ui.model.json.JSONModel({
                    Agreement: false
                });

                oDialog.setModel(oNewRuleModel, "newRule");

                // 3. Open the Dialog
                oDialog.open();
            }.bind(this));
        },
        onCloseSoftCloseDialog: function () {

            this._SoftCloseDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onConfirmSoftClose() {
            this._SoftCloseDialog.then(function (oDialog) {
                oDialog.close();
            });
            const dif = this.getOwnerComponent().getModel("PeriodCloseCockpit").getProperty("/current_period_summary/comparison_vs_prior/accruals_change_percent");
            const percent = this.getOwnerComponent().getModel("PeriodCloseCockpit").getProperty("/current_period_summary/readiness_percent");
            console.log(dif)
            console.log(percent)
            this.getOwnerComponent().getModel("PeriodCloseCockpit").setProperty("/current_period_summary/comparison_vs_prior/accruals_change_percent", 0);
            this.getOwnerComponent().getModel("PeriodCloseCockpit").setProperty("/current_period_summary/readiness_percent", percent+dif*10);
            MessageToast.show("Soft Close initiated");

        },


        onOpenHardClose() {
            if (!this._HardCloseDialog) {
                this._HardCloseDialog = this.loadFragment("com.cy.rbm.view.PeriodFragments.HardCloseDialog")
            }
            this._HardCloseDialog.then(function (oDialog) {
                var oNewRuleModel = new sap.ui.model.json.JSONModel({
                    Agreement: false
                });

                oDialog.setModel(oNewRuleModel, "newRule");

                // 3. Open the Dialog
                oDialog.open();
            }.bind(this));
        },
        onCloseHardCloseDialog: function () {

            this._HardCloseDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onConfirmHardClose() {
            this._HardCloseDialog.then(function (oDialog) {
                oDialog.close();
            });
            const dif = this.getOwnerComponent().getModel("PeriodCloseCockpit").getProperty("/current_period_summary/comparison_vs_prior/disputes_change_percent");
            const percent = this.getOwnerComponent().getModel("PeriodCloseCockpit").getProperty("/current_period_summary/readiness_percent");
            console.log(dif)
            console.log(percent)
            this.getOwnerComponent().getModel("PeriodCloseCockpit").setProperty("/current_period_summary/comparison_vs_prior/disputes_change_percent", 0);
            this.getOwnerComponent().getModel("PeriodCloseCockpit").setProperty("/current_period_summary/readiness_percent", percent+dif*10);
            
            MessageToast.show("Hard Close executed - Period is now locked");

        },

        onRefresh: function () {
            MessageToast.show("Data Refreshed");
        }
    });
});