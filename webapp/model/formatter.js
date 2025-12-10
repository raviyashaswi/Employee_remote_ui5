sap.ui.define([
	"sap/ui/core/ValueState" // 1. Import ValueState for colors
], (ValueState) => {
	"use strict";

	return {
		statusText(sStatus) {
			switch (sStatus) {
				case 0:
					return ("Pending");
				case 1:
					return ("Approved");
				case -1:
					return ("Rejected");
				case "0":
					return ("Pending");
				case "1":
					return ("Approved");
				case "-1":
					return ("Rejected");
			}
		},

		statusColor(sStatus) {
			switch (sStatus) {
				case "0":
					return ValueState.Information;
				case "1":
					return ValueState.Success;
				case "-1":
					return ValueState.Error;
				case 0:
					return ValueState.Information;
				case 1:
					return ValueState.Success;
				case -1:
					return ValueState.Error;
			}
		},
		statusIcon(sStatus) {
			switch (sStatus) {
				case 0:
					return ("sap-icon://pending");
				case 1:
					return ("sap-icon://accept");
				case -1:
					return ("sap-icon://decline");
			}
		},
		statusType(sStatus) {
			switch (sStatus) {
				case 0:
					return ("Type06");
				case 1:
					return ("Type08");
				case -1:
					return ("Type02");
			}
		}
	};
});