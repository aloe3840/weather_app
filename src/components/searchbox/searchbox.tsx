import React from 'react'
import './Searchbox.css'
import { IoSearch } from 'react-icons/io5';

type Props = {
    //검색값, 변경값, 제출함수
    searchValue: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export default function SearchBox({searchValue, onChange, onSubmit}:Props){
    return(
        <>
            <form className='searchbox-form' onSubmit={onSubmit}>
                <input className='searchbox-input' type='text' placeholder='위치를 입력하세요'
                onChange={onChange} value={searchValue}/>
                <button className='searchbox-button'>
                    <IoSearch/>
                </button>
            </form>
        </>
    )
}