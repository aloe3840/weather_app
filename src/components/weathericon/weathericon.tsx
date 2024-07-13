import Image from "next/image"
import React from "react"


type Props = {

}


export default function WeatherIcon(props : React.HTMLProps<HTMLDivElement> & {iconName: string}){
    return(
        <div {...props} className="weather-icon-container">
            <Image src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`} 
            width={100} height={100} className="weather-icon" alt="weather-icon"/>
        </div>
    )
}


//https://openweathermap.org/img/wn/02d@4x.png