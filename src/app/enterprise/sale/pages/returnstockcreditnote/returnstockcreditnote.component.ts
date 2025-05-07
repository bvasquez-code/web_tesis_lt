import { Component, ElementRef, ViewChild } from '@angular/core';
import { SaleService } from '../../service/sale.service';
import { CreditNoteRegisterDto } from '../../model/dto/CreditNoteRegisterDto';
import { Router } from '@angular/router';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { CreditNoteDetailDto } from '../../model/dto/CreditNoteDetailDto';
import { SaleDetailDto } from '../../model/dto/SaleDetailDto';
import { CreditNoteService } from '../../service/CreditNote.service';
import { ToastrService } from 'ngx-toastr';
import { IRegisterFormV2 } from 'src/app/enterprise/shared/interface/IRegisterFormV2';
import { CreditNoteDetDto } from '../../model/dto/CreditNoteDetDto';

@Component({
  selector: 'app-returnstockcreditnote',
  templateUrl: './returnstockcreditnote.component.html'
})
export class ReturnstockcreditnoteComponent implements IRegisterFormV2<CreditNoteRegisterDto,string,CreditNoteDetailDto>{

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

    this.CreditNoteRegister.DetailList = this.CreditNoteDetail.DetailList.map( e => e.CreditNoteDet );
    const rpt : ResponseWsDto = await this.creditNoteService.SaveReturnStock(this.CreditNoteRegister);

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

  AddUnit(saleDet : CreditNoteDetDto){
    if(saleDet){
      if((saleDet.CreditNoteDet.NumUnitStockReturned >= saleDet.CreditNoteDet.NumUnit)){
        return;
      }
      saleDet.CreditNoteDet.NumUnitStockReturned = saleDet.CreditNoteDet.NumUnitStockReturned + 1;
    }
  }

  SubtractUnit(saleDet : CreditNoteDetDto){
    if(saleDet){
      if((saleDet.CreditNoteDet.NumUnitStockReturned - 1 === -1)){
        return;
      }
      saleDet.CreditNoteDet.NumUnitStockReturned = saleDet.CreditNoteDet.NumUnitStockReturned - 1;
    }
  }

  getUnit(saleDet : CreditNoteDetDto):number{

    if(saleDet){
      return saleDet.CreditNoteDet.NumUnitStockReturned;
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

  validateUnit(event: any, item: any) {
    const inputValue = event.target.value;
    const maxUnits = item.CreditNoteDet.NumUnit;
  
    if (inputValue > maxUnits) {
      event.target.value = maxUnits;
    } else if (inputValue < 0) {
      event.target.value = 0;
    }
  }

}