"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/navbar/navbar";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { TbComponentsOff } from "react-icons/tb";
import ListBox from "@/components/listbox/listbox";
import { ConverKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import WeatherIcon from "@/components/weathericon/weathericon";
import ForecastDetail from "@/components/detail/forecast_detail";
import TodayDetail from "@/components/detail/today_detail";
import { convertMetersToKilometers } from "@/utils/converetMetersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { fromUnixTime, format, parseISO } from "date-fns";
import Gpt from "@/components/gpt/gpt";


//d9a8c4efd1bd90affe75eddf1a290147 키(key)
//https://api.openweathermap.org/data/2.5/forecast?q=incheon&appid=d9a8c4efd1bd90affe75eddf1a290147&cnt=56 드러가기 (확인용)

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: City;
}

interface WeatherEntry {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  sys: Sys;
  dt_txt: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Rain {
  "3h": number;
}

interface Sys {
  pod: string;
}

interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Coord {
  lat: number;
  lon: number;
}

// gpt한테 데이터 주고 타입스크립트 인터페이스 정의해달라고 한 결과
const weatherData: WeatherData = {
  cod: "200",
  message: 0,
  cnt: 2,
  list: [
    {
      dt: 1720839600,
      main: {
        temp: 297.5,
        feels_like: 298.26,
        temp_min: 296.35,
        temp_max: 297.5,
        pressure: 1006,
        sea_level: 1006,
        grnd_level: 1004,
        humidity: 87,
        temp_kf: 1.15,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
      clouds: {
        all: 31,
      },
      wind: {
        speed: 1.59,
        deg: 247,
        gust: 1.61,
      },
      visibility: 10000,
      pop: 0.46,
      rain: {
        "3h": 0.12,
      },
      sys: {
        pod: "d",
      },
      dt_txt: "2024-07-13 03:00:00",
    },
    {
      dt: 1720850400,
      main: {
        temp: 297.24,
        feels_like: 297.95,
        temp_min: 296.82,
        temp_max: 297.24,
        pressure: 1006,
        sea_level: 1006,
        grnd_level: 1003,
        humidity: 86,
        temp_kf: 0.42,
      },
      weather: [
        {
          id: 802,
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d",
        },
      ],
      clouds: {
        all: 41,
      },
      wind: {
        speed: 4.04,
        deg: 263,
        gust: 4.35,
      },
      visibility: 10000,
      pop: 0.37,
      sys: {
        pod: "d",
      },
      dt_txt: "2024-07-13 06:00:00",
    },
  ],
  city: {
    id: 1843561,
    name: "Incheon",
    coord: {
      lat: 37.45,
      lon: 126.4161,
    },
    country: "KR",
    population: 2654793,
    timezone: 32400,
    sunrise: 1720815822,
    sunset: 1720868162,
  },
};

export default function Home() {
  const [place, setPlace] = useState("seoul");
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState('')

  //있는 지역인지 검사
  const location : string[] = [
      // United States
      'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville', 'fort worth', 'columbus', 'charlotte', 'san francisco', 'indianapolis', 'seattle', 'denver', 'washington',
      // United Kingdom
      'london', 'birmingham', 'leeds', 'glasgow', 'sheffield', 'manchester', 'liverpool', 'bristol', 'newcastle', 'nottingham', 'southampton', 'portsmouth', 'plymouth', 'brighton', 'leicester', 'edinburgh', 'cardiff', 'belfast', 'stoke-on-trent', 'coventry',
      // France
      'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier', 'bordeaux', 'lille', 'rennes', 'reims', 'le havre', 'saint-étienne', 'toulon', 'angers', 'grenoble', 'dijon', 'nîmes', 'aix-en-provence',
      // Japan
      'tokyo', 'yokohama', 'osaka', 'nagoya', 'sapporo', 'kobe', 'kyoto', 'fukuoka', 'kawasaki', 'hiroshima', 'sendai', 'kitakyushu', 'chiba', 'sakai', 'niigata', 'hamamatsu', 'shizuoka', 'sagamihara', 'okayama', 'kumamoto',
      // South Korea
      'seoul', 'busan', 'incheon', 'daegu', 'daejeon', 'gwangju', 'suwon', 'ulsan', 'changwon', 'goyang', 'yongin', 'seongnam', 'cheongju', 'jeonju', 'cheonan', 'ansan', 'jeju', 'hwaseong', 'gimhae', 'pohang', 'jinju', 'gyeongju', 'mokpo', 'suncheon', 'chuncheon', 'wonju', 'gumi', 'iksan', 'andong', 'yangsan', 'gunsan', 'gwangmyeong', 'asan', 'pyeongtaek', 'siheung', 'paju', 'gimpo', 'uijeongbu', 'donghae', 'gangneung',
      // China
      'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'wuhan', 'tianjin', 'hangzhou', 'chongqing', 'nanjing', 'shenyang', 'xi\'an', 'harbin', 'suzhou', 'qingdao', 'dalian', 'zhengzhou', 'jinan', 'changsha', 'kunming', 'fuzhou', 'changchun', 'nanning', 'hefei', 'shijiazhuang', 'guiyang', 'ningbo', 'taiyuan', 'xiamen', 'urumqi', 'shijiazhuang', 'lanzhou', 'haikou', 'sanya',
      // India
      'mumbai', 'delhi', 'bangalore', 'hyderabad', 'ahmedabad', 'chennai', 'kolkata', 'surat', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'visakhapatnam', 'indore', 'thane', 'bhopal', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'ranchi', 'faridabad', 'meerut', 'rajkot', 'kalyan-dombivli', 'vasai-virar', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'howrah', 'gwalior', 'jabalpur',
      // Russia
      'moscow', 'saint petersburg', 'novosibirsk', 'yekaterinburg', 'nizhny novgorod', 'kazan', 'chelyabinsk', 'omsk', 'samara', 'rostov-on-don', 'ufa', 'krasnoyarsk', 'voronezh', 'perm', 'volgograd', 'krasnodar', 'saratov', 'tyumen', 'tolyatti', 'izhevsk', 'barnaul', 'ulyanovsk', 'irkutsk', 'khabarovsk', 'yaroslavl', 'vladivostok', 'makhachkala', 'tomsk', 'orenburg', 'kemerovo', 'novokuznetsk', 'ryazan', 'astrakhan', 'penza', 'lipetsk', 'kirov', 'cheboksary', 'kaliningrad', 'bryansk',
      // Australia
      'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold coast', 'canberra', 'newcastle', 'wollongong', 'logan city', 'geelong', 'hobart', 'townsville', 'cairns', 'toowoomba', 'darwin', 'ballarat', 'bendigo', 'launceston', 'mackay', 'rockhampton', 'bunbury', 'bundaberg', 'hervey bay', 'maitland',
      // Germany
      'berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'stuttgart', 'düsseldorf', 'dortmund', 'essen', 'leipzig', 'bremen', 'dresden', 'hanover', 'nuremberg', 'duisburg', 'bochum', 'wuppertal', 'bielefeld', 'bonn', 'münster', 'karlsruhe', 'mannheim', 'augsburg', 'wiesbaden', 'gelsenkirchen', 'mönchengladbach', 'braunschweig', 'chemnitz', 'aachen', 'kiel', 'halle', 'magdeburg', 'krefeld', 'freiburg', 'lübeck', 'oberhausen', 'erfurt', 'mainz', 'rostock', 'kassel',
      // Italy
      'rome', 'milan', 'naples', 'turin', 'palermo', 'genoa', 'bologna', 'florence', 'catania', 'bari', 'venice', 'verona', 'messina', 'padua', 'trieste', 'brescia', 'taranto', 'parma', 'prato', 'modena', 'reggio calabria', 'reggio emilia', 'perugia', 'livorno', 'ravenna', 'cagliari', 'foggia', 'rimini', 'salerno', 'ferrara',
      // Spain
      'madrid', 'barcelona', 'valencia', 'seville', 'zaragoza', 'málaga', 'murcia', 'palma', 'las palmas', 'bilbao', 'alicante', 'córdoba', 'valladolid', 'vigo', 'gijón', 'hospitalet de llobregat', 'vitoria-gasteiz', 'granada', 'elche', 'oviedo', 'badalona', 'cartagena', 'terrassa', 'jerez de la frontera', 'sabadell', 'móstoles', 'santa cruz de tenerife', 'alcalá de henares', 'pamplona', 'fuenlabrada', 'almería', 'leganés', 'san sebastián', 'burgos', 'santander', 'castellón de la plana', 'getafe', 'alcorcón', 'albacete',
      // Canada
      'toronto', 'montreal', 'vancouver', 'calgary', 'edmonton', 'ottawa', 'winnipeg', 'quebec city', 'hamilton', 'kitchener', 'london', 'victoria', 'halifax', 'oshawa', 'windsor', 'saskatoon', 'regina', 'st. john\'s', 'barrie', 'kelowna', 'abbotsford', 'sherbrooke', 'sudbury', 'kingston', 'saguenay', 'trois-rivières', 'guelph', 'moncton', 'brantford', 'saint john', 'thunder bay', 'charlottetown', 'red deer', 'lethbridge', 'kamloops', 'nanaimo', 'fredericton', 'saint-jérôme', 'peterborough',
      // Brazil
      'são paulo', 'rio de janeiro', 'brasília', 'salvador', 'fortaleza', 'belo horizonte', 'manaus', 'curitiba', 'recife', 'goiânia', 'belém', 'porto alegre', 'guarulhos', 'campinas', 'são luís', 'são gonçalo', 'maceió', 'duque de caxias', 'natal', 'teresina', 'nova iguaçu', 'são bernardo do campo', 'campo grande', 'joão pessoa', 'ribeirão preto', 'jaboatão dos guararapes', 'contagem', 'aracaju', 'feira de santana', 'sorocaba', 'londrina', 'juiz de fora', 'joinville', 'ananindeua', 'uberlândia', 'pelotas', 'blumenau', 'niterói', 'macapá',
      // South Africa
      'cape town', 'johannesburg', 'durban', 'pretoria', 'port elizabeth', 'bloemfontein', 'east london', 'nelspruit', 'kimberley', 'polokwane', 'pietermaritzburg', 'vereeniging', 'welkom', 'klerksdorp', 'george', 'witbank', 'potchefstroom', 'rustenburg', 'bethlehem', 'grahamstown', 'stellenbosch', 'rustenburg', 'sasolburg', 'newcastle', 'kroonstad', 'phalaborwa', 'carletonville', 'vryheid', 'kuruman', 'kathu',
      // Egypt
      'cairo', 'alexandria', 'giza', 'shubra el kheima', 'port said', 'suez', 'luxor', 'mansoura', 'tanta', 'asyut', 'ismailia', 'faiyum', 'zagazig', 'damietta', 'aswan', 'minya', 'beni suef', 'qena', 'sohag', 'shibin el kom', 'banha', 'arish', 'mallawi', '10th of ramadan city', 'bilqas', 'el quseir', 'hurghada', 'borg el arab', 'matruh', 'el kharga',
      // Turkey
      'istanbul', 'ankara', 'izmir', 'bursa', 'adana', 'gaziantep', 'konya', 'antalya', 'kayseri', 'mersin', 'eskisehir', 'diyarbakir', 'samsun', 'denizli', 'sanliurfa', 'adapazari', 'malatya', 'kahramanmaras', 'erzurum', 'van', 'batman', 'elazig', 'izmit', 'afyonkarahisar', 'tekirdag', 'trabzon', 'ordu', 'sivas', 'usak', 'aydin',
      // Argentina
      'buenos aires', 'córdoba', 'rosario', 'mendoza', 'la plata', 'san miguel de tucumán', 'mar del plata', 'salta', 'santa fe', 'san juan', 'resistencia', 'santiago del estero', 'corrientes', 'bahía blanca', 'paraná', 'neuquén', 'formosa', 'san luis', 'san salvador de jujuy', 'santa rosa', 'catamarca', 'río gallegos', 'comodoro rivadavia', 'posadas', 'rafaela', 'san fernando del valle de catamarca', 'la rioja', 'san carlos de bariloche', 'tandil', 'villa maría',
      // Mexico
      'mexico city', 'guadalajara', 'monterrey', 'puebla', 'tijuana', 'león', 'ciudad juárez', 'zapopan', 'monterrey', 'mérida', 'cancún', 'querétaro', 'morelia', 'aguascalientes', 'hermosillo', 'saltillo', 'culiacán', 'chihuahua', 'san luis potosí', 'torreón', 'veracruz', 'villahermosa', 'xalapa', 'irapuato', 'mazatlán', 'durango', 'cuernavaca', 'celaya', 'matamoros', 'nuevo laredo',
      // Indonesia
      'jakarta', 'surabaya', 'bandung', 'medan', 'bekasi', 'tangerang', 'depok', 'semarang', 'palembang', 'makassar', 'batam', 'pekanbaru', 'bogor', 'bandar lampung', 'malang', 'padang', 'denpasar', 'samarinda', 'tasikmalaya', 'banjarmasin', 'balikpapan', 'jambi city', 'surakarta', 'manado', 'yogyakarta', 'mataram', 'kupang', 'cilegon', 'kendari', 'bengkulu',
      // Thailand
      'bangkok', 'nonthaburi', 'nakhon ratchasima', 'chiang mai', 'hat yai', 'udon thani', 'pak kret', 'khon kaen', 'ubon ratchathani', 'nakhon si thammarat', 'songkhla', 'surat thani', 'phitsanulok', 'pattaya', 'lampang', 'trang', 'rayong', 'chiang rai', 'nakhon sawan', 'phuket'
    ];

  const fetchWeatherData = async () => {
    setIsLoading (true)
    try{
      const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`);
      const result = await res.json();
      setData(result);
    }catch(err){
      setError('날씨 가져오기 에러')
    }finally{
      setIsLoading(false);
    }
  };
  

  //백그라운드 작업 또는 타이머는 useEffect에서, 재실행은 place값이 바뀔 때만
  useEffect(()=>{
    fetchWeatherData();
  }, [place])


  //0시 데이터만 추출
  const filteredList = data?.list.filter(item=>item.dt_txt.endsWith('00:00:00'))

 
  let todayData = data?.list[1];
  const daysInKorea = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const today = new Date();
  const dayInKorea = daysInKorea[today.getDay()]

  //data.list[0].dt_txt ==> 2024-07-13 03:00:00
  // ==> 2024.7.13
  function onlyDate(dateTime: string | undefined){
    if(!dateTime){
      return '';   //타입스크립트는 비정상 값에 대해 먼저 처리해줘야함
    }

    const date = dateTime.split(' ')[0];
    const [year, month, day] = date.split('-')

    return `${year}.${month}.${day}`
  }

  

  if(isLoading){
    return(
      <div className={styles.homeLoadingBox}>
        <p className={styles.homeLoadingText}>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.homeContainer}>
      <Navbar place={place} setPlace={setPlace} location={location}/>
      <main className={styles.homeMain}>
        {/* 오늘 날씨 */}
        <section className={styles.spaceY4}>
          <div className={styles.spaceY2}>
            <h2 className={styles.todayHeader}>
              <p>{dayInKorea}</p>
              <p>({onlyDate(todayData?.dt_txt)})</p>

            </h2>
            {/* 오늘 날씨 시각화 */}
            <ListBox className="box-style2">
              <div className={styles.flexColumnP4}>
                <span className={styles.fontSize48}>
                  {ConverKelvinToCelsius(todayData?.main.temp ?? 298.15)}°C
                </span>
                <p className={styles.nowrapText}>
                  <span>체감온도</span>
                  <span>{ConverKelvinToCelsius(todayData?.main.feels_like ?? 298.15)}°C</span>
                </p>
                <p className={styles.minmaxText}>
                    최저<span>{ConverKelvinToCelsius(todayData?.main.temp_min ?? 298.15)}°C</span>
                    최고<span>{ConverKelvinToCelsius(todayData?.main.temp_max ?? 298.15)}°C</span>
                </p>
              </div>
              {/* 날씨 아이콘 */}
              <div className={styles.todayInfo}>
                {
                  data?.list.map((item, index)=>{
                    return(
                      <div className={styles.todayItem}>
                        <p className={styles.todaySecondTitle}>
                          {item.dt_txt}
                        </p>
                        {/* 아이콘 */}
                        <WeatherIcon iconName={item.weather[0].icon}/>
                        <p>
                          {ConverKelvinToCelsius(item?.main.temp ?? 298.15)}°C
                        </p>
                      </div>
                    )
                  })
                }
              </div>
            </ListBox>
          </div>

          <div className={styles.todaySecondBox}>
            <ListBox className="box-style3">
              <p>{todayData?.weather[0].description}</p>
              <WeatherIcon iconName={todayData?.weather[0].icon ?? ""}/>
            </ListBox>
            <ListBox className="box-style4">
                <TodayDetail
                visibility={convertMetersToKilometers(todayData?.visibility ?? 10000)}
                humidity={`${todayData?.main.humidity}%`}
                windSpeed={convertWindSpeed(todayData?.wind.speed ?? 0.0)}
                airPressure={`${todayData?.main.pressure}hPa`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), "H:mm")}
                sunset={format(fromUnixTime(data?.city.sunset ?? 0), "H:mm")}
                />
            </ListBox>
          </div>

          <section className={styles.gptSection}>
              <Gpt answer={answer} setAnswer={setAnswer}/>
          </section>

        </section>
        {/* 일기예보 (주간) */}
        <section className={styles.forecastSectionFlex}>
            <strong>일기예보 (자정기준) </strong>
            {
              filteredList && filteredList.map((itme, index)=>{
                return(
                  <ForecastDetail 
                  key={index}
                  weatherIcon={itme.weather[0].icon}
                  date={format(parseISO(itme.dt_txt ?? ""), "MM월 dd일")}
                  day={format(parseISO(itme.dt_txt ?? ""), "EEEE")}
                  temp={itme.main.temp ?? 0}
                  feels_like={itme.main.feels_like ?? 0}
                  temp_max={itme.main.temp_max ?? 0}
                  temp_min={itme.main.temp_min ?? 0}
                  description={itme.weather[0].description ?? ""}
                  visibility={convertMetersToKilometers(itme?.visibility ?? 10000)}
                  humidity={`${itme?.main.humidity}%`}
                  windSpeed={convertWindSpeed(itme?.wind.speed ?? 0.0)}
                  airPressure={`${itme?.main.pressure}hPa`}
                  sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), "H:mm")}
                  sunset={format(fromUnixTime(data?.city.sunset ?? 0), "H:mm")}
                  />
                )
              })
            }
        </section>

        <section className={styles.boardSectionGrid}>
          <h2>도시 검색어 안내</h2>
          <div className={styles.searchBoard}>
            {
              location.map((item, index)=>{
                return(
                  <p key={index}>{item}</p>
                )
              })
            }
          </div>
        </section>
      </main>
    </div>
  );
}

//npm install react-icons --save
//npm install react-query axios classnames
//npm install data-fns@2.30.0
