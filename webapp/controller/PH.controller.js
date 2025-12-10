sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/f/library"

], (Controller, Filter, FilterOperator, Sorter, fioriLibrary) => {
    "use strict";
    return Controller.extend("project2.controller.PH", {
        onInit() {
        },
        onHeaderButtonPress() {
            var oFCL = this.oView.getParent().getParent();
            oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);
        },

        onPress: function () {
            const oList = this.byId("_IDGenList1");
            const oBinding = oList.getBinding("items");
            const bDescending = !this._bDescending;
            this._bDescending = bDescending;
            const oSorter = new Sorter("date", bDescending);
            oBinding.sort(oSorter);
        },

        onSearch: function () {
            const sDayQuery = this.byId("_IDGenSearchField").getValue();
            const sDateQuery = this.byId("DP1").getValue();

            const oList = this.byId("_IDGenList1");
            const oBinding = oList.getBinding("items");
            const aFilters = [];

            if (sDayQuery) {
                aFilters.push(new Filter({
                    path: "day",
                    operator: FilterOperator.Contains,
                    value1: sDayQuery,
                    caseSensitive: false
                }));
            }

            if (sDateQuery) {
                aFilters.push(new Filter({
                    path: "date",
                    operator: FilterOperator.Contains,
                    value1: sDateQuery,
                    caseSensitive: false
                }));
            }

            oBinding.filter(aFilters);
        }
    });
});