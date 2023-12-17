export default function calculateAverageRating(data: { rating: string; count: number; percent?: string }[]): number {
    let totalCount = 0;
    let totalSum = 0;

    for (let i = 0; i < data.length; i++) {
        const rating = parseInt(data[i].rating);
        const count = data[i].count;
        totalCount += count;
        totalSum += rating * count;
    }

    const average = totalSum / totalCount;

    return average;
}