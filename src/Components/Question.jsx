import { useState } from "react"

export function Question({options,question,name,id,handleSelect,selected,correct,gameState})
{
    function decideClass(item)
    {
        if(selected===item&&gameState!="Checking")
            return "Selected"
        else if(correct===item && gameState=="Checking" )
            return "Correct"
        else if(correct!=selected && gameState=="Checking" &&selected===item)
            return "Wrong"
        else if(gameState=="Checking")
            return "NotSelected"

    }
    return(
        <div className="question">
            <p>{question}</p>
            {
                
                options.map((item,index)=>(
                    <label key={index} className={decideClass(item)}>
                        <input type="radio" name={name} id={name} value={item} onChange={gameState==="Playing"?()=>handleSelect(id,item):null} checked={selected===item}/>
                        <span>{item}</span>
                    </label>
                ))
            }
            <hr/>
        </div>
    )
}