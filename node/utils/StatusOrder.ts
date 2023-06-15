export enum StatusOrder {
    SYNCH = 'SYNCH',
}

export function ordinalOrderStatus( status: string): number{
    return Object.keys(StatusOrder).indexOf(status);
}