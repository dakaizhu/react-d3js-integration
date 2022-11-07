export type Weather = {
    latitude: number;
    longitude: number;
    timezone: string;
    currently: Data;
    hourly: Hourly;
}

type Data = {
    time: number;
    summary: string;
    icon:string;
    precipIntensity:number;
    precipProbability:number;
    precipType: string;
    temperature:number;
    apparentTemperature:number;
    dewPoint : number;
    humidity : number;
    pressure : number;
    windSpeed : number;
    windGust :number;
    windBearing : number;
    cloudCover : number;
    uvIndex : number;
    visibility : number;
    ozone : number;
}

type Hourly = {
    summary: string;
    icon: string;
    data: Data[]; 
}

export type Dimensions = {
    width: number;
    height: number;
    margin: Margin;
    areaWidth: number;
    areaHeight: number;    
}

type Margin = {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
 