export class OptionTableGenericDto{

    public Type: 'Modal' | 'Url' | 'Action' = 'Modal';
    public ID? : string = "";
    public Name? : string = "";
    public Title? : string = "";
    public Url?  : string = "";
    public Function?: (...args: any[]) => any;
    public FunctionUrl?: (...args: any[]) => any;
    constructor()
    {

    }

}