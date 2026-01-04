sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project2/model/formatter",
    "sap/f/library",
    'sap/ui/core/format/DateFormat',
    'sap/ui/core/BusyIndicator'

], (Controller, formatter, fioriLibrary, DateFormat, BusyIndicator) => {
    "use strict";

    return Controller.extend("project2.controller.Request", {
        onInit() {
            this.oFormatYyyymmdd = DateFormat.getInstance({ pattern: "yyyy-MM-dd" });
            globalThis.fileName = null;

        },
        formatter: formatter,
        onHeaderButtonPress() {
            var oFCL = this.oView.getParent().getParent();
            oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);
        },
        handleCalendarSelect() {
            var eModel = this.getOwnerComponent().getModel("editJSON");
            if (eModel.getData().editOn) {
                var c = this.byId("calendar");
                var tf = this.byId("_IDGenText1");
                var tt = this.byId("_IDGenText3");
                var f = c.getSelectedDates()[0].getStartDate();
                var t = c.getSelectedDates()[0].getEndDate();
                tf.setText(this.oFormatYyyymmdd.format(f));
                tt.setText(this.oFormatYyyymmdd.format(t));
                var eModel = this.getOwnerComponent().getModel("editJSON");
                console.log(eModel)
            }
        },
        onEditButtonPress() {
            var eModel = this.getOwnerComponent().getModel("editJSON");
            eModel.setProperty("/editOn", true);
            console.log(eModel.getData())
        },
        Cancel() {
            var eModel = this.getOwnerComponent().getModel("editJSON");
            eModel.setProperty("/editOn", false);
            console.log(eModel.getData());

            var rModel = this.getOwnerComponent().getModel("requestJSON");
            console.log(rModel.getData().destination);

            var oFCL = this.oView.getParent().getParent();
            oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);

        },
        onRadioButton() {
            var r1 = this.byId("_IDGenRadioButton");
            var r2 = this.byId("_IDGenRadioButton1");

            var hl = this.byId("_IDGenLabel4");
            var ht = this.byId("_IDGenText18");
            var hi = this.byId("_IDGenInput1");

            if (r1.getSelected()) {
                var eModel = this.getOwnerComponent().getModel("editJSON");
                hl.setVisible(true)
                if (eModel.getData().editOn) {
                    hi.setVisible(true)
                }
                else {
                    ht.setVisible(true)
                }
            }
            else if (r2.getSelected()) {
                hl.setVisible(false)
                ht.setVisible(false)
                hi.setVisible(false)

            }
        },
        async onDeleteButtonPress() {
            var eModel = this.getOwnerComponent().getModel("editJSON");
            var oModel = this.getView().getModel();
            var rModel = this.getOwnerComponent().getModel("requestJSON");
            var r = rModel.getData();
            var dPath = `/Remote(${r.ID})`;
            var oContextBinding = oModel.bindContext(dPath);
            try {
                await oContextBinding.requestObject();
                var oContext = oContextBinding.getBoundContext();
                if (oContext) {
                    await oContext.delete();
                    sap.m.MessageToast.show("Record deleted successfully");
                    oModel.refresh();

                } else {
                    console.error("Context was null even after requestObject");
                }
            } catch (oError) {
                console.error("Delete failed:", oError);
            }
            eModel.setProperty("/editOn", false);
            var oFCL = this.oView.getParent().getParent();
            oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);

        },
        async fileDeletePress() {

            var oModel = this.getView().getModel();
            var rModel = this.getOwnerComponent().getModel("requestJSON");
            var r = rModel.getData()
            var oContext = oModel.bindContext("/deleteFileAction(...)");
            oContext.setParameter("id", r.remoteDoc_id);
            oContext.setParameter("rid", r.ID);
            await oContext.execute();
            var oDetail = oContext.getBoundContext().getObject();
            console.log(oDetail)
            sap.m.MessageToast.show(oDetail.state);
            rModel.setProperty("/remoteDoc_name", null);
            rModel.setProperty("/remoteDoc_link", null);
            rModel.setProperty("/remoteDoc_ID", null);
        },
        onFileSelected(oEvent) {

            var file = oEvent.getParameter("files")[0];
            if (!file) {
                console.error("No file found. Make sure user selected a file.");
                return;
            }
            fileName = file.name;
            var reader = new FileReader();

            // ERROR PREVENTED: The arrow '=>' keeps 'this' pointing to the Controller
            reader.onload = (e) => {
                globalThis.con = e.target.result.split(",")[1];
            };

            reader.readAsDataURL(file);
        },
        async Save() {
            console.log("Save Pressed")
            BusyIndicator.show();
            var eModel = this.getOwnerComponent().getModel("editJSON");

            console.log(eModel.getData());
            var l = this.byId("_IDGenLabel");
            var tf = this.byId("_IDGenText1");
            var tt = this.byId("_IDGenText3");
            var r1 = this.byId("_IDGenRadioButton");
            var hi = this.byId("_IDGenInput1");
            var iRemarks = this.byId("_IDGenInput");
            var r = 2;
            var h = hi.getValue();
            console.log("label ID" + l.getText(), "from" + tf.getText(), "to" + tt.getText(), "radio" + r, "inbox" + hi.getValue(), "rema" + iRemarks.getValue())
            if (r1.getSelected()) {
                r = 1
            }
            if (r == 2) {
                h = 8
            }
            if (tf.getText() == "" || tt.getText() == "") {
                sap.m.MessageToast.show("Select FromDate and ToDate");
                return
            }

            var oModel = this.getView().getModel();
            var oContext = oModel.bindContext("/RemoteAction(...)");
            oContext.setParameter("rid", l.getText());
            if (fileName) {
                oContext.setParameter("fileName", fileName);
                oContext.setParameter("content", con);
            }
            oContext.setParameter("fromDate", tf.getText());
            oContext.setParameter("toDate", tt.getText());
            oContext.setParameter("employee_ID", 101);
            oContext.setParameter("hours", h);
            oContext.setParameter("days", 0);
            oContext.setParameter("remarks", iRemarks.getValue());
            oContext.setParameter("status", 0);
            oContext.setParameter("destination", r);
            await oContext.execute();
            var oDetail = oContext.getBoundContext().getObject();
            console.log(oDetail)
            BusyIndicator.hide();
            if (oDetail.state) {
                var oFCL = this.oView.getParent().getParent();
                oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);
                sap.m.MessageToast.show(oDetail.Sstate);
                eModel.setProperty("/editOn", false);
                if (eModel.getProperty("/editNew") === true) {
                    eModel.setProperty("/editNew", false);
                }
            }
            else {
                sap.m.MessageToast.show(oDetail.Sstate);

            }

        }

    });
});