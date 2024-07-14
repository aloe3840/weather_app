import { ConverKelvinToCelsius } from '@/utils/convertKelvinToCelsius';
import ListBox from '../listbox/listbox';
import WeatherIcon from '../weathericon/weathericon';
import './forecast_detail.css'
import TodayDetail, { TodayDetailProps } from './today_detail';

//interface는 type과 다르게 상속이 가능 (복붙)
export interface ForecastDetailProps extends TodayDetailProps{
    //todayDetailProps에 적은 내용이 복붙이 됨 (==상속)
    weatherIcon: string;
    date: string;
    day: string;
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    description: string;
}


export default function ForecastDetail(props: ForecastDetailProps){
    //null이 들어올 경우 props에 기본값 대입
    const{
        weatherIcon = '02d',
        date = '12.09',
        day = 'Monday',
        temp,
        feels_like,
        temp_min,
        temp_max,
        description
    } = props
    
    return(
        <ListBox className='box-style5'>
            <section className='forecast-left-section'>
                {/* 요약 정보 */}
                <div>
                    <WeatherIcon iconName={weatherIcon}/>
                    <p style={{fontSize: '1rem'}}>{date}</p>
                    <p style={{fontSize: '1rem'}}>{day}</p>
                </div>
                <div className='additional-info'>
                    <span>{ConverKelvinToCelsius(temp ?? 273.19)}°C</span>
                    <p className='additional-para'>
                        <span>체감온도</span>
                        <span>{ConverKelvinToCelsius(feels_like ?? 273.19)}°C</span>
                    </p>
                    <p style={{textTransform: 'capitalize', fontSize: '1rem'}}>{description}</p>
                </div>
            </section>
            
            <section className='forecast-right-section'>
                {/* 기후 정보 */}
                <TodayDetail {...props}/>
            </section>
        </ListBox>
    )
}