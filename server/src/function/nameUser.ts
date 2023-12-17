import User from '../models/User';
export default async function nameUser(username: string): Promise<string | undefined> {
    try {
        const u = await User.findOne({ username });
        if (u) {
            return u.fullname;
        }
    } catch (error) {
        console.log(error);
    }
    return undefined;
}