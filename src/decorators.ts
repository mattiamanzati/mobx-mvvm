import {IViewModel} from './interfaces/index'

/**
 * Creates a decorator that just acts as "tag".
 * You provide a string to use as key, and you will later be able to
 * get all the props on that class with that tag.
 */
function createTagDecorator(tagType: string) : PropertyDecorator {
    return function (target: Object, property: string) : void {
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

/**
 * Returns all the properties on the target that matches the given tag.
 */
function getPropertiesTagged(tagType: string, target: IViewModel): string[] {
    return Reflect.getMetadata(tagType, target) || [];
}

const INPUT_TAG = '@mobx-mvvm/INPUT_TAG'
export const input = createTagDecorator(INPUT_TAG)
export const getInputs = (target: IViewModel) => getPropertiesTagged(INPUT_TAG, target)

const OUTPUT_TAG = '@mobx-mvvm/OUTPUT_TAG'
export const output = createTagDecorator(OUTPUT_TAG)
export const getOutputs = (target: IViewModel) => getPropertiesTagged(OUTPUT_TAG, target)