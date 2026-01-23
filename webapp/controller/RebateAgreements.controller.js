sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.cy.rbm.controller.RebateAgreements", {
        onInit() {
        },
        onOpenRebateDetails: function (oEvent) {
  var sAgreementNo = oEvent
    .getSource()
    .getBindingContext("rebateModel")
    .getProperty("agreementNo");

  this.getOwnerComponent()
    .getRouter()
    .navTo("rebateDetails", {
      agreementNo: sAgreementNo
    });
}

    });
});