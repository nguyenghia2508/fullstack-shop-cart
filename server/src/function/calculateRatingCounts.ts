export default function calculateRatingCounts(listReview: { rating: number }[] | null | undefined): { rating: number, count: number, percent: string }[] {
    if (!listReview) {
        return [];
    }

    const ratingCounts: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
    };

    for (let i = 0; i < listReview.length; i++) {
        const rating = listReview[i].rating;
        ratingCounts[rating.toString()] += 1;
    }

    const totalCount = listReview.length;

    const result: { rating: number, count: number, percent: string }[] = [];
    for (const rating in ratingCounts) {
        const count = ratingCounts[rating];
        const percent = ((count / totalCount) * 100).toFixed(2);
        result.push({ rating: parseInt(rating), count, percent });
    }

    return result;
}