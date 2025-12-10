sap.ui.define([

    "sap/ui/core/mvc/Controller",
    "project2/model/formatter",
    "sap/f/library"

], (Controller, formatter, fioriLibrary) => {
    "use strict";

    return Controller.extend("project2.controller.RR", {
        async onInit() {
            await this._userFunction();

        },
        async _userFunction() {
            var uModel = this.getOwnerComponent().getModel("userJSON");
            // uModel.setProperty("/user", userInfo.getEmail());

            const uPath = `/Employees`;
            var oContext = this.getOwnerComponent().getModel().bindContext(uPath, undefined, {
                $expand: {
                    "remote": true,
                    "allocation": true,
                    "role": true
                },
            });
            var oDetail = await oContext.requestObject().then(function (oData) {
                return oData;
            });
            uModel.setData(oDetail.value);
            globalThis.empID = oDetail.value[0].ID;
            console.log(uModel.getData());

        },
        getUserInfoService: function () {
            return new Promise(resolve => sap.ui.require([
                "sap/ushell/library" // In the future, "sap/ushell/Container" might need to be required instead. Refer to API 
            ], sapUshellLib => {
                const Container = sapUshellLib.Container;
                const service = Container.getServiceAsync("UserInfo"); // .getService is deprecated!
                resolve(service);
            }));
        },
        _getBaseURL() {
            return sap.ui.require.toUrl("project2");
        },
        
        formatter: formatter,
        onItemPress(oEvent) {
            const oTableItem = oEvent.getSource();
            var oContext = oTableItem.getBindingContext();
            var sR = oContext.getObject();
            console.log("selectedR", typeof sR);
            this._request(sR);
        },
        phbFunction: async function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RoutePH", { _: "all" });
        },
        async addRequest() {

            var oFCL = this.oView.getParent().getParent();
            oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);

            var rModel = this.getOwnerComponent().getModel("requestJSON");
            rModel.setData({});
            var aSpecialDates = [];
            var holidayList = await this._holiday()
            console.log("holidayList", holidayList)
            aSpecialDates = aSpecialDates.concat(holidayList)
            rModel.setProperty("/specialDates", aSpecialDates);

            const rPath = `/Remote`;
            var oContext = this.getOwnerComponent().getModel().bindContext(rPath, undefined, {});
            var oDetail = await oContext.requestObject().then(function (oData) {
                return oData;
            });
            for (let i = 0; i < oDetail.value.length; i++) {
                var d = oDetail.value[i].fromDate
                var s = this._dateForamtter(d);
                d = oDetail.value[i].toDate
                var e = this._dateForamtter(d);
                aSpecialDates.push({
                    startDate: s,      // The Date Object (Crucial!)
                    endDate: e,        // Same day (optional, but good for single days)
                    type: this._color(oDetail.value[i].status)[0],        // "Type10" is standard for Holidays (often Red/Purple)
                    tooltip: this._color(oDetail.value[i].status)[1]     // This shows the Holiday Name when you hover!
                });
            }
            console.log(aSpecialDates.at(-1))


            var eModel = this.getOwnerComponent().getModel("editJSON");
            eModel.setProperty("/editOn", true);
            eModel.setProperty("/editNew", true);
        },
        async _request(sR) {
            var oFCL = this.oView.getParent().getParent();
            oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
            console.log(sR.ID);
            var rModel = this.getOwnerComponent().getModel("requestJSON");
            console.log("rModel==>", rModel);
            const rPath = `/Remote(${sR.ID})`;
            var oContext = this.getOwnerComponent().getModel().bindContext(rPath, undefined, {});
            var oDetail = await oContext.requestObject().then(function (oData) {
                return oData;
            });
            rModel.setData(oDetail);
            console.log("status===>", oDetail.status);

            const status = oDetail.status;

            const f = this._dateForamtter(oDetail.fromDate);
            f.setHours(0, 0, 0, 0);
            const t = this._dateForamtter(oDetail.toDate);
            t.setHours(23, 59, 59, 999);
            rModel.setProperty("/fDate", f);
            rModel.setProperty("/tDate", t);
            console.log("rModel", rModel.getData())
            var eModel = this.getOwnerComponent().getModel("editJSON");
            eModel.setProperty("/editOn", false);
            console.log(eModel.getData())

            var aSpecialDates = [];
            var holidayList = await this._holiday()
            console.log("holidayList", holidayList)
            aSpecialDates = aSpecialDates.concat(holidayList)
            console.log(aSpecialDates)
            var typeC = "";
            var typeS = "";

            // console.log(this._color(status),this._color(status)[0],this._color(status)[1])
            typeC = this._color(status)[0];
            typeS = this._color(status)[1];
            aSpecialDates.push({
                startDate: f,      // The Date Object (Crucial!)
                endDate: t,        // Same day (optional, but good for single days)
                type: typeC,        // "Type10" is standard for Holidays (often Red/Purple)
                tooltip: typeS     // This shows the Holiday Name when you hover!
            });

            console.log(aSpecialDates)
            rModel.setProperty("/specialDates", aSpecialDates);
            console.log("rModel", rModel.getData());

        },

        async _holiday() {
            var holidayDates = [];
            const hPath = `/Holiday`;
            var oContext = this.getOwnerComponent().getModel().bindContext(hPath, undefined, {});
            var oDetail = await oContext.requestObject().then(function (oData) {
                return oData;
            });
            for (let i = 0; i < oDetail.value.length; i++) {
                var d = oDetail.value[i].date
                var s = this._dateForamtter(d);
                holidayDates.push({
                    startDate: s,      // The Date Object (Crucial!)
                    endDate: s,        // Same day (optional, but good for single days)
                    type: "Type15",        // "Type10" is standard for Holidays (often Red/Purple)
                    tooltip: oDetail.value[i].day     // This shows the Holiday Name when you hover!
                });
            }
            console.log(holidayDates)
            return holidayDates;
        },

        _color(status) {
            var typeC = "";
            var typeS = "";
            switch (status) {
                case 0:
                    typeC = "Type06"
                    typeS = "Requested Date"
                    break;
                case -1:
                    typeC = "Type02"
                    typeS = "Rejected Date"
                    break;
                case 1:
                    typeC = "Type08"
                    typeS = "Approved Date"
                    break;
            }
            return [typeC, typeS]
        },

        _dateForamtter(d) {
            var p = d.split("-");
            var oDate = new Date(p[0], p[1] - 1, p[2]);
            return oDate;

        },
        
        synchronize(){
            var oModel = this.getView().getModel();
            oModel.refresh();
        }
    });
});