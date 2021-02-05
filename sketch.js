var date
var bpSugarButton;
var systolicBp,diastolicBp,sugar
var sugarUnit
var gameState="opening screen"
var systolicBpTextbox,diastolicBpTextbox,sugarTextbox,doneButton
var mmolButton,mgdlButton
var warningMsg=""
var database
var tipsButton
var backButton

function setup(){
    createCanvas(displayWidth-50,displayHeight-50)

    database=firebase.database()

    bpSugarButton=createButton("Change BP and Sugar")

    systolicBpTextbox=createInput('')
    diastolicBpTextbox=createInput('')
    sugarTextbox=createInput('')

    doneButton=createButton('Done')

    mmolButton=createButton('mmol/l')
    mgdlButton=createButton('mg/dl')

    tipsButton=createButton('Tips')
    backButton=createButton('Back')
}

function draw(){
    background("orange")

    bpSugarButton.position(displayWidth/2-80,displayHeight/2+20)
    bpSugarButton.style('background','lightblue')
    bpSugarButton.style('height','40px')
    systolicBpTextbox.position(displayWidth/2-80,displayHeight/2-180)
    systolicBpTextbox.style('width','30px')
    diastolicBpTextbox.position(displayWidth/2-30,displayHeight/2-180)
    diastolicBpTextbox.style('width','30px')
    sugarTextbox.position(displayWidth/2-80,displayHeight/2)
    doneButton.position(displayWidth/2-80,displayHeight/2+90)
    doneButton.style('height','40px')
    doneButton.style('background','green')
    mmolButton.position(displayWidth/2-70,displayHeight/2+30)
    mgdlButton.position(displayWidth/2-0,displayHeight/2+30)
    tipsButton.position(displayWidth/2-80,displayHeight/2-30)
    tipsButton.style('background','lightblue')
    tipsButton.style('width','60px')
    backButton.position(50,50)
    backButton.style('width','60px')
    backButton.style('height','30px')

    //to take the value from database
    database.ref('systolicbp').on("value",(data)=>{
        systolicBp=data.val()
    })

    database.ref('diastolicbp').on("value",(data)=>{
        diastolicBp=data.val()
    })

    database.ref('sugar').on("value",(data)=>{
        sugar=data.val()
    })

    database.ref('sugarunit').on("value",(data)=>{
        sugarUnit=data.val()
    })

    
    if(gameState!=="changing bp sugar"){
        systolicBpTextbox.hide()
        diastolicBpTextbox.hide()
        sugarTextbox.hide()
        doneButton.hide()
        mmolButton.hide()
        mgdlButton.hide()
    }

    //to display bp ang sugar level
    if(gameState==="opening screen"){
        bpSugarButton.show()
        tipsButton.show()
        backButton.hide()
        var bpMessage="Your BP Is Normal"
        var sugarMessage="Your Sugar Is Normal"
        var bpColor="green"
        var sugarColor="green"
        if(systolicBp>140 && diastolicBp>90){
            bpColor="red"
            bpMessage="Your BP Is High"
        }

        else if(systolicBp<90 && diastolicBp<60){
            bpColor="red"
            bpMessage="Your BP Is Low"
        }

        else if(systolicBp>120 && diastolicBp>80){
            bpColor="yellow"  
            bpMessage="Your Bp slightly High" 
        }

        else if(systolicBp<100 && diastolicBp<65){
            bpColor="yellow"
            bpMessage="Your Bp Is Slightly Low"
        }

        if(sugarUnit==="mmol/l"){
            if(sugar>7.8){
                sugarColor="red"
                sugarMessage="Your Sugar is High"
            }

            else if( sugar<4){
                sugarColor="red"
                sugarMessage="Your Sugar Is Low"
            }
            else if(sugar<=5 && sugar>4){
                sugarColor="yellow"
                sugarMessage="Your Sugar Is Slightly Low"
            }

            else if(sugar<7.8 && sugar>=7){
                sugarColor="yellow"
                sugarMessage="Your Sugar Is Slightly High"
            }
        }
        
        else if(sugarUnit==="mg/dl"){
            if(sugar>140 ){
                sugarColor="red"
                sugarMessage="Your Sugar is High"
            }

            else if(sugar<72){
                sugarColor="red"
                sugarMessage="Your Sugar Is Low"
            }

            else if(sugar<=90 && sugar>72){
                sugarColor="yellow"
                sugarMessage="Your Sugar Is Slightly Low"
            }

            else if(sugar<140 && sugar>=126){
                sugarColor="yellow"
                sugarMessage="Your Sugar Is Slightly High"
            }
        }
        
        
        if(systolicBp!==undefined){
            fill(bpColor)
            textSize(20)
            text("BP : " + systolicBp + "/" + diastolicBp + " mmHg",displayWidth/2-140,displayHeight/2-180)
            text(bpMessage,displayWidth/2-190,displayHeight/2-250)
    
            fill(sugarColor)
            textSize(20)
            text("SUGAR : " + sugar + "  " ,displayWidth/2+20,displayHeight/2-180)
            text(sugarMessage,displayWidth/2+20,displayHeight/2-250)
        }

        else{
            fill("green")
            textSize(20)
            text("loading",displayWidth/2-80,displayHeight/2-180)
        }
    }
   
    bpSugarButton.mousePressed(()=>{
        bpSugarButton.hide()
        tipsButton.hide()
        database.ref('/').update({
            sugarunit:"undefined"
        })
        gameState="changing bp sugar"
    })

    //to change the bp and sugar level
    if(gameState==="changing bp sugar"){
        systolicBpTextbox.show()
        diastolicBpTextbox.show()
        sugarTextbox.show()
        doneButton.show()
        backButton.show()

        if(sugarUnit==="undefined"){
            mmolButton.show()
            mgdlButton.show()
        }

        fill(0)
        textSize(30)
        text("BP LEVEL",displayWidth/2-80,displayHeight/2-210)

        fill(0)
        textSize(30)
        text("SUGAR LEVEL",displayWidth/2-80,displayHeight/2-30)

        
        fill(0)
        textSize(30)
        text(warningMsg,displayWidth/2-80,displayHeight/2-290)

        mmolButton.mousePressed(()=>{
            database.ref('/').update({
                sugarunit:"mmol/l"
            })
            mmolButton.hide()
            mgdlButton.hide()
        })

        mgdlButton.mousePressed(()=>{
            database.ref('/').update({
                sugarunit:"mg/dl"
            })
            mmolButton.hide()
            mgdlButton.hide()
        })

        doneButton.mousePressed(()=>{
            var newsystolicBp=systolicBpTextbox.value()
            var newDiastolicBp=diastolicBpTextbox.value()
            var newSugar=sugarTextbox.value()

            if(newsystolicBp>0 && newDiastolicBp>0 && newSugar>0 && sugarUnit!=="undefined"){
                gameState="opening screen"
                console.log("y")
                warningMsg=""
                database.ref('/').set({
                    systolicbp:newsystolicBp,
                    diastolicbp:newDiastolicBp,
                    sugar:newSugar,
                    sugarunit:sugarUnit
                })
            }

            else if(sugarUnit==="undefined"){
                warningMsg="Please Enter The Unit"
                mgdlButton.show()
                mmolButton.show()
            }
            else{
                warningMsg="Please Enter A Valid Number"
                console.log("n")
            }
        })
    }

    tipsButton.mousePressed(()=>{
        gameState="tips"
    })

    backButton.mousePressed(()=>{
        gameState="opening screen"
    })
   
    if(gameState==="tips"){
        displayTips()
        backButton.show()
        bpSugarButton.hide()
        tipsButton.hide()
    }
    
    drawSprites();
}

function displayTips(){
    fill("green")
    textSize(25)
    text("1. Lose extra pounds and watch your waistline,Blood pressure often increases as weight increases",100,100); 
    text("2. Exercise regularly",100,140);
    text("3. Eat a healthy diet",100,180);
    text("4. Reduce sodium in your diet",100,220);
    text("5. Limit the amount of alcohol you drink",100,260);
    text("6. Quit smoking",100,300)    
    text("7. Cut back on caffeine",100,340)
    text("8. Reduce your stress",100,380)
    text("9. Monitor your blood pressure at home and see your doctor regularly",100,420)
    
    text("10. Get support",100,460)
}
