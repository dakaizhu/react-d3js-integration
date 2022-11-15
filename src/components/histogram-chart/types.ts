export type Dimensions = {
    width: number;
    height: number;
    margins: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }

}

export type Unemployment = {
    id: number;
    state: string;
    county: string;
    rate: number;
}

export type ChartParameters = {
    value: (d: Unemployment) => number; 
}