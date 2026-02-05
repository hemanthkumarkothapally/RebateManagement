sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format"
], (Controller, JSONModel, MessageToast, ChartFormatter, Format) => {
    "use strict";

    return Controller.extend("com.cy.rbm.controller.Dashboard", {
        
        onInit() {
            Format.numericFormatter(ChartFormatter.getInstance());

    // 2. Define the "Clean Look" properties
    var oCleanProperties = {
        plotArea: {
            dataLabel: { visible: false } // Hides the numbers on the bars/lines
        },
        title: { visible: false },        // Hides the internal chart title
        valueAxis: { title: { visible: false } }, // Hides "Accrued", "Value", etc.
        categoryAxis: { title: { visible: false } } // Hides "Month", "Partner", etc.
    };

    // 3. List of all Chart IDs from your XML
    var aChartIds = ["vizTrend", "vizDonut", "vizTop5", "vizAS"];

    // 4. Loop through and apply properties to each chart
    aChartIds.forEach(function(sId) {
        var oVizFrame = this.getView().byId(sId);
        
        // Check if chart exists (important if using Fragments)
        if (oVizFrame) {
            oVizFrame.setVizProperties(oCleanProperties);
            
            // Special tweak for Donut Chart (Optional: Donut usually looks better with labels)
            if (sId === "vizDonut") {
                 oVizFrame.setVizProperties({
                    plotArea: { dataLabel: { visible: true } } // Turn labels BACK ON for donut only
                 });
            }
        }
    }.bind(this));
        },

        onPeriodChange: function(oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            this._switchPeriod(sKey);
        },

        onTimelinePress: function(oEvent) {
            // CRITICAL CHANGE: Get context from named model "dashboard"
            var oCtx = oEvent.getSource().getBindingContext("dashboard");
            
            if (!oCtx) {
                return; // Safety check
            }

            var sLabel = oCtx.getProperty("label");
            
            // Map simple label "Mar 25" to full key "March 2025" for logic
            var sFullKey = sLabel === "Mar 25" ? "March 2025" : "February 2025";
            this._switchPeriod(sFullKey);
        },

        _switchPeriod: function(sPeriod) {
            // CRITICAL CHANGE: Get the specific "dashboard" model
            var oModel = this.getView().getModel("dashboard");
            
            if (sPeriod === "March 2025") {
                oModel.setProperty("/period/current", "March 2025");
                oModel.setProperty("/period/status", "OPEN");
                oModel.setProperty("/period/statusState", "Success");
                oModel.setProperty("/period/actionsEnabled", true);
                
                // Update specific Timeline UI visual selection
                var aTimeline = oModel.getProperty("/timeline");
                aTimeline.forEach(t => t.selected = (t.label === "Mar 25"));
                oModel.setProperty("/timeline", aTimeline);

                MessageToast.show("Switched to March 2025 (Open)");
            } else {
                // Simulate switching to a closed period
                oModel.setProperty("/period/current", sPeriod);
                oModel.setProperty("/period/status", "CLOSED");
                oModel.setProperty("/period/statusState", "Error"); 
                oModel.setProperty("/period/actionsEnabled", false);

                // Update Timeline
                var aTimeline = oModel.getProperty("/timeline");
                aTimeline.forEach(t => t.selected = false);
                oModel.setProperty("/timeline", aTimeline);

                MessageToast.show("Switched to " + sPeriod + " (ReadOnly)");
            }
        },
        onAccrualTrendPress: function(oEvent) {
            sap.m.MessageToast.show("Opening Accrual Trend Details...");
        },

        // 2. Header Press: Agreement Status
        onAgreementStatusPress: function(oEvent) {
            sap.m.MessageToast.show("Opening Agreement Status Report...");
        },

        // 3. Header Press: Top Partners
        onTopPartnersPress: function(oEvent) {
            sap.m.MessageToast.show("Opening Partner Performance...");
        },

        // 4. Header Press: Accrual vs Settlement
        onAccrualSettlementPress: function(oEvent) {
            sap.m.MessageToast.show("Opening Settlement Gap Analysis...");
        },

        onMyTasks(){
            sap.m.MessageToast.show("Opening My Tasks...");
        },
        onPressCalander(){
            sap.m.MessageToast.show("Opening Calander...");
        },
        onRecentActivity(){
            sap.m.MessageToast.show("Opening All Activities...");
        },

        // Function 1: Total Accrued
        onAccruedPress: function() {
            this.getOwnerComponent()
                .getRouter()
                .navTo("accrualRuns");
        },

        // Function 2: Pending Settlement
        onSettlementPress: function() {
            this.getOwnerComponent()
                .getRouter()
                .navTo("SettlementWorkbench");
        },

        // Function 3: Open Disputes
        onDisputesPress: function() {
            this.getOwnerComponent()
                .getRouter()
                .navTo("DisputeManagement");
        },

        // Function 4: Active Agreements
        onAgreementsPress: function() {
            this.getOwnerComponent()
                .getRouter()
                .navTo("rebateTransaction");
        },

        onActionPress: function(oEvent) {
            // CRITICAL CHANGE: Get property from named model "dashboard"
            var bEnabled = this.getView().getModel("dashboard").getProperty("/period/actionsEnabled");
            
            if(bEnabled) {
                var sAction = oEvent.getSource().getHeader();
                var a = "accrualRuns";
                
                if(sAction == "Close Period"){
                    a = "PeriodCloseCockpit";
                }
                if(sAction == "Settlements"){
                    a = "SettlementWorkbench";
                }
                this.getOwnerComponent()
                .getRouter()
                .navTo(a);
                MessageToast.show("Action triggered: " + sAction);
            }
        },

        onNotificationsPress: function(oEvent) {
            var oButton = oEvent.getSource();
            MessageToast.show("Notifications clicked");
        }
    });
});