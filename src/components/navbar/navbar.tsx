import './navbar.css'
import { IoSunnyOutline } from "react-icons/io5"

type Props = {}

export default function Navbar({} : Props){
    return(
        <div className='navbar-container'>
            네비게이션바
            <IoSunnyOutline className='nav-logo-icon'/>
        </div>
    )
}

//리액트 아이콘 npm install react-icons --save