export type BubbleData = {
    id: string;
    value: number;
}

export type Dimensions = {
    width: number;
    height: number;
    margin: number;
    areaWidth: number;
    areaHeight: number;    
}

export type DrawParameters = {
    label: (d: BubbleData) => string;
    value: (d: BubbleData) => number | null;
    group: (d: BubbleData) => string;
    title: (d: BubbleData) => string; 
}