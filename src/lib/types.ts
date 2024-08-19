
export type TPages = 0 | 1 | 2;

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type TMessage = {
    name: string;
    message: string;
    summarized?: string;
}