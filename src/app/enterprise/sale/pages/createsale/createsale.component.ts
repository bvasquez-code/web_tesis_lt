import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../service/sale.service';
import { Router } from '@angular/router';
import { SaleDetailDto } from '../../model/dto/SaleDetailDto';
import { ResponseWsDto } from 'src/app/enterprise/shared/model/dto/ResponseWsDto';
import { SalePaymentEntity } from 'src/app/enterprise/trxpayment/model/entity/SalePaymentEntity';
import { TrxPaymentEntity } from 'src/app/enterprise/trxpayment/model/entity/TrxPaymentEntity';
import { SalePaymentDto } from '../../model/dto/SalePaymentDto';
import { TrxPaymentComponenRequestDto } from 'src/app/enterprise/trxpayment/model/dto/TrxPaymentComponenRequestDto';

@Component({
  selector: 'app-createsale',
  templateUrl: './createsale.component.html'
})
export class CreatesaleComponent implements OnInit{

  SaleCod : string = "";
  SaleDetail : SaleDetailDto = new SaleDetailDto();
  TrxPaymentList : TrxPaymentEntity[] = [];
  ItemCount : number = 0;

  TrxPaymentComponenRequest : TrxPaymentComponenRequestDto = new TrxPaymentComponenRequestDto();
  DocumentType : string = "03";

  constructor(
     private saleservice : SaleService
    ,private router: Router
  )
  {
    let urlTree : any = this.router.parseUrl(this.router.url);
    this.SaleCod =  urlTree.queryParams['SaleCod'];

  }
  ngOnInit(): void {
    // setTimeout(() => {this.findDataForm(this.SaleCod);}, 100);
    this.findDataForm(this.SaleCod);
  }

  async findDataForm(SaleCod : string)
  {
    const rpt : ResponseWsDto = await this.saleservice.findDataForm(SaleCod);

    if( !rpt.ErrorStatus )
    {
      this.SaleDetail = rpt.DataAdditional.find( e => e.Name = "SaleDetail" )?.Data;

      this.TrxPaymentComponenRequest.InputOutstandingBalance = this.getOutstandingbalance();
      this.TrxPaymentComponenRequest.TrxPaymentList = this.getTrxPaymentList();
    }
  }

  getItemCount():number
  {
    this.ItemCount++;
    return this.ItemCount;
  }

  ResponseResultFormClient(event : any){

    const TrxPayment : TrxPaymentEntity = event;

    this.TrxPaymentList.push(TrxPayment);

    console.log(TrxPayment);

    this.AddPayment(TrxPayment);

  }

  async AddPayment(TrxPayment : TrxPaymentEntity){

    const salePayment : SalePaymentDto = new SalePaymentDto();

    salePayment.SaleCod = this.SaleDetail.Headboard.SaleCod;
    salePayment.TrxPaymentId = TrxPayment.TrxPaymentId;
    salePayment.DocumentType = this.DocumentType;

    const rpt : ResponseWsDto = await this.saleservice.AddPayment(salePayment);

    if(!rpt.ErrorStatus){
      this.findDataForm(this.SaleCod);
    }

  }

  selectDocumentType(DocumentType : string){
    this.DocumentType = DocumentType;
  }

  

  OpenTrxPaymentModal(){
    this.TrxPaymentComponenRequest.InputOutstandingBalance = this.getOutstandingbalance();
  }

  getOutstandingbalance():number{
    return this.SaleDetail.Headboard.NumTotalPrice - this.SaleDetail.DetailPayment.reduce((sum,e) => sum + e.NumAmountPaid,0);
  }

  getTrxPaymentList():TrxPaymentEntity[]{
    return this.SaleDetail.DetailPayment.map( e => e.TrxPayment );
  }
}
