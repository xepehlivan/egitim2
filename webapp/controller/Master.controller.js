sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"../model/formatter"
], function (Controller, JSONModel, Filter, FilterOperator, MessageBox, MessageToast, formatter) {
	"use strict";

	return Controller.extend("renova.egitim2.controller.Master", {
		formatter: formatter,
		onInit: function () {
			var aJsonData = [{
				BookNo: 1,
				BookName: "Satranç",
				Writer: "Zweig",
				Summary: 'Summarry 1',
				TurkishTranslation: true,
				ReleaseDate: new Date("01.01.1985"),
				PictureUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000402142-1.jpg"
			}, {
				BookNo: 2,
				BookName: "Şeker Portakalı",
				Writer: "Mauro",
				Summary: 'Summarry 2',
				TurkishTranslation: false,
				ReleaseDate: new Date("01.04.1983"),
				PictureUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000064031-1.jpg"
			}];

			//json model
			var oJsonModel = new JSONModel(aJsonData);
			this.getView().setModel(oJsonModel, "BookModel");
		},
		onAddBook: function () {
			var oJsonModel = new JSONModel({});
			this.getView().setModel(oJsonModel, "BookDetailModel");
			this._getBookDialog().open();
		},
		onSaveBook: function () {
			this._getBusyDialog().open();
			var sBookDetail = this.getView().getModel("BookDetailModel").getData();

			//tablodaki veri
			var oBookModel = this.getView().getModel("BookModel");
			var aBookData = oBookModel.getData();

			var iElementIndex = aBookData.map(function (x) {
				return x.BookNo;
			}).indexOf(sBookDetail.BookNo);

			if (iElementIndex !== -1) {
				aBookData.splice(iElementIndex, 1);
			}

			aBookData.push(sBookDetail);
			oBookModel.setData(aBookData);
			this._getBookDialog().close();

			//Success Message
			//this.getView().getModel("i18n").getResourceBundle().getText("reCaptchaFailed")
			var oResouceBundle = this.getView().getModel("i18n");
			MessageBox.success(oResouceBundle.getResourceBundle().getText("addedBookMessage"));
			this._getBusyDialog().close();
		},
		onEditBook: function (oEvent) {
			var oJsonModel = new JSONModel(oEvent.getSource().getBindingContext("BookModel").getProperty());
			this.getView().setModel(oJsonModel, "BookDetailModel");
			this._getBookDialog().open();
		},
		onDeleteBook: function (oEvent) {
			var that = this;
			var iIndex = parseInt(oEvent.getSource().getBindingContext("BookModel").getPath().split("/")[1]);
			var oProperty = oEvent.getSource().getBindingContext("BookModel").getProperty();
			MessageBox.error(oProperty.BookName + " isimli kitap silinecek. Devam etmek istiyor musunuz ?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (sAction) {
					if (sAction === "YES") {
						that.onDeleteConfirm(iIndex);
						//Success Message
						MessageToast.show(oProperty.BookName + " isimli kitap silindi.");
						return;
					}
					MessageToast.show("Silme işlemi iptal eildi.");
					return;
				}
			});
		},
		onDeleteConfirm: function (iIndex) {
			//tablodaki veri
			var oBookModel = this.getView().getModel("BookModel");
			var aBookData = oBookModel.getData();

			aBookData.splice(iIndex, 1);
			oBookModel.setData(aBookData);
		},
		onSearchBook: function (oEvent) {
			var sQuery = oEvent.getParameters().query;
			var aFilter = [];
			if (sQuery !== "") {
				aFilter.push(new Filter("BookName", FilterOperator.Contains, sQuery));
			}

			//filter binding
			var oBookTable = this.getView().byId("idBookTable");
			var oBindingItems = oBookTable.getBinding("items");
			oBindingItems.filter(aFilter); 
		},
		onSelectBook: function (oEvent) {
			var oJsonModel = new JSONModel(oEvent.getSource().getSelectedItem().getBindingContext("BookModel").getProperty());
			this.getView().setModel(oJsonModel, "BookDetailModel");
			this._getBookDialog().open();
		},
		//dialogs
		_getBookDialog: function () {
			this._oBookDialog = sap.ui.getCore().byId("dialogBook");
			if (!this._oBookDialog) {
				this._oBookDialog = sap.ui.xmlfragment("renova.egitim2.fragments.Book", this);
				this.getView().addDependent(this._oBookDialog);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oBookDialog);
			}
			return this._oBookDialog;
		},
		_getBusyDialog: function () {
			this._oBusyDialog = sap.ui.getCore().byId("busyDialog");
			if (!this._oBusyDialog) {
				this._oBusyDialog = sap.ui.xmlfragment("renova.egitim2.fragments.Busy", this);
				this.getView().addDependent(this._oBusyDialog);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oBusyDialog);
			}
			return this._oBusyDialog;
		},
		//lifecycle events
		onAfterRendering: function () {},
		onBeforeRendering: function () {},
		onExit: function () {}
	});
});