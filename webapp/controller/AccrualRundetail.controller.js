sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";
    return Controller.extend("com.cy.rbm.controller.AccrualRundetail", {

        onInit() {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("AccrualRundetail")
                .attachPatternMatched(this._onMatched, this);
        },
        _onMatched: function (oEvent) {
            var sRunId = oEvent.getParameter("arguments").runId;
            var oMainModel = this.getOwnerComponent().getModel("accrualRunsModel");

            var oAgreement = oMainModel
                .getProperty("/accrualRuns")
                .find(a => a.runId === sRunId);

            if (oAgreement) {
                oMainModel.setProperty("/runDetail", oAgreement);
            }
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("accrualRuns");
        },
        onCancelRun: function () {
            this.onNavBack();
            MessageToast.show("Run cancelled successfully.");
        },
        /* ===================== */
        /* Currency Formatters   */
        /* ===================== */

        formatCurrency: function (vValue) {
            if (vValue === null || vValue === undefined || vValue === "") {
                return "-";
            }

            var oFormatter = new Intl.NumberFormat("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            return oFormatter.format(vValue);
        },

        formatCurrencyOrDash: function (vValue) {
            if (vValue === null || vValue === undefined) {
                return "-";
            }
            return this.formatCurrency(vValue);
        },

        /* ===================== */
        /* Number Formatters     */
        /* ===================== */

        formatNumber: function (vValue) {
            if (vValue === null || vValue === undefined) {
                return "-";
            }

            var oFormatter = new Intl.NumberFormat("en-IN");
            return oFormatter.format(vValue);
        },

        /* ===================== */
        /* Status / State Helpers*/
        /* ===================== */

        getRunStatusText: function (sStatus) {
            switch (sStatus) {
                case "P":
                    return "Processing";
                case "C":
                    return "Completed";
                case "F":
                    return "Failed";
                default:
                    return "Unknown";
            }
        },

        getRunStatusState: function (sStatus) {
            switch (sStatus) {
                case "P":
                    return "Information";
                case "C":
                    return "Success";
                case "F":
                    return "Error";
                default:
                    return "None";
            }
        },

        /* ===================== */
        /* Percentage Formatter  */
        /* ===================== */

        formatPercent: function (vValue) {
            if (vValue === null || vValue === undefined) {
                return "0%";
            }
            return vValue + "%";
        },

        /* ===================== */
        /* Date / Time Formatter */
        /* ===================== */

        formatDateTime: function (sDateTime) {
            if (!sDateTime) {
                return "-";
            }

            var oDate = new Date(sDateTime);

            return oDate.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
    });
});