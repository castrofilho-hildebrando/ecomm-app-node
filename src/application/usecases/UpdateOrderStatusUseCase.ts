export type UpdateOrderStatusInput = {
    orderId: string;
    newStatus: string;
    actor: {
        id: string;
        role: "admin" | "user";
    };
};

export type UpdateOrderStatusOutput = {
    orderId: string;
    previousStatus: string;
    currentStatus: string;
};

export interface UpdateOrderStatusUseCase {
    execute(input: UpdateOrderStatusInput): Promise<UpdateOrderStatusOutput>;
}
