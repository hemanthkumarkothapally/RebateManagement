sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
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

        onClickEscalate: function (oEvent) {
            let msg = 'Escalating...';
            MessageToast.show(msg);
        },

        onDownload:function (oEvent) {
            let msg = 'File Downloaded Successfully..';
            MessageToast.show(msg);
        },

        onClickReassignDM: function () {
            var oView = this.getView();

            if (!this._oCreateDialog) {
                this._oCreateDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "com.cy.rbm.view.ReassignDM",
                    this
                );
                oView.addDependent(this._oCreateDialog);
            }

            this._oCreateDialog.open();
        },

        onCloseReassignDM: function () {
            this._oCreateDialog.close();
        },

        onClickResolveaDM: function () {
            var oView = this.getView();

            if (!this._oCcreateDialog) {
                this._oCcreateDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "com.cy.rbm.view.ResolveDispute",
                    this
                );
                oView.addDependent(this._oCcreateDialog);
            }

            this._oCcreateDialog.open();
        },
        onCloseResolveDM: function () {
            this._oCcreateDialog.close();
        },
        onClickRejectDM: function () {
            var oView = this.getView();

            if (!this._oCreateDialogg) {
                this._oCreateDialogg = sap.ui.xmlfragment(
                    oView.getId(),
                    "com.cy.rbm.view.RejectDispute",
                    this
                );
                oView.addDependent(this._oCreateDialogg);
            }

            this._oCreateDialogg.open();
        },
        onCloseRejectDM: function () {
            this._oCreateDialogg.close();
        },
        onReassigntDispute:function(){
              let msg = 'Reassigned Successfully..';
            MessageToast.show(msg);
            this.onCloseReassignDM();
        },
         onResolveDispute:function(){
              let msg = 'Resolved Successfully..';
            MessageToast.show(msg);
            this.onCloseResolveDM();
        },
          onRejectDispute:function(){
              let msg = 'Rejected Successfully..';
            MessageToast.show(msg);
            this.onCloseRejectDM();
        }






    })
})