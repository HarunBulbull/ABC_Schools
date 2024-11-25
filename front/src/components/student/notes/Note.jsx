import './Notes.css'
import React, { useEffect, useState } from 'react';

function Note({info}) {
    const [sum, setSum] = useState(null);

    console.log(info)
    useEffect(() => {
        let total = 0;
        let count = 0;
        if(info.exam1){total+=info.exam1; count++;}
        if(info.exam2){total+=info.exam2; count++;}
        if(info.note1){total+=info.note1; count++;}
        if(info.note2){total+=info.note2; count++;}
        if(count>0){setSum(total/count);}
    })

    return (
        <>
           <b>{info.lesson}</b>
           <p>{info.exam1 && info.exam1}</p>
           <p>{info.exam2 && info.exam2}</p>
           <p>{info.note1 && info.note1}</p>
           <p>{info.note2 && info.note2}</p>
           <p>{sum && sum}</p>
        </>
    )
}

export default Note
