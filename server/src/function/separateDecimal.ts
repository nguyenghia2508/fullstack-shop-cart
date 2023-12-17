export default function separateDecimal(number: number): [number, string] {
    const integerPart = parseInt(number.toString());
    const decimalPart = number - integerPart;
    return [integerPart, decimalPart.toFixed(1)];
}