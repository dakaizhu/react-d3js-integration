export type BarchartDimensions = {
    width: number;
    height: number;
    margins : {
        top: number;
        buttom: number;
        left: number;
        right: number;
    }

    containerWidth: number;
    containerHeight: number;
}

export type Source = {
    framework: string;
    score: number;
}