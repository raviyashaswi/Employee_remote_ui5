sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project2/model/formatter",
    "sap/f/library"
], (Controller,formatter,fioriLibrary) => {
    "use strict";

    return Controller.extend("project2.controller.Dash", {
        onInit() {
        },
        formatter:formatter,
        onItemPress(oEvent) {
            const oTableItem = oEvent.getSource();
            var oContext = oTableItem.getBindingContext();
            var sR = oContext.getObject();
            var oRouter = this.getOwnerComponent().getRouter();
            var oFCL = this.oView.getParent().getParent();
			oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
            oRouter.navTo("RequestView", { ID: sR.ID, employee_ID: sR.employee_ID });
            console.log("Selected Request Code: " + sR.ID + sR.employee_ID);
        }
    });
});