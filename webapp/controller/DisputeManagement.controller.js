sap.ui.define([
    "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast"

], (Controller,MessageToast) => {
    return Controller.extend("com.cy.rbm.controller.DisputeManagement", {

        onCreateDMDialog: function () {
            var oView = this.getView();

            if (!this._oCreateDialog) {
                this._oCreateDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "com.cy.rbm.view.CreateNewDispute",
                    this
                );
                oView.addDependent(this._oCreateDialog);
            }

            this._oCreateDialog.open();
        },
        onCancelCreateDispute: function () {
            this._oCreateDialog.close();
        },
        onConfirmCreateDispute: function () {
            
            let msg = 'Dispute Created Successfully..';
            MessageToast.show(msg);
            this._oCreateDialog.close();
        },
        onNavToDMDDetail: function (oEvent) {
            let selectedId = oEvent.getSource().getBindingContext("disputeManagementModel").getObject().disputeId;
            this.getOwnerComponent()
                .getRouter()
                .navTo("DisputeManagementDetails",{disputeId:selectedId});

        },

    })
})