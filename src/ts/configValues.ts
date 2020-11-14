import { GUI } from "dat.gui";



export class ConfigValues{

    private static gui: GUI;
    public static minLength : number = 5;
    public static maxLength : number = 50;
    public static minStrength : number = 1;
    public static maxStrength : number = 20;
    public static drag : number = 0.1;
    public static minTacosDisplay : number = 13;
    public static minTacoEffect : number = 13;
    private static lock : boolean = true;
    public static weightScale : number = 0.02;



    public static setup() : GUI{
        this.gui = new GUI();

        const edgeFolder = this.gui.addFolder("edges");
        edgeFolder.add(this,"minLength",1,199,1).onChange(value => {
            this.maxLength = Math.max(this.maxLength,value+1);
            edgeFolder.updateDisplay();
        });
        edgeFolder.add(this,"maxLength",2,200,1).onChange(value => {
            this.minLength = Math.min(this.minLength,value-1);
            edgeFolder.updateDisplay();
        });
        edgeFolder.add(this,"minStrength",1,49,1).onChange(value => {
            this.maxStrength = Math.max(this.maxStrength,value+1);
            edgeFolder.updateDisplay();
        });
        edgeFolder.add(this,"maxStrength",2,50,1).onChange(value => {
            this.minStrength = Math.min(this.minStrength,value-1);
            edgeFolder.updateDisplay()
        });

        const weightsFolder = this.gui.addFolder("Tacos");

        weightsFolder.add(this,"lock").onChange(value => {
            if(value){
                this.minTacoEffect = this.minTacosDisplay;
            }
            weightsFolder.updateDisplay();
        })
        weightsFolder.add(this,"minTacosDisplay",1,50,1).onChange( value => {
            if(this.lock){
                this.minTacoEffect = value;
            }
            weightsFolder.updateDisplay();
        });
        weightsFolder.add(this,"minTacoEffect",1,50,1).onChange( value => {
            if(this.lock){
                this.minTacosDisplay = value;
            }
            weightsFolder.updateDisplay();
        });;
        


        const nodeFoldder = this.gui.addFolder("nodes");
        nodeFoldder.add(this,"drag",0.01,1,0.01);
        nodeFoldder.add(this,"weightScale",0.01,0.03,0.001);
        return this.gui
    }


    public static getGUI(): GUI{
        return this.gui
    }


}