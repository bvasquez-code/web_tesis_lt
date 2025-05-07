import { Component, ElementRef, ViewChild } from '@angular/core';
import { SaleService } from '../../service/sale.service';
import { CreditNoteRegisterDto } from '../../model/dto/CreditNoteRegisterDto';
import { Router } from '@angular/router';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { CreditNoteDetailDto } from '../../model/dto/CreditNoteDetailDto';
import { SaleDetailDto } from '../../model/dto/SaleDetailDto';
import { CreditNoteService } from '../../service/CreditNote.service';
import { SaleDetEntity } from '../../model/entity/SaleDetEntity';
import { CreditNoteDetEntity } from '../../model/entity/CreditNoteDetEntity';
import { ToastrService } from 'ngx-toastr';
import { IRegisterFormV2 } from 'src/app/enterprise/shared/interface/IRegisterFormV2';

@Component({
  selector: 'app-createcreditnote',
  templateUrl: './createcreditnote.component.html'
})
export class CreatecreditnoteComponent implements IRegisterFormV2<CreditNoteRegisterDto,string,CreditNoteDetailDto>{

  @ViewChild('txtDocumentCod') txtDocumentCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCommenter') txtCommenter!: ElementRef<HTMLInputElement>;
  
  CreditNoteDetail : CreditNoteDetailDto = new CreditNoteDetailDto();
  CreditNoteRegister : CreditNoteRegisterDto = new CreditNoteRegisterDto();

  SaleDetail : SaleDetailDto = new SaleDetailDto();
  CreditNoteCod : string = "";
  txtDocumentCodReadOnly : boolean = false;

  constructor(
    private saleService : SaleService,
    private creditNoteService : CreditNoteService,
    private toastrService : ToastrService,
    private router: Router,
  ){
    this.GetParamUrl(this.router);
    this.FindDataForm(this.CreditNoteCod);
  }


  GetParamUrl(router: Router): void {
    let urlTree : any = this.router.parseUrl(this.router.url);
    this.CreditNoteCod =  (urlTree.queryParams['CreditNoteCod']) ? urlTree.queryParams['CreditNoteCod'] : "";
  }

  async FindDataForm(Id: string): Promise<void> {

    if(!Id) return;
    
    const rpt : ResponseWsDto = await this.creditNoteService.FindById(Id);
    
    if(!rpt.ErrorStatus){
      this.txtDocumentCodReadOnly = true;
      this.CreditNoteDetail = rpt.Data;
      this.LoadingForm(this.CreditNoteDetail);
    }

  }

  async LoadingForm(CreditNoteDetail: CreditNoteDetailDto): Promise<void> {
    
    await this.FindBySaleCod(CreditNoteDetail.Headboard.SaleCod);
  }

  async Save(): Promise<void> {

    if(!this.CreditNoteRegister.Headboard.CreditNoteCod){
      this.CreditNoteRegister.Headboard.CreditNoteCod = await this.CreateCode();
    }
    this.CreditNoteRegister.Headboard.SaleCod = this.SaleDetail.Headboard.SaleCod;
    this.CreditNoteRegister.Headboard.StoreCod = this.SaleDetail.Headboard.StoreCod;
    this.CreditNoteRegister.Headboard.ClientCod = this.SaleDetail.Headboard.ClientCod;
    this.CreditNoteRegister.Headboard.NumTotalPrice = 0;
    this.CreditNoteRegister.Headboard.Commenter = this.txtCommenter.nativeElement.value;
    this.CreditNoteRegister.Headboard.PeriodId = this.SaleDetail.Headboard.PeriodId;
    this.CreditNoteRegister.Headboard.CurrencyCod = this.SaleDetail.Headboard.CurrencyCod;
    this.CreditNoteRegister.Headboard.CurrencyCodSys = this.SaleDetail.Headboard.CurrencyCodSys;
    this.CreditNoteRegister.Headboard.NumExchangevalue = this.SaleDetail.Headboard.NumExchangevalue;
    this.CreditNoteRegister.Headboard.IsPaid = this.SaleDetail.Headboard.IsPaid;

    this.CreditNoteRegister.DetailList = this.CreditNoteRegister.DetailList.filter( e => e.NumUnit > 0);

    const rpt : ResponseWsDto = await this.creditNoteService.Save(this.CreditNoteRegister);

    if(rpt.ErrorStatus){
      this.toastrService.error(rpt.Message);
    }else{
      this.toastrService.success("Operación realizada con exito.");
      this.router.navigate(['/enterprise/sale/pages/listcreditnote']);
    }
  }

  async FindByDocumentCod(): Promise<void> {

    this.SaleDetail = new SaleDetailDto();
    
    let DocumentCod : string = this.txtDocumentCod.nativeElement.value;

    const rpt : ResponseWsDto = await this.saleService.FindByDocumentCod(DocumentCod);

    if(rpt.ErrorStatus) return;

    if(rpt.Data){
      this.SaleDetail = rpt.Data;
    }

  }

  async FindBySaleCod(SaleCod : string): Promise<void> {

    this.SaleDetail = new SaleDetailDto();

    const rpt : ResponseWsDto = await this.saleService.FindById(SaleCod);

    if(rpt.ErrorStatus) return;

    if(rpt.Data){
      this.SaleDetail = rpt.Data;

      this.txtDocumentCod.nativeElement.value = this.SaleDetail.SaleDocument.DocumentCod;
      this.txtCommenter.nativeElement.value = this.CreditNoteDetail.Headboard.Commenter;
      this.CreditNoteRegister.Headboard = this.SaleDetail.CreditNoteDetail.Headboard;
      this.CreditNoteRegister.DetailList = this.SaleDetail.CreditNoteDetail.DetailList.map( e => e.CreditNoteDet );
      this.CreditNoteRegister.Document = this.SaleDetail.CreditNoteDetail.Document;
    }

  }

  AddUnit(saleDet : SaleDetEntity){

    const creditNoteDet = this.CreditNoteRegister.DetailList.find( e => e.ProductCod === saleDet.ProductCod && e.Variant === saleDet.Variant );

    if(creditNoteDet){
      if(saleDet.NumUnit >= creditNoteDet.NumUnit + 1){
        creditNoteDet.NumUnit = creditNoteDet.NumUnit + 1;
      }
    }else{
      let creditNoteDetNew : CreditNoteDetEntity = new CreditNoteDetEntity();
      creditNoteDetNew.ProductCod = saleDet.ProductCod;
      creditNoteDetNew.Variant = saleDet.Variant;
      creditNoteDetNew.NumUnit = 1;
      creditNoteDetNew.NumUnitPriceSale = saleDet.NumUnitPriceSale;
      creditNoteDetNew.NumTotalPrice = saleDet.NumTotalPrice;
      this.CreditNoteRegister.DetailList.push(creditNoteDetNew);
    }
  }

  SubtractUnit(saleDet : SaleDetEntity){
    const creditNoteDet = this.CreditNoteRegister.DetailList.find( e => e.ProductCod === saleDet.ProductCod && e.Variant === saleDet.Variant );

    if(creditNoteDet){
      creditNoteDet.NumUnit = creditNoteDet.NumUnit - 1;

      if(creditNoteDet.NumUnit === 0){
        this.CreditNoteRegister.DetailList = this.CreditNoteRegister.DetailList.filter(
          e => !(e.ProductCod === saleDet.ProductCod && e.Variant === saleDet.Variant)
        )
      }
    }
  }

  getUnit(saleDet : SaleDetEntity):number{

    const creditNoteDet = this.CreditNoteRegister.DetailList.find( e => e.ProductCod === saleDet.ProductCod && e.Variant === saleDet.Variant );

    if(creditNoteDet){
      return creditNoteDet.NumUnit;
    }
    return 0;
  }

  async CreateCode():Promise<string>
  {
    const rpt : ResponseWsDto = await this.creditNoteService.CreateCode();

    if(rpt.ErrorStatus){
      this.toastrService.error(rpt.Message);
      throw new Error(rpt.Message);
    }

    return String(rpt.Data);
  }

}
