sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("com.cy.rbm.controller.App", {
    onInit() {
    },
    onSideNavButtonPress: function () {
      var oToolPage = this.byId("toolPage");
      var bSideExpanded = oToolPage.getSideExpanded();

      // this._setToggleButtonTooltip(bSideExpanded);

      oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
    },
    onItemSelect: function (oEvent) {
      var oItem = oEvent.getParameter("item");
      // this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
      var oRouter = this.getOwnerComponent().getRouter();

      if (oItem.getKey() === "pageRebateTransactionManagement") {
        oRouter.navTo("rebateTransaction");
      }
      if (oItem.getKey() === "pageDashboard") {
        oRouter.navTo("RouteDashboard");
      }
      if (oItem.getKey() === "pageRebateAgreements") {
        oRouter.navTo("rebateList");
      }
      if (oItem.getKey() === "pageAccrualRuns") {
        oRouter.navTo("accrualRuns");
      }
      if (oItem.getKey() === "pageSettlementWorkbench") {
        oRouter.navTo("SettlementWorkbench");
      }
      if (oItem.getKey() === "pagePeriodCloseCockpit") {
        oRouter.navTo("PeriodCloseCockpit");
      }
    }
  });
});