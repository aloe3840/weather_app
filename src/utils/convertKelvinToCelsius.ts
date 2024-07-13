

//절대온도에서 섭씨온도로 바꾸는 함수
export function ConverKelvinToCelsius(tempInkelvin : number): number{
    let tempInCelsius = tempInkelvin - 273.15;   //반올림
    return Math.floor(tempInCelsius)
}