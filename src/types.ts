export interface Question {
    id: number;
    question: string;
    options: { [key: string]: string };
    answer: string | string[] | null;
    explanation: string | null;
    answer_raw: string;
    image?: string;
}
