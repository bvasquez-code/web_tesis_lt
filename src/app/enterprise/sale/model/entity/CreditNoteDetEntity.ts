import { AuditTableEntity } from "src/app/enterprise/shared/model/entity/AuditTableEntity";

export class CreditNoteDetEntity extends AuditTableEntity {
    public CreditNoteCod: string = '';
    public ProductCod: string = '';
    public Variant: string = '';
    public NumUnit: number = 0;
    public NumUnitPriceSale: number = 0;
    public NumTotalPrice: number = 0;
    public NumUnitStockReturned : number = 0;

    constructor() {
        super();
    }
}
