/*global QUnit*/

sap.ui.define([
	"project2/controller/RR.controller"
], function (Controller) {
	"use strict";

	QUnit.module("RR Controller");

	QUnit.test("I should test the RR controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
