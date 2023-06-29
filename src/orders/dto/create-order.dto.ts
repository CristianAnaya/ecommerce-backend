
export class CreateOrderDto {
    id: number;
    id_address: number;
    // status: string;
    products: Array<{ id: number; quantity: number; }>
}