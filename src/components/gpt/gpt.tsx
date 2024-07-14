'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import './gpt.css'


type Props = {
    answer : string,
    setAnswer : Dispatch<SetStateAction<string>>;
}


export default function Gpt({answer, setAnswer} : Props){
    const [inputValue, setInputValue] = useState('')

    const handleSubmit = async (event : React.FormEvent)=>{
        event.preventDefault(); //form태그 새로 고침을 막기
        if(!inputValue) return  //입력값 없으면 return (함수를 끝내버렷)
        
        try{
            //src/page/api/gpt.ts에 fetch로 백엔드에 요청 전송
            //응답값이 200(ok)면 setAnswer에 담는다
            const respones = await fetch('/api/gpt',{
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({prompt: inputValue})  
                //object를 json문자열로 바꿔서 서버에 전송한다
            })

            if(!respones.ok){
                //실패하면 catch로 넘긴다
                throw  new Error('Network response was not ok')
            }

            //서버로부터 받은 JSON문자열을 object자료형으로 바꿔준다
            const data = await respones.json();
            setAnswer(data.answer)

        }catch(error){
            console.log('gpt error' + error)
        }
    }

    return(
        <div className='gpt-container'>
            <h2>chatGPT</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    onChange={(e)=>{setInputValue(e.target.value)}}
                    value={inputValue}
                />
                <button className='gpt-button' type='submit'>입력</button>
            </form>
            <p style={{whiteSpace:'pre-line'}}>
                {answer}
            </p>
        </div>
    )
} 