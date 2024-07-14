//meter per seconds ==> kilometers per hours

export function convertWindSpeed(speedInmetersPerSecond : number) : string {
    const speedInKilometersPerHours = (speedInmetersPerSecond * 3.6).toFixed(1)
    return `${speedInKilometersPerHours}km/h`
}