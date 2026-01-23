sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.cy.rbm.controller.RebateAgreementDetails", {
        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("rebateDetails")
                .attachPatternMatched(this._onMatched, this);
        },

        _onMatched: function (oEvent) {
            var sAgreementNo = oEvent.getParameter("arguments").agreementNo;
            var oMainModel = this.getOwnerComponent().getModel("rebateModel");

            var oAgreement = oMainModel
                .getProperty("/agreements")
                .find(a => a.agreementNo === sAgreementNo);

            if (oAgreement) {
                this.getView().setModel(
                    new sap.ui.model.json.JSONModel(oAgreement),
                    "rebateModel"
                );
            }
        },
        onCloseDetails: function () {
            this.getOwnerComponent()
                .getRouter()
                .navTo("rebateList")
        }

    });
});