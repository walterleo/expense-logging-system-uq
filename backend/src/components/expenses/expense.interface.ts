export default interface ExpenseInterface {
    id?: string;
    description: string;
    date: Date;
    amount: number;
    categoryId: string;
};
