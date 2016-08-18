export function createTagDecorator(tagType: string) : PropertyDecorator {
    return function (target: any, property: string) : void {
        Reflect.defineMetadata(tagType, true, target, property);

        let inputProps = Reflect.getOwnMetadata(tagType, target);
        if (!inputProps) {
            inputProps = Reflect.hasMetadata(tagType, target)
                ? Reflect.getMetadata(tagType, target).slice(0)
                : [];

            Reflect.defineMetadata(tagType, inputProps, target);
        }

        inputProps.push(property);
    };
}

export function getPropertiesWithTag(tagType: string, target: any): string[] {
    return Reflect.getMetadata(tagType, target) || [];
}