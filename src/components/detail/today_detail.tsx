import { stringify } from 'querystring'
import './today_detail.css'
import { WiHumidity } from 'react-icons/wi'
import React from 'react';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { FiDroplet } from 'react-icons/fi';
import { MdAir } from 'react-icons/md';
import { ImMeter } from 'react-icons/im';


export interface TodayDetailProps{
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export interface SingleWeatherDetaiProps{
    information: string;
    icon: React.ReactNode;
    vaule: string
}

export default function TodayDetail(props: TodayDetailProps){
    return(
        <>
            <SingleWeatherDetail information='가시성' icon={<LuEye/>} vaule={props.visibility}/> 

            <SingleWeatherDetail information='습도' icon={<FiDroplet/>} vaule={props.humidity}/> 

            <SingleWeatherDetail information='풍속' icon={<MdAir/>} vaule={props.windSpeed}/> 

            <SingleWeatherDetail information='기압' icon={<ImMeter/>} vaule={props.airPressure}/> 

            <SingleWeatherDetail information='일출 시간' icon={<LuSunrise/>} vaule={props.sunrise}/> 

            <SingleWeatherDetail information='일몰 시간' icon={<LuSunset/>} vaule={props.sunset}/> 
        </>
    )
}

function SingleWeatherDetail(props: SingleWeatherDetaiProps){
    return(
        <div className='todaydetail-item'>
            <p className='todaydetail-info-text'>
                {props.information}
            </p>
            <div className='todaydetail-icon-size'>{props.icon}</div>
            <p>{props.vaule}</p>
        </div>
    )
}