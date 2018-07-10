export class UtilsService {
    public static capitalize(unproperString: string) {
        return unproperString.charAt(0).toUpperCase() + unproperString.toLowerCase().slice(1);
    }
}