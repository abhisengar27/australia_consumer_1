export class commonFunction{
    constructor(){}
    public validateNum(this) {
        return this.value.match(/^\d+(\.\d+)?$/);
    }
}