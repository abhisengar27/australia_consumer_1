export class CustomeStyleInterface{
    public background_color:String;
    public text_color:String;
    public font_size:String;
    public font_weight:String;
    public font_family:String;
    public btn_text_color:String;
    public bck_btn_color:String;
    public progress_bar_1:String;
    public progress_bar_2:String;
    public updated_flag:  boolean;
    public reset_flag:  boolean;


    constructor(
        background_color?:String,
        text_color?:String,
        font_size?:String,
        font_weight?:String,
        font_family?:String,
        btn_text_color?:String,
        bck_btn_color?:  String,
        progress_bar_1?:String,
        progress_bar_2?:String,
        updated_flag?:  boolean,
        reset_flag?:  boolean,
     
        ){
        this.background_color=background_color,
        this.text_color=text_color,
        this.font_size=font_size,
        this.font_weight=font_weight,
        this.btn_text_color=btn_text_color,
        this.bck_btn_color=bck_btn_color,
        this.progress_bar_1=progress_bar_1,
        this.progress_bar_2=progress_bar_2,
        this.updated_flag=updated_flag,
        this.reset_flag=reset_flag
    }
}