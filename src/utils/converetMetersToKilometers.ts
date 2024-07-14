

export function convertMetersToKilometers(meters : number) : string {
    //meter를 1000으로 나누면 킬로미터
    let kilometers = meters / 1000
    return `${kilometers.toFixed(0)}.km`
}