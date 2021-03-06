sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, MessageBox, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("br.com.idxtecCstPis.controller.CstPis", {
		onInit: function(){
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		filtraPis: function(oEvent){
			var sQuery = oEvent.getParameter("query");
			var oFilter = new Filter("Codigo", FilterOperator.Contains, sQuery);
			
			var aFilters = [
				oFilter
			];

			this.getView().byId("tableCstPis").getBinding("rows").filter(aFilters, "Application");
		},
		
		onRefresh: function(){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
			this.getView().byId("tableCstPis").clearSelection();
		},
		
		onIncluir: function(){
			var oDialog = this._criarDialog();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Inserir CST - PIS",
				codigoEdit: true,
				msgSalvar: "CST - PIS inserido com sucesso!"
			});
			
			oDialog.unbindElement();
			oDialog.setEscapeHandler(function(oPromise){
				if(oModel.hasPendingChanges()){
					oModel.resetChanges();
				}
			});
			
			var oContext = oModel.createEntry("/CstPiss", {
				properties: {
					"Codigo": "",
					"Descricao": ""
				}
			});
			
			oDialog.setBindingContext(oContext);
			oDialog.open();
		},
		
		onEditar: function(){
			var oDialog = this._criarDialog();
			var oTable = this.byId("tableCstPis");
			var nIndex = oTable.getSelectedIndex();
			var oViewModel = this.getModel("view");

			oViewModel.setData({
				titulo: "Editar CST - PIS",
				codigoEdit: false,
				msgSalvar: "CST - PIS alterado com sucesso!"
			});
			
			if(nIndex === -1){
				MessageBox.warning("Selecione um CST-PIS da tabela!");
				return;
			}
			
			var oContext = oTable.getContextByIndex(nIndex);
			
			oDialog.bindElement(oContext.sPath);
			oDialog.open();
		},
		
		onRemover: function(){
			var that = this;
			var oTable = this.byId("tableCstPis");
			var nIndex = oTable.getSelectedIndex();
			
			if(nIndex === -1){
				MessageBox.warning("Selecione um CST-PIS da tabela!");
				return;
			}
			
			MessageBox.confirm("Deseja remover esse CST-PIS?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("CST-PIS removido com sucesso!");
					}
				} 
			});
		},
		
		onSaveDialog: function(){
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
			
			if(this._checarCampos(this.getView()) === true){
				MessageBox.warning("Preencha todos os campos obrigatórios!");
				return;
			} else{
				oModel.submitChanges({
					success: function(oResponse){
						var erro = oResponse.__batchResponses[0].response;
						if(!erro){
							oModel.refresh(true);
							MessageBox.success(oViewModel.getData().msgSalvar);
							oView.byId("CstPisDialog").close();
							oView.byId("tableCstPis").clearSelection();
						}
					}
				});
			}
		},
		
		onCloseDialog: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			if(oModel.hasPendingChanges()){
				oModel.resetChanges();
			}
			
			this.byId("CstPisDialog").close();
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				}
			});
		},
		
		_criarDialog: function(){
			var oView = this.getView();
			var oDialog = this.byId("CstPisDialog");
			
			if(!oDialog){
				oDialog = sap.ui.xmlfragment(oView.getId(), "br.com.idxtecCstPis.view.CstPisDialog", this);
				oView.addDependent(oDialog); 
			}
			return oDialog;
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("descricao").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		getModel: function(sModel){
			return this.getOwnerComponent().getModel(sModel);
		}
	});
});