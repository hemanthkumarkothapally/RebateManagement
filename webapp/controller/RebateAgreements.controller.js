sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "com/cy/rbm/controller/BaseController",
  "sap/m/MessageToast"
], (Controller, BaseController, MessageToast) => {
  "use strict";

  return BaseController.extend("com.cy.rbm.controller.RebateAgreements", {
    onInit() {
    },

    onSelectRuleType(oEvent) {
      var oHeader = oEvent.getSource();
      var sSelectedKey = oHeader.data("ruleKey");
      var oModel = this.getOwnerComponent().getModel("createAgreementModel");
      if (sSelectedKey) {
        oModel.setProperty("/type", sSelectedKey);
      }
      console.log(oModel.getProperty("/type", sSelectedKey))
    },
    onSaveRule: function () {
      var oModel = this.getOwnerComponent().getModel("createAgreementModel");

      // Get existing rules array (or empty array if null)
      var aRules = oModel.getProperty("/rules") || [];

      // Get the data from the dialog
      var nRule = oModel.getProperty("/newRule");

      // 1. Find the index of the rule with the same ruleId
      var iExistingIndex = aRules.findIndex(function (oRule) {
        // Ensure we are comparing valid IDs
        return oRule.ruleId && oRule.ruleId === nRule.ruleId;
      });

      if (iExistingIndex !== -1) {
        // --- UPDATE ---
        // Rule exists, replace it at the specific index
        aRules.splice(iExistingIndex, 1, nRule);
      } else {
        // --- CREATE ---
        // Rule ID doesn't exist, push as new

        // Optional: Generate a random ID if the user didn't provide one
        if (!nRule.ruleId) {
          nRule.ruleId = "R-" + new Date().getTime().toString().slice(-6);
        }

        aRules.push(nRule);
      }

      // 2. Update the model to refresh the UI
      oModel.setProperty("/rules", aRules);

      // 3. Close the dialog
      this.onCance();
    },


    onAddRule() {
      if (!this._AgreemenDialog) {
        this._AgreemenDialog = this.loadFragment("com.cy.rbm.view.ex")
      }
      var oModel = this.getOwnerComponent().getModel("createAgreementModel");
      oModel.setProperty("/newRule", {
        active: true,
        ruleId: null,
        ruleName: null,
        ruleType: null,
        calculationBasis: null,
        calcMethod: null,
        tierApp: null,
        tiers: [],
        selectedInclusions: [], // e.g., ["BEV", "SNK"]
        selectedExclusions: [],
        conditions: {
          minTransaction: null,
          minPeriodVolume: null,
          maxRebateAmount: null,
          maxRate: null,
          validityDate: null,
          paymentTerms: "ANY",
          excludeDiscounts: "NO"
        },
        rateSummary: "null"
      });

      console.log(oModel.getData());


      this._AgreemenDialog.then(function (oDialog) {
        oDialog.open();
      });
    },

    onDeleteRule(oEvent) {
      var oModel = this.getOwnerComponent().getModel("createAgreementModel");
      var aRule = oModel.getProperty("/rules");
      var oButton = oEvent.getSource();

      var oContext = oButton.getBindingContext("createAgreementModel");
      var sPath = oContext.getPath();

      var iIndex = parseInt(sPath.split("/").pop());

      aRule.splice(iIndex, 1);
      oModel.setProperty("/rules", aRule);
    },
    onEditRule(oEvent) {
      var oButton = oEvent.getSource();
      var oContext = oButton.getBindingContext("createAgreementModel");
      var sPath = oContext.getPath();

      var oSelectedRule = oContext.getObject();
      var iIndex = parseInt(sPath.split("/").pop());

      var oRuleData = JSON.parse(JSON.stringify(oSelectedRule));
      console.log(oRuleData)
      oRuleData._editingIndex = iIndex;
      var oDialogModel = this.getOwnerComponent().getModel("createAgreementModel");
      oDialogModel.setProperty("/newRule", oRuleData)
      var oNewRuleModel = this.getOwnerComponent().getModel("newRule");
      if (!oNewRuleModel) {
        oNewRuleModel = new sap.ui.model.json.JSONModel();
        this.getOwnerComponent().setModel(oNewRuleModel, "newRule");
      }
      oNewRuleModel.setData(oRuleData);
      if (!this._AgreemenDialog) {
        this._AgreemenDialog = this.loadFragment("com.cy.rbm.view.ex");
      }

      this._AgreemenDialog.then(function (oDialog) {
        oDialog.open();
      });
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
    },

    onAddTier() {
      var oModel = this.getOwnerComponent().getModel("createAgreementModel");
      var aTiers = oModel.getProperty("/newRule/tiers") || [];
      console.log("/newRule/tier", oModel.getProperty("/newRule/tiers"))
      var oNewTier = {
        from: null,
        to: null,
        rate: null,
        bonus: null
      };
      aTiers.push(oNewTier);
      oModel.setProperty("/newRule/tiers", aTiers);
      console.log("/newRule/tier", oModel.getProperty("/newRule/tiers"))
    },

    onDeleteTier: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel("createAgreementModel");
      var aTiers = oModel.getProperty("/newRule/tiers");
      var oItem = oEvent.getParameter("listItem");
      var sPath = oItem.getBindingContext("createAgreementModel").getPath();
      var iIndex = parseInt(sPath.split("/").pop());
      aTiers.splice(iIndex, 1);
      oModel.setProperty("/newRule/tiers", aTiers);
    },

    onCreateAggrement: function () {
      if (!this._AgreementDialog) {
        this._AgreementDialog = this.loadFragment("com.cy.rbm.view.CreateEditAgreement")
      }
      this.getOwnerComponent().getModel("createAgreementModel").setData({
        type: "TIERED",
        name: "",
        active: true,
        calcBasis: "NET",       // Keys: NET, GROSS, QTY, WEIGHT, CASES
        calcMethod: "PCT",      // Keys: PCT, FIXED_UNIT, FIXED_TXN, LUMP
        tierApp: 0,             // 0 = Retroactive, 1 = Prospective, 2 = Incremental
        rules: [
        ],
        // 3️⃣ Tiers (Initialize with one empty row for better UX)
        tiers: [
        ],
        currency: "INR",        // For input descriptions

        // 4️⃣ Eligibility (For MultiComboBox selectedKeys)
        selectedInclusions: [], // e.g., ["BEV", "SNK"]
        selectedExclusions: [],

        // 5️⃣ Conditions & Limits
        conditions: {
          minTransaction: null,
          minPeriodVolume: null,
          maxRebateAmount: null,
          maxRate: null,
          validityDate: null,
          paymentTerms: "ANY",
          excludeDiscounts: "NO"
        }
      });
      console.log(this.getOwnerComponent().getModel("createAgreementModel").getData())
      this._AgreementDialog.then(function (oDialog) {
        oDialog.open();
      });
    },
    onCancel: function () {

      this._AgreementDialog.then(function (oDialog) {
        oDialog.close();
      });
    },
    onSave(){
      this._AgreementDialog.then(function (oDialog) {
        oDialog.close();
      });
      MessageToast.show("Agreement Saved");
    },
    onSaveDraft(){
      this._AgreementDialog.then(function (oDialog) {
        oDialog.close();
      });
      MessageToast.show("Draft Saved");
    },
    onCance: function () {

      this._AgreemenDialog.then(function (oDialog) {
        oDialog.close();
      });
    }

  });
});