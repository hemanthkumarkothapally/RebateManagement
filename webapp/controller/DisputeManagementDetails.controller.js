sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    return Controller.extend("com.cy.rbm.controller.DisputeManagementDetails", {
        onInit: function () {

            var oRouter = this.getOwnerComponent().getRouter();
            // Attach to the route matched event
            oRouter.getRoute("DisputeManagementDetails").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sDisputeId = oEvent.getParameter("arguments").disputeId;
            // console.log(sSetId, this._getRecordIndex(sSetId))
            console.log(sDisputeId)
            var oView = this.getView();
            // 1️⃣ Get the model
            var oModel = oView.getModel("disputeManagementModel");

            // 2️⃣ Get disputes array
            var aDisputes = oModel.getProperty("/disputes");

            // 3️⃣ Find the matching object
            var oDispute = aDisputes.find(function (oItem) {
                return oItem.disputeId === sDisputeId;
            });

            console.log("Matched Dispute Object:", oDispute);

            // 4️⃣ Optional: bind object to view (detail page)
            if (oDispute) {
                var oDetailModel = new sap.ui.model.json.JSONModel(oDispute);
                oView.setModel(oDetailModel, "detail");
            }

        },


    })
})