export default function paginateArray<T>(array: T[], page: number, perPage: number): T[] {
    const reversedArray = array.slice().reverse();
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage - 1;
    const paginatedArray = reversedArray.slice(startIndex, endIndex + 1);
    return paginatedArray;
}