
export class CreateTodoDto {

    //*This private constructor means that will only be called inside this class
    private constructor(
        public readonly text: string,
    ){

    }

    static create( props: {[key:string]: any} ): [string?, CreateTodoDto?] {

        const { text } = props;

        if ( !text ) return ['Text property is required', undefined];

        return [undefined, new CreateTodoDto(text)];
    }

}